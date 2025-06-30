"use client";

import { redirect } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosArrowBack } from "react-icons/io";
import { FaInfo } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { TfiEmail } from "react-icons/tfi";
import { FaBriefcaseMedical } from "react-icons/fa";
import * as Yup from "yup";
import { useFormik } from "formik";
import { convertTime } from "@/components/Doctors/DoctorAppointemnetscardForCheckOut";
import { store } from "@/lib/store";
import { Toast } from "@/sweetAlert2";
type Props = {
  workingHourID: number;
  doctorId: number;
  clinicId: number;
  userId?: number;
};
interface WorkingHour {
  workingHourID: number;
  workingDate: string;
  startTime: string;
  endTime: string;
}

interface RawService {
  id: number;
  price: number;
  serviceName: string;
}

interface DoctorModel {
  profileImage: string;
  doctorName: string;
  price: number;
  specialization: string;
  workingDate: string;
  startTime: string;
  endTime: string;
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
function DoctorReservation(props: Props) {
  const [doctorReservation, setDoctorReservation] = useState<DoctorModel>({
    profileImage: "",
    doctorName: "",
    price: 0,
    specialization: "",
    workingDate: "",
    startTime: "",
    endTime: "",
  });
  const [doctorServices, setDoctorServices] = useState<
    ServiceProvidedByDoctor[]
  >([]);
  const [chooseServices, setChooseServices] = useState<boolean>(false);
  const [selectServices, setSelectServices] = useState<
    ServiceProvidedByDoctor[]
  >([]);
  const [totalPrice, setTotalPrice] = useState<number>(doctorReservation.price);
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
        doctorReservation.price
      );
      setTotalPrice(servicesTotal);
    } else {
      setTotalPrice(doctorReservation.price);
    }
  }, [appointmentDetails, doctorReservation.price]);
  useEffect(() => {
    async function fetchData() {
      try {
        const firstResponse = await fetch(
          `https://citypulse.runasp.net/api/Clinic/DoctorsByClinicId?clinicId=${props.clinicId}`
        );
        const data = await firstResponse.json();
        if (
          Array.isArray(data?.workingHour?.$values) &&
          props.workingHourID != null
        ) {
          const workingHourObject = data.workingHour.$values.find(
            (hour:WorkingHour) => String(hour.workingHourID) === String(props.workingHourID)
          );
          console.log(workingHourObject);

          const doctorReservation: DoctorModel = {
            profileImage: data.profileImage,
            doctorName: data.doctorName,
            price: data.price,
            specialization: data.specialization,
            workingDate: workingHourObject.workingDate,
            startTime: workingHourObject.startTime,
            endTime: workingHourObject.endTime,
          };
          console.log(doctorReservation);
          setDoctorReservation(doctorReservation);
          const secondResponse = await fetch(
            `https://citypulse.runasp.net/api/Clinic/${props.clinicId}/services`
          );
          const fetchedData = await secondResponse.json();
          const doctorServices: ServiceProvidedByDoctor[] =
            fetchedData.$values.map((data:RawService) => {
              return {
                id: data.id,
                price: data.price,
                serviceName: data.serviceName,
              };
            });
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
        debugger;
        const createAppointment: CreateAppointmentModel = {
          workingHourId: props.workingHourID,
          userId: props.userId,
          clinicId: props.clinicId,
          totalPrice: totalPrice > doctorReservation.price ? totalPrice : 0,
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
                amount: totalPrice > doctorReservation.price ? totalPrice : 0,
                paymentMethod: "Manual",
                status: "Pending",
                transactionType: "Appointment",
                referenceId: AppointmentId,
              }),
            }
          );
          if (thirdResponse.ok) {
            Toast.fire({
              title: `You have an appointment with ${doctorReservation.doctorName}!`,
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
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <div className="bg-gray-200">
      <header className="w-full h-40 md:h-20 bg-blue-600 flex flex-col md:mb-4">
        <section className="flex flex-row justify-between items-center pr-5 h-1/2 md:h-full">
          <div className="text-white flex items-center ml-4">
            <div className="w-10 h-10 rounded-full">
              <img
                className="rounded-full"
                src={"/assets/Images/logo/services-provider-logo.jpg"}
                alt={"services-provider-logo"}
              />
            </div>
            <h3
              onClick={() => {
                redirect("/");
              }}
              className=" hover:cursor-pointer ml-2 text-2xl font-serif italic"
            >
              City Guide
            </h3>
          </div>
          <div className="text-white text-3xl md:hidden">
            <GiHamburgerMenu />
          </div>
        </section>
        <section className="border-t border-white h-1/2 md:hidden">
          <div className="pl-3 w-2/5 h-full bg-transparent flex flex-row items-center gap-x-3 text-white">
            <IoIosArrowBack className="text-3xl" />
            <div className="w-10 h-10 rounded-full border border-white">
              <img
                className="w-full h-full rounded-full"
                src={doctorReservation.profileImage}
                alt={"Doctor Profile"}
              />
            </div>
            <pre className="text-white flex flex-col gap-y-0.5">
              <span>{doctorReservation.doctorName}</span>
              <span>{doctorReservation.specialization}</span>
            </pre>
          </div>
        </section>
      </header>
      <section
        className={
          chooseServices
            ? "bg-gray-200 w-full md:pt-10 px-5 h-[728px] md:h-[1328px] pt-4 pb-10 overflow-scroll"
            : "bg-gray-200 w-full md:pt-10 px-5 h-[600px] md:h-[1200px] pt-4 pb-10 overflow-scroll"
        }
      >
        <div className="w-full lg:w-[96%] lg:mx-auto h-full bg-transparent flex flex-col gap-y-5 rounded-md lg:flex lg:flex-row lg:gap-x-5 xl:gap-x-12">
          <header className="h-1/6 lg:w-[60%] xl:w-[40%] md:h-[20%] md:flex-wrap bg-white rounded-md md:rounded-2xl flex flex-col gap-y-4 justify-center items-center md:justify-start md:items-start lg:mt-10">
            <section className="hidden md:w-[70%] lg:w-full md:pl-10 md:h-1/2 md:flex md:flex-row md:gap-x-5 md:items-center">
              <div className="w-40 h-40 rounded-full border border-gray-200 -translate-y-8 lg:border lg:border-gray-700">
                <img
                  className="w-full h-full rounded-full"
                  src={`https://citypulse.runasp.net/images/doctors${doctorReservation.profileImage}`}
                  alt={"Doctor Profile"}
                />
              </div>
              <div className="flex flex-col gap-y-4 font-sans">
                <section className="flex flex-row gap-x-2 justify-center items-center font-semibold text-2xl text-gray-400 ">
                  <span className="text-lg">Doctor</span>
                  <span>{doctorReservation.doctorName}</span>
                </section>
                <span className="font-semibold text-xl text-gray-500">
                  {doctorReservation.specialization}
                </span>
              </div>
            </section>
            <section className="flex flex-row gap-1 text-gray-600 text-lg md:hidden">
              <span>
                {new Date(doctorReservation.workingDate) === new Date()
                  ? "Today"
                  : new Date(doctorReservation.workingDate) ===
                    new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000)
                  ? "Tomorrow"
                  : new Date(doctorReservation.workingDate).getDay() === 0
                  ? "Sunday"
                  : new Date(doctorReservation.workingDate).getDay() === 1
                  ? "Monday"
                  : new Date(doctorReservation.workingDate).getDay() === 2
                  ? "Tuesday"
                  : new Date(doctorReservation.workingDate).getDay() === 3
                  ? "Wednesday"
                  : new Date(doctorReservation.workingDate).getDay() === 4
                  ? "Thursday"
                  : new Date(doctorReservation.workingDate).getDay() === 5
                  ? "Friday"
                  : new Date(doctorReservation.workingDate).getDay() === 6
                  ? "Saturday"
                  : null}
              </span>

              <span>
                {" "}
                {new Date(doctorReservation.workingDate).getMonth() === 0
                  ? "January"
                  : new Date(doctorReservation.workingDate).getMonth() === 1
                  ? "February"
                  : new Date(doctorReservation.workingDate).getMonth() === 2
                  ? "March"
                  : new Date(doctorReservation.workingDate).getMonth() === 3
                  ? "April"
                  : new Date(doctorReservation.workingDate).getMonth() === 4
                  ? "May"
                  : new Date(doctorReservation.workingDate).getMonth() === 5
                  ? "June"
                  : new Date(doctorReservation.workingDate).getMonth() === 6
                  ? "July"
                  : new Date(doctorReservation.workingDate).getMonth() === 7
                  ? "August"
                  : new Date(doctorReservation.workingDate).getMonth() === 8
                  ? "September"
                  : new Date(doctorReservation.workingDate).getMonth() === 9
                  ? "October"
                  : new Date(doctorReservation.workingDate).getMonth() === 10
                  ? "November"
                  : new Date(doctorReservation.workingDate).getMonth() === 11
                  ? "December"
                  : null}
              </span>
              <span className="space-x-3">
                {convertTime(doctorReservation.startTime)}
              </span>
              <span>-</span>
              <span className="space-x-3">
                {convertTime(doctorReservation.endTime)}
              </span>
            </section>
            <section className="flex flex-row gap-x-1 font-sans font-bold text-lg  text-gray-700 md:hidden">
              <span>Appointment</span>
              <span>reservation</span>
            </section>
            <section className="hidden md:flex md:flex-row md:gap-x-1 md:justify-start md:pl-10 md:items-center md:h-[30%] md:w-full md:bg-gray-100">
              <section className="flex flex-row gap-1 text-gray-500 text-xl">
                <span>
                  {new Date(doctorReservation.workingDate) === new Date()
                    ? "Today"
                    : new Date(doctorReservation.workingDate) ===
                      new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000)
                    ? "Tomorrow"
                    : new Date(doctorReservation.workingDate).getDay() === 0
                    ? "Sunday"
                    : new Date(doctorReservation.workingDate).getDay() === 1
                    ? "Monday"
                    : new Date(doctorReservation.workingDate).getDay() === 2
                    ? "Tuesday"
                    : new Date(doctorReservation.workingDate).getDay() === 3
                    ? "Wednesday"
                    : new Date(doctorReservation.workingDate).getDay() === 4
                    ? "Thursday"
                    : new Date(doctorReservation.workingDate).getDay() === 5
                    ? "Friday"
                    : new Date(doctorReservation.workingDate).getDay() === 6
                    ? "Saturday"
                    : null}
                </span>

                <span>
                  {" "}
                  {new Date(doctorReservation.workingDate).getMonth() === 0
                    ? "January"
                    : new Date(doctorReservation.workingDate).getMonth() === 1
                    ? "February"
                    : new Date(doctorReservation.workingDate).getMonth() === 2
                    ? "March"
                    : new Date(doctorReservation.workingDate).getMonth() === 3
                    ? "April"
                    : new Date(doctorReservation.workingDate).getMonth() === 4
                    ? "May"
                    : new Date(doctorReservation.workingDate).getMonth() === 5
                    ? "June"
                    : new Date(doctorReservation.workingDate).getMonth() === 6
                    ? "July"
                    : new Date(doctorReservation.workingDate).getMonth() === 7
                    ? "August"
                    : new Date(doctorReservation.workingDate).getMonth() === 8
                    ? "September"
                    : new Date(doctorReservation.workingDate).getMonth() === 9
                    ? "October"
                    : new Date(doctorReservation.workingDate).getMonth() === 10
                    ? "November"
                    : new Date(doctorReservation.workingDate).getMonth() === 11
                    ? "December"
                    : null}
                </span>
                <span className="space-x-3">
                  {convertTime(doctorReservation.startTime)}
                </span>
                <span>-</span>
                <span className="space-x-3">
                  {convertTime(doctorReservation.endTime)}
                </span>
              </section>
              <section className="flex flex-row gap-x-1 font-sans font-bold text-xl text-gray-500">
                <span>,</span>
                <span>Appointment</span>
                <span>reservation</span>
              </section>
            </section>
          </header>
          <form className="h-[71%] md:h-[47%] md:mb-auto lg:w-[45%] bg-white rounded-md lg:rounded-xl flex flex-col gap-y-4">
            <header className="flex flex-row gap-x-4 items-center text-gray-700 w-full h-[12%] pl-10 md:hidden">
              <div className="text-2xl text-blue-600">
                <FaInfo />
              </div>
              <h2 className="text-base font-sans font-semibold">
                Enter Your Information
              </h2>
            </header>
            <h2 className="hidden md:flex md:flex-row md:justify-center md:items-center md:text-white md:h-[6%] xl:h-[12%] md:rounded-tl-xl md:rounded-tr-xl md:bg-blue-800 md:font-sans md:font-semibold md:text-xl">
              Enter Your Info.
            </h2>
            <section
              className="md:mt-10 md:mb-10 w-[80%] md:w-[60%] lg:w-[80%] h-[20%] md:h-[7%] border-b border-gray-300 mx-auto flex flex-row gap-x-5 p-0 relative"
              ref={patientNameSection}
            >
              <BsPersonCircle className="text-3xl text-gray-500 h-full flex justify-center items-center" />
              <input
                placeholder="Patient name (who visits doctor)"
                className="h-full text-md text-gray-600 border-none outline-none focus:border-none w-full placeholder:text-gray-600 placeholder:text-md placeholder:font-sans selection:bg-blue-900 selection:text-white"
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

            <section
              className="md:mb-7 w-[80%] md:w-[60%] lg:w-[80%] h-[20%] md:h-[7%] border-b border-gray-300 mx-auto flex flex-row gap-x-5 p-0 relative"
              ref={AddressSection}
            >
              <TfiEmail className="text-3xl text-gray-500 h-full flex justify-center items-center" />
              <input
                placeholder="Address"
                className="h-full text-md text-gray-600 border-none outline-none focus:border-none w-full placeholder:text-gray-600 placeholder:text-md placeholder:font-sans selection:bg-blue-900 selection:text-white"
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
                required
              />
              {formik.touched.address && formik.errors.address ? (
                <span className="text-red-500 font-sans font-semibold absolute top-[100%] mt-1 z-10">
                  {formik.errors.address}
                </span>
              ) : null}
            </section>
            <section className="flex flex-col justify-center w-[80%] mx-auto my-5 hover:cursor-pointer relative">
              <div
                className="flex flex-row items-center justify-between mb-5"
                onClick={() => setChooseServices(!chooseServices)}
              >
                <div className="flex flex-row gap-x-4 text-center">
                  <FaBriefcaseMedical className="text-3xl h-full flex justify-center items-center" />
                  <h4 className="space-x-3 h-full pt-2">
                    Choose Services Provided By Doctor{" "}
                    {doctorReservation.doctorName}
                  </h4>
                  {chooseServices ? (
                    <IoMdArrowDropdown className="text-3xl ml-32 h-full pt-1" />
                  ) : (
                    <IoMdArrowDropright className="text-3xl ml-32 h-full pt-1" />
                  )}
                </div>
              </div>
              <div
                className={
                  chooseServices
                    ? "flex flex-col gap-y-4 opacity-100 max-h-32 transition-all duration-500 ease-in-out"
                    : "flex flex-col gap-y-4 opacity-0 max-h-0 transition-all duration-500 ease-in-out"
                }
              >
                {doctorServices.map((service) => {
                  const selectServicesNames = selectServices.map(
                    (service) => service.serviceName
                  );
                  const isChecked = selectServicesNames.includes(
                    service.serviceName
                  );
                  const toggleService = () => {
                    if (isChecked) {
                      const filteredData = selectServices.filter(
                        (selectService) =>
                          selectService.serviceName !== service.serviceName
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
                        onChange={toggleService} // onChange is better for checkboxes
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
            <hr className="hidden md:block md:bg-gray-200 md:w-full md:h-[1px]" />
            <section
              className={
                chooseServices
                  ? "hidden md:mb-[14px] md:w-[60%] lg:w-[80%] md:mx-auto md:h-20 md:flex md:flex-row md:gap-x-5"
                  : "hidden md:mt-5 md:w-[60%] lg:w-[80%] md:mx-auto md:h-14 md:flex md:flex-row md:gap-x-5 items-center"
              }
            >
              <button
                type="submit"
                className="w-[60%] h-full flex justify-center items-center bg-red-600 text-white hover:cursor-pointer rounded-md font-sans font-medium text-xl"
                onClick={(event) => {
                  event.preventDefault();

                  if (selectServices.length > 0) {
                    if (
                      patientNameSection.current &&
                      formik.values.patient_name === ""
                    ) {
                      patientNameSection.current.style.borderBottomWidth =
                        "1px";
                      patientNameSection.current.style.borderBottomColor =
                        "red";
                    }

                    if (
                      AddressSection.current &&
                      formik.values.address === ""
                    ) {
                      AddressSection.current.style.borderBottomWidth = "1px";
                      AddressSection.current.style.borderBottomColor = "red";
                    }
                    formik.submitForm();
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
          <button
            type="submit"
            className="h-[12%] md:hidden text-white bg-blue-600 rounded-md flex justify-center items-center"
            onClick={(event) => {
              event.preventDefault();
              if (selectServices.length > 0) {
                if (
                  patientNameSection.current &&
                  formik.values.patient_name === ""
                ) {
                  patientNameSection.current.style.borderBottomWidth = "1px";
                  patientNameSection.current.style.borderBottomColor = "red";
                }

                if (AddressSection.current && formik.values.address === "") {
                  AddressSection.current.style.borderBottomWidth = "1px";
                  AddressSection.current.style.borderBottomColor = "red";
                }
                formik.submitForm();
              }
            }}
          >
            {" "}
            Book
          </button>
        </div>
      </section>
    </div>
  );
}

export default DoctorReservation;
