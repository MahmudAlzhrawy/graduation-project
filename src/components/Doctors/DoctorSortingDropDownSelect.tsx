"use client";
import "../../styles/DoctorsSortingDropDownSelect.css";
import { IoIosArrowDown } from "react-icons/io";
import React, { useContext, useEffect, useState } from "react";
import { DoctorsContext } from "@/app/doctors/layout";
import { DoctorModel } from "./Doctors";
import { Atkinson_HyperlegibleFont } from "@/constants/doctor";
type Props = {
  visiableCount: number;
  getAllDoctors: DoctorModel[];
};
function DoctorSortingDropDownSelect(props: Props) {
  const SortingValues: string[] = [
    "Best Match",
    "Top Rated",
    "Price Low to High",
    "Price High to Low",
    "Less Waiting Time",
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
        Atkinson_HyperlegibleFont.className +
        " w-[70%] h-[40%] my-auto rounded-md flex flex-col items-center bg-white hover:cursor-pointer relative"
      }
      onClick={() => {
        setSelectToggle(!selectToggle);
      }}
    >
      <div
        className={
          props.visiableCount > 0 && props.getAllDoctors.length >= 1
            ? "flex flex-row mt-5 h-full w-full mr-5 text-center"
            : "flex flex-row mt-1.5 h-full items-center justify-center w-full mr-5 text-center"
        }
      >
        <h4
          className={
            Atkinson_HyperlegibleFont.className +
            " text-gray-500 text-lg w-[80%] mb-1"
          }
        >
          {SearchDoctors.Sorting
            ? SearchDoctors.Sorting.length <= 20
              ? SearchDoctors.Sorting
              : SearchDoctors.Sorting.slice(0, 21) + "..."
            : "sort by value..."}
        </h4>
        <IoIosArrowDown className="font-sans text-4xl text-gray-500 bg-transparent w-[10%]" />
      </div>
      <ul
        className={
          selectToggle ? "options-container active" : "options-container"
        }
        onMouseLeave={() => setSelectToggle(false)}
      >
        {SortingValues.map((item) => (
          <div
            key={SortingValues.indexOf(item) + 1}
            onMouseDown={() => {
              setSearchDoctors({ ...SearchDoctors, Sorting: item });
              setTimeout(() => {
                setSelectToggle(false);
              }, 100);
            }}
            className="flex flex-row items-center"
          >
            <input
              id={item}
              type="radio"
              name="Sorting_Value"
              value={item}
              className="w-4 h-4 mx-5 my-8 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={SearchDoctors.Sorting === item ? true : false}
            />
            <label
              htmlFor={item}
              className="ms-2 text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              {item}
            </label>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default DoctorSortingDropDownSelect;
