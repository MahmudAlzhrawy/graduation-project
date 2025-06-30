"use client";
import React, { Suspense, useContext } from "react";
import { useState, useEffect } from "react";
import Card from"@/Ui/Card"
import Restaurant from "./Restaurant";
import { Restocontext } from "@/app/Context/RestaurantContext";
interface Restaurant{
  restaurantId:number,
  restaurantName:string,
  restaurantDescription:string,
  restaurantImage:string,
  city:string,
  cuisineType:string
  
}
function FeaturedRestaurantsPartners() {
  const { filteredRestaurants } = useContext(Restocontext);  
  return (
    <>
    
    <div className="mt-32 mx-auto">
        <h1 className="text-black text-4xl font-serif font-bold mb-4 text-center">
          Featured Restaurant Partners
        </h1>
          { (filteredRestaurants.length > 0) ?(

            <div className="grid grid-cols-2 max-[590px]:grid-cols-1 w-[95%] mx-auto gap-8 ">
              {filteredRestaurants?.map((restaurant:Restaurant) => (
                <Card key={restaurant.restaurantId} >
                  <Restaurant {...restaurant} />
                </Card>
              ))}
            </div>
          ):(
            <div className="text-center mx-auto flex-grow w-full ">
              <h2>No Restaurants Found</h2>
            </div>
          ) 
          }
    </div>

  </>
  );
}

export default FeaturedRestaurantsPartners;
