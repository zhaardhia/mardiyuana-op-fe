import React from 'react'
import Layout from '@/components/Layout'
import { ModalAddCourse } from '@/components/course/ModalAddCourse'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useSessionUser } from '@/contexts/SessionUserContext'
import { CourseList } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import { Icon } from '@iconify/react';

const Course: React.FC = () => {
  const { state, axiosJWT} = useSessionUser()
  const { toast } = useToast()
  const [courses, setCourses] = React.useState<CourseList[]>([])
  const [courseGrade7, setCourseGrade7] = React.useState<CourseList[]>([])
  const [courseGrade8, setCourseGrade8] = React.useState<CourseList[]>([])
  const [courseGrade9, setCourseGrade9] = React.useState<CourseList[]>([])

  React.useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/course`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state?.token}`
      },
    })
    console.log({response})
    if (response?.data?.statusCode === "000") {
      setCourses(response?.data?.data)
      setCourseGrade7(
        response?.data?.data?.filter((data: CourseList) => data.grade === 7)
      )
      setCourseGrade8(
        response?.data?.data?.filter((data: CourseList) => data.grade === 8)
      )
      setCourseGrade9(
        response?.data?.data?.filter((data: CourseList) => data.grade === 9)
      )
    }
    else toast({
      title: "Gagal mendapatkan data list pelajaran.",
      description: response?.data?.message || "Silahkan cek kembali data yang anda input, atau bisa melaporkan ke tim IT",
      className: "bg-red-200"
    })
  }
  console.log({courses, courseGrade7, courseGrade8, courseGrade9})
  return (
    <Layout>
      <div className="w-[90%] mx-auto ">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl">Daftar Pelajaran (Course List)</h1>
          <ModalAddCourse />
        </div>
        <hr />
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Kelas 7</AccordionTrigger>
            {courseGrade7 && courseGrade7?.map((course: CourseList) => {
              return (
                <AccordionContent>
                  <Card className="p-3 hover:bg-slate-50 cursor-pointer">
                    <CardDescription className="flex justify-between items-center">
                      {course.name} <Icon icon="tabler:external-link" className="text-lg" />
                    </CardDescription>
                  </Card>
                </AccordionContent>
              )
            })}
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Kelas 8</AccordionTrigger>
            {courseGrade8 && courseGrade8?.map((course: CourseList) => {
              return (
                <AccordionContent>
                  <Card className="p-3 hover:bg-slate-50 cursor-pointer">
                    <CardDescription className="flex justify-between items-center">
                      {course.name} <Icon icon="tabler:external-link" className="text-lg" />
                    </CardDescription>
                  </Card>
                </AccordionContent>
              )
            })}
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Kelas 9</AccordionTrigger>
            {courseGrade9 && courseGrade9?.map((course: CourseList) => {
              return (
                <AccordionContent>
                  <Card className="p-3 hover:bg-slate-50 cursor-pointer">
                    <CardDescription className="flex justify-between items-center">
                      {course.name} <Icon icon="tabler:external-link" className="text-lg" />
                    </CardDescription>
                  </Card>
                </AccordionContent>
              )
            })}
          </AccordionItem>
        </Accordion>
      </div>
    </Layout>
  )
}

export default Course
