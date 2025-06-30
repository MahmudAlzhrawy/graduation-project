"use client"
import { RestaurantProvider } from "@/app/Context/RestaurantContext"
import Restaurants from "@/components/Restaurants/Restaurants"

export default function Resataurants(){
    
    return(
        <div className="main mb-20">
            <div >
            <RestaurantProvider>
            <Restaurants/>
            </RestaurantProvider>
                
            </div>

            
        </div>
    )
}