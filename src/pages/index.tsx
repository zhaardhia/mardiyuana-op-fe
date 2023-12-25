import Image from 'next/image'
import { Inter } from 'next/font/google'
import Layout from '@/components/Layout'
import EventDashboard from '@/components/dashboard/EventDashboard'
import { useEffect } from 'react'
const inter = Inter({ subsets: ['latin'] })
import axios from 'axios'
export default function Home() {
  useEffect(() => {
    check()
  }, [])

  const check = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/admin/refresh-token`, {
      withCredentials: true,
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
    })
    console.log({wik: response})
  }
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
