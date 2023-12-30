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
import Select, { GroupBase, ActionMeta } from "react-select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ModuleList, Option } from "@/types"
import { useSessionUser } from "@/contexts/SessionUserContext"
import { useToast } from "../ui/use-toast"
import { useRouter } from "next/router"

type ModalAddEditCourseModuleType = {
  isEdit: boolean
  defaultData?: ModuleList
  totalLengthModule: number
  totalLengthSupportedMaterial: number
  type?: string
  setModules: Dispatch<SetStateAction<ModuleList[]>>
  setSupportedMaterials: Dispatch<SetStateAction<ModuleList[]>>
}

type ObjModuleType = {
  MODULE: string
  SUPPORTED_MATERIAL: string
}

const moduleTypes = [
  { label: "Modul Pelajaran", value: "MODULE" },
  { label: "Materi Pendukung", value: "SUPPORTED_MATERIAL" }
]

const objModule = {
  MODULE: "Materi Pelajaran",
  SUPPORTED_MATERIAL: "Materi Pendukung"
}

export function ModalAddEditCourseModule({ 
  isEdit, defaultData, totalLengthModule, totalLengthSupportedMaterial, setModules, setSupportedMaterials, type 
}: ModalAddEditCourseModuleType) {

  const { state, axiosJWT } = useSessionUser()
  const router = useRouter()
  const { id, sectionId } = router.query
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [content, setContent] = useState<string | undefined>(defaultData?.content)
  const [url, setUrl] = useState<string | undefined>(defaultData?.url)
  const [typeModule, setTypeModule] = useState<Option>()

  React.useEffect(() => {
    setContent(defaultData?.content || "")
    setUrl(defaultData?.url || "")
  }, [isModalOpen])

  React.useEffect(() => {
    if (type) setTypeModule({ value: type, label: objModule[type as keyof ObjModuleType] })
  }, [])

  const onSubmit = async () => {
    const response = await axiosJWT.post(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/course-module/insert-update-course-module`, 
    {
      ...(isEdit && { id: defaultData?.id }),
      courseSectionId: sectionId,
      courseId: id,
      content,
      ...(url && { url }),
      isSupportedMaterial: typeModule?.value === "SUPPORTED_MATERIAL",
      ...(!isEdit && { numberModule: typeModule?.value === "MODULE" ? totalLengthModule : totalLengthSupportedMaterial })
    },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${state?.token}`
      }
    })

    if (response?.data?.statusCode === "000") {
      toast({
        title: "Berhasil menambahkan data modul pelajaran!",
        description: "Silahkan cek data modul pelajaran pada kolom yang tersedia.",
        className: "bg-white"
      })

      if (isEdit) {
        if (typeModule?.value === "MODULE") {
          setModules((prevModules: ModuleList[]) =>
            prevModules.map((module: ModuleList) =>
              module.id === defaultData?.id ? { ...module, content } : module
            )
          );
        } else if (typeModule?.value === "SUPPORTED_MATERIAL") {
          setSupportedMaterials((prevModules: ModuleList[]) =>
            prevModules.map((module: ModuleList) =>
              module.id === defaultData?.id ? { ...module, content } : module
            )
          );
        }
      } else {
        const newObj: ModuleList | undefined = response?.data?.data
        if (newObj && typeModule?.value === "MODULE") {
          setModules(prevSections => [...prevSections, { ...newObj}]);
        } else if (newObj && typeModule?.value === "SUPPORTED_MATERIAL") {
          console.log({newObj})
          setSupportedMaterials(prevSections => [...prevSections, { ...newObj}]);
        }
      }

    } else {
      toast({
        title: "Gagal menambahkan data modul pelajaran.",
        description: "Silahkan cek kembali data yang anda input, atau bisa melaporkan ke tim IT",
        className: "bg-red-200"
      })
    }
    setContent('')
    setUrl('')
    setIsModalOpen(!isModalOpen)
  }

  const handleSelectType = (option: Option | null, actionMeta: ActionMeta<Option>) => {
    option && setTypeModule(option)
  }

  console.log({typeModule})
  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(val) => {
        setIsModalOpen(val)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" /> {isEdit ? "Edit" : "Tambah"} Modul
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Tambah"} Modul</DialogTitle>
          <DialogDescription>
          Silahkan {isEdit ? "Edit" : "Tambah"} Modul dengan teliti.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="content" className="text-left">
              Tipe Modul
            </Label>
            <Select
              className="basic-single w-[100%] rounded-xl"
              classNamePrefix="select"
              // defaultValue={selectOption?.find(opt => opt.label === enrollmentStudent?.className)}
              // isLoading={isLoading}
              value={typeModule}
              isClearable={false}
              isSearchable={false}
              name="class"
              options={moduleTypes}
              placeholder="Pilih Tipe Modul"
              onChange={handleSelectType}
              isDisabled={isEdit}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="content" className="text-left">
              Konten
            </Label>
            <Textarea
              id="content"
              defaultValue={defaultData?.content}
              className="col-span-3"
              onChange={(e) => setContent(e.target.value)}
              value={content}
              placeholder="Input penjelasan dari modul yang ingin ditambahkan"
            />
          </div>
          {typeModule?.value === "SUPPORTED_MATERIAL" && (
            <div className="flex flex-col gap-4">
              <Label htmlFor="username" className="text-left">
                Url
              </Label>
              <Input
                id="url"
                defaultValue={defaultData?.url}
                onChange={(e) => setUrl(e.target.value)}
                className="col-span-3"
                value={url}
                placeholder="Silahkan masukkan URL link materi pembantu jika ada"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
