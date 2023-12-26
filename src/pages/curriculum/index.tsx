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
import { Switch } from "@/components/ui/switch"
import ModalAddEditCurriculum from '@/components/curriculum/ModalAddEditCurriculum'
import { CurriculumData } from '@/types'
import { useToast } from '@/components/ui/use-toast'

const Curriculum = () => {
  const { state, axiosJWT} = useSessionUser()
  const { toast } = useToast()
  const [curriculums, setCurriculums] = React.useState<CurriculumData[]>([])
    
  React.useEffect(() => {
    fetchData()
  }, [])

  const handleSwitch = async (id: string, isActive: boolean) => {
    const response = await axiosJWT.put(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/curriculum/activate`, 
    {
      isActive,
      id
    },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${state?.token}`
      }
    })

    if (response?.data?.statusCode === "000") {
      toast({
        title: "Berhasil mengaktifkan kurikulum!",
        className: "bg-white"
      })

      setCurriculums(prevCurriculums =>
        prevCurriculums.map(curriculum =>
          curriculum.id === id ? { ...curriculum, status: isActive ? "ACTIVE" : "INACTIVE" } : curriculum
        )
      );

    } else {
      toast({
        title: "Gagal mengaktifkan kurikulum.",
        className: "bg-red-200"
      })
    }
  }

  const fetchData = async () => {
    const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/curriculum`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state?.token}`
      },
    })

    setCurriculums(response?.data?.data)
  }
  console.log({curriculums})
  return (
    <Layout>
      <div className="w-[90%] mx-auto pb-10">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl">Kurikulum (Curriculum)</h1>
            <ModalAddEditCurriculum isEdit={false} setCurriculums={setCurriculums} />
          </div>
        <hr />
        <div className="mt-5">
          <Table className="py-10">
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Kurikulum</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {curriculums && curriculums?.length > 0 && curriculums?.map((data: CurriculumData) => {
                return (
                  <TableRow>
                    <TableCell className="">{data.id}</TableCell>
                    <TableCell>{data.name}</TableCell>
                    <TableCell>
                      <Switch 
                        defaultChecked={data?.status === "ACTIVE"}
                        disabled={data?.status === "INACTIVE" && curriculums?.find(curriculum => curriculum.status === "ACTIVE")}
                        onCheckedChange={(e: boolean) => handleSwitch(data.id, e)}
                      />
                    </TableCell>
                    <TableCell>
                      <ModalAddEditCurriculum isEdit={true} defaultData={data} setCurriculums={setCurriculums} />
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

export default Curriculum
