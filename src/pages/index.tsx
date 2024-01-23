import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import Layout from "@/components/Layout";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRouter } from "next/router";
import moment from "moment";
import { useSessionUser } from "@/contexts/SessionUserContext"
import { DashboardData, EventType, AnnouncementDashboard } from "@/types"
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const { axiosJWT } = useSessionUser()
  const [dashboardData, setDashboardData] = useState<DashboardData>()
  const [eventNormal, setEventNormal] = useState<EventType[]>()
  const [eventVote, setEventVote] = useState<EventType[]>()
  const [announcements, setAnnouncements] = useState<AnnouncementDashboard[]>()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_MARDIYUANA_UTIL}/dashboard/teacher`, {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
      },
    })
    console.log({response})
    if (response?.status === 200) {
      setDashboardData(response?.data?.data)
      setEventNormal(response?.data?.data?.eventNormal)
      setEventVote(response?.data?.data?.eventVote)
      setAnnouncements(response?.data?.data?.announcement)
    }
  }
  console.log({dashboardData})
  return (
    <Layout>
      <div className="flex justify-between items-center mb-8 w-[90%] mx-auto max-w-[1400px]">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p>{moment().format('llll')}</p>
      </div>

      <hr className="h-[2px] border-dotted w-[90%] mx-auto border-slate-300" />

      <div className="my-5 w-[90%] mx-auto py-3 flex lg:flex-row flex-col gap-14 items-center max-w-[1400px]">
        <div className="flex flex-col gap-4 lg:w-[55%] w-full">
          <h2 className="text-xl">School Events</h2>
          <Carousel
            plugins={[
              Autoplay({
                delay: 10000,
              }),
            ]}
          >
            <CarouselContent className="rounded-xl">
              {eventNormal?.map((event: EventType) => (
                <CarouselItem>
                  <div
                    className="h-[250px] w-full rounded-xl relative cursor-pointer"
                    onClick={() => router.push(`/event/${event.id}`)}
                  >
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt="" className="h-full object-cover rounded-xl w-full filter brightness-50" />
                    ) : (
                      <img src="/vote_img.png" alt="" className="h-full object-cover rounded-xl w-full" />
                    )}
                    <div className="absolute left-5 z-50 bottom-5">
                      <p className="text-white font-semibold text-xl">{event.name}</p>
                      <div className="text-white font-light text-sm sm:w-[25rem] w-[70%] truncate overflow-ellipsis">{event.description}</div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div className="flex flex-col gap-4 lg:w-[45%] w-full h-[300px] overflow-y-scroll border-[1px] border-gray-300 border-opacity-60 p-5 rounded-xl">
          <h2 className="text-xl mb-3">Announcement</h2>
          {announcements?.map((announcement: AnnouncementDashboard) => (
            <Link href={`/announcement/${announcement.id}`} className="bg-slate-100 hover:bg-slate-200 px-5 py-4 rounded-[15px]">{announcement.title}</Link>
          ))}
          <Link href="/announcement" className="text-center text-blue-600 hover:underline cursor-pointer w-fit px-3">See more..</Link>
        </div>
      </div>

      <hr className="h-[2px] border-dotted w-[90%] mx-auto border-slate-300" />

      <div className="my-5 w-[90%] mx-auto py-3 flex lg:flex-row flex-col gap-14 items-center justify-center max-w-[1400px]">
        <div className="w-full">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl">Displaying Vote</h2>
            <Carousel
              plugins={[
                Autoplay({
                  delay: 10000,
                }),
              ]}
            >
              <CarouselContent>
                {eventVote?.map((event: EventType) => (
                  <CarouselItem>
                    <div
                      className="h-[250px] w-full rounded-xl relative cursor-pointer"
                      onClick={() => router.push(`/vote/${event.id}`)}
                    >
                      {event.imageUrl ? (
                        <img src={event.imageUrl} alt="" className="h-full object-cover rounded-xl w-full filter brightness-50" />
                      ) : (
                        <img src="/vote_img.png" alt="" className="h-full object-cover rounded-xl w-full" />
                      )}
                      <div className="absolute left-5 z-50 bottom-5">
                        <p className="text-white font-semibold text-xl">{event.name}</p>
                        <div className="text-white font-light text-sm sm:w-[35rem] w-[70%] truncate overflow-ellipsis">{event.description}</div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </Layout>
  );
}
