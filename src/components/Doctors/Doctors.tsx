"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { patua, Atkinson_HyperlegibleFont } from "@/constants/doctor";
import { FiFilter } from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa6";
import { IoPricetag } from "react-icons/io5";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import DoctorSortingDropDownSelect from "./DoctorSortingDropDownSelect";
import { useRouter } from "next/navigation";
import PaginatedDoctors from "./PaginatedDoctors";
import { DoctorsContext } from "@/app/doctors/layout";

enum Examination_Fee_Values {
  Any = "Any",
  Less_Than_50 = "Less than 50",
  From_50_To_100 = "From 50 to 100",
  From_100_To_200 = "From 100 to 200",
  From_200_To_300 = "From 200 to 300",
  Greater_Than_300 = "Greater than 300",
}
const Filters = {
  Title: ["Professor", "Lecturer", "Consultant", "Specialist"],
  Gender: ["Female", "Male"],
  Examination_Fee: [
    "Any",
    "Less than 50",
    "From 50 to 100",
    "From 100 to 200",
    "From 200 to 300",
    "Greater than 300",
  ],
};
export interface DoctorModel {
  doctorId: number;
  clinicId: number;
  doctorName: string;
  specialization: string;
  experienceYears: number;
  profileImage: string;
  description: string;
  academicDegree: string;
  retaing: number;
  price: number;
  city: string;
  addressLine1: string;
  workingHour: DoctorWorkingHour[];
  services: DoctorServicesProvider[];
}
export interface DoctorWorkingHour {
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
export interface DoctorServicesProvider {
  idService: number;
  clinicId: number;
  serviceName: string;
  description: string;
  price: number;
}

type Props = {
  getAllDoctors: DoctorModel[];
  DoctorsSearchParams: {
    title?: string;
    examination_fee?: string;
    sorting?: string;
    specialty?: string | undefined;
    city?: string;
    search_name?: string;
  };
};
enum Sorting {
  BestMatch = "Best Match",
  TopRated = "Top Rated",
  Price_LowToHigh = "Price Low to High",
}

function Doctors(props: Props) {
  /* searching function or feature */
  const [getAllDoctors, setGetAllDoctors] = useState<DoctorModel[]>(
    props.getAllDoctors
  );
  const [visiableCount, setVisiableCount] = useState<number>(0);
  useEffect(() => {
    let filteredDoctors = [...getAllDoctors]; // Start with full data

    const searchParams = props.DoctorsSearchParams;

    if (searchParams?.title?.trim()) {
      const titleArray = searchParams.title.trim().split(",");
      filteredDoctors = filteredDoctors.filter((doctor) =>
        titleArray.includes(doctor.academicDegree)
      );
    }

    if (searchParams?.examination_fee) {
      const fee = searchParams.examination_fee;
      if (fee === "less_than_50") {
        filteredDoctors = filteredDoctors.filter((doctor) => doctor.price < 50);
      } else if (fee === "from_50_to_100") {
        filteredDoctors = filteredDoctors.filter(
          (doctor) => doctor.price >= 50 && doctor.price <= 100
        );
      } else if (fee === "from_100_to_200") {
        filteredDoctors = filteredDoctors.filter(
          (doctor) => doctor.price >= 100 && doctor.price <= 200
        );
      } else if (fee === "from_200_to_300") {
        filteredDoctors = filteredDoctors.filter(
          (doctor) => doctor.price >= 200 && doctor.price <= 300
        );
      } else if (fee === "greater_than_300") {
        filteredDoctors = filteredDoctors.filter(
          (doctor) => doctor.price > 300
        );
      }
    }

    if (searchParams?.sorting) {
      const sorting = searchParams.sorting;
      console.log(sorting);
      switch (sorting) {
        case Sorting.TopRated:
          filteredDoctors = filteredDoctors.filter(
            (doctor) => doctor.retaing === 5 || doctor.retaing === 4
          );
          break;
        case Sorting.Price_LowToHigh:
          filteredDoctors = filteredDoctors.sort((a, b) => {
            const feesA = a.price !== undefined ? a.price : Infinity;
            const feesB = b.price !== undefined ? b.price : Infinity;
            return feesA - feesB;
          });
          break;
      }
    }

    if (searchParams?.specialty?.trim()) {
      const specialty = searchParams.specialty.trim();
      filteredDoctors = filteredDoctors.filter((doctor) =>
        doctor.specialization.includes(specialty)
      );
    }

    if (searchParams?.city?.trim()) {
      const city = searchParams.city.trim().toLowerCase();
      filteredDoctors = filteredDoctors.filter((doctor) =>
        doctor.city?.toLowerCase().includes(city)
      );
    }

    if (searchParams?.search_name?.trim()) {
      const searchName = searchParams.search_name.trim().toLowerCase();
      filteredDoctors = filteredDoctors.filter((doctor) =>
        doctor.doctorName.toLowerCase().includes(searchName)
      );
    }

    setGetAllDoctors(filteredDoctors); // Apply once
  }, []);

const context = useContext(DoctorsContext);

if (!context) {
  throw new Error("DoctorsContext must be used within a Doctorslayout Provider");
}

const { SearchDoctors, setSearchDoctors } = context;

  /* searching function or feature */
  const [openTitle, setOpenTitle] = useState<boolean>(false);
  const [openExaminationFee, setOpenExaminationFee] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const doctorfilterRef = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    const position = window.scrollY;
    setScrollPosition(position);
    console.log(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    if (
      scrollPosition >= 0 &&
      getAllDoctors.length === 0 &&
      !openTitle &&
      !openExaminationFee
    ) {
      window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    } else if (
      scrollPosition >= 0 &&
      getAllDoctors.length === 0 &&
      openTitle &&
      !openExaminationFee
    ) {
      window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    } else if (
      scrollPosition >= 0 &&
      getAllDoctors.length === 0 &&
      !openTitle &&
      openExaminationFee
    ) {
      window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    }
    //  else if (scrollPosition >=2400 && getAllDoctors.length >= 1 && visiableCount === 5 && openTitle && !openExaminationFee) {
    //   window.scrollTo(0, 160);
    // }
    else if (scrollPosition < 160 && openTitle && openExaminationFee) {
      window.scrollTo(0, 160);
    } else if (scrollPosition >= 2400 && openTitle && openExaminationFee) {
      doctorfilterRef.current?.classList.add("top-[-30px]");
    } else if (
      scrollPosition >= 0 &&
      openExaminationFee &&
      getAllDoctors.length === 0
    ) {
      window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    } else if (
      scrollPosition >= 2500 &&
      !openTitle &&
      !openExaminationFee &&
      props.getAllDoctors.length >= 5
    ) {
      window.scrollTo({ left: 0, top: 2500, behavior: "smooth" });
    } else if (scrollPosition === 0 && openTitle) {
      window.scrollTo({ left: 0, top: 10, behavior: "smooth" });
    } else if (scrollPosition < 80 && openTitle) {
      window.scrollTo({ left: 0, top: 80, behavior: "smooth" });
      // } else if (scrollPosition >= 1626 && openTitle) {
      //   window.scrollTo({ left: 0, top: 1626, behavior: "smooth" });
      // } else {
      if (doctorfilterRef.current?.classList.contains("top-[-30px]")) {
        doctorfilterRef.current?.classList.remove("top-[-30px]");
      }
    }
  }, [scrollPosition, openTitle, openExaminationFee]);
  useEffect(() => {
    if (openTitle && getAllDoctors.length === 0) {
      window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    }
  }, [openTitle]);
  const professorcheckboxRef = useRef<HTMLInputElement>(null);
  const lecturercheckboxRef = useRef<HTMLInputElement>(null);
  const consultantcheckboxRef = useRef<HTMLInputElement>(null);
  const specialistcheckboxRef = useRef<HTMLInputElement>(null);
  const AnyradiobuttonRef = useRef<HTMLInputElement>(null);
  const Less_than_50_radiobuttonRef = useRef<HTMLInputElement>(null);
  const From_50_to_100_radiobuttonRef = useRef<HTMLInputElement>(null);
  const From_100_to_200_radiobuttonRef = useRef<HTMLInputElement>(null);
  const From_200_to_300_radiobuttonRef = useRef<HTMLInputElement>(null);
  const Greater_than_300_radiobuttonRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  return (
    <div
      className={
        visiableCount === 1 && getAllDoctors.length >= 1
          ? patua.className + " bg-blue-50 h-[730px] z-0 flex flex-col relative"
          : visiableCount === 2 && getAllDoctors.length >= 1
          ? " bg-blue-50 h-[3110px] z-0 flex flex-col relative"
          : visiableCount === 3 && getAllDoctors.length >= 1
          ? " bg-blue-50 w-full h-[1900px] z-0 flex flex-col relative"
          : visiableCount === 4 && getAllDoctors.length >= 1
          ? " bg-blue-50 h-[3110px] z-0 flex flex-col relative"
          : visiableCount === 5 && getAllDoctors.length >= 1
          ? " bg-blue-50 h-[2800px] max-h-[3500px] z-0 flex flex-col relative mb-10"
          : getAllDoctors.length === 0 && openTitle
          ? " bg-blue-50 w-full h-[450px] z-0 flex flex-col relative"
          : getAllDoctors.length === 0 && openExaminationFee
          ? " bg-blue-50 w-full h-[550px] z-0 flex flex-col relative"
          : getAllDoctors.length === 0
          ? " bg-blue-50 w-full h-[320px] z-0 flex flex-col relative"
          : " bg-blue-50 w-[95%] h-[400px] max-h[800px] ml-4 mr-2 z-0 flex flex-col relative"
      }
    >
      <div
        ref={doctorfilterRef}
        className={
          scrollPosition >= 2400 &&
          visiableCount === 5 &&
          getAllDoctors.length >= 1 &&
          openTitle &&
          openExaminationFee
            ? "w-[15%] flex flex-col gap-y-2 ml-[10%] fixed bottom-3 z-10"
            : scrollPosition >= 2400 &&
              visiableCount === 5 &&
              getAllDoctors.length >= 1 &&
              openTitle &&
              !openExaminationFee
            ? "w-[15%] flex flex-col gap-y-2 ml-[10%] fixed top-32 z-10"
            : scrollPosition >= 2400 &&
              visiableCount === 5 &&
              getAllDoctors.length >= 1 &&
              !openTitle &&
              openExaminationFee
            ? "w-[15%] flex flex-col gap-y-2 ml-[10%] fixed top-20 z-10"
            : scrollPosition >= 435 &&
              visiableCount === 1 &&
              getAllDoctors.length >= 1 &&
              !openTitle &&
              !openExaminationFee
            ? "w-[15%] flex flex-col gap-y-2 ml-[10%] fixed top-[100px] z-10"
            : scrollPosition >= 300 &&
              visiableCount === 1 &&
              getAllDoctors.length >= 1 &&
              openTitle &&
              openExaminationFee
            ? "w-[15%] flex flex-col gap-y-2 ml-[10%] fixed top-0 z-10"
            : scrollPosition >= 220 &&
              visiableCount === 1 &&
              getAllDoctors.length >= 1 &&
              openTitle &&
              openExaminationFee
            ? "w-[15%] flex flex-col gap-y-2 ml-[10%] fixed top-[200px] z-10"
            : scrollPosition >= 300 &&
              visiableCount === 1 &&
              getAllDoctors.length >= 1 &&
              openTitle &&
              !openExaminationFee
            ? "w-[15%] flex flex-col gap-y-2 ml-[10%] fixed top-[23px] z-10"
            : scrollPosition >= 435 &&
              visiableCount === 1 &&
              getAllDoctors.length >= 1 &&
              !openTitle &&
              openExaminationFee
            ? "w-[15%] flex flex-col gap-y-2 ml-[10%] fixed top-[100px] z-10"
            : scrollPosition >= 230 &&
              visiableCount === 1 &&
              getAllDoctors.length >= 1 &&
              !openTitle &&
              openExaminationFee
            ? "w-[15%] flex flex-col gap-y-2 ml-[10%] fixed top-[200px] z-10"
            : scrollPosition >= 550 && !openTitle && !openExaminationFee
            ? "w-[15%] flex flex-col gap-y-2 ml-[10%] fixed top-[300px] z-10"
            : scrollPosition >= 1 && openTitle && getAllDoctors.length === 0
            ? "w-[15%] flex flex-col gap-y-2 ml-[10%] fixed top-0 z-10"
            : scrollPosition >= 550
            ? "w-[15%] flex flex-col gap-y-2 ml-[10%] fixed top-[250px] z-10"
            : scrollPosition >= 550 && openExaminationFee
            ? "w-[15%] flex flex-col gap-y-2 ml-[10%] fixed top-0 z-10"
            : scrollPosition < 550 && openExaminationFee
            ? "w-[15%] flex flex-col gap-y-2 ml-[10%] fixed bottom-5 z-10"
            : scrollPosition >= 550 && openTitle
            ? "w-[15%] flex flex-col gap-y-2 ml-[10%] fixed top-[50px] z-10"
            : "w-[15%] flex flex-col gap-y-2 ml-[10%] fixed z-10"
        }
      >
        <h3 className="text-gray-400 text-sm flex flex-row items-center justify-center">
          <span
            className="text-blue-500 hover:underline hover:cursor-pointer"
            onClick={() => router.push("/")}
          >
            City Guide
          </span>
          <span className="mx-2"> / </span>All doctors in Egypt
        </h3>
        <div className="flex flex-col rounded-br-xl rounded-bl-xl">
          <header className="flex flex-row gap-x-4 items-center justify-start pl-8 text-xl text-white bg-blue-600 h-12 rounded-tl-xl rounded-tr-xl ">
            <FiFilter className="text-2xl" />
            <h4>Filters</h4>
          </header>
          <section className="text-blue-600 text-2xl flex flex-col bg-white rounded-br-xl rounded-bl-xl">
            <div className="flex flex-col justify-center w-[80%] mx-auto my-5 hover:cursor-pointer">
              <div
                className="flex flex-row items-center justify-between mb-5"
                onClick={() => setOpenTitle(!openTitle)}
              >
                <div className="flex flex-row gap-x-4">
                  <FaGraduationCap className="text-3xl" />
                  <h4 className="space-x-1.5">Academic Degreee</h4>
                </div>
                {openTitle ? (
                  <IoMdArrowDropdown className="text-3xl" />
                ) : (
                  <IoMdArrowDropright className="text-3xl" />
                )}
              </div>
              <div
                className={
                  openTitle
                    ? "flex flex-col gap-y-4 opacity-100 max-h-32 transition-all duration-500 ease-in-out"
                    : "flex flex-col gap-y-4 opacity-0 max-h-0 transition-all duration-500 ease-in-out"
                }
              >
                <div
                  onClick={() => {
                    if (professorcheckboxRef.current) {
                      if (professorcheckboxRef.current.checked) {
                        professorcheckboxRef.current.checked = false;
                        setSearchDoctors({
                          ...SearchDoctors,
                          Title: SearchDoctors.Title.filter(
                            (title: string) => title !== "Professor"
                          ),
                        });
                      } else {
                        professorcheckboxRef.current.checked = true;
                        if (!SearchDoctors.Title.includes("Professor"))
                          setSearchDoctors({
                            ...SearchDoctors,
                            Title: [...SearchDoctors.Title, "Professor"],
                          });
                      }
                    }
                  }}
                  className="flex flex-row items-center"
                >
                  <input
                    ref={professorcheckboxRef}
                    id="professor"
                    type="checkbox"
                    value="Professor"
                    onClick={(event) => {
                      if (event.currentTarget.checked) {
                        event.currentTarget.checked = false;
                        setSearchDoctors({
                          ...SearchDoctors,
                          Title: SearchDoctors.Title.filter(
                            (title: string) => title !== "Professor"
                          ),
                        });
                      } else {
                        event.currentTarget.checked = true;
                        if (!SearchDoctors.Title.includes("Professor"))
                          setSearchDoctors({
                            ...SearchDoctors,
                            Title: [...SearchDoctors.Title, "Professor"],
                          });
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="professor"
                    className="ms-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    Professor
                  </label>
                </div>
                <div
                  onClick={() => {
                    if (lecturercheckboxRef.current) {
                      if (lecturercheckboxRef.current.checked) {
                        lecturercheckboxRef.current.checked = false;
                        setSearchDoctors({
                          ...SearchDoctors,
                          Title: SearchDoctors.Title.filter(
                            (title: string) => title !== "Lecturer"
                          ),
                        });
                      } else {
                        lecturercheckboxRef.current.checked = true;
                        if (!SearchDoctors.Title.includes("Lecturer"))
                          setSearchDoctors({
                            ...SearchDoctors,
                            Title: [...SearchDoctors.Title, "Lecturer"],
                          });
                      }
                    }
                  }}
                  className="flex flex-row items-center"
                >
                  <input
                    onClick={(event) => {
                      if (event.currentTarget.checked) {
                        event.currentTarget.checked = false;
                        setSearchDoctors({
                          ...SearchDoctors,
                          Title: SearchDoctors.Title.filter(
                            (title: string) => title !== "Lecturer"
                          ),
                        });
                      } else {
                        event.currentTarget.checked = true;
                        if (!SearchDoctors.Title.includes("Lecturer"))
                          setSearchDoctors({
                            ...SearchDoctors,
                            Title: [...SearchDoctors.Title, "Lecturer"],
                          });
                      }
                    }}
                    ref={lecturercheckboxRef}
                    id="lecturer"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="lecturer"
                    className="ms-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    Lecturer
                  </label>
                </div>
                <div
                  onClick={() => {
                    if (consultantcheckboxRef.current) {
                      if (consultantcheckboxRef.current.checked) {
                        consultantcheckboxRef.current.checked = false;
                        setSearchDoctors({
                          ...SearchDoctors,
                          Title: SearchDoctors.Title.filter(
                            (title: string) => title !== "Consultant"
                          ),
                        });
                      } else {
                        consultantcheckboxRef.current.checked = true;
                        if (!SearchDoctors.Title.includes("Consultant"))
                          setSearchDoctors({
                            ...SearchDoctors,
                            Title: [...SearchDoctors.Title, "Consultant"],
                          });
                      }
                    }
                  }}
                  className="flex flex-row items-center"
                >
                  <input
                    onClick={(event) => {
                      if (event.currentTarget.checked) {
                        event.currentTarget.checked = false;
                        setSearchDoctors({
                          ...SearchDoctors,
                          Title: SearchDoctors.Title.filter(
                            (title: string) => title !== "Consultant"
                          ),
                        });
                      } else {
                        event.currentTarget.checked = true;
                        if (!SearchDoctors.Title.includes("Consultant"))
                          setSearchDoctors({
                            ...SearchDoctors,
                            Title: [...SearchDoctors.Title, "Consultant"],
                          });
                      }
                    }}
                    ref={consultantcheckboxRef}
                    id="consultant"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="consultant"
                    className="ms-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    Consultant
                  </label>
                </div>
                <div
                  onClick={() => {
                    if (specialistcheckboxRef.current) {
                      if (specialistcheckboxRef.current.checked) {
                        specialistcheckboxRef.current.checked = false;
                        setSearchDoctors({
                          ...SearchDoctors,
                          Title: SearchDoctors.Title.filter(
                            (title: string) => title !== "Specialist"
                          ),
                        });
                      } else {
                        specialistcheckboxRef.current.checked = true;
                        if (!SearchDoctors.Title.includes("Specialist"))
                          setSearchDoctors({
                            ...SearchDoctors,
                            Title: [...SearchDoctors.Title, "Specialist"],
                          });
                      }
                    }
                  }}
                  className="flex flex-row items-center"
                >
                  <input
                    onClick={(event) => {
                      if (event.currentTarget.checked) {
                        event.currentTarget.checked = false;
                        setSearchDoctors({
                          ...SearchDoctors,
                          Title: SearchDoctors.Title.filter(
                            (title: string) => title !== "Specialist"
                          ),
                        });
                      } else {
                        event.currentTarget.checked = true;
                        if (!SearchDoctors.Title.includes("Specialist"))
                          setSearchDoctors({
                            ...SearchDoctors,
                            Title: [...SearchDoctors.Title, "Specialist"],
                          });
                      }
                    }}
                    ref={specialistcheckboxRef}
                    id="specialist"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="specialist"
                    className="ms-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    Specialist
                  </label>
                </div>
              </div>
            </div>
            <hr className="text-gray-600 h-2" />
            {/* <div className="flex flex-col justify-center w-[80%] mx-auto my-5 hover:cursor-pointer">
              <div
                className="flex flex-row items-center justify-between mb-5"
                onClick={() => setOpenGender(!openGender)}
              >
                <div className="flex flex-row gap-x-4">
                  <div className="flex flex-row gap-x-0 text-3xl">
                    <CgGenderFemale className="" />
                    <CgGenderMale className="" />
                  </div>
                  <h4>Gender</h4>
                </div>
                {openGender ? (
                  <IoMdArrowDropdown className="text-3xl" />
                ) : (
                  <IoMdArrowDropright className="text-3xl" />
                )}
              </div>
              <div
                className={
                  openGender
                    ? "flex flex-col gap-y-4 opacity-100 max-h-32 transition-all duration-500 ease-in-out"
                    : "flex flex-col gap-y-4 opacity-0 max-h-0 transition-all duration-500 ease-in-out"
                }
              >
                <div
                  onClick={() => {
                    if (FemalecheckboxRef.current) {
                      if (FemalecheckboxRef.current.checked) {
                        FemalecheckboxRef.current.checked = false;
                        setSearchDoctors({
                          ...SearchDoctors,
                          Gender: SearchDoctors.Gender.filter(
                            (gender: string) => gender !== "Female"
                          ),
                        });
                      } else {
                        FemalecheckboxRef.current.checked = true;
                        if (!SearchDoctors.Gender.includes("Female"))
                          setSearchDoctors({
                            ...SearchDoctors,
                            Gender: [...SearchDoctors.Gender, "Female"],
                          });
                      }
                    }
                  }}
                  className="flex flex-row items-center"
                >
                  <input
                    onClick={(event) => {
                      if (event.currentTarget.checked) {
                        event.currentTarget.checked = false;
                        setSearchDoctors({
                          ...SearchDoctors,
                          Gender: SearchDoctors.Gender.filter(
                            (gender: string) => gender !== "Female"
                          ),
                        });
                      } else {
                        event.currentTarget.checked = true;
                        if (!SearchDoctors.Gender.includes("Female"))
                          setSearchDoctors({
                            ...SearchDoctors,
                            Gender: [...SearchDoctors.Gender, "Female"],
                          });
                      }
                    }}
                    ref={FemalecheckboxRef}
                    id="female"
                    type="checkbox"
                    value={GenderValues.Female}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="female"
                    className="ms-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    Female
                  </label>
                </div>
                <div
                  onClick={() => {
                    if (MalecheckboxRef.current) {
                      if (MalecheckboxRef.current.checked) {
                        MalecheckboxRef.current.checked = false;
                        setSearchDoctors({
                          ...SearchDoctors,
                          Gender: SearchDoctors.Gender.filter(
                            (gender: string) => gender !== "Male"
                          ),
                        });
                      } else {
                        MalecheckboxRef.current.checked = true;
                        if (!SearchDoctors.Gender.includes("Male"))
                          setSearchDoctors({
                            ...SearchDoctors,
                            Gender: [...SearchDoctors.Gender, "Male"],
                          });
                      }
                    }
                  }}
                  className="flex flex-row items-center"
                >
                  <input
                    onClick={(event) => {
                      if (event.currentTarget.checked) {
                        event.currentTarget.checked = false;
                        setSearchDoctors({
                          ...SearchDoctors,
                          Gender: SearchDoctors.Gender.filter(
                            (gender: string) => gender !== "Male"
                          ),
                        });
                      } else {
                        event.currentTarget.checked = true;
                        if (!SearchDoctors.Gender.includes("Male"))
                          setSearchDoctors({
                            ...SearchDoctors,
                            Gender: [...SearchDoctors.Gender, "Male"],
                          });
                      }
                    }}
                    ref={MalecheckboxRef}
                    id="male"
                    type="checkbox"
                    value={GenderValues.Male}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="male"
                    className="ms-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    Male
                  </label>
                </div>
              </div>
            </div> */}
            {/* <hr className="text-gray-600 h-2" /> */}
            <div className="flex flex-col justify-center w-[80%] mx-auto my-5">
              <div
                className="flex flex-row items-center justify-between mb-5 hover:cursor-pointer"
                onClick={() => setOpenExaminationFee(!openExaminationFee)}
              >
                <div className="flex flex-row gap-x-4 text-3xl">
                  <IoPricetag className="text-3xl" />
                  <h4 className="text-xl">Examination Fee</h4>
                </div>
                {openExaminationFee ? (
                  <IoMdArrowDropdown className="text-3xl" />
                ) : (
                  <IoMdArrowDropright className="text-3xl" />
                )}
              </div>
              <div
                className={
                  openExaminationFee
                    ? "flex flex-col gap-y-4 opacity-100 max-h-60 transition-all duration-500 ease-in-out"
                    : "flex flex-col gap-y-4 opacity-0 max-h-0 transition-all duration-500 ease-in-out"
                }
              >
                <div
                  onClick={() => {
                    if (AnyradiobuttonRef.current) {
                      AnyradiobuttonRef.current.checked = true;
                      setSearchDoctors({
                        ...SearchDoctors,
                        Examination_Fee: "any",
                      });
                    }
                  }}
                  className="flex flex-row items-center"
                >
                  <input
                    ref={AnyradiobuttonRef}
                    id="any"
                    type="radio"
                    name="Examination_Fee"
                    value={Examination_Fee_Values.Any}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="any"
                    className="ms-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    Any
                  </label>
                </div>
                <div
                  onClick={() => {
                    if (Less_than_50_radiobuttonRef.current) {
                      Less_than_50_radiobuttonRef.current.checked = true;
                      setSearchDoctors({
                        ...SearchDoctors,
                        Examination_Fee: "less_than_50",
                      });
                    }
                  }}
                  className="flex flex-row items-center"
                >
                  <input
                    ref={Less_than_50_radiobuttonRef}
                    id="less_than_50"
                    type="radio"
                    name="Examination_Fee"
                    value={Examination_Fee_Values.Less_Than_50}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="less_than_50"
                    className="ms-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    less than 50
                  </label>
                </div>
                <div
                  onClick={() => {
                    if (From_50_to_100_radiobuttonRef.current) {
                      From_50_to_100_radiobuttonRef.current.checked = true;
                      setSearchDoctors({
                        ...SearchDoctors,
                        Examination_Fee: "from_50_to_100",
                      });
                    }
                  }}
                  className="flex flex-row items-center"
                >
                  <input
                    ref={From_50_to_100_radiobuttonRef}
                    id="from_50_to_100"
                    type="radio"
                    name="Examination_Fee"
                    value={Examination_Fee_Values.From_50_To_100}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="from_50_to_100"
                    className="ms-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    from 50 to 100
                  </label>
                </div>
                <div
                  onClick={() => {
                    if (From_100_to_200_radiobuttonRef.current) {
                      From_100_to_200_radiobuttonRef.current.checked = true;
                      setSearchDoctors({
                        ...SearchDoctors,
                        Examination_Fee: "from_100_to_200",
                      });
                    }
                  }}
                  className="flex flex-row items-center"
                >
                  <input
                    ref={From_100_to_200_radiobuttonRef}
                    id="from_100_to_200"
                    type="radio"
                    name="Examination_Fee"
                    value={Examination_Fee_Values.From_100_To_200}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="from_100_to_200"
                    className="ms-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    from 100 to 200
                  </label>
                </div>
                <div
                  onClick={() => {
                    if (From_200_to_300_radiobuttonRef.current) {
                      From_200_to_300_radiobuttonRef.current.checked = true;
                      setSearchDoctors({
                        ...SearchDoctors,
                        Examination_Fee: "from_200_to_300",
                      });
                    }
                  }}
                  className="flex flex-row items-center"
                >
                  <input
                    ref={From_200_to_300_radiobuttonRef}
                    id="from_200_to_300"
                    type="radio"
                    name="Examination_Fee"
                    value={Examination_Fee_Values.From_200_To_300}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="from_200_to_300"
                    className="ms-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    from 200 to 300
                  </label>
                </div>
                <div
                  onClick={() => {
                    if (Greater_than_300_radiobuttonRef.current) {
                      Greater_than_300_radiobuttonRef.current.checked = true;
                      setSearchDoctors({
                        ...SearchDoctors,
                        Examination_Fee: "greater_than_300",
                      });
                    }
                  }}
                  className="flex flex-row items-center"
                >
                  <input
                    ref={Greater_than_300_radiobuttonRef}
                    id="greater_than_300"
                    type="radio"
                    name="Examination_Fee"
                    value={Examination_Fee_Values.Greater_Than_300}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="greater_than_300"
                    className="ms-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    Greater than 300
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <header
        className={
          getAllDoctors.length >= 3
            ? Atkinson_HyperlegibleFont.className +
              " ml-[5%] absolute left-[25%] w-[70%] bg-blue-50 flex justify-between items-center h-[7%]"
            : getAllDoctors.length === 0
            ? Atkinson_HyperlegibleFont.className +
              " ml-[5%] absolute left-[25%] w-[70%] bg-blue-50 flex justify-between items-center h-[30%] mb-5"
            : Atkinson_HyperlegibleFont.className +
              " ml-[5%] absolute left-[25%] w-[70%] bg-blue-50 flex justify-between items-center h-[15%]"
        }
      >
        <section className="w-[50%] flex flex-row gap-x-5">
          <h5 className="pl-4 text-gray-500 text-2xl font-bold">
            {SearchDoctors.specialty !== ""
              ? SearchDoctors.specialty
              : "All Specialities"}
          </h5>
          <h6 className="text-gray-400 text-lg flex flex-row gap-x-2 h-full pt-1">
            <span>{getAllDoctors.length}</span>
            <span>Doctors</span>
          </h6>
        </section>
        <section
          className={
            getAllDoctors.length === 0 && openTitle
              ? "w-[30%] h-[150px] flex flex-row gap-x-3 items-center"
              : getAllDoctors.length === 0 && openExaminationFee
              ? "w-[30%] h-[200px] flex flex-row gap-x-3 items-center"
              : getAllDoctors.length === 0
              ? "w-[30%] flex flex-row gap-x-3 items-center"
              : "w-[30%] h-full flex flex-row gap-x-3 items-center"
          }
        >
          <h5
            className={
              visiableCount > 0 && getAllDoctors.length >= 1
                ? "text-gray-500 text-lg mb-4"
                : getAllDoctors.length === 0 && openExaminationFee
                ? "text-gray-500 text-lg mb-2"
                : "text-gray-500 text-lg mb-1"
            }
          >
            Sorting:
          </h5>
          <DoctorSortingDropDownSelect
            visiableCount={visiableCount}
            getAllDoctors={getAllDoctors}
          />
        </section>
      </header>
      {getAllDoctors.length >= 1 ? (
        <section className="absolute top-[106px] h-auto mt-7 w-full rounded-tl-md rounded-tr-md flex flex-col gap-y-10 bg-blue-50">
          <PaginatedDoctors
            doctorCards={getAllDoctors}
            itemsPerPage={5}
            onPageChange={(count: number) => setVisiableCount(count)}
          />
        </section>
      ) : (
        <section
          className={
            getAllDoctors.length === 0 && openTitle
              ? "absolute top-[200px] pl-[27%] w-full rounded-tl-md rounded-tr-md text-center bg-blue-50"
              : getAllDoctors.length === 0 && openExaminationFee
              ? "absolute top-[306px] pl-[27%] w-full rounded-tl-md rounded-tr-md text-center bg-blue-50"
              : "absolute top-[106px] pl-[27%] w-full rounded-tl-md rounded-tr-md text-center bg-blue-50"
          }
        >
          <h1
            className="font-sans font-semibold text-4xl text-gray-600"
            style={{ wordSpacing: "5px" }}
          >
            Sorry we can&#39;t find any doctor that matches your search, please
            remove some of the filters to get results
          </h1>
        </section>
      )}
    </div>
  );
}

export default Doctors;
