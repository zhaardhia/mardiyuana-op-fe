import React, { useState } from "react"
import { Dispatch, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CourseSectionList } from "@/types"
import { useSessionUser } from "@/contexts/SessionUserContext"
import { useToast } from "../ui/use-toast"
import { useRouter } from "next/router"

type ModalAddCourseSection = {
  isEdit: boolean
  defaultData?: CourseSectionList
  totalLength: number
  setCourseSections: Dispatch<SetStateAction<CourseSectionList[]>>
}

export function ModalAddCourseSection({ isEdit, defaultData, totalLength, setCourseSections }: ModalAddCourseSection) {
  const { state, axiosJWT } = useSessionUser()
  const router = useRouter()
  const { id } = router.query
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [name, setName] = useState<string | undefined>(defaultData?.name)
  const [description, setDescription] = useState<string | undefined>(defaultData?.description)

  React.useEffect(() => {
    setName(defaultData?.name || "")
    setDescription(defaultData?.description || "")
  }, [isModalOpen])

  const onSubmit = async () => {
    const response = await axiosJWT.post(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/course-section/insert-update-course-section`, 
    {
      ...(isEdit && { id: defaultData?.id }),
      name,
      description,
      courseId: id,
      ...(!isEdit && { numberSection: totalLength })
    },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${state?.token}`
      }
    })

    if (response?.data?.statusCode === "000") {
      toast({
        title: "Berhasil menambahkan data bab pelajaran!",
        description: "Silahkan cek data bab pelajaran pada kolom yang tersedia.",
        className: "bg-white"
      })

      if (isEdit) {
        setCourseSections(prevCourseSections =>
          prevCourseSections.map(section =>
            section.id === defaultData?.id ? { ...section, name, description } : section
          )
        );
      } else {
        const newObj: CourseSectionList | undefined = response?.data?.data
        if (newObj) {
          setCourseSections(prevSections => [...prevSections, { ...newObj}]);
        }
      }

    } else {
      toast({
        title: "Gagal menambahkan data bab pelajaran.",
        description: "Silahkan cek kembali data yang anda input, atau bisa melaporkan ke tim IT",
        className: "bg-red-200"
      })
    }
    setName('')
    setDescription('')
    setIsModalOpen(!isModalOpen)
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(val) => {
        setIsModalOpen(val)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" /> {isEdit ? "Edit" : "Tambah"} Bab
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Tambah"} Bab</DialogTitle>
          <DialogDescription>
          Silahkan {isEdit ? "Edit" : "Tambah"} Bab dengan teliti.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="name" className="text-left">
              Judul
            </Label>
            <Input
              id="title"
              defaultValue={defaultData?.name}
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="username" className="text-left">
              Deskripsi
            </Label>
            <Textarea
              id="description"
              defaultValue={defaultData?.description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              value={description}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
