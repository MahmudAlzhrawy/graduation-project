"use client";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import {
  patrik_hand,
  notoSansArabic,
  notoNaskhArabic,
} from "@/constants/doctor";
import { FaLocationDot } from "react-icons/fa6";
import { FaFlag } from "react-icons/fa";
import { WiTime2 } from "react-icons/wi";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoMdStar } from "react-icons/io";
import { IoMdStarHalf } from "react-icons/io";
import { CiStethoscope } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { BiSolidRightArrow } from "react-icons/bi";
import { BiSolidLeftArrow } from "react-icons/bi";
import { usePathname, useRouter } from "next/navigation";
import { DoctorModel } from "../Doctors/Doctors";

import DoctorAppointemnetscardForCheckOut from "./DoctorAppointemnetscardForCheckOut";
import { store } from "@/lib/store";

type Props = {
  doctorCards: DoctorModel[];
};
type PaginatedDoctorsProps = {
  doctorCards: DoctorModel[];
  itemsPerPage: number;
  onPageChange: (count: number) => void;
};
/*export interface DoctorCard {
  id: string;
  name: string;
  title: string;
  specialty: string[] | string;
  description: string;
  image: string;
  rating: number;
  ratingCount: number;
  hygieneBadge: string;
  location: string;
  fees: number;
  waitingTime: string;
  phone: string;
  schedule: object[];
} */
export function DoctorStars(count: number) {
  const completeStars = Math.floor(count);
  const remainderStars = count - Math.floor(count);
  const jsxElementsStars: React.ReactNode[] = [];
  for (let i = 0; i < completeStars; i++) {
    jsxElementsStars.push(<IoMdStar key={i + 1} className="text-yellow-500" />);
  }
  if (remainderStars !== 0) {
    jsxElementsStars.push(
      <IoMdStarHalf key={0.5} className="text-yellow-500" />
    );
  }
  return jsxElementsStars;
}
function Doctors(props: Props) {
  function sendFromChild() {}
  const router = useRouter();

  return (
    <>
      {props.doctorCards &&
        props.doctorCards.map((doctor) => (
          <div
            className={
              patrik_hand.className +
              " bg-blue-50 pl-[27%] w-full lg:max-h-[1000px] flex flex-row relative"
            }
            key={doctor.doctorId}
          >
            <div className="bg-white rounded-tl-xl rounded-tr-xl w-[20%] max-h-full flex items-center justify-center">
              <img
                className="w-40 h-40 border border-gray-300 rounded-full"
                src={doctor.profileImage}
                alt={doctor.doctorName}
                title={doctor.doctorName}
              />
            </div>
            <div className="bg-white w-[40%] flex flex-col pt-10 gap-y-4">
              <div
                className={
                  notoSansArabic.className +
                  " hover:cursor-pointer flex flex-col gap-y-1"
                }
              >
                <h3 className="font-sans font-semibold text-3xl text-blue-500 flex flex-row h-10">
                  <span className="mr-2 text-lg h-full flex items-center justify-center">
                    Doctor
                  </span>
                  <span
                    title={`Book now with  ${doctor.doctorName} ${doctor.description}`}
                    className="hover:underline hover:cursor-pointer underline-offset-4 "
                    onClick={() => {
                      router.push(
                        `/doctors/doctor-${doctor.doctorName.replace(
                          " ",
                          "-"
                        )}--${doctor.doctorId}--${doctor.clinicId}`
                      );
                    }}
                  >
                    {doctor.doctorName}
                  </span>
                </h3>
                <h2 className="font-sans font-bold text-xl text-gray-600">
                  {doctor.description}
                </h2>
                <div className="flex flex-row gap-x-1 font-sans text-4xl">
                  {DoctorStars(doctor.retaing).map((item) => item)}
                </div>
              </div>
              <div className="flex flex-row gap-x-1">
                <CiStethoscope className="text-4xl text-blue-500" />
                <h4
                  className={
                    notoNaskhArabic.className +
                    "  font-sans font-bold text-xl text-black flex items-center justify-center h-full"
                  }
                >
                  <span className="text-blue-500 hover:underline ">
                    Dentist
                  </span>
                  <span className="text-gray-600 mx-1">Specialized in</span>
                  <span className="text-blue-500 hover:underline ">
                    {/* {item.specialty.concat(",").toString().length >= 25
                      ? item.specialty
                          .concat(",")
                          .toString()
                          .slice(0, 26)
                          .concat("...")
                      : item.specialty.concat(",")} */}
                    {doctor.specialization}
                  </span>
                </h4>
              </div>
              <div className="flex flex-row gap-x-1">
                <FaLocationDot className="text-4xl text-red-600 h-full flex justify-center items-center" />
                <h4
                  className={
                    notoNaskhArabic.className +
                    " font-bold text-xl text-gray-600 flex items-center justify-center h-full space-x-5"
                  }
                >
                  {doctor.city} {doctor.addressLine1}
                </h4>
              </div>
              <div className="flex flex-row gap-x-2">
                <FaFlag className="text-4xl text-blue-600" />
                <h4
                  className={
                    patrik_hand.className +
                    " font-bold text-xl text-gray-600 flex flex-row items-center justify-center gap-x-2 h-full"
                  }
                >
                  <span className="">Fees:</span>
                  {doctor.price}
                </h4>
              </div>
              <div className="flex flex-row gap-x-1 text-green-300">
                <WiTime2 className="text-4xl" />
                <h4
                  className={
                    patrik_hand.className +
                    " font-normal text-3xl flex items-center justify-center h-full space-x-5"
                  }
                >
                  Waiting time: {doctor.workingHour[0]?.waitingHours * 60}{" "}
                  Mintues
                </h4>
              </div>
              <div className="flex flex-row gap-x-1 text-blue-600 mb-10">
                <FiPhone className="text-4xl" />
                <h4
                  className={
                    patrik_hand.className +
                    " font-normal text-gray-700 text-3xl flex items-center justify-center h-full"
                  }
                >
                  010308463833
                  <span className="mx-1 text-gray-600">-</span>
                  <span className="text-gray-600">Cost of regular call</span>
                </h4>
              </div>
            </div>
            {doctor.workingHour.length === 0 ? (
              <div className="w-[40%] flex flex-col justify-center items-center gap-y-5 bg-red-300 overflow-hidden text-gray-700 text-3xl">
                <span className="space-x-1">No Available</span>{" "}
                <span>Appointments</span>
              </div>
            ) : (
              <DoctorAppointemnetscardForCheckOut
                doctorId={doctor.doctorId}
                clinicId={doctor.clinicId}
                DoctorAppointements={doctor.workingHour}
                pageName="show-all-doctors"
                sendFromChildToSecondParent={sendFromChild}
              />
            )}
            <div className="hidden">{doctor.clinicId}</div>
          </div>
        ))}
    </>
  );
}
function PaginatedDoctors(props: PaginatedDoctorsProps) {
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState<number>(props.itemsPerPage);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + props.itemsPerPage;
  const currentDoctors = props.doctorCards.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(props.doctorCards.length / props.itemsPerPage);
  console.log("currentDoctors= " + currentDoctors);
  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number; }) => {
    const newOffset =
      (event.selected * props.itemsPerPage) % props.doctorCards.length;
    setItemOffset(newOffset);
    sessionStorage.setItem(
      "currentClinicsPage",
      JSON.stringify(event.selected)
    );
    //dispatch(setnumberOfShowingClinics(newOffset));
  };
  useEffect(() => {
    props.onPageChange(currentDoctors.length);
  }, [currentDoctors, props.onPageChange]);
  const pathname = usePathname();
  //const dispatch = useDispatch();
  return (
    <div className="bg-blue-50 flex flex-col">
      <div className="flex flex-col gap-y-20">
        <Doctors doctorCards={currentDoctors} />
        <div className="flex items-center justify-center">
          <ReactPaginate
            initialPage={
              sessionStorage.getItem("currentClinicsPage")
                ? JSON.parse(
                    sessionStorage.getItem("currentClinicsPage") as string
                  )
                : 0
            }
            className="mb-5 h-16 flex flex-row gap-x-4"
            activeClassName="bg-blue-600 w-16 h-full flex items-center justify-center hover:cursor-default hover:bg-blue-600 rounded-[4px]"
            activeLinkClassName="text-lg bg-blue-600 hover:bg-blue-600 text-white w-full h-full flex items-center justify-center hover:cursor-default rounded-[4px]"
            pageClassName="w-16 h-full flex items-center justify-center text-blue-600 hover:bg-white hover:cursor-pointer"
            pageLinkClassName="text-lg text-blue-600 w-full h-full flex items-center justify-center hover:cursor-pointer rounded-[4px]"
            breakClassName="w-16 h-full bg-white flex items-center justify-center text-blue-600  hover:bg-gray-100  hover:cursor-pointer"
            breakLinkClassName="text-lg text-blue-600 w-full h-full flex items-center justify-center hover:cursor-pointer rounded-[4px]"
            previousClassName="w-16 h-full bg-white flex items-center justify-center hover:bg-gray-100 hover:cursor-pointer"
            previousLinkClassName="text-lg text-blue-600 w-full h-full flex items-center justify-center hover:cursor-pointer rounded-[4px]"
            nextClassName="w-16 h-full bg-white flex items-center justify-center text-blue-600  text-blue-600 hover:bg-gray-100 hover:cursor-pointer"
            nextLinkClassName="text-lg text-blue-600 w-full h-full flex items-center justify-center hover:cursor-pointer rounded-[4px]"
            disabledClassName="w-16 h-full bg-red-600 flex items-center justify-center hover:bg-red-700 hover:cursor-not-allowed"
            disabledLinkClassName="text-lg text-white w-full h-full flex items-center justify-center text-white bg-red-700 hover:bg-red-700 hover:cursor-not-allowed rounded-[4px]"
            breakLabel={<HiDotsHorizontal className="text-lg" />}
            nextLabel={<BiSolidRightArrow className="text-lg" />}
            onPageChange={handlePageClick}
            onClick={handlePageClick}
            eventListener="onClick"
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel={<BiSolidLeftArrow className="text-lg" />}
            renderOnZeroPageCount={null}
            prevRel={
              itemOffset > 0 ? pathname?.concat(`?page=${itemOffset}`) : null
            }
            nextRel={
              itemOffset < pageCount - 1
                ? pathname?.concat(`?page=${itemOffset + 2}`)
                : null
            }
            selectedPageRel={pathname?.concat(`?page=${itemOffset + 1}`)}
          />
        </div>
      </div>
    </div>
  );
}

export default PaginatedDoctors;
