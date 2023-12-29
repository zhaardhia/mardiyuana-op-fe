import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { useSessionUser } from '@/contexts/SessionUserContext'
import { TeacherDetail, TeacherStatus, EnrolledAcademicYearsTeacherType, EnrollmentTeacherType, EnrollmentTeacherTeacherType } from '@/types'
import { useRouter } from 'next/router';
import moment from 'moment'
import { Button } from "@/components/ui/button"
import Select, { ActionMeta, SingleValue } from "react-select"
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
import { statusTeacher, statusEnrollmentStudent, enrollTeacherType } from "@/utils/constant"
import ModalAddEditEnrollmentTeacher from '@/components/enrollmentTeacher/ModalAddEditEnrollTeacher';
type Option = { value: string; label: string };

const TeacherDetail = () => {
  const { state, axiosJWT } = useSessionUser()
  const router = useRouter();
  const { id } = router.query;
  const [teacherData, setStudentData] = useState<TeacherDetail | undefined>();
  const [enrollmentTeacher, setEnrollmentTeacher] = useState<EnrollmentTeacherType[] | undefined>();
  const [optionAcademicYears, setOptionAcademicYears] = useState<Option[] | undefined>();
  const [selectAcademicYears, setSelectAcademicYears] = useState<Option | undefined>();

  useEffect(() => {
    if (id) fetchTeacherData()
  }, [id])

  useEffect(() => {
    if (id) fetchEnrolledTeacher()
  }, [id, selectAcademicYears])

  const fetchTeacherData = async () => {
    try {
      const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/admin-teacher/detail-teacher?id=${id}`, {
        headers: {
          Authorization: `Bearer ${state?.token}`
        }
      })
      console.log({response})

      if (response?.data?.statusCode === "000") {
        setStudentData(response?.data?.data);
        setOptionAcademicYears(response?.data?.data?.enrolledAcademicYears?.map((ay: EnrolledAcademicYearsTeacherType) => {
          return {
            label: ay.academicYear, value: ay.academicYearId
          }
        }))
        const activeAcademicYear: EnrolledAcademicYearsTeacherType = response?.data?.data?.enrolledAcademicYears?.find((ay: EnrolledAcademicYearsTeacherType) => ay.status === "ACTIVE")
        setSelectAcademicYears({ label: activeAcademicYear.academicYear, value: activeAcademicYear.academicYearId })
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

  const fetchEnrolledTeacher = async () => {
    try {
      const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/enrollment-teacher/enrolled-teacher-by-academic-year?teacherId=${id}${selectAcademicYears?.value && `&academicYearId=${selectAcademicYears?.value}`}`, {
        headers: {
          Authorization: `Bearer ${state?.token}`
        }
      })
      console.log({response})

      if (response?.data?.statusCode === "000") {
        setEnrollmentTeacher(response?.data?.data);
      } else {
        throw Error("Fetch data error.")
      }
    } catch (error) {
      console.error(error)
    }
  }
  console.log({teacherData, selectAcademicYears})

  const handleSelectAcademicYears = (option: SingleValue<Option>, actionMeta: ActionMeta<Option>) => {
    option && setSelectAcademicYears(option)
  }
  return (
    <Layout>
      <div className="w-[90%] mx-auto pb-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl">Detail Guru {"  "} a.n {"  "} <span className="italic">{teacherData?.fullname}</span></h1>
          {/* <ModalAddEditTeacher isEdit={false} /> */}
        </div>
        <hr />
        <Card className="w-[100%] mx-auto my-5">
          <CardHeader>
            <CardTitle>{teacherData?.fullname}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Nama Singkat</Label>
              <Input disabled defaultValue={teacherData?.name} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Email</Label>
              <Input disabled defaultValue={teacherData?.email} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">No. Telp</Label>
              <Input disabled defaultValue={teacherData?.phone || "-"} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Status</Label>
              <Input disabled defaultValue={statusTeacher[teacherData?.status as keyof TeacherStatus]} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">Tempat Tanggal Lahir</Label>
              <Input disabled defaultValue={`${teacherData?.bornIn}, ${moment(teacherData?.bornAt).format("DD MMMM YYYY")}`} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Mulai Pada Tahun Ajaran</Label>
              <Input disabled defaultValue={moment(teacherData?.startAt).format("DD MMMM YYYY")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Selesai Pada Tahun Ajaran</Label>
              <Input disabled defaultValue={teacherData?.endAt ? moment(teacherData?.endAt)?.format("DD MMMM YYYY") : "-"} />
            </div>
          </CardContent>
        </Card>
        <div className="my-10">
          <div className="flex justify-between items-center mb-8">
            <p className="text-xl text-center">Data Tahunan Guru</p>
            <div className="flex gap-2">
              <Select
                className="basic-single w-[20rem] rounded-xl"
                classNamePrefix="select"
                defaultValue={selectAcademicYears}
                // isLoading={isLoading}
                value={selectAcademicYears}
                isClearable={false}
                isSearchable={false}
                name="academicYears"
                options={optionAcademicYears}
                placeholder="Pilih Tahun Ajaran"
                onChange={handleSelectAcademicYears}
              />
              <ModalAddEditEnrollmentTeacher isEdit={false}/>
            </div>
            {/* <ModalAddEditEnrollmentStudent isEdit={false} defaultData={teacherData} setStudentData={setStudentData} /> */}
          </div>
          <Table className="py-10">
            <TableHeader>
              <TableRow>
                {/* <TableHead>ID</TableHead> */}
                <TableHead>Kelas</TableHead>
                <TableHead>Pelajaran</TableHead>
                <TableHead>Tipe Guru</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollmentTeacher && enrollmentTeacher?.length > 0 && enrollmentTeacher?.map((data: EnrollmentTeacherType) => {
                return (
                  <TableRow>
                    <TableCell>{data.className}</TableCell>
                    <TableCell>
                      {data?.courseName || "-"}
                    </TableCell>
                    <TableCell>
                      {statusTeacher[data?.status as keyof TeacherStatus]}
                    </TableCell>
                    <TableCell>
                      {enrollTeacherType[data.teacherType as keyof EnrollmentTeacherTeacherType]}
                    </TableCell>
                    <TableCell>
                      {/* <ModalAddEditEnrollmentStudent isEdit={true} defaultData={teacherData} setStudentData={setStudentData} enrollmentStudent={data} /> */}
                      <ModalAddEditEnrollmentTeacher isEdit={true} />
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

export default TeacherDetail
