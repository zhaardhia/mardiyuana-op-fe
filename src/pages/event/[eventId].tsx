import Layout from "@/components/Layout";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import moment from "moment";
import { useSessionUser } from "@/contexts/SessionUserContext"
import { EventType } from "@/types"
const EventDetail = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const { axiosJWT } = useSessionUser()
  const [event, setEvent] = useState<EventType>()

  React.useEffect(() => {
    if (eventId) fetchData()
  }, [eventId])

  const fetchData = async () => {
    const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_MARDIYUANA_UTIL}/event/detail-novote?id=${eventId}`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
      },
    })
    console.log({response})
    if (response?.status === 200) setEvent(response?.data?.data)
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8 w-[90%] mx-auto max-w-[1400px]">
        <h1 className="text-2xl font-semibold">Event</h1>
        <p>{moment().format('llll')}</p>
      </div>

      <hr className="h-[2px] border-dotted w-[90%] mx-auto border-slate-300" />

      <div className="my-5 flex items-center w-[90%] mx-auto max-w-[1400px]">
        <Icon icon="formkit:arrowleft" className="cursor-pointer h-full" onClick={() => router.back()} />
        <h2 className="font-semibold text-2xl w-full text-center mt-5">{event?.name}</h2>
      </div>

      <div className="h-[300px] mt-7">
        {event?.imageUrl ? (
          <img src={event?.imageUrl} alt="" className="h-full object-cover w-[90%] mx-auto rounded-xl" />
          ) : (
            <img src="/school_event.png" alt="" className="h-full object-cover w-[90%] mx-auto rounded-xl" />
          )
        }
      </div>

      <div className="my-8 flex flex-start w-[90%] mx-auto max-w-[1400px]">
        <p className="text-md text-left italic">
          Tanggal Mulai Event: {moment(event?.eventDate).format("LL")}
        </p>
      </div>

      <div className="my-8 flex items-center w-[90%] mx-auto max-w-[1400px]">
        <p className="text-lg text-justify indent-20">
          {event?.description}
        </p>
      </div>

      <div className="my-8 flex flex-start w-[90%] mx-auto max-w-[1400px]">
        <p className="text-md text-left italic">
          Ditulis tanggal: {moment(event?.createdDate).format("LL")}
        </p>
      </div>
    </Layout>
  );
};

export default EventDetail;
