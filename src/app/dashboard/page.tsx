import { Suspense } from 'react'
import Dashboard from '@/views/Dashboard'
import ProtectedRoute from '@/components/ProtectedRoute'
import { PageLoader } from '@/components/Loaders'

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </Suspense>
  )
}
