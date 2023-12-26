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
import { useForm } from "react-hook-form";
import { validator } from "@/utils/validator"
import { useSessionUser } from "@/contexts/SessionUserContext"
import React, { ReactNode } from "react"
import { FormDataAddStudent } from "@/types"
import { Datepicker } from 'flowbite-react';
import { useToast } from "@/components/ui/use-toast"

// import 'flowbite/css/flowbite.css';  // Adjust the path based on your project structure


export function ModalAddEditStudent() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormDataAddStudent>();
  const { state, axiosJWT, refreshToken, dispatch } = useSessionUser()
  const { toast } = useToast()
  const [bornAtStudent, setBornAtStudent] = React.useState<Date>()
  const [errorBornAtStudentInput, setErrorBornAtStudentInput] = React.useState<string>()
  const [bornAtParent, setBornAtParent] = React.useState<Date>()
  const [errorBornAtParentInput, setErrorBornAtParentInput] = React.useState<string>()

  const onSubmit = async (values: any) => {
    if (!bornAtStudent) return setErrorBornAtStudentInput("Tanggal lahir wajib diisi.")
    if (!bornAtParent) return setErrorBornAtParentInput("Tanggal lahir wajib diisi.")
    values.parent.bornAt = bornAtParent;
    values.student.bornAt = bornAtStudent;
    console.log({values})

    const postStudent = await axiosJWT.post(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/admin/create-parent-student`, 
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
    console.log({postStudent})
    toast({
      title: "Berhasil menambahkan data murid!",
      description: "Halaman akan refresh 5 detik dari sekarang. Silahkan cek data murid pada tabel yang tersedia",
      className: "bg-white"
    })
    // Refresh the page after 5 seconds
    setTimeout(() => {
      window.location.reload(); // You can use other methods to refresh the page if needed
    }, 5000);
  }
  console.log({errors})
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Tambah Murid
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Tambah Murid</DialogTitle>
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
                  // defaultValue="Pedro Duarte"
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
                  defaultValue=""
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
                  defaultValue=""
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
                  defaultValue=""
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
                  defaultValue=""
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
                  defaultValue=""
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
                  defaultValue=""
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
                  defaultValue=""
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
                  defaultValue=""
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
                  defaultValue=""
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
                  defaultValue=""
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
                  defaultValue=""
                  {...register("parent.phone", { 
                    required: validator.required,
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
