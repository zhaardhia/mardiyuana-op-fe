import React from 'react'
import Layout from '@/components/Layout'
import { ModalAddCourseSection } from '@/components/course/ModalAddCourseSection'
import moment from 'moment'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useSessionUser } from '@/contexts/SessionUserContext'
import { CourseInCourseSection, CourseSectionList } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router'
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './Droppable'
import dynamic from 'next/dynamic';
import { reorderDragNDrop } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const CourseDetail: React.FC = () => {
  const { state, axiosJWT} = useSessionUser()
  const router = useRouter()
  const { id } = router.query;
  const { toast } = useToast()
  const [courseSections, setCourseSections] = React.useState<CourseSectionList[]>([])
  const [course, setCourse] = React.useState<CourseInCourseSection>()

  React.useEffect(() => {
    if (id) fetchDataDetail()
  }, [id])

  const fetchDataDetail = async () => {
    try {
      const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/course-section/get-by-id?id=${id}`, {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*', 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state?.token}`
        },
      })
      console.log({response})
      if (response?.data?.statusCode === "000") {
        setCourseSections(response?.data?.data?.sections)
        setCourse(response?.data?.data?.course)
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "Gagal mendapatkan data list pelajaran.",
        description: "Silahkan cek kembali data yang anda input, atau bisa melaporkan ke tim IT",
        className: "bg-red-200"
      })
    }
  }

  const onDragEnd = async (result: any) => {
    console.log({result})

    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const res = reorderDragNDrop(courseSections, result.source.index, result.destination.index).map((dataSection: CourseSectionList, idx) => {
      return {
        ...dataSection,
        numberSection: idx,
        updatedDate: new Date()
      }
    });
    await reorderCourseSection(result.source.index, result.destination.index, id);

    setCourseSections(res)
  }

  const reorderCourseSection = async (startIndex: number, endIndex: number, courseId: string | undefined | string[]) => {
    const response = await axiosJWT.put(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/course-section/reorder-section`, 
      {
        startIndex, endIndex, courseId
      },
      {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*', 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state?.token}`
        },
      }
    )
  }
  console.log({courseSections, course})
  // console.log({courses, courseGrade7, courseGrade8, courseGrade9})
  return (
    <Layout>
      <div className="w-[90%] mx-auto ">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl">{course?.name} Kelas {course?.grade}</h1>
          <ModalAddCourseSection isEdit={false} totalLength={courseSections.length} setCourseSections={setCourseSections}  />
        </div>
        <hr />
        <div className="my-10">
          <p className="text-xl font-semibold">List Modul</p>
            {courseSections.length < 1 ? (
              <p>Belum ada data bab pada pelajaran ini. Silahkan tambahkan pelajaran terlebih dahulu</p>
            ) : (
              <span>Drag n Drop bab untuk mengubah urutannya</span>
            )}
          {courseSections && (
            <DragDropContext onDragEnd={onDragEnd}>
              <StrictModeDroppable droppableId="SECTION">
              {provided => (
                <ul className="link-block no-bullets" {...provided.droppableProps} ref={provided.innerRef}>
                  {courseSections.map((section: CourseSectionList, idx: number) => {
                    const { id: idSection, name, description, numberSection, courseId, createdDate, updatedDate } = section;
                    return (
                      <Draggable draggableId={String(numberSection)} index={numberSection} key={numberSection}>
                        {providedChild => (
                          <li
                            ref={providedChild.innerRef}
                            {...providedChild.draggableProps}
                            {...providedChild.dragHandleProps}
                          >
                            <Card className="my-4">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <CardTitle>Bab {numberSection + 1}: {name}</CardTitle>
                                    <CardDescription>{description}</CardDescription>
                                  </div>
                                  <div className="flex flex-col gap-3">
                                    <ModalAddCourseSection isEdit={true} defaultData={section} setCourseSections={setCourseSections} totalLength={courseSections.length} />
                                    <Link href={`/course/${id}/list-section/${idSection}`}>
                                      <Button variant="outline" className="w-full">Detail</Button>
                                    </Link>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardFooter className="flex flex-col items-start">
                                <span className="text-sm text-gray-400">Created At: {moment(createdDate).format("DD MMMM YYYY HH:mm")} </span>
                                <span className="text-sm text-gray-400">Updated At: {moment(updatedDate).format("DD MMMM YYYY HH:mm")} </span>
                              </CardFooter>
                            </Card>
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </ul>
              )}
              </StrictModeDroppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(CourseDetail), {
  ssr: false,
});
