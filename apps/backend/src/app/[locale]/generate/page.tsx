import { GenerateClient } from './page.client'
import { Header } from '@/components/Header'

export default async function Page() {

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <GenerateClient />
      </main>
    </>
  )
}
