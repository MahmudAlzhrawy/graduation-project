"use client";
import React, { useContext} from "react";
import { Restocontext } from "@/app/Context/RestaurantContext";
import { ManageRestoContext } from "@/app/Context/ManageRestoContext";
export default function Filter() {
  const context = useContext(Restocontext);
  if (!context) {
    throw new Error("Filter must be used within a RestaurantProvider");
  }
  // const governorates = [
  //   "Cairo",
  //   "Alexandria",
  //   "Port Said",
  //   "Suez",
  //   "Damietta",
  //   "Dakahlia",
  //   "Sharqia",
  //   "Qalyubia",
  //   "Kafr El Sheikh",
  //   "Gharbia",
  //   "Monufia",
  //   "Beheira",
  //   "Ismailia",
  //   "Giza",
  //   "Beni Suef",
  //   "Faiyum",
  //   "Minya",
  //   "Asyut",
  //   "Sohag",
  //   "Qena",
  //   "Luxor",
  //   "Aswan",
  //   "Red Sea",
  //   "New Valley",
  //   "Matrouh",
  //   "North Sinai",
  //   "South Sinai",
  // ];
  const {
    searchName,
    selectedGovernorate,
    selectedCategory,
    setSearchName,
    setSelectedGovernorate,
    setSelectedCategory,
    applyFilter,
    clearFilter,
  } = context;
  const{Cities}=useContext(ManageRestoContext)

  return (
    <div className="x-4 border p-2 rounded-lg shadow-md pb-4">
      <h2 className="text-xl text-white font-bold mb-3  rounded-lg p-3 bg-blue-700 bg-opacity-75">
        Filter
      </h2>
      <fieldset className=" filset  ">
        <legend className=" legend ">Search By Name</legend>
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            console.log(searchName);
          }}
          className="border p-2 rounded w-full mb-2"
        />
      </fieldset>
      <fieldset className=" filset ">
        <legend className="legend ">Search By Governorate</legend>
        <select
          value={selectedGovernorate}
          onChange={(e) => {
            setSelectedGovernorate(e.target.value);
          }}
          className="border p-2 rounded w-full mb-2"
        >
          <option value="">Select Governorate</option>
          {Cities.map((gov, index) => (
            <option key={index} value={gov.cityName}>
              {gov.cityName}
            </option>
          ))}
        </select>
      </fieldset>
      <fieldset className="filset ">
        <legend className=" legend">Search By Categorey</legend>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        >
          <option value="">Select Category</option>
          <option value="Italian">Italian</option>
          <option value="Seafood">Seafood</option>
          <option value="Fast Food">Fast Food</option>
          <option value="Desserts">Desserts</option>
        </select>
      </fieldset>
      <div className="flex  justify-center flex-wrap  gap-2 mt-3">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={applyFilter}
        >
          Apply
        </button>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded"
          onClick={clearFilter}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
