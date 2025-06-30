"use client";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import "../../styles/ContactUs.css";
function ContactPage() {
  const options_hearing_about_us: string[] = [
    "Search Engine",
    "Social Media",
    "Email",
    "Friend",
    "Referral by Doctor",
    "Existing Patient / Repeat Visit",
    "Other",
  ];
  const myDropDownSelect = useRef<HTMLInputElement>(null);
  const [selectToggle, setSelectToggle] = useState<boolean>(false);
  useEffect(() => {
    if (selectToggle) {
    }
  }, [selectToggle]);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      hearing_about_us: "",
      subject: "",
      message: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phoneNumber: Yup.string().required("Phone number is required"),

      hearing_about_us: Yup.string().required("Hearing_about_us is required"),
      subject: Yup.string().required("Subject is required"),
      message: Yup.string().required("Message is required"),
    }),
    onSubmit: async (values) => {},
  });
  return (
    <div className="mt-10">
      <div className="flex items-center justify-start mb-10 ml-28 md:ml-32 lg:ml-36 xl:ml-40">
        <h1 className="font-serif font-bold text-3xl text-black selection:bg-blue-900 selection:text-white">
          Get in Touch!
        </h1>
      </div>
      <div className="mt-10">
        <form
          className="flex flex-col justify-start gap-2 "
          onSubmit={formik.handleSubmit}
        >
          <div className=" ml-[10%] w-[50%] mr-[40%] flex flex-col gap-y-2">
            <label
              className="text-blue-500 font-sans h-[40%] selection:bg-blue-900 selection:text-white"
              htmlFor="Name"
            >
              Name
            </label>
            <input
              placeholder="Enter your name"
              className="bg-gray-50 border border-gray-300 text-sm text-black rounded-[4px] focus:border-gray-300 w-full h-[30%] py-2 px-3 placeholder:text-gray-400 placeholder:text-sm placeholder:font-sans  selection:bg-blue-900 selection:text-white"
              value={formik.values.name}
              onChange={formik.handleChange}
              type="text"
              id="Name"
              name="name"
              required
            />
            {formik.touched.name && formik.errors.name ? (
              <span className="text-red-500">{formik.errors.name}</span>
            ) : null}
          </div>
          <div className="mt-2 ml-[10%] w-[50%] mr-[40%] flex flex-col gap-y-2">
            <label
              className="text-blue-500 font-sans h-[40%] selection:bg-blue-900 selection:text-white"
              htmlFor="email"
            >
              Enter email address
            </label>
            <input
              placeholder="Enter your email"
              className="bg-gray-50 border border-gray-300 text-sm text-black rounded-[4px] focus:border-gray-300 w-full h-[30%] py-2 px-3 placeholder:text-gray-400 placeholder:text-sm placeholder:font-sans selection:bg-blue-900 selection:text-white"
              value={formik.values.email}
              onChange={formik.handleChange}
              type="email"
              id="email"
              name="email"
              required
            />
            {formik.touched.email && formik.errors.email ? (
              <span className="text-red-500">{formik.errors.email}</span>
            ) : null}
          </div>
          <div className="mt-2 ml-[10%] w-[50%] mr-[40%] flex flex-col gap-y-2">
            <label
              className="text-blue-500 font-sans h-[40%] selection:bg-blue-900 selection:text-white"
              htmlFor="phoneNumber"
            >
              Enter phone number
            </label>
            <input
              placeholder="e.g. 0100 123 4567"
              className="bg-gray-50 border border-gray-300 text-sm text-black rounded-[4px] focus:border-gray-300 w-full h-[30%] py-2 px-3 placeholder:text-gray-400 placeholder:text-sm placeholder:font-sans selection:bg-blue-900 selection:text-white"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              required
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
              <span className="errors">{formik.errors.phoneNumber}</span>
            ) : null}
          </div>
          <div className="mt-2 ml-[10%] w-[50%] mr-[40%] flex flex-col gap-y-2">
            <label
              className="text-blue-500 font-sans h-[40%] selection:bg-blue-900 selection:text-white"
              htmlFor="hearing_about_us"
            >
              How did you hear about us?
            </label>
            <div className="select-box w-full h-[30%]">
              <div className="input-container">
                <input
                  ref={myDropDownSelect}
                  onKeyDown={(e) => e.preventDefault()}
                  onClick={() => setSelectToggle(!selectToggle)}
                  onBlur={() => setSelectToggle(false)}
                  placeholder="How did you hear about us?"
                  className="selected"
                  style={{ caretColor: "transparent" }}
                  id="hearing_about_us"
                  name="hearing_about_us"
                  autoFocus={false}
                  autoComplete="false"
                />
                {selectToggle ? (
                  <IoMdArrowDropup className="arrow bg-transparent" />
                ) : (
                  <IoMdArrowDropdown className="arrow bg-transparent" />
                )}
              </div>
              <ul
                className={
                  selectToggle
                    ? "options-container active"
                    : "options-container"
                }
              >
                {options_hearing_about_us.map((item) => (
                  <li
                    key={options_hearing_about_us.indexOf(item) + 1}
                    onClick={() => {
                      console.log(item);
                      debugger;
                      if (myDropDownSelect.current) {
                        myDropDownSelect.current.placeholder = item;
                        formik.values.hearing_about_us = item;
                        console.log(formik.values.hearing_about_us);
                        setSelectToggle(false);
                      }
                    }}
                    className="option"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {formik.touched.hearing_about_us &&
            formik.errors.hearing_about_us ? (
              <span className="text-red-500">
                {formik.errors.hearing_about_us}
              </span>
            ) : null}
          </div>
          <div className="ml-[10%] w-[50%] mr-[40%] flex flex-col gap-y-2">
            <label
              className="text-blue-500 font-sans h-[40%] selection:bg-blue-900 selection:text-white"
              htmlFor="Name"
            >
              Subject
            </label>
            <input
              placeholder="Enter subject"
              className="bg-gray-50 border border-gray-300 text-sm text-gray-800 font-mono rounded-[4px] focus:border-gray-300 w-full h-[30%] py-2 px-3 placeholder:text-gray-400 placeholder:text-sm placeholder:font-sans selection:bg-blue-900 selection:text-white"
              value={formik.values.subject}
              onChange={formik.handleChange}
              type="text"
              id="subject"
              name="subject"
              required
            />
            {formik.touched.subject && formik.errors.subject ? (
              <span className="text-red-500">{formik.errors.subject}</span>
            ) : null}
          </div>
          <div className="mt-2 ml-[10%] w-[50%] mr-[40%] flex flex-col gap-y-2">
            <label
              className="text-blue-500 font-sans h-[40%] selection:bg-blue-900 selection:text-white"
              htmlFor="Name"
            >
              Message
            </label>
            <textarea
              placeholder="Enter message"
              className="h-[90px] bg-gray-50 border border-gray-300 text-sm text-gray-800 font-mono rounded-[4px] focus:border-gray-300 w-full py-2 px-3 placeholder:text-gray-400 placeholder:text-sm placeholder:font-sans selection:bg-blue-900 selection:text-white"
              value={formik.values.message}
              onChange={formik.handleChange}
              id="message"
              name="message"
            />
            {formik.touched.message && formik.errors.message ? (
              <span className="text-red-500">{formik.errors.message}</span>
            ) : null}
          </div>
          <button
            className="mt-16 mb-20 ml-[10%] w-[10%] mr-[80%] h-10 rounded-[4px] bg-blue-700 text-white text-base md:text-md
                        font-sans font-bold
                        hover:no-underline hover:cursor-pointer
                    
                          "
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;
