import Layout from "@/components/Layout";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import moment from "moment";
import { useSessionUser } from "@/contexts/SessionUserContext"
import { AnnouncementData } from "@/types"

const AnnouncementDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const { axiosJWT } = useSessionUser()
  const [announcement, setAnnouncement] = useState<AnnouncementData>()

  React.useEffect(() => {
    if (id) fetchData()
  }, [id])

  const fetchData = async () => {
    const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_MARDIYUANA_UTIL}/announcement/detail?id=${id}`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
      },
    })
    console.log({response})
    if (response?.status === 200) setAnnouncement(response?.data?.data)
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8 w-[90%] mx-auto max-w-[1400px]">
        <h1 className="text-2xl font-semibold">Announcement</h1>
        <p>{moment().format('llll')}</p>
      </div>

      <hr className="h-[2px] border-dotted w-[90%] mx-auto border-slate-300" />

      <div className="my-5 flex items-center w-[90%] mx-auto max-w-[1400px]">
        <Icon icon="formkit:arrowleft" className="cursor-pointer h-full" onClick={() => router.back()} />
        <h2 className="font-semibold text-2xl w-full text-center mt-5">{announcement?.title}</h2>
      </div>

      <div className="my-8 flex flex-col items-center w-[90%] mx-auto max-w-[1400px]">
        <p className="text-lg text-justify indent-20">
          {announcement?.body}
        </p>
      </div>
      <div className="w-[90%] mx-auto italic">
        <p>Ditulis tanggal: {moment(announcement?.createdDate).format("LLL")}</p>
      </div>
    </Layout>
  );
};

export default AnnouncementDetail;
