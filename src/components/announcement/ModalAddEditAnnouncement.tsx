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
import { Textarea } from "@/components/ui/textarea"
import Select, { ActionMeta } from "react-select"
import { Label } from "@/components/ui/label"
import { AnnouncementData, Option } from "@/types"
import { useSessionUser } from "@/contexts/SessionUserContext"
import { useToast } from "@/components/ui/use-toast"

interface ModalAnnouncementType {
  isEdit: boolean
  defaultData?: AnnouncementData | undefined
  setAnnouncements: Dispatch<SetStateAction<AnnouncementData[]>>
}

const ModalAddEditEvent = ({ isEdit, defaultData, setAnnouncements }: ModalAnnouncementType) => {
  const { state, axiosJWT } = useSessionUser()
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string | undefined>(defaultData?.title)
  const [body, setBody] = useState<string | undefined>(defaultData?.body)
  
  const [msgError, setMsgError] = useState<string | undefined>()
  
  useEffect(() => {
    setTitle(defaultData?.title || "")
    setBody(defaultData?.body || "")
  }, [isModalOpen])

  const onSubmit = async () => {

    if (!title || !body) {
      setMsgError("Informasi event harus diisi dengan lengkap")
      setTimeout(() => {
        setMsgError(undefined)
      }, 5000)
    }
    console.log({body})
    // return
    
    const response = await axiosJWT.post(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/announcement`, 
    {
      ...(isEdit && { id: defaultData?.id }),
      title,
      body,
    },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${state?.token}`,
        'Content-Type': 'application/json',
      }
    })

    if (response?.data?.statusCode === "000") {
      toast({
        title: "Berhasil menambahkan data pengumuman!",
        description: "Silahkan cek data pengumuman pada kolom yang tersedia.",
        className: "bg-white"
      })

      if (isEdit) {
        setAnnouncements(prevAnnouncements =>
          prevAnnouncements.map(event =>
            event.id === defaultData?.id ? { 
              ...event, 
              title: title,
              body,
              updatedDate: new Date()
            } : event
          )
        );
      } else {
        const newObj: AnnouncementData | undefined = response?.data?.data
        if (newObj) {
          setAnnouncements(prevAnnouncements => [...prevAnnouncements, { ...newObj}]);
        }
      }

    } else {
      toast({
        title: "Gagal menambahkan data pengumuman.",
        description: "Silahkan cek kembali data yang anda input, atau bisa melaporkan ke tim IT",
        className: "bg-red-200"
      })
    }
    setTitle('')
    setIsModalOpen(!isModalOpen)
  }

  const handleInputChange = (event: { target: { value: React.SetStateAction<string | undefined> } }) => {
    setBody(event.target.value);
  };

  // console.log({description})
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
            <Plus className="mr-2 h-4 w-4" /> {isEdit ? "Edit" : "Tambah"} Pengumuman
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-[30rem] bg-white max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Tambah"} Pengumuman</DialogTitle>
          <DialogDescription>
            Silahkan {isEdit ? "Edit" : "Tambah"} pengumuman dengan teliti.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="title" className="text-left">
              Nama Pengumuman
            </Label>
            <Input
              id="title"
              defaultValue={defaultData?.title}
              className="col-span-3"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="body" className="text-left">
              Deskripsi Pengumuman
            </Label>
            <Textarea
              id="body"
              defaultValue={defaultData?.body}
              className="col-span-3"
              onChange={handleInputChange}
              value={body}
              // dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>
        <p className="my-5 text-center text-red-500">{msgError}</p>
        <DialogFooter>
          <Button type="submit"
            onClick={onSubmit}
          >Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModalAddEditEvent
