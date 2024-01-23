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
import { AcademicYearData } from "@/types"
import { useSessionUser } from "@/contexts/SessionUserContext"
import { useToast } from "@/components/ui/use-toast"

interface ModalAcademicYearType {
  isEdit: boolean
  defaultData?: AcademicYearData | undefined
  setAcademicYears: Dispatch<SetStateAction<AcademicYearData[]>>
}

const ModalAddEditAcademicYear = ({ isEdit, defaultData, setAcademicYears }: ModalAcademicYearType) => {
  const { state, axiosJWT } = useSessionUser()
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [academicYear, setAcademicYear] = useState<string | undefined>(defaultData?.academicYear)

  useEffect(() => {
    setAcademicYear(defaultData?.academicYear || "")
  }, [isModalOpen])

  const onSubmit = async () => {
    const response = await axiosJWT.post(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/academic-year`, 
    {
      ...(isEdit && { id: defaultData?.id }),
      academicYear
    },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${state?.token}`
      }
    })

    if (response?.data?.statusCode === "000") {
      toast({
        title: "Berhasil menambahkan data tahun ajaran!",
        description: "Silahkan cek data kurikulum pada kolom yang tersedia. Perhatikan kembali tahun ajaran mana yang ingin diaktifkan",
        className: "bg-white"
      })

      if (isEdit) {
        setAcademicYears(prevAcademicYears =>
          prevAcademicYears.map(academic =>
            academic.id === defaultData?.id ? { ...academic, name: name } : academic
          )
        );
      } else {
        const newObj: AcademicYearData | undefined = response?.data?.data
        if (newObj) {
          setAcademicYears(prevAcademicYears => [...prevAcademicYears, { ...newObj}]);
        }
      }

    } else {
      toast({
        title: "Gagal menambahkan data tahun ajaran.",
        description: "Silahkan cek kembali data yang anda input, atau bisa melaporkan ke tim IT",
        className: "bg-red-200"
      })
    }
    setAcademicYear('')
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
            <Plus className="mr-2 h-4 w-4" /> {isEdit ? "Edit" : "Tambah"} Tahun Ajaran
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Tambah"} Tahun Ajaran</DialogTitle>
          <DialogDescription>
            Silahkan {isEdit ? "Edit" : "Tambah"} tahun ajaran dengan teliti.
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
            <Label htmlFor="academicYear" className="text-left">
              Tahun Ajaran
            </Label>
            <Input
              id="academicYear"
              defaultValue={defaultData?.academicYear}
              className="col-span-3"
              onChange={(e) => setAcademicYear(e.target.value)}
              value={academicYear}
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

export default ModalAddEditAcademicYear
