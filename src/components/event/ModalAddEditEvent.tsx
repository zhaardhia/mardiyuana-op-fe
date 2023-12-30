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
import { EventData, Option } from "@/types"
import { useSessionUser } from "@/contexts/SessionUserContext"
import { useToast } from "@/components/ui/use-toast"
import { Datepicker } from "flowbite-react"
import ImageUploader from "../ImageUploader"

interface ModalEventType {
  isEdit: boolean
  defaultData?: EventData | undefined
  setEvents: Dispatch<SetStateAction<EventData[]>>
}

const optionVoting = [
  { label: "Ya", value: "VOTE" },
  { label: "Tidak", value: "NO_VOTE" }
]

const ModalAddEditEvent = ({ isEdit, defaultData, setEvents }: ModalEventType) => {
  const { state, axiosJWT } = useSessionUser()
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [name, setName] = useState<string | undefined>(defaultData?.name)
  const [description, setDescription] = useState<string | undefined>(defaultData?.description)
  const [needVote, setNeedVote] = useState<Option | undefined>(
    defaultData?.eventVoteType ? optionVoting?.find((voting) => voting.value === defaultData?.eventVoteType) : undefined
  )
  const [eventDate, setEventDate] = useState<Date | undefined>(defaultData?.eventDate)
  const [image, setImage] = useState<any>(defaultData?.imageUrl)
  const [msgError, setMsgError] = useState<string | undefined>()
  
  useEffect(() => {
    setName(defaultData?.name || "")
    setDescription(defaultData?.description || "")
    setNeedVote(defaultData?.eventVoteType ? optionVoting?.find((voting) => voting.value === defaultData?.eventVoteType) : undefined)
    setEventDate(defaultData?.eventDate || undefined)
    setImage(defaultData?.imageUrl || undefined)
  }, [isModalOpen])

  const onSubmit = async () => {

    if (!name || !description || !needVote || !eventDate || !image) {
      setMsgError("Informasi event harus diisi dengan lengkap")
      setTimeout(() => {
        setMsgError(undefined)
      }, 5000)
    }
    // return
    console.log({ image })

    let imageUrl: any = null
    if (image !== defaultData?.imageUrl) {
      const formData = new FormData()
      if (image) formData.append('image', image)

      const saveImage = await axiosJWT( 
        {
          method: "post",
          url: `${process.env.NEXT_PUBLIC_MARDIYUANA_UTIL}/image`,
          withCredentials: true,
          headers: {
            // Authorization: `Bearer ${state?.token}`,
            "Content-Type": "multipart/form-data"
          },
          data: formData,
        }    
      )
      console.log({saveImage: saveImage.data.data.url})
      imageUrl = saveImage.data.data.url
    } else imageUrl = defaultData?.imageUrl
    
    
    const response = await axiosJWT.post(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/event`, 
    {
      ...(isEdit && { id: defaultData?.id }),
      name,
      description,
      needVote: needVote?.value,
      eventDate,
      imageUrl: imageUrl
    },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${state?.token}`
      }
    })

    if (response?.data?.statusCode === "000") {
      toast({
        title: "Berhasil menambahkan data event!",
        description: "Silahkan cek data event pada kolom yang tersedia.",
        className: "bg-white"
      })

      if (isEdit) {
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event.id === defaultData?.id ? { 
              ...event, 
              name: name,
              description,
              ...(needVote && { eventVoteType: needVote.value }),
              ...(eventDate && { eventDate }),
              imageUrl,
              updatedDate: new Date()
            } : event
          )
        );
      } else {
        const newObj: EventData | undefined = response?.data?.data
        if (newObj) {
          setEvents(prevEvents => [...prevEvents, { ...newObj}]);
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

  const handleInputChange = (event: { target: { value: React.SetStateAction<string | undefined> } }) => {
    setDescription(event.target.value);
  };
  const handleSelectType = (option: Option | null, actionMeta: ActionMeta<Option>) => {
    option && setNeedVote(option)
  }

  console.log({description})
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
            <Plus className="mr-2 h-4 w-4" /> {isEdit ? "Edit" : "Tambah"} Event
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-[30rem] bg-white max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Tambah"} Event</DialogTitle>
          <DialogDescription>
            Silahkan {isEdit ? "Edit" : "Tambah"} event dengan teliti.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="name" className="text-left">
              Nama Event
            </Label>
            <Input
              id="name"
              defaultValue={defaultData?.name}
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="name" className="text-left">
              Deskripsi
            </Label>
            <Textarea
              id="name"
              defaultValue={defaultData?.description}
              className="col-span-3"
              onChange={handleInputChange}
              value={description}
              // dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="content" className="text-left">
              Dibutuhkan Voting
            </Label>
            <Select
              className="basic-single w-[100%] rounded-xl"
              classNamePrefix="select"
              defaultValue={needVote}
              // isLoading={isLoading}
              value={needVote}
              isClearable={false}
              isSearchable={false}
              name="class"
              options={optionVoting}
              placeholder="Pilih Tipe Modul"
              onChange={handleSelectType}
              // isDisabled={isEdit}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="" className="text-left">
              Waktu Event
            </Label>
            <div className="col-span-3">
              <Datepicker
                onSelectedDateChanged={(date) => setEventDate(date)}
                // dateFormat="yyyy-MM-dd"
                // {...register("student.bornAt", { 
                //   required: validator.required,
                //   // minLength: validator.minLength(3),
                //   // maxLength: validator.maxLength(20) 
                // })}
                defaultDate={defaultData?.eventDate && new Date(defaultData?.eventDate)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="name" className="text-left">
              Foto
            </Label>
            {image && (
              <img src={`${image}`} className="w-[10rem] rounded-lg" />
            )}
            <ImageUploader imageURL={image} setImage={setImage}/>
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
