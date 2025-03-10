import { Header } from '@/components/Header'
import HomePage from './page.client'

export default async function Page() {
  return (
    <>
      <Header />
      <main className="container mx-auto flex-1 h-full">
        <HomePage />
      </main>
    </>
  )
}
