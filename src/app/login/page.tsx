import { Suspense } from 'react'
import Login from '@/views/Login'
import { PageLoader } from '@/components/Loaders'

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Login />
    </Suspense>
  )
}
