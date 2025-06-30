"use client";
import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhone, FaUtensils } from "react-icons/fa";
import { isValidImage } from "@/ExternalFunctions/isValidImage";

type Props = {
  schoolId: number;
  schoolName: string;
  schoolType: string;
  location: string;
  phoneNumber: string;
  description: string;
  website: string;
  openingHours: string;
  schoolImage: string;
};

function School(props: Props) {
  const imageUrl = `https://citypulse.runasp.net/images/schools/${props.schoolImage}`;

  const [validImageUrl, setValidImageUrl] = useState<boolean | null>(null);

  useEffect(() => {
    isValidImage(imageUrl).then(setValidImageUrl);
  }, [imageUrl]);
  return (
    <div
      id={props.schoolId.toString()}
      className="group transition duration-300 ease-in-out w-full h-full bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl overflow-hidden flex flex-col items-center justify-start text-center p-4 hover:bg-blue-50"
    >
      {/* صورة المدرسة */}
      <div className="w-full h-44 mb-4 overflow-hidden rounded-lg">
        {validImageUrl ? (
          <img
            src={imageUrl}
            alt={props.schoolName}
            className="w-full h-full object-cover rounded-md transform transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <FaUtensils
            className={`text-gray-500 w-full h-full object-cover rounded-md transform transition-transform duration-300 group-hover:scale-105`}
          />
        )}
      </div>

      {/* اسم المدرسة */}
      <h1 className="text-xl font-semibold text-gray-800 group-hover:text-blue-800 mb-2">
        {props.schoolName}
      </h1>

      {/* العنوان */}
      <div className="text-gray-600 group-hover:text-gray-700 text-sm mb-1">
        <div className="flex items-center justify-center gap-2">
          <FaLocationDot className="text-blue-600" />
          <p>{props.location}</p>
        </div>
      </div>

      {/* نوع المدرسة */}
      <h2 className="text-sm text-gray-600 group-hover:text-gray-700 mb-2">
        <span className="font-medium">Type:</span> {props.schoolType}
      </h2>

      {/* رقم الهاتف */}
      <div className="flex items-center justify-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-full text-sm font-medium mt-3">
        <FaPhone />
        <span className="underline">{props.phoneNumber}</span>
      </div>

      {/* الوصف */}
      <p className="text-xs mt-2 text-gray-500 group-hover:text-gray-600 px-1">
        {props.description}
      </p>

      {/* رابط الموقع */}
      <a
        href={`https://${props.website}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-sm text-blue-600 hover:underline font-medium"
      >
        Visit Website
      </a>
    </div>
  );
}

export default School;
