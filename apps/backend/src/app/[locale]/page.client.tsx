'use client'

import { useUser } from '@/providers/userProvider'

export default function HomePage() {
  const user = useUser()
  return <div>{user.user?.apiKey}</div>
}
