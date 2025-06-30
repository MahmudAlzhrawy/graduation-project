"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaLocationDot} from "react-icons/fa6";
import { FaPhone } from "react-icons/fa";

import { GiMeal } from "react-icons/gi";
import ReviewForm from "./Blog/AddOpinion";
import Blog from "./Blog/Blog";

interface Props{

        restoId:number
    
}
interface Restaurant{
    restaurantId:number,
    restaurantName:string,
    restaurantImage:string,
    restaurantDescription:string,
    city:string,
    cuisineType:string,
    status:string,
    phoneNumber:string,
    deliveryFee:string,
    location:string,
    
}

export default function SingleResto({restoId}:Props){
const[restaurant,setRestaurant]=useState<Restaurant>();
const[addReview,setAc]=useState<boolean>(false)
useEffect(() => {
    console.log("Fetching restaurant with ID:", restoId);

    const fetchdata = async () => {
        try {
            const res = await fetch(`https://citypulse.runasp.net/api/Restaurant`);
            if (res.status === 200) {
                const data = await res.json();
                const selectedResto = data.$values.filter((resto: Restaurant) => resto.restaurantId == restoId);
                console.log("Selected Restaurant:", selectedResto[0]); // ✅ تحقق من الفلترة
                setRestaurant(selectedResto[0]);
            } else {
                console.error("Error fetching data");
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    fetchdata();
}, [restoId]);

return(<>

    <div className="mian border-4 shadow-md max-w-[70%]  mx-auto ">
        <div className="Addblog">
            
            {addReview && <ReviewForm setAc={setAc} restoId={restoId}/>}
            
        </div>
        <div className="cardcontent p-4">
        <div className="pt-1 pb-4 hover:brightness-75 duration-500 overflow-hidden">
            <img
            className=" h-[300px] hover:scale-110 duration-700 ease-in-out w-full  "
                src={`http://citypulse.runasp.net/images/Restaurants/${restaurant?.restaurantImage}`}
                alt={restaurant?.restaurantName}
            />
            <p className="text-violet-950 flex text-xl  mt-2"><span><FaLocationDot/></span>{restaurant?.city}</p>
            <p className=" text-violet-600 flex  gap-1 "><span><FaLocationDot/></span>{restaurant?.location}</p>
            <h1 className="text-gray-900 text-center font-semibold">{restaurant?.restaurantName}</h1>
            <p className="w-[90%] mx-auto text-gray-900 text-opacity-65 font-bold">{restaurant?.restaurantDescription}</p>
            <p className=" text-blue-700 flex  gap-1 "><span><GiMeal/></span>{restaurant?.cuisineType}</p>
            <p className="text-gray-700 mt-2 flex items-center gap-1 "><span className="text-blue-950"><FaPhone/></span> {restaurant?.phoneNumber}</p>
            <p className={`${restaurant?.status =="Open"?"text-green-700":"text-red-600"} mt-1`}> {restaurant?.status}</p>
            <p className="text-gray-700 mt-1">Delivery: {restaurant?.deliveryFee} $</p>

            <div className="w-[90%]  mt-4 text-center mx-auto">
            <Link href={`/services/restaurants/${restaurant?.restaurantId}/menu`}>
            <button className="btn min-[921px]:mt-2">Make an Order</button>
            </Link>
            </div>
            
        </div>
        </div>
    </div>
        <div className="border mt-5 w-full ">
        <button className="btn mt-4" onClick={()=>{setAc(el=>!el)}}>Add Review</button>
            <h2 className="text-5xl text-gray-300 font-serif font-bold tracking-tighter text-center my-10">Reviews</h2>
                <Blog restoId={restoId}/>
        </div>
        </>
)
}