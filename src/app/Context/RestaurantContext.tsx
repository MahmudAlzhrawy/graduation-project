"use client"
import { createContext,Dispatch,ReactNode, SetStateAction, useEffect, useState } from "react";
interface Restaurant{
    restaurantId:number,
    restaurantName:string,
    restaurantImage:string,
    restaurantDescription:string,
    city:string,
    cuisineType:string
    
}
interface RestaurantContextType {
    restaurants: Restaurant[];
    filteredRestaurants: Restaurant[];
    searchName: string;
    selectedGovernorate: string;
    selectedCategory: string;
    setSearchName:Dispatch<SetStateAction<string>>;
    setSelectedGovernorate:Dispatch<SetStateAction<string>>;
    setSelectedCategory:Dispatch<SetStateAction<string>>;
    applyFilter: () => void;
    clearFilter: () => void;
    pagination: (val?: number) => void;
}
export const Restocontext =createContext<RestaurantContextType>({
    restaurants: [],
    filteredRestaurants: [],
    searchName: '',
    selectedGovernorate: '',
    selectedCategory: '',
    setSearchName: () => {},
    setSelectedGovernorate: () => {},
    setSelectedCategory: () => {},
    applyFilter: () => {},
    clearFilter: () => {},
    pagination: (val?: number) => {},
});
interface RestaurantProviderProps {
    children: ReactNode;
}

export const RestaurantProvider: React.FC<RestaurantProviderProps> = ({ children }) => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
    const [searchName, setSearchName] = useState<string>('');
    const [selectedGovernorate, setSelectedGovernorate] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("⏳ Fetching restaurants...");
                const response = await fetch('https://citypulse.runasp.net/api/Restaurant');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log("✅ Fetched data:", data.$values);
                
                setRestaurants( await data.$values);
                setFilteredRestaurants(data.$values);
            } catch (error) {
                console.error("❌ Error fetching restaurants:", error);
            }
        };
        fetchData();
    }, []);
    const applyFilter = () => {
        const filtered = restaurants.filter((restaurant) => {
            const matchName = restaurant.restaurantName.toLowerCase().includes(searchName.toLowerCase());
            const matchGovernorate = selectedGovernorate ? restaurant.city === selectedGovernorate : true;
            const matchCategory = selectedCategory ? restaurant.cuisineType=== selectedCategory : true;
            return matchName && matchGovernorate && matchCategory;
        });
        console.log("✅ Filtered Restaurants:", filtered);
        setFilteredRestaurants(filtered);
    };
    const pagination =(val:number=1)=>{
        setFilteredRestaurants(restaurants.slice((val-1)*5,val*5));
    }
    
    const clearFilter = () => {
        setSearchName('');
        setSelectedGovernorate('');
        setSelectedCategory('');
        setFilteredRestaurants(restaurants);
    };
    
    return(
        <Restocontext.Provider value={{
            restaurants, 
            filteredRestaurants, 
            searchName, 
            selectedGovernorate, 
            selectedCategory, 
            setSearchName, 
            setSelectedGovernorate, 
            setSelectedCategory, 
            applyFilter, 
            clearFilter,
            pagination
        }}>
            {children}
        </Restocontext.Provider>
    )
}