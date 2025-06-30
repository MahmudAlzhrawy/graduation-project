"use client";
import "../../styles/DoctorsSpecialtyDropDownSelect.css";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import React, { useContext, useEffect, useState } from "react";
import { patua } from "@/constants/doctor";
import { TbStethoscope } from "react-icons/tb";
import { DoctorsContext } from "@/app/doctors/layout";
function DoctorSpecialtyDropDownSelect() {
  const specialties: string[] = [
    "Choose specialty",
    "Most popular",
    "Dermatology (Skin)",
    "Dentistry (Teeth)",
    "Psychiatry (Mental, Emotional or Behavioral Disorders)",
    "Pediatrics and New Born (Child)",
    "Neurology (Brain & Nerves)",
    "Orthopedics (Bones)",
    "Gynaecology and Infertility",
    "Ear, Nose and Throat",
    "Cardiology and Vascular Disease (Heart)",
    "Other Specialties",
    "Allergy and Immunology",
    "Andrology and Male Infertility",
    "Audiology",
    "Cardiology and Thoracic Surgery",
    "Chest and Respiratory",
    "Diabetes and Endocrinology",
    "Diagnostic Radiology",
    "Dietitian and Nutrition",
    "Family Medicine",
    "Gastroenterology and Endoscopy",
    "General Practice",
    "General Surgery",
    "Geriatrics",
    "Hematology",
    "Hepatology",
    "Internal Medicine",
    "Interventional Radiology",
    "IVF and Infertility",
    "Laboratories",
    "Nephrology",
    "Neurosurgery",
    "Obesity and Laparoscopic Surgery",
    "Oncology",
    "Oncology Surgery",
    "Ophthalmology",
    "Osteopathy",
    "Pain Management",
    "Pediatric Surgery",
    "Phoniatrics",
    "Physiotherapy and Sport Injuries",
    "Plastic Surgery",
    "Rheumatology",
    "Spinal Surgery",
    "Urology",
    "Vascular Surgery",
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
          ? "w-1/5 h-full rounded-tl-2xl rounded-bl-2xl border-r-2 py-4 border-red-600 flex flex-col gap-y-1 bg-blue-100 hover:cursor-pointer relative"
          : "w-1/5 h-full rounded-tl-2xl rounded-bl-2xl border-r-2 py-4 border-red-600 flex flex-col gap-y-1 bg-white hover:cursor-pointer relative"
      }
      onClick={() => {
        setSelectToggle(!selectToggle);
      }}
      onMouseLeave={() => setSelectToggle(false)}
    >
      <div className="relative ml-4">
        <label className={patua + " text-lg text-gray-500"}>
          Select a specialty
        </label>
        {selectToggle ? (
          <IoMdArrowDropup className="absolute top-2/3 right-3 text-4xl text-gray-500 bg-transparent" />
        ) : (
          <IoMdArrowDropdown className="absolute top-2/3 right-3 text-4xl text-gray-500 bg-transparent" />
        )}
      </div>
      <div className="flex flex-row gap-x-4 ml-4">
        <TbStethoscope className="h-full flex justify-center items-center text-3xl text-blue-600" />
        <h4 className={patua.className + " text-2xl text-blue-600"}>
          {SearchDoctors.specialty
            ? SearchDoctors.specialty.length <= 20
              ? SearchDoctors.specialty
              : SearchDoctors.specialty.slice(0, 21) + "..."
            : "specialty"}
        </h4>
      </div>
      <ul
        className={
          selectToggle ? "options-container active" : "options-container"
        }
      >
        {specialties.map((item) => (
          <li
            key={specialties.indexOf(item) + 1}
            onMouseDown={() => {
              setSearchDoctors({ ...SearchDoctors, specialty: item });
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

export default DoctorSpecialtyDropDownSelect;
