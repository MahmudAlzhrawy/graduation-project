"use client";
import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import styled, { keyframes } from "styled-components";
import { slideInLeft, slideInRight } from "react-animations";
import { DoctorWorkingHour } from "./Doctors";
import { store } from "@/lib/store";
import { redirect, useRouter } from "next/navigation";

const SlideInLeft = styled.div`
  animation: 1s ${keyframes`${slideInLeft}`} ease-in-out;
`;

const SlideInRight = styled.div`
  animation: 1s ${keyframes`${slideInRight}`} ease-in-out;
`;
type Props = {
  pageName: string;
  doctorId: number;
  clinicId: number;
  DoctorAppointements: DoctorWorkingHour[];
  sendFromChildToSecondParent: (workingHourId: number) => void;
};
export function convertTime(timeString: string): string {
  const parts = timeString.split(":");
  const hours = parseInt(parts[1], 10);
  const minutes = parseInt(parts[0], 10);

  const meridiem = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  const formattedTime = `${displayHours.toString()} : ${minutes
    .toString()
    .padStart(2, "0")} ${meridiem}`;

  return formattedTime;
}

function DoctorAppointemnetscardForCheckOut(props: Props) {
  const router = useRouter();
  const [firstDate, setFirstDate] = useState<Date>(new Date());
  const [secondDate, setSecondDate] = useState<Date>(
    new Date(firstDate.getTime() + 24 * 60 * 60 * 1000)
  );
  const [thirdDate, setThirdDate] = useState<Date>(
    new Date(secondDate.getTime() + 24 * 60 * 60 * 1000)
  );
  const [isSlidingInLeft, setIsSlidingInLeft] = useState<boolean>(false);
  const [isSlidingInRight, setIsSlidingInRight] = useState<boolean>(false);
  const [isDateChangeLoading, setIsDateChangeLoading] =
    useState<boolean>(false);
  const [isDisableRightButtonForSliding, setisDisableRightButtonForSliding] =
    useState<boolean>(true);
  useEffect(() => {
    if (isDateChangeLoading && isSlidingInLeft) {
      setTimeout(() => {
        setFirstDate(new Date(firstDate.getTime() + 3 * 24 * 60 * 60 * 1000));
        setSecondDate(new Date(secondDate.getTime() + 3 * 24 * 60 * 60 * 1000));
        setThirdDate(new Date(thirdDate.getTime() + 3 * 24 * 60 * 60 * 1000));
        setisDisableRightButtonForSliding(false);
        setIsDateChangeLoading(false);
        setIsSlidingInRight(false);
      }, 1000);
    }
  }, [isDateChangeLoading, isSlidingInLeft]);
  useEffect(() => {
    if (isDisableRightButtonForSliding === false && isSlidingInRight === true) {
      setIsSlidingInLeft(false);
      setFirstDate(new Date(firstDate.getTime() - 3 * 24 * 60 * 60 * 1000));
      setSecondDate(new Date(secondDate.getTime() - 3 * 24 * 60 * 60 * 1000));
      setThirdDate(new Date(thirdDate.getTime() - 3 * 24 * 60 * 60 * 1000));
      setTimeout(() => {
        setIsSlidingInRight(false);
      }, 1000);
    }
  }, [isSlidingInRight]);
  const SlideInLeftFirstDate = useRef<HTMLDivElement>(null);
  const SlideInLeftSecondDate = useRef<HTMLDivElement>(null);
  const SlideInLeftThirdDate = useRef<HTMLDivElement>(null);
  const SlideInRightFirstDate = useRef<HTMLDivElement>(null);
  const SlideInRightSecondDate = useRef<HTMLDivElement>(null);
  const SlideInRightThirdDate = useRef<HTMLDivElement>(null);
  const SectionFirstDate = useRef<HTMLDivElement>(null);
  const SectionSecondDate = useRef<HTMLDivElement>(null);
  const SectionThirdDate = useRef<HTMLDivElement>(null);
  interface AppointmentDetails {
    servicesId: number;
    subTotalPrice: number;
  }
  interface createAppointmentButtonClickModel {
    clicked: boolean;
    workingHourID: number;
    doctorId: number;
    clinicId: number;
    userId: number | undefined;
  }
  const [createAppointmentButtonClick, setCreateAppointmentButtonClick] =
    useState<createAppointmentButtonClickModel>({
      clicked: false,
      workingHourID: 0,
      doctorId: 0,
      clinicId: 0,
      userId: 0,
    });
  useEffect(() => {
    if (
      createAppointmentButtonClick.clicked &&
      createAppointmentButtonClick.userId !== 0
    ) {
      redirect(
        decodeURIComponent(`/en/doctors/Reservation/create?
        workingHourID=${createAppointmentButtonClick.workingHourID}
        &doctorId=${createAppointmentButtonClick.doctorId}
        &clinicId=${createAppointmentButtonClick.clinicId}
        &userId=${createAppointmentButtonClick.userId}`).replace(/\s+/g, "")
      );
    }
  }, [createAppointmentButtonClick]);
  return (
    <div
      className={
        props.pageName === "show-all-doctors"
          ? "w-[40%] flex flex-row bg-gray-200 gap-x-4 overflow-hidden"
          : "w-full max-h-[1000px] flex flex-row bg-gray-200 gap-x-4 overflow-hidden"
      }
    >
      <div
        className="w-[15%] max-h-[1000px] flex justify-center items-center hover:cursor-pointer"
        onClick={() => {
          console.log(firstDate.getDate());

          if (
            firstDate.getDate() > new Date().getDate() &&
            firstDate.getFullYear() === new Date().getFullYear() &&
            firstDate.getMonth() === new Date().getMonth()
          ) {
            setTimeout(() => {
              setisDisableRightButtonForSliding(false);
              setIsSlidingInRight(true);
            }, 100);
          } else if (
            firstDate.getFullYear() === new Date().getFullYear() &&
            firstDate.getMonth() > new Date().getMonth()
          ) {
            setTimeout(() => {
              setisDisableRightButtonForSliding(false);
              setIsSlidingInRight(true);
            }, 100);
          } else {
            setisDisableRightButtonForSliding(true);
          }
        }}
      >
        <div className="bg-white w-[70%] h-10 rounded-md border border-gray-100 flex justify-center items-center hover:cursor-pointer">
          <IoIosArrowBack
            className={
              isDisableRightButtonForSliding
                ? "text-3xl text-blue-500 opacity-50"
                : "text-3xl text-blue-500 opacity-100"
            }
          />
        </div>
      </div>
      {isDateChangeLoading ? (
        <div
          className={
            props.pageName === "doctor-details"
              ? "w-[65%] h-[350px] flex justify-center items-center bg-transparent"
              : "w-[65%] h-full flex justify-center items-center bg-transparent"
          }
        >
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="https://cors-anywhere.herokuapp.com/www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      ) : isSlidingInLeft ? (
        <SlideInLeft className="w-[65%]  flex flex-row gap-x-[5%] max-h-[1000px]">
          <div
            className="w-[30%] h-full flex flex-col py-5"
            ref={SlideInLeftFirstDate}
          >
            <header className="w-full h-10 bg-blue-600 text-white text-md rounded-tr-md rounded-tl-md flex justify-center items-center">
              {firstDate.getDate() === new Date().getDate()
                ? "Today"
                : firstDate.toDateString().slice(0, 8)}
            </header>

            <section
              className={
                "bg-white min-h-60 py-8 px-8 flex flex-col gap-4 justify-center items-center"
              }
            >
              {(() => {
                const matchingAppointments = props.DoctorAppointements.filter(
                  (appointment) =>
                    new Date(appointment.workingDate).toDateString() ===
                    firstDate.toDateString()
                );

                if (matchingAppointments.length === 0) {
                  return (
                    <div
                      key={"No Available Appointments First Date"}
                      id={"No Available Appointments First Date"}
                      className="font-sans font-normal text-base text-gray-500 flex flex-col gap-y-4 justify-center items-center"
                    >
                      <span className="space-x-4">No Available</span>
                      <span>Appointments</span>
                    </div>
                  );
                }

                return matchingAppointments.map((appointment) => (
                  <div
                    key={appointment.workingDate}
                    id={appointment.workingDate}
                    className="font-sans font-normal text-base text-blue-600 flex flex-col gap-1 hover:cursor-pointer transition-all duration-75 rounded-md hover:text-white hover:bg-blue-600 transition-all duration-75 rounded-md hover:text-white hover:bg-blue-600"
                    onClick={() => {
                      if (
                        store.getState().auth.userToken !== null &&
                        store.getState().auth.user?.roles === "User"
                      ) {
                        if (props.pageName === "doctor-details") {
                          props.sendFromChildToSecondParent(
                            appointment.workingHourID
                          );
                        } else if (props.pageName === "show-all-doctors") {
                          setCreateAppointmentButtonClick({
                            clicked: true,
                            workingHourID: appointment.workingHourID,
                            doctorId: props.doctorId,
                            clinicId: props.clinicId,
                            userId:
                              store.getState().auth.user?.id !== undefined
                                ? store.getState().auth.user?.id
                                : 0,
                          });
                        }
                      } else {
                        location.replace("/login");
                      }
                    }}
                  >
                    <span className="flex flex-row gap-x-4">
                      <span>From</span>
                      <span className="font-bold">
                        {convertTime(appointment.startTime)}
                      </span>
                    </span>
                    <span className="flex flex-row gap-x-4">
                      <span className="ml-[17px]">To</span>
                      <span className="font-bold">
                        {convertTime(appointment.endTime)}
                      </span>
                    </span>
                    <span className="hidden" id="hidden">
                      <span>{appointment.status}</span>
                      <span>{appointment.workingDay}</span>
                      <span>{appointment.appointmentCount}</span>
                      <span>{appointment.maxAppointments}</span>
                    </span>
                  </div>
                ));
              })()}
            </section>

            <footer className="w-full h-10 bg-red-600 text-white text-md rounded-br-md rounded-bl-md flex justify-center items-center">
              Book
            </footer>
          </div>

          <div className="w-[30%] h-full py-5" ref={SlideInLeftSecondDate}>
            <header className="w-full h-10 bg-blue-600 text-white rounded-tr-md rounded-tl-md flex justify-center items-center">
              {secondDate.getDate() === new Date().getDate()
                ? "Tommorrow"
                : secondDate.toDateString().slice(0, 8)}
            </header>
            <section className="bg-white min-h-60 py-8 px-8 flex flex-col gap-4 justify-center items-center">
              {(() => {
                const matchingAppointments = props.DoctorAppointements.filter(
                  (appointment) =>
                    new Date(appointment.workingDate).toDateString() ===
                    secondDate.toDateString()
                );

                if (matchingAppointments.length === 0) {
                  return (
                    <div
                      key={"No Available Appointments First Date"}
                      id={"No Available Appointments First Date"}
                      className="font-sans font-normal text-base text-gray-500 flex flex-col gap-y-4"
                    >
                      <span className="space-x-4">No Available</span>
                      <span>Appointments</span>
                    </div>
                  );
                }

                return matchingAppointments.map((appointment) => (
                  <div
                    key={appointment.workingDate}
                    id={appointment.workingDate}
                    onClick={() => {
                      if (
                        store.getState().auth.userToken !== null &&
                        store.getState().auth.user?.roles === "User"
                      ) {
                        if (props.pageName === "doctor-details") {
                          props.sendFromChildToSecondParent(
                            appointment.workingHourID
                          );
                        } else if (props.pageName === "show-all-doctors") {
                          setCreateAppointmentButtonClick({
                            clicked: true,
                            workingHourID: appointment.workingHourID,
                            doctorId: props.doctorId,
                            clinicId: props.clinicId,
                            userId:
                              store.getState().auth.user?.id !== undefined
                                ? store.getState().auth.user?.id
                                : 0,
                          });
                        }
                      } else {
                        location.replace("/login");
                      }
                    }}
                    className="font-sans font-normal text-base text-blue-600 flex flex-col gap-1 hover:cursor-pointer transition-all duration-75 rounded-md hover:text-white hover:bg-blue-600"
                  >
                    <span className="flex flex-row gap-x-4">
                      <span>From</span>
                      <span className="font-bold">
                        {convertTime(appointment.startTime)}
                      </span>
                    </span>
                    <span className="flex flex-row gap-x-4">
                      <span className="ml-[17px]">To</span>
                      <span className="font-bold">
                        {convertTime(appointment.endTime)}
                      </span>
                    </span>
                    <span className="hidden" id="hidden">
                      <span>{appointment.status}</span>
                      <span>{appointment.workingDay}</span>
                      <span>{appointment.appointmentCount}</span>
                      <span>{appointment.maxAppointments}</span>
                    </span>
                  </div>
                ));
              })()}
            </section>
            <footer className="w-full h-10 bg-red-600 text-white text-md rounded-br-md rounded-bl-md flex justify-center items-center">
              Book
            </footer>
          </div>
          <div className="w-[30%] h-full py-5" ref={SlideInLeftThirdDate}>
            <header className="w-full h-10 bg-blue-600 text-white text-md rounded-tr-md rounded-tl-md flex justify-center items-center">
              {thirdDate.toDateString().slice(0, 8)}
            </header>
            <section className="bg-white min-h-60 py-8 px-8 flex flex-col gap-4 justify-center items-center">
              {(() => {
                const matchingAppointments = props.DoctorAppointements.filter(
                  (appointment) =>
                    new Date(appointment.workingDate).toDateString() ===
                    thirdDate.toDateString()
                );

                if (matchingAppointments.length === 0) {
                  return (
                    <div
                      key={"No Available Appointments First Date"}
                      id={"No Available Appointments First Date"}
                      className="font-sans font-normal text-base text-gray-500 flex flex-col gap-y-4"
                    >
                      <span className="space-x-4">No Available</span>
                      <span>Appointments</span>
                    </div>
                  );
                }

                return matchingAppointments.map((appointment) => (
                  <div
                    key={appointment.workingDate}
                    id={appointment.workingDate}
                    onClick={() => {
                      if (
                        store.getState().auth.userToken !== null &&
                        store.getState().auth.user?.roles === "User"
                      ) {
                        if (props.pageName === "doctor-details") {
                          props.sendFromChildToSecondParent(
                            appointment.workingHourID
                          );
                        } else if (props.pageName === "show-all-doctors") {
                          setCreateAppointmentButtonClick({
                            clicked: true,
                            workingHourID: appointment.workingHourID,
                            doctorId: props.doctorId,
                            clinicId: props.clinicId,
                            userId:
                              store.getState().auth.user?.id !== undefined
                                ? store.getState().auth.user?.id
                                : 0,
                          });
                        }
                      } else {
                        location.replace("/login");
                      }
                    }}
                    className="font-sans font-normal text-base text-blue-600 flex flex-col gap-1 hover:cursor-pointer transition-all duration-75 rounded-md hover:text-white hover:bg-blue-600"
                  >
                    <span className="flex flex-row gap-x-4">
                      <span>From</span>
                      <span className="font-bold">
                        {convertTime(appointment.startTime)}
                      </span>
                    </span>
                    <span className="flex flex-row gap-x-4">
                      <span className="ml-[17px]">To</span>
                      <span className="font-bold">
                        {convertTime(appointment.endTime)}
                      </span>
                    </span>
                    <span className="hidden" id="hidden">
                      <span>{appointment.status}</span>
                      <span>{appointment.workingDay}</span>
                      <span>{appointment.appointmentCount}</span>
                      <span>{appointment.maxAppointments}</span>
                    </span>
                  </div>
                ));
              })()}
            </section>
            <footer className="w-full h-10 bg-red-600 text-white text-md rounded-br-md rounded-bl-md flex justify-center items-center">
              Book
            </footer>
          </div>
        </SlideInLeft>
      ) : isSlidingInRight ? (
        <SlideInRight className="w-[65%]  flex flex-row gap-x-[5%] max-h-[1000px]">
          <div
            className="w-[30%] h-full flex flex-col py-5"
            ref={SlideInLeftFirstDate}
          >
            <header className="w-full h-10 bg-blue-600 text-white text-md rounded-tr-md rounded-tl-md flex justify-center items-center">
              {firstDate.getDate() === new Date().getDate()
                ? "Today"
                : firstDate.toDateString().slice(0, 8)}
            </header>

            <section className="bg-white min-h-60 py-8 px-8 flex flex-col gap-4 justify-center items-center">
              {(() => {
                const matchingAppointments = props.DoctorAppointements.filter(
                  (appointment) =>
                    new Date(appointment.workingDate).toDateString() ===
                    firstDate.toDateString()
                );

                if (matchingAppointments.length === 0) {
                  return (
                    <div
                      key={"No Available Appointments First Date"}
                      id={"No Available Appointments First Date"}
                      className="font-sans font-normal text-base text-gray-500 flex flex-col gap-y-4"
                    >
                      <span className="space-x-4">No Available</span>
                      <span>Appointments</span>
                    </div>
                  );
                }

                return matchingAppointments.map((appointment) => (
                  <div
                    key={appointment.workingDate}
                    id={appointment.workingDate}
                    onClick={() => {
                      if (
                        store.getState().auth.userToken !== null &&
                        store.getState().auth.user?.roles === "User"
                      ) {
                        if (props.pageName === "doctor-details") {
                          props.sendFromChildToSecondParent(
                            appointment.workingHourID
                          );
                        } else if (props.pageName === "show-all-doctors") {
                          setCreateAppointmentButtonClick({
                            clicked: true,
                            workingHourID: appointment.workingHourID,
                            doctorId: props.doctorId,
                            clinicId: props.clinicId,
                            userId:
                              store.getState().auth.user?.id !== undefined
                                ? store.getState().auth.user?.id
                                : 0,
                          });
                        }
                      } else {
                        location.replace("/login");
                      }
                    }}
                    className="font-sans font-normal text-base text-blue-600 flex flex-col gap-1 hover:cursor-pointer transition-all duration-75 rounded-md hover:text-white hover:bg-blue-600"
                  >
                    <span className="flex flex-row gap-x-4">
                      <span>From</span>
                      <span className="font-bold">
                        {convertTime(appointment.startTime)}
                      </span>
                    </span>
                    <span className="flex flex-row gap-x-4">
                      <span className="ml-[17px]">To</span>
                      <span className="font-bold">
                        {convertTime(appointment.endTime)}
                      </span>
                    </span>
                    <span className="hidden" id="hidden">
                      <span>{appointment.status}</span>
                      <span>{appointment.workingDay}</span>
                      <span>{appointment.appointmentCount}</span>
                      <span>{appointment.maxAppointments}</span>
                    </span>
                  </div>
                ));
              })()}
            </section>

            <footer className="w-full h-10 bg-red-600 text-white text-md rounded-br-md rounded-bl-md flex justify-center items-center">
              Book
            </footer>
          </div>

          <div className="w-[30%] h-full py-5" ref={SlideInLeftSecondDate}>
            <header className="w-full h-10 bg-blue-600 text-white rounded-tr-md rounded-tl-md flex justify-center items-center">
              {secondDate.getDate() === new Date().getDate()
                ? "Tommorrow"
                : secondDate.toDateString().slice(0, 8)}
            </header>
            <section className="bg-white min-h-60 py-8 px-8 flex flex-col gap-4 justify-center items-center">
              {(() => {
                const matchingAppointments = props.DoctorAppointements.filter(
                  (appointment) =>
                    new Date(appointment.workingDate).toDateString() ===
                    secondDate.toDateString()
                );

                if (matchingAppointments.length === 0) {
                  return (
                    <div
                      key={"No Available Appointments First Date"}
                      id={"No Available Appointments First Date"}
                      className="font-sans font-normal text-base text-gray-500 flex flex-col gap-y-4"
                    >
                      <span className="space-x-4">No Available</span>
                      <span>Appointments</span>
                    </div>
                  );
                }

                return matchingAppointments.map((appointment) => (
                  <div
                    key={appointment.workingDate}
                    id={appointment.workingDate}
                    onClick={() => {
                      if (
                        store.getState().auth.userToken !== null &&
                        store.getState().auth.user?.roles === "User"
                      ) {
                        if (props.pageName === "doctor-details") {
                          props.sendFromChildToSecondParent(
                            appointment.workingHourID
                          );
                        } else if (props.pageName === "show-all-doctors") {
                          setCreateAppointmentButtonClick({
                            clicked: true,
                            workingHourID: appointment.workingHourID,
                            doctorId: props.doctorId,
                            clinicId: props.clinicId,
                            userId:
                              store.getState().auth.user?.id !== undefined
                                ? store.getState().auth.user?.id
                                : 0,
                          });
                        }
                      } else {
                        location.replace("/login");
                      }
                    }}
                    className="font-sans font-normal text-base text-blue-600 flex flex-col gap-1 hover:cursor-pointer transition-all duration-75 rounded-md hover:text-white hover:bg-blue-600"
                  >
                    <span className="flex flex-row gap-x-4">
                      <span>From</span>
                      <span className="font-bold">
                        {convertTime(appointment.startTime)}
                      </span>
                    </span>
                    <span className="flex flex-row gap-x-4">
                      <span className="ml-[17px]">To</span>
                      <span className="font-bold">
                        {convertTime(appointment.endTime)}
                      </span>
                    </span>
                    <span className="hidden" id="hidden">
                      <span>{appointment.status}</span>
                      <span>{appointment.workingDay}</span>
                      <span>{appointment.appointmentCount}</span>
                      <span>{appointment.maxAppointments}</span>
                    </span>
                  </div>
                ));
              })()}
            </section>
            <footer className="w-full h-10 bg-red-600 text-white text-md rounded-br-md rounded-bl-md flex justify-center items-center">
              Book
            </footer>
          </div>
          <div className="w-[30%] h-full py-5" ref={SlideInLeftThirdDate}>
            <header className="w-full h-10 bg-blue-600 text-white text-md rounded-tr-md rounded-tl-md flex justify-center items-center">
              {thirdDate.toDateString().slice(0, 8)}
            </header>
            <section className="bg-white min-h-60 py-8 px-8 flex flex-col gap-4 justify-center items-center">
              {(() => {
                const matchingAppointments = props.DoctorAppointements.filter(
                  (appointment) =>
                    new Date(appointment.workingDate).toDateString() ===
                    thirdDate.toDateString()
                );

                if (matchingAppointments.length === 0) {
                  return (
                    <div
                      key={"No Available Appointments First Date"}
                      id={"No Available Appointments First Date"}
                      className="font-sans font-normal text-base text-gray-500 flex flex-col gap-y-4"
                    >
                      <span className="space-x-4">No Available</span>
                      <span>Appointments</span>
                    </div>
                  );
                }

                return matchingAppointments.map((appointment) => (
                  <div
                    key={appointment.workingDate}
                    id={appointment.workingDate}
                    onClick={() => {
                      if (
                        store.getState().auth.userToken !== null &&
                        store.getState().auth.user?.roles === "User"
                      ) {
                        if (props.pageName === "doctor-details") {
                          props.sendFromChildToSecondParent(
                            appointment.workingHourID
                          );
                        } else if (props.pageName === "show-all-doctors") {
                          setCreateAppointmentButtonClick({
                            clicked: true,
                            workingHourID: appointment.workingHourID,
                            doctorId: props.doctorId,
                            clinicId: props.clinicId,
                            userId:
                              store.getState().auth.user?.id !== undefined
                                ? store.getState().auth.user?.id
                                : 0,
                          });
                        }
                      } else {
                        location.replace("/login");
                      }
                    }}
                    className="font-sans font-normal text-base text-blue-600 flex flex-col gap-1 hover:cursor-pointer transition-all duration-75 rounded-md hover:text-white hover:bg-blue-600"
                  >
                    <span className="flex flex-row gap-x-4">
                      <span>From</span>
                      <span className="font-bold">
                        {convertTime(appointment.startTime)}
                      </span>
                    </span>
                    <span className="flex flex-row gap-x-4">
                      <span className="ml-[17px]">To</span>
                      <span className="font-bold">
                        {convertTime(appointment.endTime)}
                      </span>
                    </span>
                    <span className="hidden" id="hidden">
                      <span>{appointment.status}</span>
                      <span>{appointment.workingDay}</span>
                      <span>{appointment.appointmentCount}</span>
                      <span>{appointment.maxAppointments}</span>
                    </span>
                  </div>
                ));
              })()}
            </section>
            <footer className="w-full h-10 bg-red-600 text-white text-md rounded-br-md rounded-bl-md flex justify-center items-center">
              Book
            </footer>
          </div>
        </SlideInRight>
      ) : (
        <div className="w-[65%]  flex flex-row gap-x-[5%] max-h-[1000px]">
          <div
            className="w-[30%] h-full flex flex-col py-5"
            ref={SlideInLeftFirstDate}
          >
            <header className="w-full h-10 bg-blue-600 text-white text-md rounded-tr-md rounded-tl-md flex justify-center items-center">
              {firstDate.getDate() === new Date().getDate()
                ? "Today"
                : firstDate.toDateString().slice(0, 8)}
            </header>

            <section className="bg-white min-h-60 py-8 px-8 flex flex-col gap-4 justify-center items-center">
              {(() => {
                const matchingAppointments = props.DoctorAppointements.filter(
                  (appointment) =>
                    new Date(appointment.workingDate).toDateString() ===
                    firstDate.toDateString()
                );

                if (matchingAppointments.length === 0) {
                  return (
                    <div
                      key={"No Available Appointments First Date"}
                      id={"No Available Appointments First Date"}
                      className="font-sans font-normal text-base text-gray-500 flex flex-col gap-y-4"
                    >
                      <span className="space-x-4">No Available</span>
                      <span>Appointments</span>
                    </div>
                  );
                }

                return matchingAppointments.map((appointment) => (
                  <div
                    key={appointment.workingDate}
                    id={appointment.workingDate}
                    onClick={() => {
                      if (
                        store.getState().auth.userToken !== null &&
                        store.getState().auth.user?.roles === "User"
                      ) {
                        if (props.pageName === "doctor-details") {
                          props.sendFromChildToSecondParent(
                            appointment.workingHourID
                          );
                        } else if (props.pageName === "show-all-doctors") {
                          setCreateAppointmentButtonClick({
                            clicked: true,
                            workingHourID: appointment.workingHourID,
                            doctorId: props.doctorId,
                            clinicId: props.clinicId,
                            userId:
                              store.getState().auth.user?.id !== undefined
                                ? store.getState().auth.user?.id
                                : 0,
                          });
                        }
                      } else {
                        location.replace("/login");
                      }
                    }}
                    className="font-sans font-normal text-base text-blue-600 flex flex-col gap-1 hover:cursor-pointer transition-all duration-75 rounded-md hover:text-white hover:bg-blue-600"
                  >
                    <span className="flex flex-row gap-x-4">
                      <span>From</span>
                      <span className="font-bold">
                        {convertTime(appointment.startTime)}
                      </span>
                    </span>
                    <span className="flex flex-row gap-x-4">
                      <span className="ml-[17px]">To</span>
                      <span className="font-bold">
                        {convertTime(appointment.endTime)}
                      </span>
                    </span>
                    <span className="hidden" id="hidden">
                      <span>{appointment.status}</span>
                      <span>{appointment.workingDay}</span>
                      <span>{appointment.appointmentCount}</span>
                      <span>{appointment.maxAppointments}</span>
                    </span>
                  </div>
                ));
              })()}
            </section>

            <footer className="w-full h-10 bg-red-600 text-white text-md rounded-br-md rounded-bl-md flex justify-center items-center">
              Book
            </footer>
          </div>

          <div className="w-[30%] h-full py-5" ref={SlideInLeftSecondDate}>
            <header className="w-full h-10 bg-blue-600 text-white rounded-tr-md rounded-tl-md flex justify-center items-center">
              {secondDate.getDate() === new Date().getDate()
                ? "Tommorrow"
                : secondDate.toDateString().slice(0, 8)}
            </header>
            <section className="bg-white min-h-60 py-8 px-8 flex flex-col gap-4 justify-center items-center">
              {(() => {
                const matchingAppointments = props.DoctorAppointements.filter(
                  (appointment) =>
                    new Date(appointment.workingDate).toDateString() ===
                    secondDate.toDateString()
                );

                if (matchingAppointments.length === 0) {
                  return (
                    <div
                      key={"No Available Appointments First Date"}
                      id={"No Available Appointments First Date"}
                      className="font-sans font-normal text-base text-gray-500 flex flex-col gap-y-4"
                    >
                      <span className="space-x-4">No Available</span>
                      <span>Appointments</span>
                    </div>
                  );
                }

                return matchingAppointments.map((appointment) => (
                  <div
                    key={appointment.workingDate}
                    id={appointment.workingDate}
                    onClick={() => {
                      if (
                        store.getState().auth.userToken !== null &&
                        store.getState().auth.user?.roles === "User"
                      ) {
                        if (props.pageName === "doctor-details") {
                          props.sendFromChildToSecondParent(
                            appointment.workingHourID
                          );
                        } else if (props.pageName === "show-all-doctors") {
                          setCreateAppointmentButtonClick({
                            clicked: true,
                            workingHourID: appointment.workingHourID,
                            doctorId: props.doctorId,
                            clinicId: props.clinicId,
                            userId:
                              store.getState().auth.user?.id !== undefined
                                ? store.getState().auth.user?.id
                                : 0,
                          });
                        }
                      } else {
                        location.replace("/login");
                      }
                    }}
                    className="font-sans font-normal text-base text-blue-600 flex flex-col gap-1 hover:cursor-pointer transition-all duration-75 rounded-md hover:text-white hover:bg-blue-600"
                  >
                    <span className="flex flex-row gap-x-4">
                      <span>From</span>
                      <span className="font-bold">
                        {convertTime(appointment.startTime)}
                      </span>
                    </span>
                    <span className="flex flex-row gap-x-4">
                      <span className="ml-[17px]">To</span>
                      <span className="font-bold">
                        {convertTime(appointment.endTime)}
                      </span>
                    </span>
                    <span className="hidden" id="hidden">
                      <span>{appointment.status}</span>
                      <span>{appointment.workingDay}</span>
                      <span>{appointment.appointmentCount}</span>
                      <span>{appointment.maxAppointments}</span>
                    </span>
                  </div>
                ));
              })()}
            </section>
            <footer className="w-full h-10 bg-red-600 text-white text-md rounded-br-md rounded-bl-md flex justify-center items-center">
              Book
            </footer>
          </div>
          <div className="w-[30%] h-full py-5" ref={SlideInLeftThirdDate}>
            <header className="w-full h-10 bg-blue-600 text-white text-md rounded-tr-md rounded-tl-md flex justify-center items-center">
              {thirdDate.toDateString().slice(0, 8)}
            </header>
            <section className="bg-white min-h-60 py-8 px-8 flex flex-col gap-4 justify-center items-center">
              {(() => {
                const matchingAppointments = props.DoctorAppointements.filter(
                  (appointment) =>
                    new Date(appointment.workingDate).toDateString() ===
                    thirdDate.toDateString()
                );

                if (matchingAppointments.length === 0) {
                  return (
                    <div
                      key={"No Available Appointments First Date"}
                      id={"No Available Appointments First Date"}
                      className="font-sans font-normal text-base text-gray-500 flex flex-col gap-y-4"
                    >
                      <span className="space-x-4">No Available</span>
                      <span>Appointments</span>
                    </div>
                  );
                }

                return matchingAppointments.map((appointment) => (
                  <div
                    key={appointment.workingDate}
                    id={appointment.workingDate}
                    onClick={() => {
                      if (
                        store.getState().auth.userToken !== null &&
                        store.getState().auth.user?.roles === "User"
                      ) {
                        if (props.pageName === "doctor-details") {
                          props.sendFromChildToSecondParent(
                            appointment.workingHourID
                          );
                        } else if (props.pageName === "show-all-doctors") {
                          setCreateAppointmentButtonClick({
                            clicked: true,
                            workingHourID: appointment.workingHourID,
                            doctorId: props.doctorId,
                            clinicId: props.clinicId,
                            userId:
                              store.getState().auth.user?.id !== undefined
                                ? store.getState().auth.user?.id
                                : 0,
                          });
                        }
                      } else {
                        location.replace("/login");
                      }
                    }}
                    className="font-sans font-normal text-base text-blue-600 flex flex-col gap-1 hover:cursor-pointer transition-all duration-75 rounded-md hover:text-white hover:bg-blue-600"
                  >
                    <span className="flex flex-row gap-x-4">
                      <span>From</span>
                      <span className="font-bold">
                        {convertTime(appointment.startTime)}
                      </span>
                    </span>
                    <span className="flex flex-row gap-x-4">
                      <span className="ml-[17px]">To</span>
                      <span className="font-bold">
                        {convertTime(appointment.endTime)}
                      </span>
                    </span>
                    <span className="hidden" id="hidden">
                      <span>{appointment.status}</span>
                      <span>{appointment.workingDay}</span>
                      <span>{appointment.appointmentCount}</span>
                      <span>{appointment.maxAppointments}</span>
                    </span>
                  </div>
                ));
              })()}
            </section>
            <footer className="w-full h-10 bg-red-600 text-white text-md rounded-br-md rounded-bl-md flex justify-center items-center">
              Book
            </footer>
          </div>
        </div>
      )}
      <div className="w-[15%] max-h-[1000px] flex justify-center items-center hover:cursor-pointer">
        <div
          className="bg-white w-[70%] h-10 rounded-md border border-gray-100 flex justify-center items-center hover:cursor-pointer"
          onClick={() => {
            setIsDateChangeLoading(true);
            setIsSlidingInLeft(true);
          }}
        >
          <IoIosArrowForward className="text-3xl text-blue-500" />
        </div>
      </div>
    </div>
  );
}

export default DoctorAppointemnetscardForCheckOut;
