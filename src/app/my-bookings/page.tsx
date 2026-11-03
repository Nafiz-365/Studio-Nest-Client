import { Suspense } from 'react'
import MyBookings from '@/views/MyBookings'
import ProtectedRoute from '@/components/ProtectedRoute'
import { PageLoader } from '@/components/Loaders'

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProtectedRoute>
        <MyBookings />
      </ProtectedRoute>
    </Suspense>
  )
}
