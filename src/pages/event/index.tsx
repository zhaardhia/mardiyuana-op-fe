import React from 'react'
import Layout from '@/components/Layout'
import { useSessionUser } from '@/contexts/SessionUserContext'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import ModalAddEditEvent from '@/components/event/ModalAddEditEvent'
import { EventData } from '@/types'
import { useToast } from '@/components/ui/use-toast'
import moment from 'moment'
import { Button } from '@/components/ui/button'

const Event = () => {
  const { state, axiosJWT} = useSessionUser()
  const { toast } = useToast()
  const [events, setEvents] = React.useState<EventData[]>([])
    
  React.useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/event`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state?.token}`
      },
    })

    setEvents(response?.data?.data)
  }
  console.log({events})
  return (
    <Layout>
      <div className="w-[90%] mx-auto pb-10">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl">Events</h1>
            <ModalAddEditEvent isEdit={false} setEvents={setEvents} />
          </div>
        <hr />
        <div className="mt-5">
          <Table className="py-10">
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>Nama Event</TableHead>
                <TableHead>Tanggal Event</TableHead>
                <TableHead>Perlu Voting</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events && events?.length > 0 && events?.map((data: EventData) => {
                return (
                  <TableRow key={data.id}>
                    <TableCell className="">{data.name}</TableCell>
                    <TableCell>
                      {moment(data.eventDate).format("DD MMMM YYYY")}
                    </TableCell>
                    <TableCell>
                      {data.eventVoteType === "VOTE" ? "Ya" : "Tidak"}
                    </TableCell>
                    <TableCell>
                      <ModalAddEditEvent isEdit={true} defaultData={data} setEvents={setEvents} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  )
}

export default Event
