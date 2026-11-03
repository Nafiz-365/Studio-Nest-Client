'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Building2, Edit3, Eye, MapPin, Plus, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import ConfirmModal from '../components/ConfirmModal'
import EmptyState from '../components/EmptyState'
import { useApp } from '../lib/AppContext'
import type { Studio } from '../types'
import { formatMoney } from '../lib/utils'

export default function MyListings() {
  const { studios, user, deleteStudio, bookings } = useApp()
  const [deleteTarget, setDeleteTarget] = useState<Studio | null>(null)
  const [deleting, setDeleting] = useState(false)
  const listings = studios.filter((studio) => studio.ownerEmail === user?.email)

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const result = await deleteStudio(deleteTarget.id)
      if (result.ok) {
        toast.success(result.message)
        setDeleteTarget(null)
      } else {
        toast.error(result.message)
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="container-shell section-space">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div><p className="eyebrow">Host workspace</p><h1 className="page-title mt-4">My studio listings.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-muted">Manage your spaces, keep production details current, and see how each room is performing.</p></div>
        <Link href="/add-studio" className="btn-primary shrink-0"><Plus size={17} />Add New Studio</Link>
      </div>
      {listings.length > 0 && <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-5">
        {[{ label: 'Live spaces', value: listings.length }, { label: 'Total reviews', value: listings.reduce((sum, studio) => sum + studio.reviewsCount, 0) }, { label: 'Booking requests', value: bookings.filter((booking) => listings.some((studio) => studio.id === booking.studioId)).length }].map((stat) => <div key={stat.label} className="rounded-[20px] border border-line bg-surface p-4 sm:p-6"><p className="font-display text-2xl font-semibold tracking-[-0.05em] sm:text-4xl">{stat.value}</p><p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted sm:text-xs">{stat.label}</p></div>)}
      </div>}
      <div className="mt-10">
        {listings.length ? <div className="space-y-4">{listings.map((studio, index) => {
          const listingBookings = bookings.filter((booking) => booking.studioId === studio.id)
          return (
            <motion.article key={studio.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="grid overflow-hidden rounded-[24px] border border-line bg-surface md:grid-cols-[230px_1fr_auto]">
              <Link href={`/studios/${studio.id}`} className="relative min-h-48 overflow-hidden md:min-h-full"><img src={studio.images[0]} alt={studio.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-105" /><span className="absolute left-4 top-4 rounded-full bg-[#171915]/75 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md">{studio.category}</span></Link>
              <div className="p-5 sm:p-7">
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted"><span className="flex items-center gap-1.5"><MapPin size={13} />{studio.location}</span>{studio.reviewsCount ? <span className="flex items-center gap-1.5"><Star size={13} className="text-[#d29b22]" fill="currentColor" />{studio.rating.toFixed(2)} ({studio.reviewsCount})</span> : <span>New listing</span>}</div>
                <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.045em]">{studio.title}</h2>
                <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-6 text-muted">{studio.overview}</p>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs"><span><strong className="font-display text-lg">{formatMoney(studio.rate)}</strong> <span className="text-muted">/ hour</span></span><span className="text-muted">{listingBookings.length} {listingBookings.length === 1 ? 'booking' : 'bookings'}</span><span className="text-muted">Capacity {studio.capacity}</span></div>
              </div>
              <div className="flex gap-2 border-t border-line p-5 md:w-36 md:flex-col md:justify-center md:border-l md:border-t-0">
                <Link href={`/studios/${studio.id}`} className="btn-secondary flex-1 !min-h-10 !px-3 text-xs md:flex-none"><Eye size={15} />View</Link>
                <Link href={`/studios/edit/${studio.id}`} className="btn-secondary flex-1 !min-h-10 !px-3 text-xs md:flex-none"><Edit3 size={15} />Update</Link>
                <button type="button" onClick={() => setDeleteTarget(studio)} className="btn-danger-subtle flex-1 !min-h-10 !px-3 text-xs md:flex-none"><Trash2 size={15} />Delete</button>
              </div>
            </motion.article>
          )
        })}</div> : <EmptyState icon={<Building2 size={28} />} title="Your next great listing starts here" description="You haven’t published a studio yet. Add your first space with clear photos, useful amenities, and a rate that works for you." actionLabel="Add your first studio" actionTo="/add-studio" />}
      </div>
      <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-[24px] bg-soft p-6 sm:flex-row sm:items-center sm:p-8"><div><h3 className="font-display text-xl font-semibold tracking-[-0.035em]">Make your listing more bookable.</h3><p className="mt-2 text-sm text-muted">Detailed inventories and recent photos help creators commit with confidence.</p></div><Link href="/how-it-works" className="btn-secondary shrink-0">Read the host guide<ArrowUpRight size={16} /></Link></div>
      <ConfirmModal open={Boolean(deleteTarget)} onClose={() => { if (!deleting) setDeleteTarget(null) }} title={`Delete ${deleteTarget?.title ?? 'this studio'}?`} description="This permanently removes the listing and its associated booking records. This action cannot be undone." confirmLabel={deleting ? 'Deleting…' : 'Delete studio'} onConfirm={confirmDelete} />
    </div>
  )
}
