import { Suspense } from 'react'
import StudioEditor from '@/views/StudioEditor'
import ProtectedRoute from '@/components/ProtectedRoute'
import { PageLoader } from '@/components/Loaders'

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProtectedRoute>
        <StudioEditor mode="edit" />
      </ProtectedRoute>
    </Suspense>
  )
}
