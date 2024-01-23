import React, { useState, Dispatch, SetStateAction, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit } from "lucide-react"
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
import { TeacherDetail, EnrollmentStudentDetailPage, InitialDataBeforeEnroll, InitGetAllClass, InitialTeacherData, InitialTeacherEnrollData } from "@/types"
import { useSessionUser } from "@/contexts/SessionUserContext"
import { useToast } from "@/components/ui/use-toast"
import Select, { ActionMeta, SingleValue } from "react-select"
import { useRouter } from "next/router"

type Option = { value: string | undefined; label: string | undefined, isDisabled?: boolean };
interface ModalEnrollmentTeacherType {
  isEdit: boolean
  defaultData?: TeacherDetail
  enrollmentStudent?: EnrollmentStudentDetailPage
}

const optionTeacherType = [
  { label: "Guru Pelajaran", value: "NORMAL" },
  { label: "Wali Kelas", value: "HOMEROOM" },
]

const ModalAddEditEnrollmentTeacher = ({ isEdit, defaultData }: ModalEnrollmentTeacherType) => {
  const { state, axiosJWT } = useSessionUser()
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast()
  const [initialData, setInitialData] = useState<InitialTeacherData>();
  const [optionClasses, setOptionClasses] = useState<Option[]>();
  const [optionSubjects, setOptionSubjects] = useState<Option[]>();
  const [selectTeacherType, setSelectTeacherType] = useState<Option>();
  const [selectClass, setSelectClass] = useState<Option | null>();
  const [selectSubject, setSelectSubject] = useState<Option | null>();
  const [isStudentCannotEnroll, setIsStudentCannotEnroll] = useState<boolean>(false);

  // const [selectedClass, setSelectedClass] = useState<Option | undefined>(selectOption?.find(opt => opt.label === enrollmentStudent?.className));
  // const [selectedStatus, setSelectedStatus] = useState<Option | undefined>(optionStatusFilter?.find(status => status.value === enrollmentStudent?.status) || undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    setSelectClass(null)
    setSelectSubject(null)
    setSelectTeacherType(undefined)
  }, [isModalOpen])
  useEffect(() => {
    // setIsStudentCannotEnroll(false)
    // setSelectedStatus(undefined)
    // setSelectedClass(undefined)
    if (id) fetchInitData()
  }, [isModalOpen, selectTeacherType])


  const handleSelectTeacherType = (option: SingleValue<Option> | null, actionMeta: ActionMeta<Option>) => {
    option && setSelectTeacherType(option)
    setSelectClass(null)
    setSelectSubject(null)
  }
  const handleSelectClass = (option: SingleValue<Option> | null, actionMeta: ActionMeta<Option>) => {
    option && setSelectClass(option)
    setSelectSubject(null)
    if (option && selectTeacherType?.value === "NORMAL") {
      const filteringClass: Option[] = (initialData?.enroll_data ?? []).filter(data => data.classId === option.value).map((data: InitialTeacherEnrollData) => {
        return {
          label: data.courseLabel,
          value: data.courseValue,
          isDisabled: !data.isSupportEnroll
        };
      });
      console.log({filteringClass})
      if (filteringClass?.length > 0) setOptionSubjects(filteringClass)
    }
  }

  const handleSelectSubject = (option: SingleValue<Option> | null, actionMeta: ActionMeta<Option>) => {
    option && setSelectSubject(option)
  }

  console.log({optionClasses, selectClass, initialData})
  const fetchInitData = async () => {
    try {
      //${isEdit ? `&id=${enrollmentStudent?.id}` : ""}
      const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/enrollment-teacher/initial-data-enroll-teacher?teacherId=${id}${selectTeacherType && `&teacherType=${selectTeacherType.value}`}`, {
        headers: {
          Authorization: `Bearer ${state?.token}`
        }
      })
      console.log({response})
      if (response?.data?.statusCode === "000") {
        // setInitialData(response?.data?.data);
        setOptionClasses(response?.data?.data?.classes)
        setInitialData(response?.data?.data)
        // setSelectOption(
        //   response?.data?.data?.classes?.map((className: InitGetAllClass) => {
        //     return {
        //       value: className.id,
        //       label: className.name
        //     }
        //   })
        // )
      } else {
        throw Error("Fetch data error.")
      }
    } catch (error) {
      console.error(error)
      // setIsStudentCannotEnroll(true)
      // console.log({status: error?.response})
    }
  }

  const onSubmit = async () => {
    // console.log(selectedClass?.value)
    const response = await axiosJWT.post(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/enrollment-teacher/insert-enrollment-teacher`, 
    {
      ...(selectTeacherType?.value === "NORMAL" && {
        classId: selectClass?.value,
        courseValue: selectSubject?.value,
        isHomeRoom: false
      }),
      ...(selectTeacherType?.value === "HOMEROOM" && {
        homeRoomClassId: selectClass?.value,
        isHomeRoom: true
      }),
      teacherId: id,
    },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${state?.token}`
      }
    })

    if (response?.data?.statusCode === "000") {
      toast({
        title: "Berhasil menambahkan data enrollment guru!",
        description: "Silahkan cek data guru pada kolom yang tersedia. Halaman ini akan terefresh dalam 5 detik.",
        className: "bg-white"
      })
      setTimeout(() => {
        window.location.reload(); // You can use other methods to refresh the page if needed
      }, 5000);
      setIsModalOpen(!isModalOpen)
    } else {
      toast({
        title: "Gagal menambahkan data enrollment guru.",
        description: response?.data?.message || "Silahkan cek kembali data yang anda input, atau bisa melaporkan ke tim IT",
        className: "bg-red-200"
      })
    }
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
            <Edit className="mr-2 h-4 w-4"/> Edit
          </Button>
        ) : (
          <Button variant="outline" className="bg-[#2F9757] hover:bg-[#348f57] text-white hover:text-white">
            <Plus className="mr-1 h-4 w-4" /> {isEdit ? "Edit" : "Tambah"} Enrollment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Tambah"} Enrollment Guru</DialogTitle>
          <DialogDescription>
            Silahkan {isEdit ? "Edit" : "Tambah"} enrollment guru dengan teliti.
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
                      // defaultValue={defaultData?.id}
                      className=""
                      disabled
                    />
                  </div>
                </>
              )}
              <div className="flex flex-col gap-4">
                <Label htmlFor="name" className="text-left">
                  Tipe Guru
                </Label>
                <Select
                  className="basic-single w-[100%] rounded-xl"
                  classNamePrefix="select"
                  // defaultValue={selectOption?.find(opt => opt.label === enrollmentStudent?.className)}
                  // isLoading={isLoading}
                  // value={selectedClass}
                  isClearable={true}
                  isSearchable={false}
                  name="typeTeacher"
                  options={optionTeacherType}
                  placeholder="Pilih Tipe Guru"
                  onChange={handleSelectTeacherType}
                  // isDisabled={enrollmentStudent?.status === "ACTIVE" || enrollmentStudent?.status === "GRADUATED" }
                />
              </div>
              <div className="flex flex-col gap-4">
                <Label htmlFor="name" className="text-left">
                  Kelas
                </Label>
                <Select
                  className="basic-single w-[100%] rounded-xl"
                  classNamePrefix="select"
                  // defaultValue={selectOption?.find(opt => opt.label === enrollmentStudent?.className)}
                  // isLoading={isLoading}
                  value={selectClass}
                  isClearable={false}
                  isSearchable={false}
                  name="class"
                  options={optionClasses}
                  placeholder="Pilih Kelas"
                  onChange={handleSelectClass}
                  // isDisabled={enrollmentStudent?.status === "ACTIVE" || enrollmentStudent?.status === "GRADUATED" }
                />
              </div>
              {selectTeacherType?.value === "NORMAL" && optionSubjects?.length && (
                <div className="flex flex-col gap-4">
                  <Label htmlFor="name" className="text-left">
                    Pelajaran
                  </Label>
                  <Select
                    className="basic-single w-[100%] rounded-xl"
                    classNamePrefix="select"
                    // defaultValue={selectOption?.find(opt => opt.label === enrollmentStudent?.className)}
                    // isLoading={isLoading}
                    value={selectSubject}
                    isClearable={false}
                    isSearchable={false}
                    name="class"
                    options={optionSubjects}
                    placeholder="Pilih Kelas"
                    onChange={handleSelectSubject}
                    // isDisabled={enrollmentStudent?.status === "ACTIVE" || enrollmentStudent?.status === "GRADUATED" }
                  />
                </div>
              )}
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

export default ModalAddEditEnrollmentTeacher
