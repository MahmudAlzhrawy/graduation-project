"use client"
import { useEffect,useState } from "react"
import { Swiper,SwiperSlide } from "swiper/react"
import {Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
interface gallarytyps {
    id:number,
    name:string,
    path:string
}
export default function Gallery(){
    const [galleryData, setGalleryData] = useState<gallarytyps[]>([]) ;
    useEffect(()=>{
        const fetchData=async()=>{
            const response = await fetch('/Jsons/gallary-data.json');
            const data =await response.json();
            console.log(data);
            setGalleryData(data);
        }
        fetchData();
    },[])
    return(
        <div className="gallary w-full">
            <Swiper className="w-full"
            slidesPerView={6}
            spaceBetween={5}
            
            navigation={false}
        
            pagination={{
                clickable: true,
            }}
            autoplay={{
                delay: 5000,
                disableOnInteraction: false,
            }}
            modules={[Autoplay,Navigation, Pagination]}
            >
                {
                    galleryData.map((data,index)=>{
                        return(
                                <SwiperSlide key={index} className="flex w-auto" >
                                    <div >
                                        <img className="w-full object-cover"  src={data.path} alt={data.name} />
                                    
                                    </div>
                                </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </div>
    )
}