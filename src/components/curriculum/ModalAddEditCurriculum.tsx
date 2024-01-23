import React, { useState, Dispatch, SetStateAction, useEffect } from "react"
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
import { Label } from "@/components/ui/label"
import { CurriculumData } from "@/types"
import { useSessionUser } from "@/contexts/SessionUserContext"
import { useToast } from "@/components/ui/use-toast"

interface ModalCurriculumType {
  isEdit: boolean
  defaultData?: CurriculumData | undefined
  setCurriculums: Dispatch<SetStateAction<CurriculumData[]>>
}

const ModalAddEditCurriculum = ({ isEdit, defaultData, setCurriculums }: ModalCurriculumType) => {
  const { state, axiosJWT } = useSessionUser()
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [name, setName] = useState<string | undefined>(defaultData?.name)

  useEffect(() => {
    setName(defaultData?.name || "")
  }, [isModalOpen])

  const onSubmit = async () => {
    const response = await axiosJWT.post(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/curriculum`, 
    {
      ...(isEdit && { id: defaultData?.id }),
      name
    },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${state?.token}`
      }
    })

    if (response?.data?.statusCode === "000") {
      toast({
        title: "Berhasil menambahkan data kurikulum!",
        description: "Silahkan cek data kurikulum pada kolom yang tersedia. Perhatikan kembali kurikulum mana yang ingin diaktifkan",
        className: "bg-white"
      })

      if (isEdit) {
        setCurriculums(prevCurriculums =>
          prevCurriculums.map(curriculum =>
            curriculum.id === defaultData?.id ? { ...curriculum, name: name } : curriculum
          )
        );
      } else {
        const newObj: CurriculumData | undefined = response?.data?.data
        if (newObj) {
          setCurriculums(prevCurriculums => [...prevCurriculums, { ...newObj}]);
        }
      }

    } else {
      toast({
        title: "Gagal menambahkan data kurikulum.",
        description: "Silahkan cek kembali data yang anda input, atau bisa melaporkan ke tim IT",
        className: "bg-red-200"
      })
    }
    setName('')
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
        {isEdit ? (
          <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white hover:text-white">
            Edit
          </Button>
        ) : (
          <Button variant="outline" className="bg-[#2F9757] hover:bg-[#348f57] text-white hover:text-white">
            <Plus className="mr-2 h-4 w-4" /> Tambah Kurikulum
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Tambah"} Kurikulum</DialogTitle>
          <DialogDescription>
            Silahkan {isEdit ? "Edit" : "Tambah"} kurikulum dengan teliti.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isEdit && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-left">
                ID
              </Label>
              <Input
                id="name"
                defaultValue={defaultData?.id}
                className="col-span-3"
                disabled
              />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              Name
            </Label>
            <Input
              id="name"
              defaultValue={defaultData?.name}
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit"
            onClick={onSubmit}
          >Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModalAddEditCurriculum
