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
import { FormDataAddTeacher, ListTeacherTableType } from "@/types"
import { Datepicker } from 'flowbite-react';
import { useToast } from "@/components/ui/use-toast"

interface ModalTeacherType {
  isEdit: boolean
  defaultData?: ListTeacherTableType | undefined
}

export function ModalAddEditTeacher({ isEdit, defaultData }: ModalTeacherType) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormDataAddTeacher>();
  const { state, axiosJWT, refreshToken, dispatch } = useSessionUser()
  const { toast } = useToast()
  const [bornAtTeacher, setBornAtTeacher] = React.useState<Date>(() => defaultData?.bornAt || new Date())
  const [errorBornAtTeacherInput, setErrorBornAtTeacherInput] = React.useState<string>()

  const onSubmit = async (values: any) => {
    if (!bornAtTeacher) return setErrorBornAtTeacherInput("Tanggal lahir wajib diisi.")
    values.bornAt = bornAtTeacher;
    
    console.log({values})
    // return

    let postTeacher = null
    if (isEdit) {
      values.id = defaultData?.id
      postTeacher = await axiosJWT.put(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/admin-teacher/edit-teacher`, 
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
      postTeacher = await axiosJWT.post(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/admin/create-teacher`, 
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

    console.log({postTeacher})

    if (postTeacher?.data?.statusCode === "000") {
      toast({
        title: "Berhasil menambahkan data guru!",
        description: "Halaman akan refresh 5 detik dari sekarang. Silahkan cek data guru pada tabel yang tersedia",
        className: "bg-white"
      })
    } else {
      toast({
        title: "Gagal menambahkan data guru.",
        description: "Silahkan cek kembali data yang anda input, atau bisa melaporkan ke tim IT",
        className: "bg-red-200"
      })
    }
    // Refresh the page after 5 seconds
    setTimeout(() => {
      window.location.reload(); // You can use other methods to refresh the page if needed
    }, 5000);
  }
  console.log({errors})
  return (
    <Dialog>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white hover:text-white">
            <Edit className="mr-2 h-4 w-4"/> Edit
          </Button>
        ) : (
          <Button variant="outline" className="bg-[#2F9757] hover:bg-[#348f57] text-white hover:text-white">
            <Plus className="mr-1 h-4 w-4" /> {isEdit ? "Edit" : "Tambah"} Guru
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Tambah"} Guru</DialogTitle>
          <DialogDescription>
            Silahkan input data data guru dengan benar.
          </DialogDescription>
        </DialogHeader>
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullname" className="text-left">
                Nama Lengkap
              </Label>
              <div className="col-span-3">
                <Input
                  id="fullname"
                  defaultValue={defaultData?.fullname || undefined}
                  className="w-full"
                  {...register("fullname", { 
                    required: validator.required,
                    min: validator.min(3),
                    max: validator.max(100) })}
                />
                <small className="text-red-500">{errors?.fullname?.message as ReactNode}</small>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-left">
                Nama Singkat
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  defaultValue={defaultData?.name || undefined}
                  {...register("name", { 
                    required: validator.required,
                    minLength: validator.minLength(3),
                    maxLength: validator.maxLength(20) 
                  })}
                />
                <small className="text-red-500">{errors?.name?.message as ReactNode}</small>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-left">
                Email Guru
              </Label>
              <div className="col-span-3">
                <Input
                  id="email"
                  defaultValue={defaultData?.email || undefined}
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x7f])+)\])/i,
                      message: "Format email tidak sesuai"
                    },
                    minLength: validator.minLength(3),
                    maxLength: validator.maxLength(50) 
                  })}
                />
                <small className="text-red-500">{errors?.email?.message as ReactNode}</small>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-left">
                Username
              </Label>
              <div className="col-span-3">
                <Input
                  id="username"
                  defaultValue={defaultData?.username || undefined}
                  {...register("username", { 
                    required: validator.required,
                    minLength: validator.minLength(3),
                    maxLength: validator.maxLength(20) 
                  })}
                />
                <small className="text-red-500">{errors?.username?.message as ReactNode}</small>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bornIn" className="text-left">
                Kota Lahir
              </Label>
              <div className="col-span-3">
                <Input
                  id="bornIn"
                  defaultValue={defaultData?.bornIn || undefined}
                  {...register("bornIn", { 
                    required: validator.required,
                    minLength: validator.minLength(3),
                    maxLength: validator.maxLength(20) 
                  })}
                />
                <small className="text-red-500">{errors?.bornIn?.message as ReactNode}</small>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="" className="text-left">
                Tanggal Lahir
              </Label>
              <div className="col-span-3">
                <Datepicker
                  onSelectedDateChanged={(date) => setBornAtTeacher(date)}
                  // dateFormat="yyyy-MM-dd"
                  // {...register("student.bornAt", { 
                  //   required: validator.required,
                  //   // minLength: validator.minLength(3),
                  //   // maxLength: validator.maxLength(20) 
                  // })}
                  defaultDate={defaultData?.bornAt && new Date(defaultData?.bornAt)}
                />
                {errorBornAtTeacherInput && <small className="text-red-500">{errorBornAtTeacherInput}</small>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-left">
                Nomor Telepon
              </Label>
              <div className="col-span-3">
                <Input
                  id="phone"
                  defaultValue={defaultData?.phone || undefined}
                  {...register("phone", { 
                    // required: validator.required,
                    pattern: validator.phoneNotStrict,
                  })}
                />
                <small className="text-red-500">{errors?.phone?.message as ReactNode}</small>
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
