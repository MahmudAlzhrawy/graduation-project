"use client"
import { ManageRestoProvider } from "@/app/Context/ManageRestoContext"
import { RestaurantProvider } from "@/app/Context/RestaurantContext"
import Restaurants from "@/components/Restaurants/Restaurants"

export default function Resataurants(){
    
    return(
        <div className="main mb-20">
            <div >
            <ManageRestoProvider>
            <RestaurantProvider>
            <Restaurants/>
            </RestaurantProvider>
            </ManageRestoProvider>
                
            </div>

            
        </div>
    )
}