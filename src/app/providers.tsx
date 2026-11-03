'use client'

import { type ReactNode } from 'react'
import { Toaster } from 'sonner'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { AppProvider, useApp } from '@/lib/AppContext'

function AppShell({ children }: { children: ReactNode }) {
  const { theme } = useApp()
  return (
    <div className="min-h-screen bg-bg text-text">
      <Header />
      <main>{children}</main>
      <Footer />
      <Toaster
        position="top-right"
        theme={theme}
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          className: 'studio-toast',
          style: { borderRadius: '16px', fontFamily: 'DM Sans, sans-serif' },
        }}
      />
    </div>
  )
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <AppShell>{children}</AppShell>
    </AppProvider>
  )
}
