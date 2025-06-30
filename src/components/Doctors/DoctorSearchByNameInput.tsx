"use client";
import "../../styles/DoctorsSpecialtyDropDownSelect.css";
import React, { useContext, useEffect, useState } from "react";
import { patua } from "@/constants/doctor";
import { FaUserDoctor } from "react-icons/fa6";
import { DoctorsContext } from "@/app/doctors/layout";
function DoctorSearchByNameInput() {
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
        "w-1/5 h-full py-4 flex flex-col gap-y-1 bg-white hover:cursor-pointer relative"
      }
      onClick={() => {
        setSelectToggle(!selectToggle);
      }}
      onMouseLeave={() => setSelectToggle(false)}
    >
      <div className="relative ml-4">
        <label className={patua + " text-lg text-gray-500"}>
          Or search by name
        </label>
      </div>
      <div className="flex flex-row gap-x-4">
        <FaUserDoctor className="h-full flex justify-center items-center text-2xl text-blue-600" />
        <input
          placeholder="Doctor name or ..."
          className={
            patua.className +
            " text-xl text-blue-600 placeholder:text-xl border-none outline-none placeholder:text-blue-600"
          }
          value={SearchDoctors.search_name}
          onChange={(event) =>
            setSearchDoctors({
              ...SearchDoctors,
              search_name: event.target.value,
            })
          }
        />
      </div>
    </div>
  );
}

export default DoctorSearchByNameInput;
