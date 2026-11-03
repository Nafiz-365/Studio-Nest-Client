'use client'

import { ArrowUpRight, Instagram, Linkedin, Youtube } from 'lucide-react'
import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { categories } from '../data/studios'
import Logo from './Logo'

function XLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" /></svg>
  )
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const subscribe = (event: FormEvent) => {
    event.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Enter a valid email address to join the field notes.')
      return
    }
    const existing = JSON.parse(localStorage.getItem('studionest.newsletter') ?? '[]') as string[]
    if (!existing.includes(email)) localStorage.setItem('studionest.newsletter', JSON.stringify([...existing, email]))
    toast.success('You’re on the list. Expect useful studio notes, never noise.')
    setEmail('')
  }

  return (
    <footer className="border-t border-white/10 bg-[#171915] text-[#f4f2e9]">
      <div className="container-shell py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_.75fr_.75fr_1.25fr] lg:gap-10">
          <div>
            <Logo light />
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/55">Making remarkable creative space easier to find, book, and share. Built for the people behind the work.</p>
            <div className="mt-7 flex items-center gap-2">
              {[
                { label: 'X', href: 'https://x.com', icon: <XLogo /> },
                { label: 'Instagram', href: 'https://instagram.com', icon: <Instagram size={18} /> },
                { label: 'LinkedIn', href: 'https://linkedin.com', icon: <Linkedin size={18} /> },
                { label: 'YouTube', href: 'https://youtube.com', icon: <Youtube size={18} /> },
              ].map((social) => <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/65 transition hover:border-[#d9ff63] hover:bg-[#d9ff63] hover:text-[#171915]">{social.icon}</a>)}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Navigate</h3>
            <div className="mt-5 flex flex-col items-start gap-3.5 text-sm">
              {[['Explore studios', '/studios'], ['How it works', '/how-it-works'], ['About StudioNest', '/about'], ['Host your space', '/add-studio'], ['My bookings', '/my-bookings']].map(([label, to]) => <Link key={to} href={to} className="text-white/70 transition hover:text-[#d9ff63]">{label}</Link>)}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Popular spaces</h3>
            <div className="mt-5 flex flex-col items-start gap-3.5 text-sm">
              {categories.map((category) => <Link key={category.name} href={`/studios?category=${encodeURIComponent(category.name)}`} className="text-white/70 transition hover:text-[#d9ff63]">{category.label}</Link>)}
            </div>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold tracking-[-0.035em]">Field notes for better production days.</h3>
            <p className="mt-3 text-sm leading-6 text-white/50">New spaces, practical host guides, and studio craft. Twice a month.</p>
            <form onSubmit={subscribe} className="mt-6 flex rounded-full border border-white/15 bg-white/5 p-1.5 focus-within:border-[#d9ff63]/60">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input id="newsletter-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@studio.com" className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/35" suppressHydrationWarning autoComplete="off" />
              <button type="submit" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d9ff63] text-[#171915] transition hover:scale-105" aria-label="Subscribe to newsletter"><ArrowUpRight size={18} /></button>
            </form>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p suppressHydrationWarning>© {new Date().getFullYear()} StudioNest. Creative space, thoughtfully shared.</p>
          <div className="flex gap-5"><Link href="/terms" className="transition hover:text-white">Terms & privacy</Link><span>Bookings subject to host agreement</span></div>
        </div>
      </div>
    </footer>
  )
}
