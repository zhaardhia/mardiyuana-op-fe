import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSessionUser } from '@/contexts/SessionUserContext'
import { DetailStudent, StudentStatus, EnrollmentStudentDetailPage, EnrollmentStudentStatus } from '@/types'
import { useRouter } from 'next/router';
import moment from 'moment'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { statusStudent, statusEnrollmentStudent } from "@/utils/constant"
import { ModalAddCourse } from '@/components/course/ModalAddCourse'
import ModalAddEditEnrollmentStudent from '@/components/enrollmentStudent/ModalAddEditEnrollmentStudent'

const StudentDetail = () => {
  const { state, axiosJWT } = useSessionUser()
  const router = useRouter();
  const { id } = router.query;
  const [studentData, setStudentData] = useState<DetailStudent | undefined>();

  useEffect(() => {
    if (id) fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/admin-student/detail-student?id=${id}`, {
        headers: {
          Authorization: `Bearer ${state?.token}`
        }
      })
      console.log({response})

      if (response?.data?.statusCode === "000") {
        setStudentData(response?.data?.data);
        // setTotalData(response?.data?.data?.totalData);
        // setTotalPages(response?.data?.data?.totalPages);
        // setNextPage(response?.data?.data?.nextPage);
      } else {
        throw Error("Fetch data error.")
      }
    } catch (error) {
      console.error(error)
    }
  }
  console.log({studentData})
  return (
    <Layout>
      <div className="w-[90%] mx-auto pb-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl">Detail Murid {"  "} a.n {"  "} <span className="italic">{studentData?.fullname}</span></h1>
          {/* <ModalAddEditTeacher isEdit={false} /> */}
        </div>
        <hr />
        <Tabs defaultValue="murid" className="w-[100%] mx-auto my-5">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="murid">Data Murid</TabsTrigger>
            <TabsTrigger value="ortu">Data Orang Tua</TabsTrigger>
          </TabsList>
          <TabsContent value="murid">
            <Card>
              <CardHeader>
                <CardTitle>{studentData?.fullname}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Nama Singkat</Label>
                  <Input disabled defaultValue={studentData?.name} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input disabled defaultValue={studentData?.email} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">No. Telp</Label>
                  <Input disabled defaultValue={studentData?.phone || "-"} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="status">Status</Label>
                  <Input disabled defaultValue={statusStudent[studentData?.status as keyof StudentStatus]} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="ttlStudent">Tempat Tanggal Lahir</Label>
                  <Input disabled defaultValue={`${studentData?.bornIn}, ${moment(studentData?.bornAt).format("DD MMMM YYYY")}`} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="startacademicyear">Mulai Pada Tahun Ajaran</Label>
                  <Input disabled defaultValue={studentData?.startAcademicYear} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="endacademicyear">Selesai Pada Tahun Ajaran</Label>
                  <Input disabled defaultValue={studentData?.endAcademicYear || "-"} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ortu">
            <Card>
              <CardHeader>
                <CardTitle>{studentData?.parent?.fullname}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Nama Singkat</Label>
                  <Input disabled defaultValue={studentData?.parent?.name} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input disabled defaultValue={studentData?.parent?.email} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">No. Telp</Label>
                  <Input disabled defaultValue={studentData?.parent?.phone || "-"} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="ttl">Tempat Tanggal Lahir</Label>
                  <Input disabled defaultValue={`${studentData?.parent?.bornIn}, ${moment(studentData?.parent?.bornAt).format("DD MMMM YYYY")}`} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="my-10">
          <div className="flex justify-between items-center mb-8">
            <p className="text-xl text-center">Data Tahunan Siswa</p>
            <ModalAddEditEnrollmentStudent isEdit={false} defaultData={studentData} setStudentData={setStudentData} />
          </div>
          <Table className="py-10">
            <TableHeader>
              <TableRow>
                {/* <TableHead>ID</TableHead> */}
                <TableHead>Kelas</TableHead>
                <TableHead>Tahun Ajaran</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentData?.enrollment_students && studentData?.enrollment_students?.map((data: EnrollmentStudentDetailPage) => {
                return (
                  <TableRow>
                    {/* <TableCell className="">{data.id}</TableCell> */}
                    <TableCell>{data.className}</TableCell>
                    <TableCell>
                      {data.academicYear}
                    </TableCell>
                    <TableCell>
                      {statusEnrollmentStudent[data.status as keyof EnrollmentStudentStatus]}
                    </TableCell>
                    <TableCell>
                      <ModalAddEditEnrollmentStudent isEdit={true} defaultData={studentData} setStudentData={setStudentData} enrollmentStudent={data} />
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

export default StudentDetail
