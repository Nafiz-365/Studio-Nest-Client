'use client'

import { CalendarDays, Check, Clock, Minus, Plus, ShieldCheck, Users } from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useApp } from '../lib/AppContext'
import type { Studio } from '../types'
import { addDays, calculateHours, formatMoney, formatTime, toDateInput } from '../lib/utils'
import Modal from './Modal'

const times = Array.from({ length: 32 }, (_, index) => {
  const minutes = 7 * 60 + index * 30
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
})

export default function BookingModal({ studio, open, onClose }: { studio: Studio; open: boolean; onClose: () => void }) {
  const { addBooking } = useApp()
  const [date, setDate] = useState(toDateInput(addDays(new Date(), 1)))
  const [startTime, setStartTime] = useState('10:00')
  const [endTime, setEndTime] = useState('14:00')
  const [guests, setGuests] = useState(2)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const hours = calculateHours(startTime, endTime)
  const subtotal = studio.rate * hours
  const serviceFee = Math.round(subtotal * 0.08)
  const total = subtotal + serviceFee + studio.deposit
  const endTimes = useMemo(() => times.filter((time) => time > startTime), [startTime])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!date) {
      toast.error('Choose a date for your studio session.')
      return
    }
    if (hours < 1) {
      toast.error('Studio reservations have a one-hour minimum. Adjust your session hours.')
      return
    }
    setSubmitting(true)
    window.setTimeout(() => {
      const result = addBooking({ studioId: studio.id, date, startTime, endTime, guests, notes })
      setSubmitting(false)
      if (!result.ok) {
        toast.error(result.message, { duration: 5500 })
        return
      }
      toast.success(result.message, { duration: 5000 })
      setNotes('')
      onClose()
    }, 450)
  }

  return (
    <Modal open={open} onClose={onClose} title="Reserve your session" description={`${studio.title} · ${studio.location}`} wide>
      <form onSubmit={submit} className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_250px]">
        <div className="space-y-5">
          <div>
            <label htmlFor="booking-date" className="field-label">Session date</label>
            <div className="relative"><CalendarDays size={17} className="field-icon" /><input id="booking-date" type="date" min={toDateInput(new Date())} value={date} onChange={(event) => setDate(event.target.value)} className="field !pl-11" required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label htmlFor="booking-start" className="field-label">Start time</label><div className="relative"><Clock size={16} className="field-icon" /><select id="booking-start" value={startTime} onChange={(event) => { setStartTime(event.target.value); if (endTime <= event.target.value) setEndTime(times[times.indexOf(event.target.value) + 2] ?? '22:30') }} className="field !pl-10">{times.slice(0, -2).map((time) => <option key={time} value={time}>{formatTime(time)}</option>)}</select></div></div>
            <div><label htmlFor="booking-end" className="field-label">End time</label><div className="relative"><Clock size={16} className="field-icon" /><select id="booking-end" value={endTime} onChange={(event) => setEndTime(event.target.value)} className="field !pl-10">{endTimes.map((time) => <option key={time} value={time}>{formatTime(time)}</option>)}</select></div></div>
          </div>
          <div>
            <span className="field-label">People attending</span>
            <div className="flex items-center justify-between rounded-2xl border border-line bg-bg px-4 py-3">
              <span className="flex items-center gap-2 text-sm text-muted"><Users size={17} />Maximum {studio.capacity}</span>
              <div className="flex items-center gap-3"><button type="button" className="icon-button !h-8 !w-8" onClick={() => setGuests((value) => Math.max(1, value - 1))} aria-label="Remove one guest"><Minus size={14} /></button><span className="w-5 text-center font-display text-lg font-semibold">{guests}</span><button type="button" className="icon-button !h-8 !w-8" onClick={() => setGuests((value) => Math.min(studio.capacity, value + 1))} aria-label="Add one guest"><Plus size={14} /></button></div>
            </div>
          </div>
          <div><label htmlFor="booking-notes" className="field-label">Production notes <span className="font-normal text-muted">(optional)</span></label><textarea id="booking-notes" value={notes} onChange={(event) => setNotes(event.target.value)} className="field min-h-24 resize-none" placeholder="Tell the host about your setup, crew, or equipment needs." maxLength={500} /></div>
          <div className="flex items-start gap-3 rounded-2xl bg-soft p-4 text-xs leading-5 text-muted"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#789b27]" /><p>Your request starts as <strong className="text-text">Pending</strong>. Confirmed sessions are checked for time collisions before a reservation is saved.</p></div>
        </div>
        <aside className="flex flex-col rounded-[22px] border border-line bg-bg p-5">
          <img src={studio.images[0]} alt="" className="h-28 w-full rounded-xl object-cover" />
          <h3 className="mt-4 font-display text-lg font-semibold leading-tight tracking-[-0.035em]">{studio.title}</h3>
          <div className="mt-5 space-y-3 border-t border-line pt-4 text-xs">
            <div className="flex justify-between gap-3 text-muted"><span>{formatMoney(studio.rate)} × {hours || 0} hours</span><span className="text-text">{formatMoney(subtotal)}</span></div>
            <div className="flex justify-between gap-3 text-muted"><span>Creator service fee</span><span className="text-text">{formatMoney(serviceFee)}</span></div>
            <div className="flex justify-between gap-3 text-muted"><span>Refundable deposit</span><span className="text-text">{formatMoney(studio.deposit)}</span></div>
          </div>
          <div className="mt-4 flex items-end justify-between border-t border-line pt-4"><span className="text-xs text-muted">Total due</span><span className="font-display text-2xl font-bold tracking-[-0.05em]">{formatMoney(total)}</span></div>
          <button type="submit" disabled={submitting || hours < 1} className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50">{submitting ? <><span className="spinner" />Checking time…</> : <><Check size={17} />Request booking</>}</button>
          <p className="mt-3 text-center text-[10px] leading-4 text-muted">No charge is made in this demo. Your host reviews the request next.</p>
        </aside>
      </form>
    </Modal>
  )
}
