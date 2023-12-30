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
import { CourseInCourseSection, CourseSectionList, ModuleList, CourseSectionInCourseModule, ResponseCourseModuleList } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router'
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '../../Droppable'
import dynamic from 'next/dynamic';
import { reorderDragNDropModule } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import { ModalAddEditCourseModule } from '@/components/course/ModalAddEditCourseModule'
const CourseModuleList: React.FC = () => {
  const { state, axiosJWT} = useSessionUser()
  const router = useRouter()
  const { id, sectionId } = router.query;
  const { toast } = useToast()
  const [modules, setModules] = React.useState<ModuleList[]>([])
  const [supportedMaterials, setSupportedMaterials] = React.useState<ModuleList[]>([])
  const [courseSection, setCourseSection] = React.useState<CourseSectionList>()
  const [course, setCourse] = React.useState<CourseInCourseSection>()

  React.useEffect(() => {
    if (sectionId) fetchDataDetail()
  }, [sectionId])

  const fetchDataDetail = async () => {
    const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/course-module/get-all-modules?id=${sectionId}`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state?.token}`
      },
    })
    console.log({response})
    if (response?.data?.statusCode === "000") {
      setModules(response?.data?.data?.courseModules?.modules)
      setSupportedMaterials(response?.data?.data?.courseModules?.supportedMaterials)
      setCourse(response?.data?.data?.course)
      setCourseSection(response?.data?.data?.courseSection)
    } else {
      toast({
        title: "Gagal mendapatkan data list module pelajaran.",
        description: response?.data?.message || "Silahkan cek kembali data yang anda input, atau bisa melaporkan ke tim IT",
        className: "bg-red-200"
      })
    }
  }

  const onDragEnd = async (result: any, type: string) => {
    console.log({result})

    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const array = type === "MODULE" ? modules : supportedMaterials
    const res = reorderDragNDropModule(array, result.source.index, result.destination.index).map((dataModule: ModuleList, idx) => {
      return {
        ...dataModule,
        numberModule: idx,
        updatedDate: new Date()
      }
    });
    await reorderCourseModule(result.source.index, result.destination.index, sectionId, type);

    if (type === "MODULE") setModules(res)
    else if (type === "SUPPORTED_MATERIAL") setSupportedMaterials(res)
  }

  const reorderCourseModule = async (startIndex: number, endIndex: number, courseSectionId: string | undefined | string[], type: string) => {
    if (!type) return

    await axiosJWT.put(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/course-module/reorder-module`, 
      {
        startIndex, endIndex, courseSectionId, type
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
  console.log({courseSection, course})
  // console.log({courses, courseGrade7, courseGrade8, courseGrade9})
  return (
    <Layout>
      <div className="w-[90%] mx-auto ">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl">{course?.name} Kelas {course?.grade}: {courseSection?.name}</h1>
          <ModalAddEditCourseModule isEdit={false} totalLengthModule={modules.length} totalLengthSupportedMaterial={supportedMaterials.length} setModules={setModules} setSupportedMaterials={setSupportedMaterials} type="MODULE"  />
        </div>
        <hr />
        <div className="my-10">
          <p className="text-xl font-semibold">List Modul</p>
          {modules.length < 1 ? (
            <p>Belum ada data modul pada bab ini. Silahkan tambahkan modul terlebih dahulu</p>
          ) : (
            <span>Drag n Drop modul untuk mengubah urutannya</span>
          )}
          {modules.length > 0 && (
            <DragDropContext onDragEnd={(result) => onDragEnd(result, "MODULE")}>
              <StrictModeDroppable droppableId="module">
              {provided => (
                <ul className="link-block no-bullets" {...provided.droppableProps} ref={provided.innerRef}>
                  {modules.map((module: ModuleList, idx: number) => {
                    const { id, content, numberModule, createdDate, updatedDate, courseSectionId } = module;
                    return (
                      <Draggable draggableId={String(numberModule)} index={numberModule} key={numberModule}>
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
                                    <CardTitle className="text-lg">Modul Ke {numberModule + 1}</CardTitle>
                                    <CardDescription className="text-md">
                                      {content}
                                    </CardDescription>
                                  </div>
                                  <div className="flex flex-col gap-3">
                                    <ModalAddEditCourseModule isEdit={true} totalLengthModule={modules.length} totalLengthSupportedMaterial={supportedMaterials.length} setModules={setModules} setSupportedMaterials={setSupportedMaterials} defaultData={module}  />
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
        <div className="my-10">
          <p className="text-xl font-semibold">List Materi Pendukung</p>
          {supportedMaterials.length < 1 ? (
            <p>Belum ada data materi pendukung pada bab ini. Silahkan tambahkan materi pendukung terlebih dahulu</p>
          ) : (
            <span>Drag n Drop modul untuk mengubah urutannya</span>
          )}
          {supportedMaterials.length > 0 && (
            <DragDropContext onDragEnd={(result) => onDragEnd(result, "SUPPORTED_MATERIAL")}>
              <StrictModeDroppable droppableId="module">
              {provided => (
                <ul className="link-block no-bullets" {...provided.droppableProps} ref={provided.innerRef}>
                  {supportedMaterials.map((module: ModuleList, idx: number) => {
                    const { id, content, numberModule, createdDate, updatedDate, courseSectionId, url } = module;
                    return (
                      <Draggable draggableId={String(numberModule)} index={numberModule} key={numberModule}>
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
                                    <CardTitle className="text-lg">Modul Ke {numberModule + 1}</CardTitle>
                                    <CardDescription className="text-md">
                                      {content}
                                      {url && (<p>Link: <a href={url} className="italic underline">{url}</a></p>)}
                                    </CardDescription>
                                  </div>
                                  <div className="flex flex-col gap-3">
                                    <ModalAddEditCourseModule isEdit={true} totalLengthModule={modules.length} totalLengthSupportedMaterial={supportedMaterials.length} setModules={setModules} setSupportedMaterials={setSupportedMaterials} defaultData={module} type='SUPPORTED_MATERIAL'  />
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

export default dynamic(() => Promise.resolve(CourseModuleList), {
  ssr: false,
});
