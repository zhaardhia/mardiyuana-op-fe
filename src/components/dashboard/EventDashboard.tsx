import React from 'react'
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay'

type EventDashboardProps = {
  type: string
}

type TitleEventType = {
  schoolEvents: string
  billboard: string
  planningVote: string
}

const objTypeTitle: TitleEventType = {
  schoolEvents: "School Events",
  billboard: "Billboard",
  planningVote: "Planning Vote"
}

const EventDashboard = ({ type }: EventDashboardProps) => {
  return (
    <div className="my-10">
      <p className="text-xl mb-5">{objTypeTitle[type as keyof TitleEventType]}</p>
      <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination, Autoplay, A11y]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        // scrollbar={{ draggable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
      >
        <SwiperSlide className="mx-auto">
          <div className="w-full cursor-pointer rounded-xl">
            <div className="relative h-64 rounded-xl">
              <img
                src="/dashboard/event_example.png"
                alt=""
                className="w-full object-cover h-full rounded-xl"
              />
              <div className="absolute bottom-6 text-white flex items-center text-xl px-6 gap-2">
                <h3 className="text-xl font-light">Peningkatan Literasi</h3>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="mx-auto">
          <div className="w-full cursor-pointer rounded-xl">
            <div className="relative h-64 rounded-xl">
              <img
                src="/dashboard/event_example.png"
                alt=""
                className="w-full object-cover h-full rounded-xl"
              />
              <div className="absolute bottom-6 text-white flex items-center text-xl px-6 gap-2">
                <h3 className="text-xl font-light">Bolos Bersama</h3>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default EventDashboard
