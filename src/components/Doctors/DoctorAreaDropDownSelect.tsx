"use client";
import "../../styles/DoctorsSpecialtyDropDownSelect.css";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import React, { useContext, useEffect, useState } from "react";
import { patua } from "@/constants/doctor";
import { TfiLocationPin } from "react-icons/tfi";
import { DoctorsContext } from "@/app/doctors/layout";
function DoctorAreaDropDownSelect() {
  const citiesWithAreas = [
    {
      city: "Cairo",
      popularAreas: ["Zamalek", "Maadi", "Heliopolis", "Dokki", "Nasr City"],
    },
    {
      city: "Giza",
      popularAreas: ["Giza Plateau", "Dokki", "Omrania", "Khalafawy"],
    },
    {
      city: "Alexandria",
      popularAreas: ["Bahary", "Smouha", "Alamreen", "Stanley"],
    },
    {
      city: "North Coast",
      popularAreas: ["Sidi Abdel Rahman", "Marassi", "El Alamein"],
    },
    {
      city: "Qalyubia",
      popularAreas: ["Shubra El Kheima", "Qalyub", "Banha"],
    },
    {
      city: "Gharbia",
      popularAreas: ["Tanta", "Mahalla", "Kafr El Zayat"],
    },
    {
      city: "Menoufia",
      popularAreas: ["Shebin El Kom", "Sadat", "Mansoura"],
    },
    {
      city: "Fayoum",
      popularAreas: ["Fayoum City", "Tahoun", "Ibshway"],
    },
    {
      city: "El-Dakahlia",
      popularAreas: ["Mansoura", "El Mansoura", "Dikirnis"],
    },
    {
      city: "El-Sharqia",
      popularAreas: ["Zagazig", "Belbeis", "El-Sheruq"],
    },
    {
      city: "El-Beheira",
      popularAreas: ["Damanhour", "Kafr El Dawwar"],
    },
    {
      city: "Damietta",
      popularAreas: ["Damietta City", "Ras El Bar"],
    },
    {
      city: "Matrouh",
      popularAreas: ["Marsa Matrouh", "Sidi Barani"],
    },
    {
      city: "Assiut",
      popularAreas: ["Assiut City", "Saft El Laban"],
    },
    {
      city: "El-Ismailia",
      popularAreas: ["Ismailia City", "El Qantara"],
    },
    {
      city: "Hurghada",
      popularAreas: ["Sakkala", "El Memsha", "Old Sheraton"],
    },
    {
      city: "Sharm El Sheikh",
      popularAreas: ["Naama Bay", "Sharm Old Town", "Hadaba"],
    },
    {
      city: "Portsaid",
      popularAreas: ["Port Said City", "Al Matar"],
    },
    {
      city: "Suez",
      popularAreas: ["Suez City", "Port Tawfik"],
    },
    {
      city: "Sohag",
      popularAreas: ["Sohag City", "Tima"],
    },
    {
      city: "El-Minia",
      popularAreas: ["Minya City", "Mallawi"],
    },
    {
      city: "Kafr El Sheikh",
      popularAreas: ["Kafr El Sheikh City", "Desouk"],
    },
    {
      city: "Luxor",
      popularAreas: ["Karnak", "The Valley of the Kings"],
    },
    {
      city: "Qena",
      popularAreas: ["Qena City", "Nag Hamadi"],
    },
    {
      city: "Aswan",
      popularAreas: ["Aswan City", "Nubian Village"],
    },
    {
      city: "Beni Suef",
      popularAreas: ["Beni Suef City", "Al Wasta"],
    },
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
          ? "w-1/4 h-full py-4 flex flex-col gap-y-1 bg-blue-100 hover:cursor-pointer relative"
          : "w-1/4 h-full py-4 flex flex-col gap-y-1 bg-white hover:cursor-pointer relative"
      }
      onClick={() => {
        setSelectToggle(!selectToggle);
      }}
      onMouseLeave={() => setSelectToggle(false)}
    >
      <div className="relative ml-4">
        <label className={patua + " text-lg text-gray-500"}>In this area</label>
        {selectToggle ? (
          <IoMdArrowDropup className="absolute top-2/3 right-3 text-4xl text-gray-500 bg-transparent" />
        ) : (
          <IoMdArrowDropdown className="absolute top-2/3 right-3 text-4xl text-gray-500 bg-transparent" />
        )}
      </div>
      <div className="flex flex-row gap-x-4 ml-4">
        <TfiLocationPin className="h-full flex justify-center items-center text-3xl text-blue-600" />
        <h4 className={patua.className + " text-2xl text-blue-600"}>
          {SearchDoctors.area
            ? SearchDoctors.area.length <= 20
              ? SearchDoctors.area
              : SearchDoctors.area.slice(0, 21) + "..."
            : "Choose area"}
        </h4>
      </div>
      <ul
        className={
          selectToggle ? "options-container active" : "options-container"
        }
      >
        {SearchDoctors.city
          ? citiesWithAreas.map((item) =>
              SearchDoctors.city === item.city
                ? item.popularAreas.map((area) => (
                    <li
                      key={area.indexOf(area) + 1}
                      onMouseDown={() => {
                        setSearchDoctors({ ...SearchDoctors, area: area });
                        setSelectToggle(false);
                      }}
                      className={patua.className + " option"}
                    >
                      {area}
                    </li>
                  ))
                : null
            )
          : null}
      </ul>
    </div>
  );
}

export default DoctorAreaDropDownSelect;
