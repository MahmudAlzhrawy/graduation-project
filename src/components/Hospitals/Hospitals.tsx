"use client";
import { FaSpinner } from "react-icons/fa";
import MainHeaderForEachComponent, {
  ImainRestaurantHeader,
} from "../mainHeaderForEachComponent";
import { useEffect, useState } from "react";
import HospitalCard from "./HospitalCard";

interface Hospitals {
  hospitalId: number;
  hospitalName: string;
  location: string;
  description: string;
  phoneNumber: number;
  website: string;
  openingHours: string;
  hospitalImage: string;
  cityCode: string;
  hospitalType: string; // ✅ النوع (خاص / حكومي)
}

interface City {
  cityCode: string;
  cityName: string;
}

export default function Hospitals() {
  const mainHeaderForRestaurantComponent: ImainRestaurantHeader = {
    image: "url('/assets/hospitals/hospital.jpeg')",
    text: "Hospitals In Assiut Government",
  };

  const [hospitals, setHospitals] = useState<Hospitals[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospitals[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fetchAllHospitals = async () => {
        try {
          const res = await fetch("https://citypulse.runasp.net/api/Hospital/AllHospitals");
          const data = await res.json();
          setHospitals(data.$values);
          setFilteredHospitals(data.$values);
        } catch (e) {
          console.log("Error fetching hospitals:", e);
        }
      };

      const fetchCities = async () => {
        try {
          const res = await fetch("https://citypulse.runasp.net/api/School/ALlcities");
          const data = await res.json();
          setCities(data.$values);
        } catch (e) {
          console.log("Error fetching cities:", e);
        }
      };

      fetchAllHospitals();
      fetchCities();
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let filtered = hospitals;

    if (selectedCity !== "") {
      filtered = filtered.filter((h) => h.cityCode === selectedCity);
    }

    if (selectedType !== "") {
      filtered = filtered.filter((h) => h.hospitalType === selectedType);
    }

    setFilteredHospitals(filtered);
  }, [selectedCity, selectedType, hospitals]);

  return (
    <div className="m">
      <MainHeaderForEachComponent mainHeader={mainHeaderForRestaurantComponent} />

      <h1 className="text-black text-4xl font-serif font-bold my-4 text-center">
        The closest government hospitals to your location is in Assiut
      </h1>

      {/* فلاتر */}
      <div className="text-center mt-6 flex justify-center gap-8 flex-wrap">
        {/* فلتر المدينة */}
        <div>
          <label className="text-lg font-medium mr-2">Select City:</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="border px-4 py-2 rounded-md bg-white shadow-sm"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city.cityCode} value={city.cityCode}>
                {city.cityName}
              </option>
            ))}
          </select>
        </div>

        {/* فلتر النوع */}
        <div>
          <label className="text-lg font-medium mr-2">Select Type:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border px-4 py-2 rounded-md bg-white shadow-sm"
          >
            <option value="">All Types</option>
            <option value="Government">Government</option>
            <option value="Private">Private</option>
          </select>
        </div>
      </div>

      {filteredHospitals.length > 0 ? (
        <div className="container w-[95%] mx-auto">
          <div className="allHospitals grid grid-cols-2 my-20 gap-6">
            {filteredHospitals.map((hospital) => (
              <HospitalCard key={hospital.hospitalId} hospital={hospital} />
            ))}
          </div>
        </div>
      ) : (
        <div className="spin h-96">
          <div className="flex justify-center h-full items-center">
            <h2 className="text-5xl text-blue-700">Loading..</h2>
            <FaSpinner className="animate-spin text-blue-500 text-6xl ml-4" />
          </div>
        </div>
      )}
    </div>
  );
}
