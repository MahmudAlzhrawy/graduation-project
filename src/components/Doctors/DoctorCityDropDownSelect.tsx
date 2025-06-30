"use client";
import "../../styles/DoctorsSpecialtyDropDownSelect.css";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import React, { useContext, useEffect, useState } from "react";
import { patua } from "@/constants/doctor";
import { TfiLocationPin } from "react-icons/tfi";
import { DoctorsContext } from "@/app/doctors/layout";
function DoctorCityDropDownSelect() {
  const cities: string[] = [
    "All Cities",
    "Cairo",
    "Giza",
    "Alexandria",
    "North Coast",
    "Qalyubia",
    "Gharbia",
    "Menoufia",
    "Fayoum",
    "El-Dakahlia",
    "El-Sharqia",
    "El-Beheira",
    "Damietta",
    "Matrouh",
    "Assiut",
    "El-Ismailia",
    "Hurghada",
    "Sharm El Sheikh",
    "Portsaid",
    "Suez",
    "Sohag",
    "El-Minia",
    "Kafr El sheikh",
    "Luxor",
    "Qena",
    "Aswan",
    "Beni Suef",
  ];


const context = useContext(DoctorsContext);

if (!context) {
  throw new Error("DoctorsContext must be used within a Doctorslayout Provider");
}

const { SearchDoctors, setSearchDoctors } = context;

  const [selectToggle, setSelectToggle] = useState<boolean>(false);
  useEffect(() => {
    if (selectToggle) {
    }
  }, [selectToggle]);
  return (
    <div
      className={
        selectToggle
          ? "w-1/5 h-full py-4 flex flex-col gap-y-1 bg-blue-100 hover:cursor-pointer relative"
          : "w-1/5 h-full py-4 flex flex-col gap-y-1 bg-white hover:cursor-pointer relative"
      }
      onClick={() => {
        setSelectToggle(!selectToggle);
      }}
      onMouseLeave={() => setSelectToggle(false)}
    >
      <div className="relative ml-4">
        <label className={patua + " text-lg text-gray-500"}>In this city</label>
        {selectToggle ? (
          <IoMdArrowDropup className="absolute top-2/3 right-3 text-4xl text-gray-500 bg-transparent" />
        ) : (
          <IoMdArrowDropdown className="absolute top-2/3 right-3 text-4xl text-gray-500 bg-transparent" />
        )}
      </div>
      <div className="flex flex-row gap-x-4 ml-4">
        <TfiLocationPin className="h-full flex justify-center items-center text-3xl text-blue-600" />
        <h4 className={patua.className + " text-2xl text-blue-600"}>
          {SearchDoctors.city
            ? SearchDoctors.city.length <= 20
              ? SearchDoctors.city
              : SearchDoctors.city.slice(0, 21) + "..."
            : "city"}
        </h4>
      </div>
      <ul
        className={
          selectToggle ? "options-container active" : "options-container"
        }
      >
        {cities.map((item) => (
          <li
            key={cities.indexOf(item) + 1}
            onMouseDown={() => {
              setSearchDoctors({ ...SearchDoctors, city: item });
              setSelectToggle(false);
            }}
            className={patua.className + " option"}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DoctorCityDropDownSelect;
