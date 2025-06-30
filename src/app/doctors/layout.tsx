"use client";
import React, { createContext, useState } from "react";
import { patua, patrik_hand } from "@/constants/doctor";
import { IoIosCall } from "react-icons/io";
import DoctorSpecialtyDropDownSelect from "@/components/Doctors/DoctorSpecialtyDropDownSelect";
import DoctorCityDropDownSelect from "../../components/Doctors/DoctorCityDropDownSelect";
import DoctorAreaDropDownSelect from "../../components/Doctors/DoctorAreaDropDownSelect";
import DoctorSearchByNameInput from "../../components/Doctors/DoctorSearchByNameInput";
import DoctorSearchButton from "../../components/Doctors/DoctorSearchButton";
import { usePathname } from "next/navigation";
type DoctorsContextType = {
  SearchDoctors: search_DoctorsType;
  setSearchDoctors: React.Dispatch<React.SetStateAction<search_DoctorsType>>;
};

interface search_DoctorsType {
  specialty: string;
  city: string;
  area: string;
  search_name: string;
  Title: string[];
  Gender: string[];
  Examination_Fee: string;
  Sorting: string;
}

const initial_state: search_DoctorsType = {
  specialty: "",
  city: "",
  area: "",
  search_name: "",
  Title: [],
  Gender: [],
  Examination_Fee: "",
  Sorting: "",
};
export const DoctorsContext = createContext<DoctorsContextType | undefined>(undefined);
const Doctorslayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [SearchDoctors, setSearchDoctors] =
    useState<search_DoctorsType>(initial_state);
  const pathname = usePathname();
  return (
    <DoctorsContext.Provider value={{ SearchDoctors, setSearchDoctors }}>
      <div className={"bg-blue-50 h-[315px] lg:h-[315px]"}>
        <div className="h-48 pl-12 mt-4 mb-6 flex flex-row gap-x-2 bg-gray-100">
          <div className="w-1/3 flex flex-col gap-10">
            <h2
              className={patua.className + " font-bold text-2xl text-gray-600"}
            >
              Best Doctors in Egypt
            </h2>
            <div
              className={
                patua.className +
                " font-base text-2xl text-gray-950 flex flex-col gap-y-3"
              }
            >
              <div
                className={
                  patua.className +
                  " font-base text-xl text-gray-600 flex flex-row gap-x-2"
                }
              >
                <h3 className="text-gray-500 cursor-default hover:cursor-text">
                  Book online or call
                </h3>
                <ul className="flex flex-row gap-x-1 cursor-default hover:cursor-text">
                  <IoIosCall className="text-3xl text-red-600 h-full flex items-center justify-center" />
                  <li>2344230</li>
                </ul>
              </div>
              <div
                className={
                  patrik_hand.className +
                  " font-base text-xl text-gray-500 flex flex-row gap-x-2"
                }
              >
                <p className=" cursor-default hover:cursor-texts">
                  1500 Doctors - 9000 Professors and Consultants - More than 40
                  Specialties
                </p>
              </div>
            </div>
          </div>
          <div className="w-2/3 flex justify-start items-start">
            <img
              className="w-40 h-full"
              src="/assets/Images/CityGuideDoctorsSection.png"
              alt="s"
            />
          </div>
        </div>
        <div className="w-[95%] h-24 mx-auto flex flex-row justify-center mb-10 rounded-2xl">
          <DoctorSpecialtyDropDownSelect />
          <DoctorCityDropDownSelect />
          <DoctorSearchByNameInput />
          <DoctorSearchButton />
        </div>
      </div>
      {children}
    </DoctorsContext.Provider>
  );
};

export default Doctorslayout;
