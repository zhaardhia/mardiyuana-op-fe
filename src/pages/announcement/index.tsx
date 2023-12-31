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
import ModalAddEditAnnouncement from '@/components/announcement/ModalAddEditAnnouncement'
import { AnnouncementData } from '@/types'
import { useToast } from '@/components/ui/use-toast'
import moment from 'moment'

const Announcement = () => {
  const { state, axiosJWT} = useSessionUser()
  const { toast } = useToast()
  const [announcements, setAnnouncements] = React.useState<AnnouncementData[]>([])
    
  React.useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/announcement`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state?.token}`
      },
    })

    setAnnouncements(response?.data?.data)
  }
  console.log({announcements})
  return (
    <Layout>
      <div className="w-[90%] mx-auto pb-10">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl">Announcement (Pengumuman)</h1>
            <ModalAddEditAnnouncement isEdit={false} setAnnouncements={setAnnouncements} />
          </div>
        <hr />
        <div className="mt-5">
          <Table className="py-10">
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements && announcements?.length > 0 && announcements?.map((data: AnnouncementData) => {
                return (
                  <TableRow key={data.id}>
                    <TableCell className="">{data.title}</TableCell>
                    <TableCell>
                      {moment(data.createdDate).format("DD MMMM YYYY HH:mm")}
                    </TableCell>
                    <TableCell>
                      <ModalAddEditAnnouncement isEdit={true} defaultData={data} setAnnouncements={setAnnouncements} />
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

export default Announcement
