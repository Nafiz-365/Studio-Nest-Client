import { Suspense } from 'react'
import Studios from '@/views/Studios'
import { PageLoader } from '@/components/Loaders'

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Studios />
    </Suspense>
  )
}
