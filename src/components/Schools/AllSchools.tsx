"use client";
import React, { useState, useEffect } from "react";
import School from "./School";

interface SchoolModel {
  schoolId: number;
  schoolName: string;
  schoolType: string;
  location: string;
  phoneNumber: string;
  description: string;
  website: string;
  openingHours: string;
  schoolImage: string;
  cityCode: string;
}

interface City {
  cityCode: string;
  cityName: string;
}

const AllSchools = () => {
  const [schools, setSchools] = useState<SchoolModel[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<SchoolModel[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch("https://citypulse.runasp.net/api/School");
        const data = await res.json();
        setSchools(data.$values);
        setFilteredSchools(data.$values);
      } catch (error) {
        console.log("Error fetching schools:", error);
      }
    };

    const fetchCities = async () => {
      try {
        const res = await fetch("https://citypulse.runasp.net/api/School/ALlcities");
        const data = await res.json();
        setCities(data.$values);
      } catch (error) {
        console.log("Error fetching cities:", error);
      }
    };

    fetchSchools();
    fetchCities();
  }, []);

  useEffect(() => {
    let filtered = schools;

    if (selectedCity !== "") {
      filtered = filtered.filter((s) => s.cityCode === selectedCity);
    }

    if (selectedType !== "") {
      filtered = filtered.filter((s) => s.schoolType === selectedType);
    }

    setFilteredSchools(filtered);
  }, [selectedCity, selectedType, schools]);

  return (
    <div className="mt-24 px-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-700">
        Explore Schools by City and Type
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-8 justify-center items-center mb-12 bg-white shadow-md rounded-xl p-6">
        {/* City Filter */}
        <div className="flex flex-col">
          <label className="text-gray-800 font-medium mb-2 text-lg">Select City</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="border border-gray-300 px-5 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city.cityCode} value={city.cityCode}>
                {city.cityName}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex flex-col">
          <label className="text-gray-800 font-medium mb-2 text-lg">School Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 px-5 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
          >
            <option value="">All Types</option>
            <option value="Private">Private</option>
            <option value="Government">Government</option>
            <option value="International">International</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {filteredSchools.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No schools found for this selection.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school) => (
            <School key={school.schoolId} {...school} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllSchools;
