'use client'

import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import AuthLayout, { GoogleButton } from '../components/AuthLayout'
import { useApp } from '../lib/AppContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Login() {
  const { login, googleLogin } = useApp()
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromParam = searchParams?.get('from')
  const emailParam = searchParams?.get('email')
  const destination = fromParam?.startsWith('/') ? fromParam : '/'
  const [email, setEmail] = useState(emailParam ?? '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Enter both your email and password to continue.')
      return
    }
    setSubmitting(true)
    window.setTimeout(async () => {
      const result = await login(email, password)
      setSubmitting(false)
      if (!result.ok) {
        setError(result.message)
        toast.error(result.message)
        return
      }
      toast.success(result.message)
      router.replace(destination)
    }, 450)
  }

  const social = () => {
    const account = googleLogin()
    toast.success(`Welcome, ${account.name.split(' ')[0]}. Your Google session is connected.`)
    router.replace(destination)
  }

  return (
    <AuthLayout mode="login">
      <p className="eyebrow">Welcome back</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Log in to your creative space.</h1>
      <p className="mt-4 text-sm leading-6 text-muted">Pick up a booking, manage your listings, or find the room for what comes next.</p>
      <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
        {error && <div role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs leading-5 text-red-500">{error}</div>}
        <div><Label htmlFor="login-email">Email address</Label><div className="relative"><Mail size={17} className="field-icon" /><Input id="login-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="!pl-11" placeholder="you@studio.com" required suppressHydrationWarning /></div></div>
        <div><div className="flex items-center justify-between"><Label htmlFor="login-password">Password</Label><button type="button" onClick={() => toast.info('Password recovery is disabled for this preview. Use the demo account or register a new local account.')} className="mb-2 text-xs font-medium text-[#719122] hover:underline">Forgot password?</button></div><div className="relative"><LockKeyhole size={17} className="field-icon" /><Input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="!pl-11 !pr-12" placeholder="Your password" required suppressHydrationWarning /><button type="button" onClick={() => setShowPassword((show) => !show)} className="absolute right-4 top-3.5 text-muted transition hover:text-text" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
        <button type="submit" disabled={submitting} className="btn-primary !min-h-12 w-full disabled:opacity-60">{submitting ? <><span className="spinner" />Opening your studio…</> : 'Login'}</button>
      </form>
      <div className="my-6 flex items-center gap-4"><span className="h-px flex-1 bg-line" /><span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted">or continue with</span><span className="h-px flex-1 bg-line" /></div>
      <GoogleButton onClick={social} label="Continue with Google" />
      <div className="mt-6 rounded-2xl border border-dashed border-line bg-bg p-4"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-semibold">Explore with the demo account</p><p className="mt-1 text-[11px] text-muted">demo@studionest.co · Studio1</p></div><button type="button" onClick={() => { setEmail('demo@studionest.co'); setPassword('Studio1'); setError(''); toast.success('Demo credentials added. Select Login to continue.') }} className="shrink-0 text-[11px] font-semibold text-[#719122] hover:underline">Fill details</button></div></div>
      <p className="mt-8 text-center text-sm text-muted">New to StudioNest? <Link href="/register" className="font-semibold text-text underline decoration-[#b3d75a] decoration-2 underline-offset-4">Create an account</Link></p>
    </AuthLayout>
  )
}
