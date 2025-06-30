"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaLocationDot} from "react-icons/fa6";
import { GiMeal } from "react-icons/gi";

type Props = {
  restaurantId: number;
  restaurantName: string;
  restaurantDescription: string;
  restaurantImage: string;
 city: string;
 cuisineType: string;
};

function Restaurant(props: Props) {
  const [shortDescription, setShortDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    
    setLoading(true); // إظهار التحميل
    setTimeout(() => {
      setLoading(false); // إخفاء التحميل بعد 3 ثوانٍ (مثلاً)
    }, 3000);
  };


  useEffect(() => {
    const shorttext = () => {
      if (props.restaurantDescription.length > 100) {
        setShortDescription(props.restaurantDescription.slice(0, 100) + '...');
      } else {
        setShortDescription(props.restaurantDescription);
      }
    };
    shorttext();
  }, [props.restaurantDescription]);

  return (
    <div className="pt-1 pb-4 hover:brightness-75 duration-500 overflow-hidden">
        <img
        className=" h-[300px] hover:scale-110 duration-700 ease-in-out w-full  "
          src={`http://citypulse.runasp.net/images/Restaurants/${props.restaurantImage}`}
          alt={props.restaurantName}
        />
      <p className="text-violet-950 flex text-xl  mt-2"><span><FaLocationDot/></span>{props.city}</p>
      <p className=" text-blue-700 flex ml-2 gap-1 "><span><GiMeal/></span>{props.cuisineType}</p>
      <h1 className="text-gray-900 text-center font-semibold">{props.restaurantName}</h1>
      <p className="w-[90%] mx-auto text-gray-900 text-opacity-65 font-bold">{shortDescription}</p>

      <div className="w-[90%]  mt-4 text-center mx-auto">
      <Link href={`/services/restaurants/${props.restaurantId}`}>
      <button 
      onClick={handleClick} 
      className="btn max-[920px]:mb-2 "
      disabled={loading} // تعطيل الزر أثناء التحميل
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 mr-1" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      ) : (
        "More Details"
      )}
    </button>
      </Link>
        <Link href={`/services/restaurants/${props.restaurantId}/menu`}>
        <button className="btn min-[921px]:mt-2">Make an Order</button>
        </Link>
      </div>
    </div>
  );
};

export default Restaurant;
