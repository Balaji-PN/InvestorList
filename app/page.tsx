import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { InvestorList } from "@/components/investor-list"

export default async function Home() {
  const session = await getServerSession()

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <main className="w-full py-4 md:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          Investor Directory
        </h1>
      </div>
      <InvestorList />
    </main>
  )
}
