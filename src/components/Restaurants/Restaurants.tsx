"use client";
import React, { Suspense, useContext, useEffect, useState } from "react";
import MainHeaderForEachComponent, {
  ImainRestaurantHeader,
} from "../mainHeaderForEachComponent";
import FeaturedRestaurantsPartners from "./FeaturedRestaurants";
import Filter from "../filter";
import { Restocontext } from "@/app/Context/RestaurantContext";
function Restaurants() {
  const { restaurants, pagination } = useContext(Restocontext);
  const restLength = restaurants.length;
  const [count, setCounter] = useState<number>(1);
  useEffect(() => {
    if (restaurants.length > 0) {
      pagination(1);
    }
  }, [restaurants]);
  const mainHeaderForRestaurantComponent: ImainRestaurantHeader = {
    image:
      "url('/assets/Restaurants/mainComponentBackgroundInRestaurantComponent.jpg')",
    text: "Restaurant Partners",
  };
  return (
    <div className="mb-8">
      <MainHeaderForEachComponent
        mainHeader={mainHeaderForRestaurantComponent}
      />

      <div className="flex mt-2">
        <div className="w-1/4 text-center border rounded-lg shadow h-max">
          <Filter />
        </div>
        <Suspense>
          <div className="flex flex-col flex-grow">
            <FeaturedRestaurantsPartners />
            <div className="flex gap-1 w-1/2 rounded-lg p-1 bg-slate-200 mx-auto mt-10 ">
              <button
                onClick={() => {
                  if (count > 1) pagination(count - 1);
                }}
                disabled={count === 1} // تعطيل الزر إذا كانت الصفحة الأولى
                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 disabled:opacity-50"
              >
                Previous
              </button>

              <div className="mx-auto ">
                {Array.from({ length: Math.ceil(restLength / 5) }).map(
                  (_, i) => (
                    <button
                      value={i + 1}
                      key={i}
                      className="bg-gray-500 mr-1 text-white px-4 py-2 rounded-md duration-500 hover:bg-gray-600"
                      onClick={() => {
                        console.log(`Clicked on page ${i + 1}`);
                        pagination(i + 1);
                        setCounter(i);
                      }}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() => {
                  if (count < Math.ceil(restaurants.length / 5))
                    pagination(count + 1);
                }}
                disabled={count === Math.ceil(restaurants.length / 5)} // تعطيل الزر إذا كانت الصفحة الأخيرة
                className="bg-gray-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  );
}

export default Restaurants;
