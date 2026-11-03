'use client'

import { Check, Eye, EyeOff, Image, LockKeyhole, Mail, UserRound, X } from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import AuthLayout, { GoogleButton } from '../components/AuthLayout'
import { useApp } from '../lib/AppContext'
import { cn } from '../lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Register() {
  const { register, googleLogin } = useApp()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', photoURL: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const checks = useMemo(() => [
    { label: 'One uppercase letter', valid: /[A-Z]/.test(form.password) },
    { label: 'One lowercase letter', valid: /[a-z]/.test(form.password) },
    { label: 'At least 6 characters', valid: form.password.length >= 6 },
  ], [form.password])
  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }))

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Add your name and a valid email address.')
      toast.error('Check your name and email before continuing.')
      return
    }
    if (checks.some((check) => !check.valid)) {
      setError('Your password does not meet all three security requirements below.')
      toast.error('Choose a stronger password before registering.')
      return
    }
    setSubmitting(true)
    window.setTimeout(async () => {
      const result = await register(form.name, form.email, form.photoURL, form.password)
      setSubmitting(false)
      if (!result.ok) {
        setError(result.message)
        toast.error(result.message)
        return
      }
      toast.success(result.message)
      router.push(`/login?email=${encodeURIComponent(form.email)}`)
    }, 500)
  }

  const social = () => {
    const account = googleLogin()
    toast.success(`Your StudioNest account is ready, ${account.name.split(' ')[0]}.`)
    router.push('/')
  }

  return (
    <AuthLayout mode="register">
      <p className="eyebrow">Join the community</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Make space for your next idea.</h1>
      <p className="mt-4 text-sm leading-6 text-muted">One account to book remarkable rooms or share your own with fellow creators.</p>
      <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
        {error && <div role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs leading-5 text-red-500">{error}</div>}
        <div><Label htmlFor="register-name">Full name</Label><div className="relative"><UserRound size={17} className="field-icon" /><Input id="register-name" autoComplete="name" value={form.name} onChange={(event) => update('name', event.target.value)} className="!pl-11" placeholder="Your name" required /></div></div>
        <div><Label htmlFor="register-email">Email address</Label><div className="relative"><Mail size={17} className="field-icon" /><Input id="register-email" type="email" autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} className="!pl-11" placeholder="you@studio.com" required suppressHydrationWarning /></div></div>
        <div><Label htmlFor="register-photo">Photo URL <span className="font-normal text-muted">(optional)</span></Label><div className="relative"><Image size={17} className="field-icon" /><Input id="register-photo" type="url" value={form.photoURL} onChange={(event) => update('photoURL', event.target.value)} className="!pl-11" placeholder="https://example.com/portrait.jpg" /></div></div>
        <div><Label htmlFor="register-password">Password</Label><div className="relative"><LockKeyhole size={17} className="field-icon" /><Input id="register-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={(event) => update('password', event.target.value)} className="!pl-11 !pr-12" placeholder="Create a secure password" required suppressHydrationWarning /><button type="button" onClick={() => setShowPassword((show) => !show)} className="absolute right-4 top-3.5 text-muted transition hover:text-text" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
        <div className="grid gap-2 rounded-2xl bg-bg p-4 sm:grid-cols-3">{checks.map((check) => <div key={check.label} className={cn('flex items-center gap-1.5 text-[10px] leading-4', check.valid ? 'text-emerald-600' : 'text-muted')}>{check.valid ? <Check size={12} strokeWidth={3} /> : <X size={12} />}{check.label}</div>)}</div>
        <button type="submit" disabled={submitting} className="btn-primary !min-h-12 w-full disabled:opacity-60">{submitting ? <><span className="spinner" />Creating your account…</> : 'Register'}</button>
      </form>
      <div className="my-6 flex items-center gap-4"><span className="h-px flex-1 bg-line" /><span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted">or</span><span className="h-px flex-1 bg-line" /></div>
      <GoogleButton onClick={social} label="Sign up with Google" />
      <p className="mt-8 text-center text-sm text-muted">Already have an account? <Link href="/login" className="font-semibold text-text underline decoration-[#b3d75a] decoration-2 underline-offset-4">Log in</Link></p>
    </AuthLayout>
  )
}
