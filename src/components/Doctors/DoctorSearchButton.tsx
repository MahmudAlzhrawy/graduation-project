"use client";
import React, { useContext, useState } from "react";
import { DoctorsContext } from "@/app/doctors/layout";
import { ImSearch } from "react-icons/im";
import { patua } from "@/constants/doctor";
import "./LoadingSpinnerOne.css";
function CovertFromArrayOfStringsToString(array: string[]) {
  let stringValue = "";
  if (array.length > 0) {
    array.forEach((element) => {
      if (
        array.indexOf(element) !== 0 &&
        array.indexOf(element) !== array.length
      )
        stringValue = stringValue + "," + element;
      else stringValue += element;
    });
  }
  stringValue = stringValue.trim();
  if (array.length === 0) return null;
  else return stringValue;
}
function DoctorSearchButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
const context = useContext(DoctorsContext);

if (!context) {
  throw new Error("DoctorsContext must be used within a Doctorslayout Provider");
}
  const { SearchDoctors } = context;
  return (
    <div
      onClick={() => {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          const params = new URLSearchParams();

          const title = CovertFromArrayOfStringsToString(
            SearchDoctors.Title
          )?.trim();
          if (title) params.append("title", title);

          const specialty = SearchDoctors.specialty.trim();
          if (specialty) params.append("specialty", specialty);

          const fee = SearchDoctors.Examination_Fee.trim();
          if (fee) params.append("examination_fee", fee);

          const sorting = SearchDoctors.Sorting.trim();
          if (sorting) params.append("sorting", sorting);

          const city = SearchDoctors.city.trim();
          if (city) params.append("city", city);

          const searchName = SearchDoctors.search_name.trim();
          if (searchName) params.append("search_name", searchName);

          window.location.assign(`/doctors?${params.toString()}`);
        }, 1000);
      }}
      className="w-1/5 h-full rounded-tr-2xl rounded-br-2xl py-4 flex flex-row items-center justify-center bg-red-500 hover:cursor-pointer relative"
    >
      {isLoading ? (
        <div className="loader">
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
          <div className="bar4"></div>
          <div className="bar5"></div>
          <div className="bar6"></div>
          <div className="bar7"></div>
          <div className="bar8"></div>
          <div className="bar9"></div>
          <div className="bar10"></div>
          <div className="bar11"></div>
          <div className="bar12"></div>
        </div>
      ) : (
        <div className="flex flex-row gap-x-5">
          <ImSearch className="text-4xl text-white" />
          <h2
            className={
              patua +
              " text-3xl text-white h-full flex justify-center items-center"
            }
          >
            Search
          </h2>
        </div>
      )}
    </div>
  );
}

export default DoctorSearchButton;
