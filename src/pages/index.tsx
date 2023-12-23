import Image from 'next/image'
import { Inter } from 'next/font/google'
import Layout from '@/components/Layout'
import EventDashboard from '@/components/dashboard/EventDashboard'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <Layout>
      <div className="w-[90%] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl">Dashboard</h1>
          <p>Jumat, 3 Desember 1945</p>
        </div>
        <hr />
        <div className="my-5">
          <EventDashboard type="schoolEvents" />
        </div>
        <hr />
        <div className="my-5">
          <EventDashboard type="billboard" />
        </div>
        <hr />
        <div className="my-5">
          <EventDashboard type="planningVote" />
        </div>
      </div>
    </Layout>
  )
}
