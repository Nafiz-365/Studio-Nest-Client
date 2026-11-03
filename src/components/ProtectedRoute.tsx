'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useApp } from '@/lib/AppContext'
import { PageLoader } from '@/components/Loaders'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isHydrated } = useApp()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isHydrated && !user) {
      router.replace(`/login?from=${encodeURIComponent(pathname || '/')}`)
    }
  }, [isHydrated, user, router, pathname])

  // While checking local session or if not authenticated yet, show clean loader
  if (!isHydrated || !user) {
    return <PageLoader />
  }

  return <>{children}</>
}

