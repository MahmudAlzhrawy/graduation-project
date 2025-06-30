"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { patua } from "@/constants/doctor";
import { redirect, useRouter } from "next/navigation";
import { DoctorsContext } from "@/app/doctors/layout";
import { FaInfo } from "react-icons/fa";
import { RiStarHalfLine } from "react-icons/ri";
import { SiComma } from "react-icons/si";
import { FaMoneyBillWave } from "react-icons/fa";
import { WiTime2 } from "react-icons/wi";
import { FaLocationDot } from "react-icons/fa6";
import { BsCalendarCheckFill } from "react-icons/bs";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaBriefcaseMedical } from "react-icons/fa";
import { DoctorStars } from "./PaginatedDoctors";
import { IoMdStar } from "react-icons/io";
import DoctorAppointemnetscardForCheckOut, {
  convertTime,
} from "./DoctorAppointemnetscardForCheckOut";
import styled, { keyframes } from "styled-components";
import { slideInLeft, slideInRight } from "react-animations";
import { BsPersonCircle } from "react-icons/bs";
import { TfiEmail } from "react-icons/tfi";
import * as Yup from "yup";
import { useFormik } from "formik";
import { DoctorModel } from "./Doctors";
import { store } from "@/lib/store";
import { toast } from "react-hot-toast";
const SlideInLeft = styled.div`
animation: 1s ${keyframes`${slideInLeft}`} ease-in-out;
`;

const SlideInRight = styled.div`
animation: 1s ${keyframes`${slideInRight}`} ease-in-out;
`;
interface WorkingHour {
  workingHourID: number;
  workingDate: string;
  workingDay: string;
  startTime: string;
  endTime: string;
  waitingHours: number;
  status: string;
  appointmentCount: number;
  maxAppointments: number;
}



type Props = {
  DoctorObject: DoctorModel;
  workingHourID: number; // ✅ أضف هذا
};
interface userRatingModel {
  ratingId: number;
  nameU: string;
  ratingValue: number;
  review: string;
  ratingDate: string;
}
interface ServiceProvidedByDoctor {
  id: number;
  price: number;
  serviceName: string;
}
interface AppointmentDetailsModel {
  subTotalPrice: number;
  servicesId: number;
}
interface CreateAppointmentModel {
  workingHourId: number;
  userId: number | undefined;
  clinicId: number;
  totalPrice: number;
  patientName: string;
  patientAddress: string;
  appointmentDetails: AppointmentDetailsModel[];
}
interface CreateDoctorRating {
  userId: number | undefined;
  serviceID: number;
  review: string;
  value: number;
}

import { Toast } from "@/sweetAlert2";

interface CreateAppointmentButtonState {
  clicked: boolean;
  workingHourId: number;
  doctorId: number;
  userId: number;
}


const DoctorDetailsClientComponent = (props: Props) => {
  const [createAppointmentButtonClick, setCreateAppointmentButtonClick] =
  useState<CreateAppointmentButtonState>({
    clicked: false,
    workingHourId: 0,
    doctorId: 0,
    userId: 0,
  });

  useEffect(() => {
    if (
      createAppointmentButtonClick.clicked &&
      createAppointmentButtonClick.userId !== 0
    ) {
      fetchData();
    }
    async function fetchData() {
      try {
        const secondResponse = await fetch(
          `https://citypulse.runasp.net/api/Clinic/${props.DoctorObject.clinicId}/services`
        );
        const fetchedData = await secondResponse.json();
        const doctorServices: ServiceProvidedByDoctor[] =
          fetchedData.$values.map((data: { id: any; price: any; serviceName: any; }) => {
            return {
              id: data.id,
              price: data.price,
              serviceName: data.serviceName,
            };
          });
        console.log(doctorServices);
        setDoctorServices(doctorServices);
      } catch (error) {
        console.log(error);
      }
    }
  }, [createAppointmentButtonClick]);
  function sendFromChild(workingHourId: number) {
  if (store.getState().auth.userToken !== null) {
    setCreateAppointmentButtonClick({
      clicked: true,
      workingHourId: workingHourId,
      doctorId: props.DoctorObject.doctorId,
      userId: store.getState().auth.user?.id ?? 0,
    });
  }
}

  const router = useRouter();

const context = useContext(DoctorsContext);

if (!context) {
  throw new Error("DoctorsContext must be used within a Doctorslayout Provider");
}

const { SearchDoctors, setSearchDoctors } = context;
  const [changeOpacity, setChangeOpacity] = useState<boolean>(false);
  const [doctorServices, setDoctorServices] = useState<
    ServiceProvidedByDoctor[]
  >([]);
  const [chooseServices, setChooseServices] = useState<boolean>(false);
  const [selectServices, setSelectServices] = useState<
    ServiceProvidedByDoctor[]
  >([]);
  const [totalPrice, setTotalPrice] = useState<number>(
    props.DoctorObject.price
  );
  const [appointmentDetails, setAppointmentDetails] = useState<
    AppointmentDetailsModel[]
  >([]);
  useEffect(() => {
    if (selectServices.length > 0) {
      for (let i = 0; i < selectServices.length; i++) {
        setAppointmentDetails([
          ...appointmentDetails,
          {
            subTotalPrice: selectServices[i].price,
            servicesId: selectServices[i].id,
          },
        ]);
      }
    }
  }, [selectServices]);
  useEffect(() => {
    if (appointmentDetails.length > 0) {
      const servicesTotal = appointmentDetails.reduce(
        (sum, selectService) => sum + selectService.subTotalPrice,
        props.DoctorObject.price
      );
      setTotalPrice(servicesTotal);
    } else {
      setTotalPrice(props.DoctorObject.price);
    }
  }, [appointmentDetails, props.DoctorObject.price]);
  useEffect(() => {
    async function fetchData() {
      try {
        const firstResponse = await fetch(
          `https://citypulse.runasp.net/api/Clinic/DoctorsByClinicId?clinicId=${props.DoctorObject.clinicId}`
        );
        const data = await firstResponse.json();
        if (Array.isArray(data?.workingHour?.$values)) {
          const workingHourObject = data.workingHour.$values.find(
            (hour:WorkingHour) => String(hour.workingHourID) === String(props.workingHourID)
          );
          console.log(workingHourObject);
          // const doctorworkingHour: DoctorWorkingHour[] =
          //   data.workingHour.$values.map((data: { workingHourID: any; workingDate: any; workingDay: any; startTime: any; endTime: any; waitingHours: any; status: any; appointmentCount: any; maxAppointments: any; }) => {
          //     return {
          //       workingHourID: data.workingHourID,
          //       workingDate: data.workingDate,
          //       workingDay: data.workingDay,
          //       startTime: data.startTime,
          //       endTime: data.endTime,
          //       waitingHours: data.waitingHours,
          //       status: data.status,
          //       appointmentCount: data.appointmentCount,
          //       maxAppointments: data.maxAppointments,
          //     };
          //   });
          const secondResponse = await fetch(
            `https://citypulse.runasp.net/api/Clinic/${props.DoctorObject.clinicId}/services`
          );
          const fetchedData = await secondResponse.json();
          const doctorServices: ServiceProvidedByDoctor[] =
            fetchedData.$values.map((data: { id: any; price: any; serviceName: any; }) => {
              return {
                id: data.id,
                price: data.price,
                serviceName: data.serviceName,
              };
            });
          // const doctorReservation: DoctorModel = {
          //   doctorId: data.doctorId,
          //   clinicId: data.clinicId,
          //   experienceYears: data.experienceYears,
          //   profileImage: data.profileImage,
          //   description: data.description,
          //   doctorName: data.doctorName,
          //   price: data.price,
          //   academicDegree: data.academicDegree,
          //   retaing: data.retaing,
          //   city: data.city,
          //   addressLine1: data.addressLine1,
          //   specialization: data.specialization,
          //   workingHour: doctorworkingHour,
          //   services: data.services.$values.map((data: { id: any; serviceName: any; description: any; price: any; }) => {
          //     return {
          //       idService: data.id,
          //       serviceName: data.serviceName,
          //       clinicId: data.id,
          //       description: data.description,
          //       price: data.price,
          //     };
          //   }),
          // };
          console.log(doctorServices);
          setDoctorServices(doctorServices);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const patientNameSection = useRef<HTMLDivElement>(null);
  const AddressSection = useRef<HTMLDivElement>(null);
  const formik = useFormik({
    initialValues: {
      patient_name: "",
      address: "",
    },
    validationSchema: Yup.object().shape({
      patient_name: Yup.string().required("Patient Name is required"),
      address: Yup.string().required("Patient Address is required"),
    }),
    onSubmit: async (values) => {
      try {
        if (
          createAppointmentButtonClick.clicked &&
          createAppointmentButtonClick.userId !== null
        ) {
         
         
          const createAppointment: CreateAppointmentModel = {
            workingHourId: createAppointmentButtonClick.workingHourId,
            userId: createAppointmentButtonClick.userId,
            clinicId: props.DoctorObject.clinicId,
            totalPrice: totalPrice > props.DoctorObject.price ? totalPrice : 0,
            patientName: values.patient_name,
            patientAddress: values.address,
            appointmentDetails: appointmentDetails,
          };
          const response = await fetch(
            `https://citypulse.runasp.net/api/Clinic/CreateAppointment`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${store.getState().auth.userToken}`,
              },
              body: JSON.stringify(createAppointment),
            }
          );
          if (response.ok) {
            const AppointmentId: Promise<number> = await response.json();
            const thirdResponse = await fetch(
              "https://citypulse.runasp.net/api/User/SaveTransaction",
              {
                method: "POST",
                mode: "cors",
                headers: {
                  Authorization: `Bearer ${store.getState().auth.userToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: store.getState().auth.user?.id,
                  amount:
                    totalPrice > props.DoctorObject.price ? totalPrice : 0,
                  paymentMethod: "Manual",
                  status: "Pending",
                  transactionType: "Appointment",
                  referenceId: AppointmentId,
                }),
              }
            );
            if (thirdResponse.ok) {
              Toast.fire({
                title: `You have an appointment with ${props.DoctorObject.doctorName}!`,
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              }); // Display a success message
              window.location.assign("/doctors");
            } else {
              const errorMessage = await thirdResponse.text();
              console.log("Server Error:", errorMessage);
              Toast.fire({
                title: "An error occurred while taking the Appointment.",
                icon: "error",
                showConfirmButton: true,
                timer: 1500,
              });
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  const [userRatingsState, setUserRatingsState] = useState<userRatingModel[]>(
    []
  );
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://citypulse.runasp.net/api/Clinic/AllDoctorRating /${props.DoctorObject.doctorId}`,
          {
            method: "GET",
          }
        );
        if (response.ok) {
          const data = await response.json();
          const userRatings: userRatingModel[] = data.$values.map(
            (userRating: { ratingId: any; nameU: any; ratingValue: any; review: any; ratingDate: any; }) => ({
              ratingId: userRating.ratingId,
              nameU: userRating.nameU,
              ratingValue: userRating.ratingValue,
              review: userRating.review,
              ratingDate: userRating.ratingDate,
            })
          );
          if (data.$values !== null) setUserRatingsState(userRatings);
        }
      } catch (e) {
        console.log("Error", e);
      }
    }
    fetchData();
  }, []);
  const [rating, setRating] = useState<number>(1);
  const [comment, setComment] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      store.getState().auth.userToken !== null &&
      store.getState().auth.user?.roles === "User"
    ) {
      try {
        if (
          store.getState().auth.user?.id !== null &&
          comment.trim() !== "" &&
          rating > 0
        ) {
          const createDoctorRating: CreateDoctorRating = {
            userId: store.getState().auth.user?.id,
            serviceID: props.DoctorObject.doctorId,
            review: comment,
            value: rating,
          };
          const response = await fetch(
            `https://citypulse.runasp.net/api/Clinic/CreateDoctorRating`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${store.getState().auth.userToken}`,
              },
              body: JSON.stringify(createDoctorRating),
            }
          );
          if (response.ok) {
            setRating(0);
            setComment("");
            toast.success("Your comment send to the doctor");
          } else {
            window.location.assign("/login");
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      location.replace("/login");
    }
  };
  const [toggleClickOnFirstStar, setToggleClickOnFirstStar] =
    useState<boolean>(false);
  const [toggleClickOnSecondStar, setToggleClickOnSecondStar] =
    useState<boolean>(false);
  const [toggleClickOnThirdStar, setToggleClickOnThirdStar] =
    useState<boolean>(false);
  const [toggleClickOnFourStar, setToggleClickOnFourStar] =
    useState<boolean>(false);
  const [toggleClickOnFiveStar, setToggleClickOnFiveStar] =
    useState<boolean>(false);
  useEffect(() => {
    if (toggleClickOnFirstStar) setRating(1);
    else setRating(0);
  }, [toggleClickOnFirstStar]);
  useEffect(() => {
    if (toggleClickOnSecondStar) setRating(2);
    else setRating(0);
  }, [toggleClickOnSecondStar]);
  useEffect(() => {
    if (toggleClickOnThirdStar) setRating(3);
    else setRating(0);
  }, [toggleClickOnThirdStar]);
  useEffect(() => {
    if (toggleClickOnFourStar) setRating(4);
    else setRating(0);
  }, [toggleClickOnFourStar]);
  useEffect(() => {
    if (toggleClickOnFiveStar) setRating(5);
    else setRating(0);
  }, [toggleClickOnFiveStar]);

 return (
  <div className={patua.className + " bg-blue-50 w-full flex flex-row"}>
    {/* Left Section - Doctor Details */}
    <section
      className={`w-[60%] mr-auto bg-transparent h-full z-10 ${changeOpacity ? "opacity-50" : "opacity-100"}`}
      onClick={() => setChangeOpacity(false)}
    >
      <div className="ml-auto w-[95%] h-full bg-transparent">
        {/* Breadcrumb */}
        <h3 className="ml-4 text-gray-400 text-sm flex items-center h-[4%] mb-4 mt-1">
          <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => router.push("/")}>City Guide</span>
          <span className="mx-4">/</span>
          <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => setSearchDoctors({ ...SearchDoctors, specialty: props.DoctorObject.specialization })}>{props.DoctorObject.specialization} in Egypt</span>
          <span className="mx-4">/</span>
          <p>
            <span className="mr-1">Doctor</span>
            {props.DoctorObject.doctorName.split(" ").map((part, idx) => (
              <span key={idx} className="mr-1">{part}</span>
            ))}
          </p>
        </h3>

        {/* Doctor Header */}
        <section className="bg-transparent h-[96%] flex flex-col gap-y-5">
          <section className="h-[25%] rounded-2xl bg-white flex gap-x-2">
            <div className="w-[30%] h-full flex items-center justify-center">
              <img className="w-40 h-40 border border-gray-300 rounded-full" src={`https://citypulse.runasp.net/images/doctors${props.DoctorObject.profileImage}`} alt={props.DoctorObject.doctorName} title={props.DoctorObject.doctorName} />
            </div>

            <div className="w-[70%] h-[70%] my-auto">
              <h3 className="text-gray-500 text-3xl mb-8 flex items-center">
                <span className="mr-1">Doctor</span>
                {props.DoctorObject.doctorName.split(" ").map((part, idx) => (
                  <span key={idx} className={idx === 2 ? "ml-1" : "mr-1"}>{part}</span>
                ))}
              </h3>

              <h4 className="text-gray-600 text-xl font-bold mb-5">
                <span className="mr-1">{props.DoctorObject.specialization}</span>
                <span>consultant</span>
                <span className="mx-1.5">-</span>
                {props.DoctorObject.city?.split(" ")[0] && <span className="mr-1">{props.DoctorObject.city.split(" ")[0]}</span>}
                {props.DoctorObject.addressLine1?.split(" ")[1] && <span>{props.DoctorObject.addressLine1.split(" ")[1]}</span>}
                {props.DoctorObject.city?.split(" ")[2] && <span className="ml-1">{props.DoctorObject.city.split(" ")[2]}</span>}
              </h4>

              <p className="text-lg font-semibold">
                <span className="mr-1 text-blue-600 underline cursor-pointer">{props.DoctorObject.specialization}</span>
                <span className="mx-1 text-gray-400">Specialized In</span>
                {props.DoctorObject.specialization}
              </p>

              <div className="my-5 flex text-4xl">
                {DoctorStars(props.DoctorObject.retaing).map((item, index) => <span key={index}>{item}</span>)}
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="h-[10%] rounded-xl bg-white px-10 py-10 flex flex-col gap-y-2">
            <h4 className="text-blue-600 text-3xl flex flex-row gap-x-3">
              <FaInfo className="relative" />
              <span className="font-sans font-semibold text-gray-600 text-xl">About The Doctor</span>
            </h4>
            <p className="ml-11 text-gray-500 font-sans font-medium text-lg">
              {props.DoctorObject.description}
            </p>
          </section>

          {/* Patient Reviews */}
          <section className="h-[55%] rounded-xl bg-gray-100 flex flex-col mb-24">
            <section className="pl-10 h-[45%] mb-auto rounded-tr-xl rounded-tl-xl bg-white">
              <h4 className="text-blue-600 text-3xl flex flex-row gap-x-5 mt-12">
                <RiStarHalfLine className="relative" />
                <span className="font-sans font-semibold text-gray-600 text-xl">Patients, Reviews:</span>
              </h4>
              <div className="mt-4 flex flex-row justify-center gap-x-5 font-sans text-4xl">
                {DoctorStars(props.DoctorObject.retaing).map((item, index) => <span key={index}>{item}</span>)}
              </div>
              <h4 className="font-sans font-medium text-gray-600 text-xl flex justify-center mt-3">Overall Rating</h4>
              <button className="w-20 h-10 mx-auto mt-3 rounded-lg bg-blue-600 text-white text-2xl flex justify-center items-center">
                <span className="text-4xl mr-1">{parseFloat(props.DoctorObject.retaing.toFixed(1))}</span><span>/5</span>
              </button>
              <h4 className="font-sans font-medium text-gray-600 text-md flex justify-center mt-2">Doctor Rating</h4>
            </section>

            {/* Comments Section */}
            {userRatingsState.length > 0 ? (
              <section className="h-[50%] rounded-br-xl rounded-bl-xl bg-white flex flex-col">
                {userRatingsState.map((userRating) => {
                  const ratingDate = new Date(userRating.ratingDate);
                  return (
                    <section key={userRating.ratingId} className="h-40 p-5 pr-28 border-t-2 border-gray-200 flex justify-between">
                      <div>
                        <div className="flex flex-row gap-x-2 font-sans text-2xl">
                          {DoctorStars(userRating.ratingValue).map((item, idx) => <span key={idx}>{item}</span>)}
                        </div>
                        <h5 className="text-lg text-gray-600 mt-2">Overall Rating</h5>
                        <h6 className="text-lg text-gray-600 mt-1">'{userRating.review}'</h6>
                        <h6 className="text-sm text-gray-600 mt-1">{userRating.nameU}</h6>
                        <h6 className="text-sm text-gray-700 font-semibold mt-1">
                          {ratingDate.toLocaleDateString()} - {convertTime(ratingDate.toLocaleString())}
                        </h6>
                      </div>
                      <div className="flex flex-col gap-y-4 pt-5">
                        <button className="w-12 h-14 bg-blue-600 text-white text-2xl flex justify-center items-center rounded-lg">
                          {parseFloat(userRating.ratingValue.toFixed(1))}
                        </button>
                        <h4 className="text-md text-gray-600">Doctor Rating</h4>
                      </div>
                    </section>
                  );
                })}
              </section>
            ) : (
              <div className="h-40 rounded-b-xl bg-white flex justify-center items-center text-red-300 text-bold text-2xl font-sans border-t border-t-gray-100">
                No Available Comments
              </div>
            )}
          </section>
        </section>
      </div>
    </section>
      <section
        className={
          changeOpacity
            ? "w-[39.1%] bg-transparent pt-5 opacity-100"
            : "w-[39.1%] bg-transparent pt-5 opacity-100"
        }
        onClick={() => setChangeOpacity(true)}
      >
        <h3 className="h-10 bg-blue-600 rounded-tr-md rounded-tl-lg font-sans font-medium text-xl text-white flex flex-row gap-x-1 justify-center items-center">
          <span>Booking</span>
          <span>information</span>
        </h3>
        <h4 className="h-20 flex flex-col justify-center items-center bg-white border-b-2 border-gray-500 font-sans font-medium text-xl text-gray-500">
          <span className="hover:cursor-pointer">Book</span>
          <span className="text-2xl text-blue-600 hover:cursor-pointer">
            Examination
          </span>
        </h4>
        <h4 className="h-24 px-20 flex flex-row justify-between items-center bg-white border-b-2 border-gray-500 font-sans font-medium text-md text-gray-500">
          <div className="w-40 flex flex-col gap-y-3 justify-center items-center h-full">
            <FaMoneyBillWave className="text-blue-600 text-4xl" />
            <span className="flex flex-row gap-x-1 hover:cursor-text">
              <span>Fees</span>
              <span className="text-gray-600 font-bold">
                {props.DoctorObject.price}
              </span>
              <span className="text-gray-600 font-bold">EGP</span>
            </span>
          </div>
          <div className="w-52 flex flex-col gap-y-3 justify-center items-center h-full">
            <WiTime2 className="text-green-500 text-4xl" />
            <span className="flex flex-row items-center gap-x-1 text-green-300 hover:cursor-text">
              <span>Waiting</span>
              <span>Time</span>
              <span className="text-xl">:</span>
              <span>{props.DoctorObject.workingHour[0].waitingHours * 60}</span>
            </span>
          </div>
        </h4>
        {!createAppointmentButtonClick.clicked ? (
          <SlideInLeft className="overflow-hidden">
            <h4 className="bg-white h-20 py-2 pl-10 border-b-2 border-gray-500 flex flex-col gap-y-1">
              <h5 className="flex flex-row gap-x-1 items-center">
                <FaLocationDot className="text-blue-600 text-3xl" />
                <p className="font-sans font-medium text-lg text-gray-500">
                  {props.DoctorObject.addressLine1}
                </p>
              </h5>
              <p className="ml-9 font-sans font-bold text-sm text-gray-600">
                Book now to receive the clinic&#39;s address details and phone
                number
              </p>
            </h4>
            <h4 className="bg-white h-24 flex justify-center items-center font-sans font-semibold text-2xl text-black">
              Choose your appointment
            </h4>
            <DoctorAppointemnetscardForCheckOut
              doctorId={props.DoctorObject.doctorId}
              clinicId={props.DoctorObject.clinicId}
              DoctorAppointements={props.DoctorObject.workingHour}
              pageName="doctor-details"
              sendFromChildToSecondParent={sendFromChild}
            />
            <h4 className="bg-white h-16 flex justify-center items-center font-sans font-normal text-lg text-gray-500 border-y-2 border-gray-400 hover:cursor-text">
              Appointment reservation
            </h4>
            <section className="px-28 h-32 bg-white rounded-bl-lg rounded-br-lg flex flex-row items-center gap-x-5">
              <BsCalendarCheckFill className="text-5xl text-green-400" />
              <div className="flex flex-col gap-y-2">
                <p className="text-gray-700 flex flex-row gap-x-1 hover:cursor-text">
                  <span>Book</span>
                  <span>online</span>
                  <span>-</span>
                  <span>Pay</span>
                  <span>at</span>
                  <span>the</span>
                  <span>clinic!</span>
                </p>
                <p className="font-sans font-normal text-gray-500 flex flex-row gap-x-1 hover:cursor-text">
                  <span>Doctor</span>
                  <span>requires</span>
                  <span>reservations!</span>
                </p>
              </div>
              {/* <button
                className="bg-green-600 font-sans font-bold text-white text-xl border border-white rounded-full"
                onClick={() => setChangeLayout(true)}
              >
                I select appointment by Salem Issa
              </button> */}
            </section>
          </SlideInLeft>
        ) : (
          <SlideInRight>
          <h4 className="bg-white h-20 py-2 pl-10 border-b-2 border-gray-500 flex flex-col gap-y-1">
            <h5 className="flex flex-row gap-x-1 items-center">
              <FaLocationDot className="text-blue-600 text-3xl" />
              <p className="font-sans font-medium text-lg text-gray-500">
                {props.DoctorObject.addressLine1}
              </p>
            </h5>
            <p className="ml-9 font-sans font-bold text-sm text-gray-600">
              Book now to receive the clinic&#39;s address details and phone number
            </p>
          </h4>

          <h4 className="bg-white h-12 flex justify-center items-center font-sans font-semibold text-xl text-gray-500">
            Enter Your Info.
          </h4>

          {props.DoctorObject.workingHour.map((hour) => {
            if (
              hour.workingHourID ===
              createAppointmentButtonClick.workingHourId
            ) {
              return (
                <h4
                  key={hour.workingHourID}
                  className="bg-white h-12 flex justify-center items-center font-sans font-semibold text-lg text-gray-500 space-x-3"
                >
                  {hour.workingDate} - {hour.workingDay} - From{" "}
                  {convertTime(hour.startTime)} - To{" "}
                  {convertTime(hour.endTime)}
                </h4>
              );
            }
          })}

          {/* بداية نموذج البيانات */}
          <form className="h-full w-full md:h-[47%] md:mb-auto bg-white rounded-bl-md lg:rounded-bl-xl flex flex-col gap-y-4">
            {/* Patient Name */}
            <section
              className="md:mt-10 md:mb-10 w-[85%] mx-auto h-[20%] border-b border-gray-300 flex flex-row gap-x-5 p-0 relative"
              ref={patientNameSection}
            >
              <BsPersonCircle className="mb-3 text-3xl text-gray-500 h-full flex justify-center items-centerx" />
              <input
                placeholder="Patient name (who visits doctor)"
                className="h-full mb-3 text-md text-gray-600 border-none outline-none focus:border-none w-full placeholder:text-gray-600 placeholder:text-md placeholder:font-sans selection:bg-blue-900 selection:text-white"
                value={formik.values.patient_name}
                onChange={formik.handleChange}
                onFocus={(event) => {
                  if (event.target.parentElement) {
                    event.target.parentElement.style.borderBottomWidth = "1px";
                    event.target.parentElement.style.borderColor = "blue";
                  }
                }}
                onBlur={(event) => {
                  if (event.target.parentElement) {
                    event.target.parentElement.style.borderBottomWidth = "";
                    event.target.parentElement.style.borderColor = "";
                  }
                }}
                type="text"
                id="patient_name"
                name="patient_name"
                required
              />
              {formik.touched.patient_name && formik.errors.patient_name ? (
                <span className="text-red-500 font-sans font-semibold absolute top-[100%] mt-1 z-10">
                  {formik.errors.patient_name}
                </span>
              ) : null}
            </section>

            {/* Address & Services */}
            <div className="w-[85%] mx-auto flex flex-row gap-x-4">
              {/* Choose Services */}
              <section className="flex flex-col justify-center w-[80%] mx-auto my-5 hover:cursor-pointer relative">
                <div
                  className="flex flex-row items-center justify-between mb-5"
                  onClick={() => setChooseServices(!chooseServices)}
                >
                  <div className="flex flex-row gap-x-[0.3rem] text-center">
                    <FaBriefcaseMedical className="text-3xl w-[70px] h-[70px] flex justify-center items-center" />
                    <h4 className="space-x-3 h-full pt-2">
                      Choose Services Provided By Doctor{" "}
                      {props.DoctorObject.doctorName}
                    </h4>
                    {chooseServices ? (
                      <IoMdArrowDropdown className="text-3xl w-[70px] h-[70px] pt-1" />
                    ) : (
                      <IoMdArrowDropright className="text-3xl w-[70px] h-[70px] pt-1" />
                    )}
                  </div>
                </div>

                {/* List of Services */}
                <div
                  className={
                    chooseServices
                      ? "flex flex-col gap-y-4 opacity-100 max-h-32 transition-all duration-500 ease-in-out"
                      : "flex flex-col gap-y-4 opacity-0 max-h-0 transition-all duration-500 ease-in-out"
                  }
                >
                  {doctorServices.map((service) => {
                    const selectServicesNames = selectServices.map(
                      (s) => s.serviceName
                    );
                    const isChecked = selectServicesNames.includes(service.serviceName);
                    const toggleService = () => {
                      if (isChecked) {
                        const filteredData = selectServices.filter(
                          (s) => s.serviceName !== service.serviceName
                        );
                        setSelectServices(filteredData);
                      } else {
                        setSelectServices((prev) => [
                          ...prev,
                          {
                            id: service.id,
                            price: service.price,
                            serviceName: service.serviceName,
                          },
                        ]);
                      }
                    };

                    return (
                      <div
                        key={service.id}
                        onClick={toggleService}
                        className="flex flex-row items-center"
                      >
                        <input
                          id={service.serviceName}
                          type="checkbox"
                          value={service.serviceName}
                          checked={isChecked}
                          onChange={toggleService}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor={service.serviceName}
                          className="ms-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                          onClick={toggleService}
                        >
                          {service.serviceName}
                        </label>
                      </div>
                    );
                  })}
                </div>
                {selectServices.length === 0 ? (
                  <span className="text-purple-500 font-sans font-semibold absolute top-[100%] mt-1 z-10 space-x-2">
                    please, select service !!!
                  </span>
                ) : null}
              </section>

              {/* Address Field */}
              <section
                className="md:mb-7 w-[80%] md:w-[60%] lg:w-[80%] h-[20%] md:h-[7%] border-b border-gray-300 mx-auto flex flex-row gap-x-5 p-0 relative"
                ref={AddressSection}
              >
                <TfiEmail className=" mb-3 text-3xl text-gray-500 h-full flex justify-center items-center" />
                <input
                  placeholder="Address"
                  className="h-full mb-3 text-md text-gray-600 border-none outline-none focus:border-none w-full placeholder:text-gray-600 placeholder:text-md placeholder:font-sans selection:bg-blue-900 selection:text-white"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onFocus={(event) => {
                    if (event.target.parentElement) {
                      event.target.parentElement.style.borderBottomWidth = "1px";
                      event.target.parentElement.style.borderColor = "blue";
                    }
                  }}
                  onBlur={(event) => {
                    if (event.target.parentElement) {
                      event.target.parentElement.style.borderBottomWidth = "";
                      event.target.parentElement.style.borderColor = "";
                    }
                  }}
                  type="text"
                  id="address"
                  name="address"
                />
                {formik.touched.address && formik.errors.address ? (
                  <span className="text-red-500 font-sans font-semibold absolute top-[100%] mt-1 z-10">
                    {formik.errors.address}
                  </span>
                ) : null}
              </section>
            </div>

            {/* Submit Buttons */}
            <section className="mb-12 md:w-[60%] lg:w-[80%] md:mx-auto md:h-14 md:flex md:flex-row md:gap-x-5 ">
              <button
                type="submit"
                className="w-[60%] h-full flex justify-center items-center bg-red-600 text-white hover:cursor-pointer rounded-md font-sans font-medium text-xl"
                onClick={(event) => {
                  event.preventDefault();
                  if (selectServices.length > 0) {
                    if (
                      store.getState().auth.user?.id !== null &&
                      store.getState().auth.userToken !== null &&
                      store.getState().auth.user?.roles === "User"
                    ) {
                      if (
                        patientNameSection.current &&
                        formik.values.patient_name === ""
                      ) {
                        patientNameSection.current.style.borderBottomWidth = "1px";
                        patientNameSection.current.style.borderBottomColor = "red";
                      }

                      if (
                        AddressSection.current &&
                        formik.values.address === ""
                      ) {
                        AddressSection.current.style.borderBottomWidth = "1px";
                        AddressSection.current.style.borderBottomColor = "red";
                      }

                      formik.submitForm();
                    } else {
                      location.replace("/login");
                    }
                  }
                }}
              >
                Book
              </button>
              <button
                type="button"
                className="w-[40%] h-full text-gray-600 flex justify-center items-center border border-gray-400 hover:cursor-pointer rounded-md font-sans font-medium text-xl"
                onClick={() => redirect("/doctors")}
              >
                Cancel
              </button>
            </section>
          </form>
        </SlideInRight>

        )}
      </section>
    </div>
  );
};

export default DoctorDetailsClientComponent;
