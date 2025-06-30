"use client";
import dynamic from "next/dynamic";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useEffect, useState } from "react";
interface servi {
  id: number;
  imgUrl: string;
  Name: string;
  Content: string;
}
const Gallery = dynamic(() => import("@/components/Gallary"), { ssr: false });
export default function Home() {
  const [activeSlide, setActiveSlide] = useState<number>();
  const [service, setServices] = useState<servi[]>([]);
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/Jsons/servces-data.json");
      const data = await res.json();
      setServices(data);
    }
    fetchData();
  }, []);
  return (
    <div className="main">
      <div className="w-full relative  ">
        <Swiper
          onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
          slidesPerView={1}
          spaceBetween={30}
          effect={"fade"}
          navigation={true}
          centeredSlides={true}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="home_bg ">
              <img
                className="w-full h-[613px]"
                src="/assets/Images/homepage .png"
              />
              <div
                className={` ${
                  activeSlide === 0
                    ? "delay-200 translate-x-0 duration-1000 ease-in-out"
                    : "-translate-x-full  opacity-0"
                } absolute  top-0  w-[45%] flex bg-black p-10 bg-opacity-15 h-full items-center`}
              >
                <span className="bg-blue-500 h-48 -translate-y-8 w-5 mr-3  rounded-2xl"></span>
                <div className="items-center">
                  <h1 className="text-4xl font-bold text-gray-800 tracking-widest">
                    Making Access to Public Services Easier
                  </h1>
                  <p>
                    <span className="flex text-2xl font-serif text-gray-50 font-bold">
                      Through our platform, we offer advanced and accessible
                      public services that enhance your daily experience
                    </span>

                    <button className=" mt-10 font-medium w-[30%]  p-2.5 bg-blue-700 text-white text-xl hover:bg-white hover:text-blue-800  duration-300 ease-in-out">
                      Explore More
                    </button>
                    <button className="mt-10 ml-10 w-[30%] font-medium  p-2.5 bg-blue-50 text-blue-700 text-xl hover:bg-blue-700 hover:text-blue-50 duration-300 ease-in-out">
                      Get Start
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="home_bg ">
              <img
                className="w-full h-[613px]"
                src="/assets/Images/home2.jpg"
              />
              <div
                className={` ${
                  activeSlide === 1
                    ? "delay-200 translate-x-0 duration-1000 ease-in-out"
                    : "-translate-x-full  opacity-0  "
                } absolute  top-0  w-[45%] flex bg-black p-10 bg-opacity-15 h-full items-center`}
              >
                <span className="bg-blue-500 h-48 -translate-y-8 w-5 mr-3  rounded-2xl"></span>
                <div className="items-center">
                  <h1 className="text-4xl font-bold text-gray-800 tracking-widest">
                    Making Access to Public Services Easier
                  </h1>
                  <p>
                    <span className="flex text-2xl font-serif text-gray-50 font-bold">
                      Through our platform, we offer advanced and accessible
                      public services that enhance your daily experience
                    </span>

                    <button className=" mt-10 font-medium w-[30%]  p-2.5 bg-blue-700 text-white text-xl hover:bg-white hover:text-blue-800  duration-300 ease-in-out">
                      Explore More
                    </button>
                    <button className="mt-10 ml-10 w-[30%] font-medium  p-2.5 bg-blue-50 text-blue-700 text-xl hover:bg-blue-700 hover:text-blue-50 duration-300 ease-in-out">
                      Get Start
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="home_bg overflow-hidden ">
              <img
                className="w-full h-[613px]"
                src="/assets/Images/home3.jpg"
              />
              <div
                className={`${
                  activeSlide === 2
                    ? "delay-200 translate-x-0 duration-1000 ease-in-out"
                    : "-translate-x-full  opacity-0"
                } absolute  top-0  w-[45%] flex bg-black p-10 bg-opacity-15 h-full items-center`}
              >
                <span className="bg-blue-500 h-48 -translate-y-8 w-5 mr-3  rounded-2xl"></span>
                <div className="items-center">
                  <h1 className="text-4xl font-bold text-gray-800 tracking-widest">
                    Making Access to Public Services Easier
                  </h1>
                  <p>
                    <span className="flex text-2xl font-serif text-gray-50 font-bold">
                      Through our platform, we offer advanced and accessible
                      public services that enhance your daily experience
                    </span>

                    <button className=" mt-10 font-medium w-[30%]  p-2.5 bg-blue-700 text-white text-xl hover:bg-white hover:text-blue-800  duration-300 ease-in-out">
                      Explore More
                    </button>
                    <button className="mt-10 ml-10 w-[30%] font-medium  p-2.5 bg-blue-50 text-blue-700 text-xl hover:bg-blue-700 hover:text-blue-50 duration-300 ease-in-out">
                      Get Start
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="relative w-full h-auto mt-10">
        <Gallery />
      </div>
      <h1 className="text-center text-5xl tracking-tighter font-extrabold italic text-gray-200  my-10">
        Services
      </h1>
      <div
        id="servic"
        className="servces    gap-5  grid grid-cols-3 w-[85%] mx-auto p-10"
      >
        {service.map((serv: servi) => {
          return (
            <div
              key={serv.id}
              className={`rounded-md relative z-50  ${
                serv.id % 2 === 0
                  ? "bg-blue-50 shadow-xl hover:scale-90  "
                  : "bg-blue-100 hover:scale-100 scale-90"
              }     text-center shadow-md shadow-gray-400 hover:brightness-75 duration-700 ease-in-out border-l-[20px] border-l-cyan-600 border-t-[15px] border-t-blue-950 `}
            >
              <div className=" content w-full">
                <img
                  className="h-1/2 w-full"
                  src={`/assets/servicesImg/${serv.imgUrl}`}
                  alt="Not Found"
                />
                <div className="w-full pt-1 ">
                  <h1 className="text-2xl  font-serif text-blue-900 italic text-bold">
                    {serv.Name}
                  </h1>
                  <p className="text-sm leading-5   text-gray-700 px-2 text-left  ">
                    {serv.Content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
