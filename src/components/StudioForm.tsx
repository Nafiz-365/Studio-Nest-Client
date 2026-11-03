'use client'

import { ArrowLeft, ArrowRight, Check, ImagePlus, Lock, Upload, X } from 'lucide-react'
import { FormEvent, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { amenityOptions, categories } from '../data/studios'
import { useApp } from '../lib/AppContext'
import type { Category, Studio, StudioDraft } from '../types'
import { cn, formatMoney } from '../lib/utils'

interface FormState {
  title: string
  category: Category
  rate: string
  deposit: string
  capacity: string
  location: string
  address: string
  image: string
  amenities: string[]
  overview: string
  size: string
  rules: string
}

const emptyForm: FormState = {
  title: '', category: 'Photo Studio', rate: '', deposit: '', capacity: '', location: '', address: '', image: '', amenities: [], overview: '', size: '', rules: '',
}

export default function StudioForm({ studio }: { studio?: Studio }) {
  const { user, addStudio, updateStudio } = useApp()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<FormState>(() => studio ? {
    title: studio.title, category: studio.category, rate: String(studio.rate), deposit: String(studio.deposit), capacity: String(studio.capacity), location: studio.location, address: studio.address, image: studio.images[0] ?? '', amenities: studio.amenities, overview: studio.overview, size: String(studio.size), rules: studio.rules.join('\n'),
  } : emptyForm)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const update = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const upload = async (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Choose a JPG, PNG, or WebP image for your studio.')
      return
    }
    const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || (typeof process !== 'undefined' && process.env?.VITE_IMGBB_API_KEY)
    if (imgbbKey) {
      const loadingToast = toast.loading('Uploading studio image to ImgBB...')
      try {
        const formData = new FormData()
        formData.append('image', file)
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
          method: 'POST',
          body: formData,
        })
        const data = await response.json()
        if (data?.success && data?.data?.url) {
          update('image', data.data.url)
          toast.dismiss(loadingToast)
          toast.success('Image uploaded to ImgBB successfully.')
          return
        }
      } catch {
        toast.dismiss(loadingToast)
        toast.error('ImgBB upload failed, falling back to local preview.')
      }
    }

    if (file.size > 900 * 1024) {
      toast.error('For local saving, choose an image smaller than 900 KB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      update('image', String(reader.result))
      toast.success('Studio image added. Your preview has been updated.')
    }
    reader.onerror = () => toast.error('That image could not be read. Try another file.')
    reader.readAsDataURL(file)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (form.title.trim().length < 3) nextErrors.title = 'Use a descriptive title with at least 3 characters.'
    if (!Number(form.rate) || Number(form.rate) < 1) nextErrors.rate = 'Enter an hourly rate above $0.'
    if (Number(form.deposit) < 0 || form.deposit === '') nextErrors.deposit = 'Enter a deposit of $0 or more.'
    if (!Number(form.capacity) || Number(form.capacity) < 1) nextErrors.capacity = 'Capacity must be at least one person.'
    if (!Number(form.size) || Number(form.size) < 50) nextErrors.size = 'Enter a floor area of at least 50 sq ft.'
    if (!form.location.trim()) nextErrors.location = 'Add the city and state.'
    if (!form.address.trim()) nextErrors.address = 'Add the full studio address.'
    if (!form.image) nextErrors.image = 'Add an image URL or upload a studio photo.'
    if (form.overview.trim().length < 60) nextErrors.overview = 'Give creators at least 60 characters of useful detail.'
    if (!form.amenities.length) nextErrors.amenities = 'Select at least one available amenity.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      toast.error('A few listing details still need your attention.')
      document.querySelector('.field-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const draft: StudioDraft = {
      title: form.title.trim(), category: form.category, rate: Number(form.rate), deposit: Number(form.deposit), capacity: Number(form.capacity), location: form.location.trim(), address: form.address.trim(), images: [form.image], amenities: form.amenities, overview: form.overview.trim(), size: Number(form.size), rules: form.rules.split('\n').map((rule) => rule.trim()).filter(Boolean),
    }
    if (!draft.rules.length) draft.rules = ['Leave the studio clean and reset all included equipment', 'Report accidental damage before checkout', 'Overtime is billed in 30-minute increments when available']
    setSaving(true)
    window.setTimeout(() => {
      const result = studio ? updateStudio(studio.id, draft) : addStudio(draft)
      setSaving(false)
      if (!result.ok) {
        toast.error(result.message)
        return
      }
      toast.success(result.message)
      router.push('/my-listings')
    }, 550)
  }

  return (
    <form onSubmit={submit} className="grid items-start gap-8 lg:grid-cols-[1fr_330px]">
      <div className="space-y-6">
        <section className="form-section">
          <div className="form-section-heading"><span>01</span><div><h2>Studio essentials</h2><p>The clear, useful details creators see first.</p></div></div>
          <div className="mt-7 space-y-5">
            <div><label htmlFor="studio-title" className="field-label">Studio title</label><input id="studio-title" value={form.title} onChange={(event) => update('title', event.target.value)} className={cn('field', errors.title && 'field-error')} placeholder="e.g. Sunroom Editorial Studio" />{errors.title && <p className="field-error-text">{errors.title}</p>}</div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div><label htmlFor="studio-category" className="field-label">Category</label><select id="studio-category" value={form.category} onChange={(event) => update('category', event.target.value as Category)} className="field">{categories.map((category) => <option key={category.name} value={category.name}>{category.name}</option>)}</select></div>
              <div><label htmlFor="studio-size" className="field-label">Floor area (sq ft)</label><input id="studio-size" type="number" min="50" value={form.size} onChange={(event) => update('size', event.target.value)} className={cn('field', errors.size && 'field-error')} placeholder="1200" />{errors.size && <p className="field-error-text">{errors.size}</p>}</div>
              <div><label htmlFor="studio-rate" className="field-label">Hourly rate ($)</label><input id="studio-rate" type="number" min="1" value={form.rate} onChange={(event) => update('rate', event.target.value)} className={cn('field', errors.rate && 'field-error')} placeholder="85" />{errors.rate && <p className="field-error-text">{errors.rate}</p>}</div>
              <div><label htmlFor="studio-deposit" className="field-label">Security deposit ($)</label><input id="studio-deposit" type="number" min="0" value={form.deposit} onChange={(event) => update('deposit', event.target.value)} className={cn('field', errors.deposit && 'field-error')} placeholder="150" />{errors.deposit && <p className="field-error-text">{errors.deposit}</p>}</div>
              <div><label htmlFor="studio-capacity" className="field-label">Maximum capacity</label><input id="studio-capacity" type="number" min="1" value={form.capacity} onChange={(event) => update('capacity', event.target.value)} className={cn('field', errors.capacity && 'field-error')} placeholder="12" />{errors.capacity && <p className="field-error-text">{errors.capacity}</p>}</div>
              <div><label htmlFor="studio-location" className="field-label">City & state</label><input id="studio-location" value={form.location} onChange={(event) => update('location', event.target.value)} className={cn('field', errors.location && 'field-error')} placeholder="Brooklyn, New York" />{errors.location && <p className="field-error-text">{errors.location}</p>}</div>
            </div>
            <div><label htmlFor="studio-address" className="field-label">Location / full address</label><input id="studio-address" value={form.address} onChange={(event) => update('address', event.target.value)} className={cn('field', errors.address && 'field-error')} placeholder="Street address, city, state, postal code" />{errors.address && <p className="field-error-text">{errors.address}</p>}</div>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section-heading"><span>02</span><div><h2>Show the space</h2><p>Use a bright, landscape photo that reflects the actual studio.</p></div></div>
          <div className="mt-7">
            <label htmlFor="studio-image" className="field-label">Primary image URL</label>
            <div className="flex flex-col gap-3 sm:flex-row"><input id="studio-image" value={form.image.startsWith('data:') ? '' : form.image} onChange={(event) => update('image', event.target.value)} className={cn('field flex-1', errors.image && 'field-error')} placeholder={form.image.startsWith('data:') ? 'Uploaded image selected' : 'https://your-image-host.com/studio.jpg'} readOnly={form.image.startsWith('data:')} /><button type="button" onClick={() => fileRef.current?.click()} className="btn-secondary shrink-0"><Upload size={16} />Upload image</button><input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => upload(event.target.files?.[0])} /></div>
            {errors.image && <p className="field-error-text">{errors.image}</p>}
            {form.image ? <div className="relative mt-4 aspect-[16/8] overflow-hidden rounded-2xl bg-soft"><img src={form.image} alt="Studio listing preview" className="h-full w-full object-cover" /><button type="button" onClick={() => update('image', '')} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm" aria-label="Remove image"><X size={16} /></button></div> : <button type="button" onClick={() => fileRef.current?.click()} className="mt-4 flex aspect-[16/6] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-bg text-muted transition hover:border-[#9cbb4e] hover:text-text"><ImagePlus size={28} strokeWidth={1.4} /><span className="mt-3 text-xs font-semibold">Add your best studio view</span><span className="mt-1 text-[10px]">JPG, PNG or WebP · max 900 KB</span></button>}
          </div>
        </section>

        <section className="form-section">
          <div className="form-section-heading"><span>03</span><div><h2>Amenities & overview</h2><p>Help creators plan with confidence before they book.</p></div></div>
          <div className="mt-7"><span className="field-label">Available amenities</span><div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">{amenityOptions.map((amenity) => { const checked = form.amenities.includes(amenity); return <label key={amenity} className={cn('flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-xs transition', checked ? 'border-[#a8ca5b] bg-[#d9ff63]/15' : 'border-line bg-bg hover:bg-soft')}><input type="checkbox" checked={checked} onChange={() => update('amenities', checked ? form.amenities.filter((item) => item !== amenity) : [...form.amenities, amenity])} className="sr-only" /><span className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded border', checked ? 'border-[#7e9f2e] bg-[#a8cd4b] text-[#171915]' : 'border-line')}>{checked && <Check size={11} strokeWidth={3} />}</span>{amenity}</label>})}</div>{errors.amenities && <p className="field-error-text">{errors.amenities}</p>}</div>
          <div className="mt-6"><label htmlFor="studio-overview" className="field-label">Detailed overview</label><textarea id="studio-overview" value={form.overview} onChange={(event) => update('overview', event.target.value)} className={cn('field min-h-40 resize-y leading-6', errors.overview && 'field-error')} placeholder="Describe the light, layout, included equipment, atmosphere, and what kind of production the room suits best." maxLength={1600} /><div className="mt-1 flex justify-between gap-4"><div>{errors.overview && <p className="field-error-text">{errors.overview}</p>}</div><span className="text-[10px] text-muted">{form.overview.length}/1600</span></div></div>
          <div className="mt-5"><label htmlFor="studio-rules" className="field-label">House rules <span className="font-normal text-muted">(one per line)</span></label><textarea id="studio-rules" value={form.rules} onChange={(event) => update('rules', event.target.value)} className="field min-h-28 resize-y leading-6" placeholder={'No open flame\nReset included equipment before checkout\nNo glitter or confetti'} /></div>
        </section>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-28">
        <div className="rounded-[24px] border border-line bg-surface p-5">
          <p className="eyebrow">Host account</p>
          <div className="mt-5 space-y-4"><div><label className="field-label">Host name</label><div className="relative"><input value={user?.name ?? ''} readOnly className="field !pr-10 opacity-70" /><Lock size={14} className="absolute right-4 top-4 text-muted" /></div></div><div><label className="field-label">Host email</label><div className="relative"><input value={user?.email ?? ''} readOnly className="field !pr-10 opacity-70" /><Lock size={14} className="absolute right-4 top-4 text-muted" /></div></div></div>
          <p className="mt-4 text-[10px] leading-4 text-muted">Host details are locked to your signed-in account and appear on the public listing.</p>
        </div>
        <div className="rounded-[24px] bg-[#1a1c17] p-6 text-white"><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#d9ff63]">Live rate preview</p><p className="mt-4 font-display text-4xl font-bold tracking-[-0.055em]">{formatMoney(Number(form.rate) || 0)}<span className="text-sm font-normal text-white/45"> / hr</span></p><p className="mt-3 text-xs leading-5 text-white/50">Creators also see the refundable deposit and an 8% service fee before requesting a booking.</p><div className="mt-5 border-t border-white/15 pt-4 text-xs text-white/65">{form.amenities.length} amenities selected · {form.capacity || 0} guests maximum</div></div>
        <button type="submit" disabled={saving} className="btn-primary !min-h-13 w-full disabled:opacity-60">{saving ? <><span className="spinner" />Saving your studio…</> : <>{studio ? 'Save studio changes' : 'Publish studio'}<ArrowRight size={17} /></>}</button>
        <Link href="/my-listings" className="btn-ghost mx-auto flex text-xs"><ArrowLeft size={14} />Cancel and return</Link>
      </aside>
    </form>
  )
}
