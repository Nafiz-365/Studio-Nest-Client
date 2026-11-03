'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Expand, Heart, MapPin, Maximize2, MessageCircle, Share2, ShieldCheck, Star, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import BookingModal from '../components/BookingModal'
import EmptyState from '../components/EmptyState'
import { Avatar } from '../components/Header'
import StudioCard from '../components/StudioCard'
import { useApp } from '../lib/AppContext'
import { useLoading } from '../lib/useLoading'
import { addDays, cn, formatDate, formatMoney, formatTime, getCurrentDate, getInitials, toDateInput } from '../lib/utils'
import type { Studio } from '../types'

export default function StudioDetails({
  studio,
  related,
}: {
  studio: Studio | null
  related: Studio[]
}) {
  const { bookings, user, wishlist, toggleWishlist } = useApp()
  const loading = useLoading()
  const id = studio?.id
  const [bookingOpen, setBookingOpen] = useState(false)
  const [gallery, setGallery] = useState<SwiperType | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const router = useRouter()
  const pathname = usePathname()
  const availability = useMemo(() => Array.from({ length: 5 }, (_, index) => {
    const date = toDateInput(addDays(getCurrentDate(), index + 1))
    return {
      date,
      reserved: bookings.filter((booking) => booking.studioId === id && booking.date === date && booking.status === 'Confirmed'),
    }
  }), [bookings, id])

  if (loading) {
    return <div className="container-shell section-space"><div className="skeleton h-5 w-56" /><div className="mt-7 grid gap-8 lg:grid-cols-[1.5fr_.7fr]"><div className="skeleton aspect-[16/10] rounded-[28px]" /><div className="space-y-5"><div className="skeleton h-12 w-4/5" /><div className="skeleton h-5 w-2/3" /><div className="skeleton h-40 w-full rounded-[24px]" /></div></div></div>
  }

  if (!studio) {
    return <div className="container-shell section-space"><EmptyState title="This studio has left the directory" description="The listing may have been removed by its host, or the link may be out of date. There are plenty of other rooms ready for your next idea." actionLabel="Browse available studios" actionTo="/studios" /></div>
  }

  const saved = wishlist.includes(studio.id)
  const openBooking = () => {
    if (!user) {
      toast.error('Log in to reserve this workspace. We’ll bring you right back.')
      router.push('/login?from=' + encodeURIComponent(pathname || '/'))
      return
    }
    setBookingOpen(true)
  }
  const handleSave = () => {
    const result = toggleWishlist(studio.id)
    if (!result.ok) {
      toast.error(result.message)
      router.push('/login?from=' + encodeURIComponent(pathname || '/'))
    } else toast.success(result.message)
  }
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: studio.title, text: `See ${studio.title} on StudioNest`, url: window.location.href })
      else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Studio link copied to your clipboard.')
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') toast.error('Could not share automatically. Copy the page address from your browser.')
    }
  }

  return (
    <>
      <section className="container-shell pb-12 pt-7 sm:pt-10">
        <div className="mb-7 flex items-center justify-between gap-4">
          <Link href="/studios" className="inline-flex items-center gap-2 text-xs font-semibold text-muted transition hover:text-text"><ArrowLeft size={15} />Back to all studios</Link>
          <div className="flex items-center gap-2">
            <button type="button" onClick={share} className="btn-ghost !min-h-9 !px-3 text-xs"><Share2 size={15} /><span className="hidden sm:inline">Share</span></button>
            <button type="button" onClick={handleSave} className={cn('btn-ghost !min-h-9 !px-3 text-xs', saved && 'text-[#789b27]')}><Heart size={15} fill={saved ? 'currentColor' : 'none'} /><span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span></button>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.55fr_.65fr]">
          <motion.div initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0 round 26px)' }} animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0 round 26px)' }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }} className="relative overflow-hidden rounded-[26px] bg-soft">
            <Swiper modules={[Navigation, Pagination]} onSwiper={setGallery} onSlideChange={(swiper) => setActiveImage(swiper.activeIndex)} pagination={{ clickable: true, el: '.studio-pagination' }} className="aspect-[16/10] h-full min-h-[300px] w-full sm:min-h-[440px]">
              {studio.images.map((image, index) => <SwiperSlide key={`${image}-${index}`}><img src={image} alt={`${studio.title}, view ${index + 1}`} className="h-full w-full object-cover" /></SwiperSlide>)}
            </Swiper>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2">
              <button type="button" onClick={() => gallery?.slidePrev()} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition hover:bg-white hover:text-black" aria-label="Previous image"><ChevronLeft size={18} /></button>
              <button type="button" onClick={() => gallery?.slideNext()} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition hover:bg-white hover:text-black" aria-label="Next image"><ChevronRight size={18} /></button>
            </div>
            <div className="studio-pagination absolute bottom-7 right-6 z-20 !w-auto" />
          </motion.div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:grid-rows-3">
            {studio.images.map((image, index) => (
              <button type="button" key={`${image}-thumb`} onClick={() => gallery?.slideTo(index)} className={cn('relative min-h-20 overflow-hidden rounded-[18px] border-2 bg-soft transition sm:min-h-24', activeImage === index ? 'border-[#a5ce43]' : 'border-transparent opacity-70 hover:opacity-100')} aria-label={`Show studio image ${index + 1}`}>
                <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                {index === studio.images.length - 1 && <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[9px] text-white backdrop-blur-sm"><Expand size={10} />{studio.images.length} views</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell grid gap-12 pb-20 lg:grid-cols-[1fr_360px] lg:gap-16">
        <div className="min-w-0">
          <div className="border-b border-line pb-8">
            <div className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-soft px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">{studio.category}</span><span className="flex items-center gap-1.5 text-xs text-muted"><BadgeCheck size={14} className="text-[#7b9e2a]" />Verified host</span></div>
            <h1 className="mt-5 font-display text-[clamp(2.7rem,5vw,4.8rem)] font-semibold leading-[0.98] tracking-[-0.06em]">{studio.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted"><span className="flex items-center gap-1.5"><MapPin size={16} />{studio.location}</span>{studio.reviewsCount > 0 ? <span className="flex items-center gap-1.5 font-semibold text-text"><Star size={15} fill="currentColor" className="text-[#d29b22]" />{studio.rating.toFixed(2)} <span className="font-normal text-muted">({studio.reviewsCount} reviews)</span></span> : <span>New to StudioNest</span>}<span className="flex items-center gap-1.5"><Maximize2 size={15} />{studio.size.toLocaleString()} sq ft</span></div>
          </div>

          <div className="grid grid-cols-1 gap-3 border-b border-line py-7 sm:grid-cols-3">
            {[[Users, 'Capacity', `${studio.capacity} people`], [Maximize2, 'Floor area', `${studio.size.toLocaleString()} sq ft`], [Clock3, 'Minimum hire', '1 hour']].map(([Icon, label, value]) => {
              const SpecIcon = Icon as typeof Users
              return <div key={label as string} className="rounded-2xl bg-surface p-4 sm:p-5"><SpecIcon size={19} className="text-[#83a62d]" strokeWidth={1.6} /><p className="mt-4 text-[10px] uppercase tracking-[0.12em] text-muted">{label as string}</p><p className="mt-1 font-display text-sm font-semibold sm:text-base">{value as string}</p></div>
            })}
          </div>

          <div className="border-b border-line py-9"><h2 className="content-heading">Inside the space</h2><p className="mt-5 text-[15px] leading-8 text-muted">{studio.overview}</p><p className="mt-5 flex items-start gap-2 text-xs leading-5 text-muted"><MapPin size={15} className="mt-0.5 shrink-0" />{studio.address}</p></div>

          <div className="border-b border-line py-9"><h2 className="content-heading">Equipment & amenities</h2><div className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">{studio.amenities.map((amenity) => <div key={amenity} className="flex items-center gap-3 text-sm"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d9ff63]/35 text-[#67851f]"><Check size={13} strokeWidth={2.5} /></span>{amenity}</div>)}</div></div>

          <div className="border-b border-line py-9">
            <div className="flex items-end justify-between gap-4"><div><h2 className="content-heading">Upcoming availability</h2><p className="mt-2 text-sm text-muted">Confirmed holds for the next five days. Other hours are open to request.</p></div><CalendarDays size={23} className="hidden text-muted sm:block" strokeWidth={1.5} /></div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">{availability.map((day, index) => <button type="button" key={day.date} onClick={openBooking} className="rounded-2xl border border-line bg-surface p-3 text-left transition hover:border-[#9abc48] hover:bg-soft"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{index === 0 ? 'Tomorrow' : formatDate(day.date, { weekday: 'short' })}</p><p className="mt-1 font-display text-lg font-semibold">{formatDate(day.date, { month: 'short', day: 'numeric' })}</p><p className="mt-3 text-[10px] leading-4 text-muted">{day.reserved.length ? `${day.reserved.length} confirmed ${day.reserved.length === 1 ? 'hold' : 'holds'}` : 'Fully open'}</p>{day.reserved.slice(0, 1).map((booking) => <p key={booking.id} className="mt-1 truncate text-[9px] text-amber-600">{formatTime(booking.startTime)}–{formatTime(booking.endTime)}</p>)}</button>)}</div>
          </div>

          <div className="border-b border-line py-9"><h2 className="content-heading">House rules</h2><div className="mt-5 space-y-3">{studio.rules.map((rule, index) => <div key={rule} className="flex items-start gap-4 text-sm leading-6 text-muted"><span className="font-display text-xs font-semibold text-text">0{index + 1}</span>{rule}</div>)}</div><div className="mt-6 flex items-start gap-3 rounded-2xl bg-soft p-4 text-xs leading-5 text-muted"><ShieldCheck size={18} className="shrink-0 text-[#7b9d29]" />The refundable security deposit is returned after checkout, subject to the host’s damage and overtime policy.</div></div>

          <div className="py-9">
            <div className="flex items-end justify-between"><h2 className="content-heading">Notes from recent creators</h2>{studio.reviewsCount > 0 && <span className="flex items-center gap-1 text-sm font-semibold"><Star size={15} fill="currentColor" className="text-[#d29b22]" />{studio.rating.toFixed(2)}</span>}</div>
            {studio.reviews.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2">{studio.reviews.map((review) => <article key={review.id} className="rounded-[22px] border border-line bg-surface p-6"><div className="flex gap-0.5 text-[#d29b22]">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={12} fill={index < Math.round(review.rating) ? 'currentColor' : 'none'} />)}</div><p className="mt-4 text-sm leading-7 text-muted">“{review.text}”</p><div className="mt-6 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-soft font-display text-[10px] font-bold">{getInitials(review.author)}</span><div><p className="text-xs font-semibold">{review.author}</p><p className="mt-0.5 text-[10px] text-muted">{review.role} · {formatDate(review.date, { month: 'short', year: 'numeric' })}</p></div></div></article>)}</div> : <div className="mt-6 rounded-2xl border border-dashed border-line p-7 text-sm leading-6 text-muted">This space is new to StudioNest. Be the first creator to leave a production note after your session.</div>}
          </div>
        </div>

        <aside className="lg:relative">
          <div className="top-28 rounded-[26px] border border-line bg-surface p-6 shadow-[0_18px_55px_rgba(25,30,18,.07)] lg:sticky">
            <div className="flex items-end justify-between"><p><span className="font-display text-3xl font-bold tracking-[-0.055em]">{formatMoney(studio.rate)}</span><span className="text-sm text-muted"> / hour</span></p><span className="mb-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600">Open to book</span></div>
            <p className="mt-2 text-xs text-muted">{formatMoney(studio.deposit)} refundable deposit · 8% service fee</p>
            <button type="button" onClick={openBooking} className="btn-primary mt-6 !min-h-13 w-full">Book Workspace Now<ArrowUpRight size={17} /></button>
            <p className="mt-3 text-center text-[10px] text-muted">You won’t be charged at this step</p>
            <div className="mt-7 border-t border-line pt-6">
              <div className="flex items-center gap-3"><Avatar name={studio.ownerName} className="h-12 w-12" /><div><p className="text-[10px] uppercase tracking-[0.12em] text-muted">Hosted by</p><p className="mt-0.5 font-display text-base font-semibold">{studio.ownerName}</p></div><BadgeCheck size={19} className="ml-auto text-[#7c9e2a]" /></div>
              <div className="mt-5 space-y-2 text-xs text-muted"><p>Hosting since {studio.hostSince}</p><p>{studio.responseTime}</p><p>Identity & contact details verified</p></div>
              <button type="button" onClick={() => toast.success(`Message request noted. ${studio.ownerName} typically responds within the listed response time.`)} className="btn-secondary mt-5 w-full !min-h-10 text-xs"><MessageCircle size={15} />Ask the host a question</button>
            </div>
            <div className="mt-6 flex items-start gap-2 border-t border-line pt-5 text-[10px] leading-4 text-muted"><ShieldCheck size={15} className="shrink-0" />StudioNest support is available throughout your reservation.</div>
          </div>
        </aside>
      </section>

      {related.length > 0 && <section className="border-t border-line bg-surface section-space"><div className="container-shell"><div className="flex items-end justify-between gap-5"><div><p className="eyebrow">Keep exploring</p><h2 className="mt-4 section-title !text-3xl sm:!text-4xl">More {studio.category.toLowerCase()} spaces</h2></div><Link href={`/studios?category=${encodeURIComponent(studio.category)}`} className="btn-secondary hidden sm:flex">See all<ArrowRight size={16} /></Link></div><div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((item, index) => <StudioCard key={item.id} studio={item} index={index} />)}</div></div></section>}
      {studio && <BookingModal studio={studio} open={bookingOpen} onClose={() => setBookingOpen(false)} />}
    </>
  )
}
