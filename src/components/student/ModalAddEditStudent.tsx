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
import { useForm } from "react-hook-form";
import { validator } from "@/utils/validator"
import { useSessionUser } from "@/contexts/SessionUserContext"
import React, { ReactNode } from "react"
import { FormDataAddStudent, ListStudentTableType } from "@/types"
import { Datepicker } from 'flowbite-react';
import { useToast } from "@/components/ui/use-toast"

interface ModalStudentType {
  isEdit: boolean
  defaultData?: ListStudentTableType | undefined
}

export function ModalAddEditStudent({ isEdit, defaultData }: ModalStudentType) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormDataAddStudent>();
  const { state, axiosJWT, refreshToken, dispatch } = useSessionUser()
  const { toast } = useToast()
  const [bornAtStudent, setBornAtStudent] = React.useState<Date>(() => defaultData?.bornAt || new Date())
  const [errorBornAtStudentInput, setErrorBornAtStudentInput] = React.useState<string>()
  const [bornAtParent, setBornAtParent] = React.useState<Date>(() => defaultData?.parent?.bornAt || new Date())
  const [errorBornAtParentInput, setErrorBornAtParentInput] = React.useState<string>()
  console.log({defaultData})
  const onSubmit = async (values: any) => {
    if (!bornAtStudent) return setErrorBornAtStudentInput("Tanggal lahir wajib diisi.")
    if (!bornAtParent) return setErrorBornAtParentInput("Tanggal lahir wajib diisi.")
    values.parent.bornAt = bornAtParent;
    values.student.bornAt = bornAtStudent;
    console.log({values})
    // return
    let postStudent = null
    if (isEdit) {
      values.parent.id = defaultData?.parent?.id
      values.student.id = defaultData?.id

      postStudent = await axiosJWT.put(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/admin-student/edit-student-parent`, 
        {
          ...values
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${state?.token}`
          }
        }
      )
    } else {
      postStudent = await axiosJWT.post(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/admin/create-parent-student`, 
        {
          ...values
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${state?.token}`
          }
        }
      )
    }
    console.log({postStudent})

    if (postStudent?.data?.statusCode === "000") {
      toast({
        title: "Berhasil menambahkan data murid!",
        description: "Halaman akan refresh 5 detik dari sekarang. Silahkan cek data murid pada tabel yang tersedia",
        className: "bg-white"
      })
    } else {
      toast({
        title: "Gagal menambahkan data murid.",
        description: "Silahkan cek kembali data yang anda input, atau bisa melaporkan ke tim IT",
        className: "bg-red-200"
      })
    }
    // Refresh the page after 5 seconds
    setTimeout(() => {
      window.location.reload(); // You can use other methods to refresh the page if needed
    }, 5000);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white hover:text-white">
            <Edit className="mr-2 h-4 w-4"/> Edit
          </Button>
        ) : (
          <Button variant="outline" className="bg-[#2F9757] hover:bg-[#348f57] text-white hover:text-white">
            <Plus className="mr-1 h-4 w-4" /> {isEdit ? "Edit" : "Tambah"} Murid
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] bg-white max-w-[90%] max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Tambah"}  Murid</DialogTitle>
          <DialogDescription>
            Silahkan input data data murid dan orang tua dengan benar.
          </DialogDescription>
        </DialogHeader>
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div>
              <p className="text-lg">Data Murid</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student.fullname" className="text-left">
                Nama Lengkap
              </Label>
              <div className="col-span-3">
                <Input
                  id="studentFullname"
                  defaultValue={defaultData?.fullname}
                  className="w-full"
                  {...register("student.fullname", { 
                    required: validator.required,
                    min: validator.min(3),
                    max: validator.max(100) })}
                />
                <small className="text-red-500">{errors?.student?.fullname?.message as ReactNode}</small>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student.name" className="text-left">
                Nama Singkat
              </Label>
              <div className="col-span-3">
                <Input
                  id="student.name"
                  defaultValue={defaultData?.name}
                  {...register("student.name", { 
                    required: validator.required,
                    minLength: validator.minLength(3),
                    maxLength: validator.maxLength(20) 
                  })}
                />
                <small className="text-red-500">{errors?.student?.name?.message as ReactNode}</small>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student.email" className="text-left">
                Email Murid
              </Label>
              <div className="col-span-3">
                <Input
                  id="student.email"
                  defaultValue={defaultData?.email}
                  {...register("student.email", { 
                    required: "Email is required",
                    pattern: {
                      value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x7f])+)\])/i,
                      message: "Format email tidak sesuai"
                    },
                    minLength: validator.minLength(3),
                    maxLength: validator.maxLength(50) 
                  })}
                />
                <small className="text-red-500">{errors?.student?.email?.message as ReactNode}</small>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student.username" className="text-left">
                Username
              </Label>
              <div className="col-span-3">
                <Input
                  id="student.username"
                  defaultValue={defaultData?.username}
                  {...register("student.username", { 
                    required: validator.required,
                    minLength: validator.minLength(3),
                    maxLength: validator.maxLength(20) 
                  })}
                />
                <small className="text-red-500">{errors?.student?.username?.message as ReactNode}</small>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student.bornIn" className="text-left">
                Kota Lahir
              </Label>
              <div className="col-span-3">
                <Input
                  id="student.bornIn"
                  defaultValue={defaultData?.bornIn}
                  {...register("student.bornIn", { 
                    required: validator.required,
                    minLength: validator.minLength(3),
                    maxLength: validator.maxLength(20) 
                  })}
                />
                <small className="text-red-500">{errors?.student?.bornIn?.message as ReactNode}</small>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="" className="text-left">
                Tanggal Lahir
              </Label>
              <div className="col-span-3">
                <Datepicker
                  onSelectedDateChanged={(date) => setBornAtStudent(date)}
                  // dateFormat="yyyy-MM-dd"
                  // {...register("student.bornAt", { 
                  //   required: validator.required,
                  //   // minLength: validator.minLength(3),
                  //   // maxLength: validator.maxLength(20) 
                  // })}
                  defaultDate={defaultData?.bornAt && new Date(defaultData?.bornAt)}
                />
                {errorBornAtStudentInput && <small className="text-red-500">{errorBornAtStudentInput}</small>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student.phone" className="text-left">
                Nomor Telepon
              </Label>
              <div className="col-span-3">
                <Input
                  id="student.phone"
                  defaultValue={defaultData?.phone}
                  {...register("student.phone", { 
                    // required: validator.required,
                    pattern: validator.phoneNotStrict,
                  })}
                />
                <small className="text-red-500">{errors?.student?.phone?.message as ReactNode}</small>
              </div>
            </div>
          </div>
          <div className="grid gap-4 py-4">
            <div>
              <p className="text-lg">Data Wali Murid</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parent.fullname" className="text-left">
                Nama Lengkap
              </Label>
              <div className="col-span-3">
                <Input
                  id="parent.fullname"
                  defaultValue={defaultData?.parent?.fullname}
                  {...register("parent.fullname", { 
                    required: validator.required,
                    minLength: validator.minLength(3),
                    maxLength: validator.maxLength(100) 
                  })}
                />
                <small className="text-red-500">{errors?.parent?.fullname?.message as ReactNode}</small>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parent.name" className="text-left">
                Nama Singkat
              </Label>
              <div className="col-span-3">
                <Input
                  id="parent.name"
                  defaultValue={defaultData?.parent?.name}
                  {...register("parent.name", { 
                    required: validator.required,
                    minLength: validator.minLength(3),
                    maxLength: validator.maxLength(50) 
                  })}
                />
                <small className="text-red-500">{errors?.parent?.name?.message as ReactNode}</small>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-left">
                Email Orang Tua / Wali Murid
              </Label>
              <div className="col-span-3">
                <Input
                  id="parent.email"
                  defaultValue={defaultData?.parent?.email}
                  {...register("parent.email", { 
                    required: "Email is required",
                    pattern: {
                      value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x7f])+)\])/i,
                      message: "Format email tidak sesuai"
                    },
                    minLength: validator.minLength(3),
                    maxLength: validator.maxLength(50) 
                  })}
                />
                <small className="text-red-500">{errors?.parent?.email?.message as ReactNode}</small>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-left">
                Username
              </Label>
              <div className="col-span-3">
                <Input
                  id="parent.username"
                  defaultValue={defaultData?.parent?.username}
                  {...register("parent.username", { 
                    required: validator.required,
                    minLength: validator.minLength(3),
                    maxLength: validator.maxLength(30) 
                  })}
                />
                <small className="text-red-500">{errors?.parent?.username?.message as ReactNode}</small>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parent.bornIn" className="text-left">
                Kota Lahir
              </Label>
              <div className="col-span-3">
                <Input
                  id="parent.bornIn"
                  defaultValue={defaultData?.parent?.bornIn}
                  {...register("parent.bornIn", { 
                    required: validator.required,
                    minLength: validator.minLength(3),
                    maxLength: validator.maxLength(30) 
                  })}
                />
                <small className="text-red-500">{errors?.parent?.bornIn?.message as ReactNode}</small>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="" className="text-right">
                Tanggal Lahir
              </Label>
              <div className="col-span-3">
                <Datepicker
                  onSelectedDateChanged={(date) => setBornAtParent(date)}
                  // dateFormat="yyyy-MM-dd"
                  // {...register("parent.bornAt", { 
                  //   required: validator.required,
                  //   // minLength: validator.minLength(3),
                  //   // maxLength: validator.maxLength(20) 
                  // })}
                  defaultDate={defaultData?.parent?.bornAt && new Date(defaultData?.parent?.bornAt)}
                />
                {errorBornAtParentInput && <small className="text-red-500">{errorBornAtParentInput}</small>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parent.phone" className="text-right">
                Nomor Telepon
              </Label>
              <div className="col-span-3">
                <Input
                  id="parent.phone"
                  defaultValue={defaultData?.parent?.phone}
                  {...register("parent.phone", { 
                    // required: validator.required,
                    pattern: validator.phoneNotStrict,
                  })}
                />
                <small className="text-red-500">{errors?.parent?.phone?.message as ReactNode}</small>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
