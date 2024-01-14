import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import { useToast } from "./ui/use-toast";
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useSessionUser } from "@/contexts/SessionUserContext";

type ModalDeleteType = {
  id: string
  title: string
  endpoint: string
  type: string
}

const ModalDelete: React.FC<ModalDeleteType> = ({ id, title, endpoint, type }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [msgError, setMsgError] = useState<string>("")
  const { toast } = useToast()
  const { axiosJWT } = useSessionUser()

  const submitDelete = async () => {
    try {
      const response = await axiosJWT.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`,
        {
          data: { id },
          headers: {
            withCredentials: true,
            headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
          }
        }
      );
      if (response?.data?.statusCode === "000") {
        toast({
          title: `Berhasil menghapus notes`,
          className: "bg-white"
        })
        setTimeout(() => {
          window.location.reload(); // You can use other methods to refresh the page if needed
        }, 2000);
      }
      
      setIsModalOpen(!isModalOpen)
    } catch (error: any) {
      console.error(error.response.data.message);
      toast({
        title: "Gagal menghapus notes",
        description: error.response.data.message,
        className: "bg-red-200"
      })
    }
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(val) => {
        setIsModalOpen(val)
      }}
    >
      <DialogTrigger asChild>
        <Button variant={'destructive'} className="flex items-center px-4 py-2  font-medium rounded-md hover:opacity-95">
          <Icon icon="fluent:delete-12-regular" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white w-[90%]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Hapus {type}</DialogTitle>
          <DialogDescription className="text-lg">Apakah anda yakin untuk menghapus {type.toLowerCase()} <strong>{title}</strong>?</DialogDescription>
        </DialogHeader>        
        <p className={cn("text-red-500", msgError.length > 0 ? "block" : "hidden")}>{msgError}</p>
        <DialogFooter>
          <Button
            onClick={submitDelete}
            variant={'destructive'}
            type="submit"
            className="flex items-center justify-center px-4 py-2 font-medium rounded-xl hover:opacity-95"
          >
            Hapus
          </Button>
          <Button
            onClick={() => setIsModalOpen(!isModalOpen)}
            variant={'outline'}
            className="flex items-center justify-center px-4 py-2 font-medium rounded-xl hover:opacity-95"
          >
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModalDelete
