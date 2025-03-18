import { Header } from '@/components/Header'
import HomePage from './page.client'

export default async function Page() {
  return (
    <div className="w-full h-full overflow-auto flex flex-col">
      <Header />
      <main className="w-full mx-auto flex-1 max-h-full">
        <HomePage />
      </main>
    </div>
  )
}
