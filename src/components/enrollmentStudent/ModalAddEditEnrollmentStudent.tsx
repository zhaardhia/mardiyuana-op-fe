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
import { DetailStudent, EnrollmentStudentDetailPage, InitialDataBeforeEnroll, InitGetAllClass } from "@/types"
import { useSessionUser } from "@/contexts/SessionUserContext"
import { useToast } from "@/components/ui/use-toast"
import Select, { ActionMeta } from "react-select"

type Option = { value: string; label: string };
interface ModalEnrollmentStudentType {
  isEdit: boolean
  defaultData?: DetailStudent
  enrollmentStudent?: EnrollmentStudentDetailPage
  setStudentData: Dispatch<SetStateAction<DetailStudent | undefined>>
}

const optionStatusFilter = [
  { label: "Aktif", value: "ACTIVE" },
  { label: "Tidak Lulus / Dikeluarkan", value: "INACTIVE" },
  { label: "Naik Kelas", value: "GRADUATED" },
]

const ModalAddEditEnrollmentStudent = ({ isEdit, defaultData, setStudentData, enrollmentStudent }: ModalEnrollmentStudentType) => {
  const { state, axiosJWT } = useSessionUser()
  const { toast } = useToast()
  const [initialData, setInitialData] = useState<InitialDataBeforeEnroll>();
  const [isStudentCannotEnroll, setIsStudentCannotEnroll] = useState<boolean>(false);
  const [selectOption, setSelectOption] = useState<Option[]>();
  const [selectedClass, setSelectedClass] = useState<Option | undefined>(selectOption?.find(opt => opt.label === enrollmentStudent?.className));
  const [selectedStatus, setSelectedStatus] = useState<Option | undefined>(optionStatusFilter?.find(status => status.value === enrollmentStudent?.status) || undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    setIsStudentCannotEnroll(false)
    setSelectedStatus(undefined)
    setSelectedClass(undefined)
    fetchInitData()
  }, [isModalOpen])

  useEffect(() => {
    setSelectedClass(selectOption?.find(opt => opt.label === enrollmentStudent?.className))
  }, [selectOption])

  const handleSelectClass = (option: Option | null, actionMeta: ActionMeta<Option>) => {
    option && setSelectedClass(option)
  }

  const handleSelectStatus = (option: Option | null, actionMeta: ActionMeta<Option>) => {
    option && setSelectedStatus(option)
  }

  const fetchInitData = async () => {
    try {
      const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/enrollment-student/initial-data?studentId=${defaultData?.id}${isEdit ? `&id=${enrollmentStudent?.id}` : ""}`, {
        headers: {
          Authorization: `Bearer ${state?.token}`
        }
      })
      console.log({response})
      if (response?.data?.statusCode === "000") {
        setInitialData(response?.data?.data);
        setSelectOption(
          response?.data?.data?.classes?.map((className: InitGetAllClass) => {
            return {
              value: className.id,
              label: className.name
            }
          })
        )
        // setTotalData(response?.data?.data?.totalData);
        // setTotalPages(response?.data?.data?.totalPages);
        // setNextPage(response?.data?.data?.nextPage);
      } else {
        throw Error("Fetch data error.")
      }
    } catch (error) {
      console.error(error)
      setIsStudentCannotEnroll(true)
      // console.log({status: error?.response})
    }
  }

  const onSubmit = async () => {
    console.log(selectedClass?.value)
    const response = await axiosJWT.post(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/enrollment-student/insert-update-enrollment-student`, 
    {
      ...(isEdit && { id: enrollmentStudent?.id, status: selectedStatus?.value }),
      academicYearId: enrollmentStudent?.academicYearId || initialData?.activeAcademicYear?.id,
      studentId: defaultData?.id,
      classId: selectedClass?.value
    },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${state?.token}`
      }
    })

    if (response?.data?.statusCode === "000") {
      toast({
        title: "Berhasil menambahkan data murid!",
        description: "Silahkan cek data murid pada kolom yang tersedia. Halaman ini akan terefresh dalam 5 detik.",
        className: "bg-white"
      })
    } else {
      toast({
        title: "Gagal menambahkan data murid.",
        description: "Silahkan cek kembali data yang anda input, atau bisa melaporkan ke tim IT",
        className: "bg-red-200"
      })
    }

    setTimeout(() => {
      window.location.reload(); // You can use other methods to refresh the page if needed
    }, 5000);
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
          <Button variant="outline">
            Edit
          </Button>
        ) : (
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> {isEdit ? "Edit" : "Tambah"} Enrollment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Tambah"} Enrollment</DialogTitle>
          <DialogDescription>
            Silahkan {isEdit ? "Edit" : "Tambah"} enrollment dengan teliti.
          </DialogDescription>
        </DialogHeader>
        {isStudentCannotEnroll ? (
          <div>
            <p>Murid tidak dapat enroll tahun ajaran baru. Cek kelengkapan data sebelum enroll tahun ajaran baru.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              {isEdit && (
                <>
                  <div className="flex flex-col gap-4">
                    <Label htmlFor="name" className="text-left">
                      ID
                    </Label>
                    <Input
                      id="name"
                      defaultValue={defaultData?.id}
                      className=""
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <Label htmlFor="name" className="text-left">
                      Status
                    </Label>
                    <Select
                      className="basic-single w-[100%] rounded-xl"
                      classNamePrefix="select"
                      defaultValue={optionStatusFilter?.find(status => status.value === enrollmentStudent?.status)}
                      // isLoading={isLoading}
                      value={selectedStatus}
                      isClearable={false}
                      isSearchable={false}
                      name="class"
                      options={optionStatusFilter}
                      placeholder="Pilih Status"
                      onChange={handleSelectStatus}
                    />
                  </div>
                </>
              )}
              <div className="flex flex-col gap-4">
                <Label htmlFor="name" className="text-left">
                  Tahun Ajaran Aktif
                </Label>
                <Input
                  id="name"
                  defaultValue={enrollmentStudent?.academicYear || initialData?.activeAcademicYear?.academicYear}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-4">
                <Label htmlFor="name" className="text-left">
                  Kelas
                </Label>
                <Select
                  className="basic-single w-[100%] rounded-xl"
                  classNamePrefix="select"
                  defaultValue={selectOption?.find(opt => opt.label === enrollmentStudent?.className)}
                  // isLoading={isLoading}
                  value={selectedClass}
                  isClearable={false}
                  isSearchable={false}
                  name="class"
                  options={selectOption}
                  placeholder="Pilih Kelas"
                  onChange={handleSelectClass}
                  isDisabled={enrollmentStudent?.status === "ACTIVE" || enrollmentStudent?.status === "GRADUATED" }
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit"
                onClick={onSubmit}
              >Save changes</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ModalAddEditEnrollmentStudent
