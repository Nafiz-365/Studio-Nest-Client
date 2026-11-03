'use client'

import { useParams } from 'next/navigation'
import EmptyState from '../components/EmptyState'
import StudioForm from '../components/StudioForm'
import { useApp } from '../lib/AppContext'

export default function StudioEditor({ mode }: { mode: 'add' | 'edit' }) {
  const params = useParams<{ id?: string }>()
  const id = params?.id
  const { studios, user } = useApp()
  const studio = mode === 'edit' ? studios.find((item) => item.id === id) : undefined

  if (mode === 'edit' && (!studio || studio.ownerEmail !== user?.email)) {
    return <div className="container-shell section-space"><EmptyState title="You can’t edit this listing" description="This studio may have been removed, or it belongs to another host. Return to your own listings to manage your spaces." actionLabel="Go to my listings" actionTo="/my-listings" /></div>
  }

  return (
    <>
      <section className="border-b border-line bg-surface"><div className="container-shell py-10 sm:py-14"><p className="eyebrow">{mode === 'add' ? 'Share your space' : 'Listing editor'}</p><h1 className="mt-4 max-w-3xl font-display text-[clamp(2.7rem,5vw,5rem)] font-semibold leading-[1] tracking-[-0.06em]">{mode === 'add' ? 'A great studio deserves great company.' : 'Keep every detail production-ready.'}</h1><p className="mt-5 max-w-xl text-sm leading-7 text-muted">{mode === 'add' ? 'Tell creators what makes your room useful. You can update availability, rates, and details whenever your space evolves.' : `Editing ${studio?.title}. Changes appear across the directory as soon as you save.`}</p></div></section>
      <div className="container-shell section-space !pt-8 sm:!pt-10"><StudioForm key={studio?.id ?? 'new'} studio={studio} /></div>
    </>
  )
}
