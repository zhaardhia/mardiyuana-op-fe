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
import ModalAddEditAcademicYear from '@/components/academicYear/ModalAddEditAcademicYear'
import { AcademicYearData } from '@/types'
import { useToast } from '@/components/ui/use-toast'

const AcademicYear = () => {
  const { state, axiosJWT} = useSessionUser()
  const { toast } = useToast()
  const [academicYears, setAcademicYears] = React.useState<AcademicYearData[]>([])
    
  React.useEffect(() => {
    fetchData()
  }, [])

  const handleSwitch = async (id: string, isActive: boolean) => {
    const response = await axiosJWT.put(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/academic-year/activate`, 
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
        title: `Berhasil ${isActive ? "mengaktifkan" : "menonaktifkan"} kurikulum!`,
        className: "bg-white"
      })

      setAcademicYears(prevAcademicYears =>
        prevAcademicYears.map(academic =>
          academic.id === id ? { ...academic, status: isActive ? "ACTIVE" : "INACTIVE" } : academic
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
    const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/academic-year`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state?.token}`
      },
    })

    setAcademicYears(response?.data?.data)
  }
  console.log({academicYears})
  return (
    <Layout>
      <div className="w-[90%] mx-auto pb-10">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl">Tahun Ajaran (Academic Year)</h1>
            <ModalAddEditAcademicYear isEdit={false} setAcademicYears={setAcademicYears} />
          </div>
        <hr />
        <div className="mt-5">
          <Table className="py-10">
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>Tahun Ajaran</TableHead>
                <TableHead>Kurikulum</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {academicYears && academicYears?.length > 0 && academicYears?.map((data: AcademicYearData) => {
                return (
                  <TableRow>
                    <TableCell>{data.academicYear}</TableCell>
                    <TableCell>{data.curriculumName}</TableCell>
                    <TableCell>
                      <Switch 
                        defaultChecked={data?.status === "ACTIVE"}
                        disabled={data?.status === "INACTIVE" && academicYears?.find(academic => academic.status === "ACTIVE")}
                        onCheckedChange={(e: boolean) => handleSwitch(data.id, e)}
                      />
                    </TableCell>
                    <TableCell>
                      <ModalAddEditAcademicYear isEdit={true} defaultData={data} setAcademicYears={setAcademicYears} />
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

export default AcademicYear
