import { Suspense } from 'react'
import StudioDetails from '@/views/StudioDetails'
import { PageLoader } from '@/components/Loaders'

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <StudioDetails />
    </Suspense>
  )
}
