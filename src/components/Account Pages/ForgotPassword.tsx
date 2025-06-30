"use client";
import "../../styles/register.css";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";
import { MdEditDocument } from "react-icons/md";
import React, { useEffect, useReducer, useRef, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import ForgotPasswordReducer, {
  initialStateForgotPassword,
} from "../../Reducers/ForgotPasswordReducer/ForgotPasswordReducer";
import ErrorMessageForLoginPage, { stage } from "./ErrorMessageForLoginPage";
import {
  changePasswordUsingUserNameAndPassword,
  changePasswordUsingEmailAndPassword,
} from "../../ExternalFunctions/AccountFunctions/Account";
import { actionTypes } from "../../Reducers/ForgotPasswordReducer/ForgotPasswordActionTypes";
import ForgotPasswordSuccessMessage from "./ForgotPasswordSuccessMessage";
import { useRouter } from "next/navigation";
function ForgotPassword() {
  const ForgotPasswordForm = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState<false | boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<
    false | boolean
  >(false);
  const [ForgotPasswordState, dispatch] = useReducer(
    ForgotPasswordReducer,
    initialStateForgotPassword
  );
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object().shape({
      username: Yup.string(),
      email: Yup.string().email("Invalid email"),
      newPassword: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long"),
      confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("newPassword"), ""], "Passwords must match"),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const [stageAnimations, setStageAnimations] = useState<
    stage.first | stage.second
  >(stage.first);
  const [ErrorMessageShowed, setErrorMessageShowed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [SuccessMessageShowed, setSuccessMessageShowed] =
    useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  useEffect(() => {
    if (ErrorMessageShowed) {
      setErrorMessage(ForgotPasswordState.errors?.value);
      setSuccessMessage("");
    } else if (SuccessMessageShowed) {
      setSuccessMessage("Your password has been reset!");
      setErrorMessage("");
    }
  }, [ErrorMessageShowed, SuccessMessageShowed]);
  return (
    <div className="relative bg-blue-500 w-full h-[600px] md:h-[590px] flex flex-wrap items-center justify-center z-0">
      <div
        className="sm:w-[65%] md:w-1/2 xl:w-[35%]
           h-[60%]
            my-auto mx-auto
             bg-[#F5F5F5]"
      >
        <h1 className="h-1/6 bg-blue-950 flex items-center justify-center text-white font-sans font-bold ">
          Forgot Password?
        </h1>
        <form
          onSubmit={async (event) => {
            if (formik.values.username.length > 0) {
              if (
                await changePasswordUsingUserNameAndPassword(
                  formik.values.username,
                  formik.values.newPassword
                )
              ) {
                dispatch({
                  type: actionTypes.CHANGE_PASSWORD,
                  payload: {
                    userName: formik.values.username,
                    email: "",
                    password: formik.values.newPassword,
                  },
                });
                if (ForgotPasswordState.changePassword) {
                  setSuccessMessageShowed(true);
                  setStageAnimations(stage.first);
                  setTimeout(() => {
                    setStageAnimations(stage.second);
                    setTimeout(() => {
                      setSuccessMessageShowed(false);
                      setStageAnimations(stage.first);
                      setTimeout(() => {
                        router.push("/login");
                      }, 1000);
                    }, 500);
                  }, 2000);
                }
              } else {
                dispatch({
                  type: actionTypes.ERROR_CHECK_USERACCOUNT,
                  payload: {
                    userName: "",
                    email: "",
                    password: "",
                  },
                });
                if (!ForgotPasswordState.changePassword) {
                  setErrorMessageShowed(true);
                  setStageAnimations(stage.first);
                  setTimeout(() => {
                    setStageAnimations(stage.second);
                    setTimeout(() => {
                      setErrorMessageShowed(false);
                      setStageAnimations(stage.first);
                    }, 500);
                  }, 2000);
                }
              }
            } else if (formik.values.email.length > 0) {
              if (
                await changePasswordUsingEmailAndPassword(
                  formik.values.email,
                  formik.values.newPassword
                )
              ) {
                dispatch({
                  type: actionTypes.CHANGE_PASSWORD,
                  payload: {
                    userName: "",
                    email: formik.values.email,
                    password: formik.values.newPassword,
                  },
                });
                if (ForgotPasswordState.changePassword) {
                  setSuccessMessageShowed(true);
                  setStageAnimations(stage.first);
                  setTimeout(() => {
                    setStageAnimations(stage.second);
                    setTimeout(() => {
                      setSuccessMessageShowed(false);
                      setStageAnimations(stage.first);
                      setTimeout(() => {
                        router.push("/login");
                      }, 1000);
                    }, 500);
                  }, 2000);
                }
              } else {
                dispatch({
                  type: actionTypes.ERROR_CHECK_USERACCOUNT,
                  payload: {
                    userName: "",
                    email: "",
                    password: "",
                  },
                });
                if (!ForgotPasswordState.changePassword) {
                  setErrorMessageShowed(true);
                  setStageAnimations(stage.first);
                  setTimeout(() => {
                    setStageAnimations(stage.second);
                    setTimeout(() => {
                      setErrorMessageShowed(false);
                      setStageAnimations(stage.first);
                    }, 500);
                  }, 2000);
                }
              }
            } else if (
              formik.values.username === "" &&
              formik.values.email === ""
            ) {
              event.preventDefault();
              dispatch({
                type: actionTypes.CHANGE_PASSWORD_NOT_EMPTY,
                payload: { userName: "", email: "", password: "" },
              });
              setErrorMessageShowed(true);
              setStageAnimations(stage.first);
              setTimeout(() => {
                setStageAnimations(stage.second);
                setTimeout(() => {
                  setErrorMessageShowed(false);
                  setStageAnimations(stage.first);
                }, 500);
              }, 2000);
            }
          }}
          ref={ForgotPasswordForm}
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              console.log("login form submmited successfully");
              ForgotPasswordForm.current?.submit();
            }
          }}
          className="h-[83%]"
        >
          <div
            className="border-b border-gray-300
            px-2 
                  flex flex-col md:justify-center md:items-center 
                  sm:gap-0 md:gap-3 
                  bg-transparent h-3/4 my-3 md:my-0"
          >
            <div className="flex flex-row justify-center items-center gap-2 mt-2 mb-0">
              <div className="sm:w-full">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-sans font-medium text-gray-900 dark:text-white"
                >
                  User Name:
                </label>
                <input
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="username"
                  type="text"
                  className="bg-white
                          w-full p-2.5
                           border border-gray-300
                           text-gray-900 text-sm font-sans 
                           rounded-md
                           focus:ring-blue-400
                           focus:border-blue-400
                            dark:bg-gray-700 dark:border-gray-600
                            dark:text-white dark:placeholder-text-gray-400
                            dark:focus:ring-blue-400 dark:focus:border-blue-400
                            placeholder:text-md placeholder:text-gray-500 placeholder:font-sans placeholder:font-normal md:placeholder:text-lg
                           "
                  placeholder="Username"
                  autoComplete="false"
                />
                {formik.touched.username && formik.errors.username ? (
                  <span className="errors">{formik.errors.username}</span>
                ) : null}
              </div>

              <div className="sm:w-full lg:w-[100%]">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-sans font-medium text-gray-900 dark:text-white"
                >
                  Email Address
                </label>
                <input
                  className="bg-white
                          w-full p-2.5
                           text-gray-900 text-sm font-sans 
                           rounded-md
                           focus:ring-blue-400
                           focus:border-blue-400
                            dark:bg-gray-700 dark:border-gray-600
                            dark:text-white dark:placeholder-text-gray-400
                            dark:focus:ring-blue-400 dark:focus:border-blue-400
                            placeholder:text-md placeholder:text-gray-500 placeholder:font-sans placeholder:font-normal md:placeholder:text-lg"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type="email"
                  id="email"
                  name="email"
                />
                {formik.touched.email && formik.errors.email ? (
                  <span className="errors">{formik.errors.email}</span>
                ) : null}
              </div>
            </div>
            <div className="flex flex-row justify-center items-center gap-2 mt-6 md:mt-0">
              <div className="relative sm:w-full lg:w-[50%]">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-sans font-medium text-gray-900 dark:text-white"
                >
                  Password:
                </label>
                {!showPassword ? (
                  <FaEye
                    className=" w-6 h-6 absolute right-[5%] md:right-[5%] z-10 top-[54.5%] "
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <FaEyeSlash
                    className=" w-6 h-6 absolute right-[5%] top-[54.5%] md:top-[54.5%] md:right-[5%] lg:top-[54.5%] lg:right-[6%] z-10"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className=" bg-white
                          w-full p-2.5
                           border border-gray-300
                           text-gray-900 text-sm font-sans 
                           rounded-md
                           focus:ring-blue-400
                           focus:border-blue-400
                            dark:bg-gray-700 dark:border-gray-600
                            dark:text-white dark:placeholder-text-gray-400
                            dark:focus:ring-blue-400 dark:focus:border-blue-400
                           "
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="newPassword"
                  onCopy={(event) => event.preventDefault()}
                  onPaste={(event) => event.preventDefault()}
                  autoComplete="false"
                />
                {formik.touched.newPassword && formik.errors.newPassword ? (
                  <span className="errors absolute top-[89.5%]">
                    {formik.errors.newPassword}
                  </span>
                ) : null}
              </div>
              <div className="relative sm:w-full lg:w-[50%]">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-sans font-medium text-gray-900 dark:text-white"
                >
                  confirmPassword
                </label>
                {!showConfirmPassword ? (
                  <FaEye
                    className=" w-6 h-6 absolute right-[5%] md:right-[5%] z-10 top-[54.5%] "
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                ) : (
                  <FaEyeSlash
                    className=" w-6 h-6 absolute right-[5%] top-[54.5%] md:top-[54.5%] md:right-[5%] lg:top-[54.5%] lg:right-[6%] z-10"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                )}
                <input
                  className="bg-white
                          w-full p-2.5
                           border border-gray-300
                           text-gray-900 text-sm font-sans 
                           rounded-md
                           focus:ring-blue-400
                           focus:border-blue-400
                            dark:bg-gray-700 dark:border-gray-600
                            dark:text-white dark:placeholder-text-gray-400
                            dark:focus:ring-blue-400 dark:focus:border-blue-400
                            placeholder:text-md placeholder:text-gray-500 placeholder:font-sans placeholder:font-normal md:placeholder:text-lg"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  onCopy={(event) => event.preventDefault()}
                  onPaste={(event) => event.preventDefault()}
                />
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                  <span className="errors absolute top-[89.5%]">
                    {formik.errors.confirmPassword}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="px-2 mt-2 flex items-center gap-2 bg-transparent h-[15%] md:h-[20%] my-auto">
            <button
              className="h-[70%] md:h-1/2 my-auto md:my-0 mt-1
                       w-[28%]
                        rounded-[3px]
                        text-white sm:text-lg md:text-xl lg:text-xl xl:text-xl
                        bg-red-600 hover:bg-red-700
                          font-sans font-bold
                           flex items-center justify-center
                           "
              type="button"
              onClick={() => router.push("/login")}
            >
              <TiCancel className="text-2xl inline-block" />
              <span>cancel</span>
            </button>
            <button
              className="h-[70%] md:h-1/2 my-auto md:my-0 mt-1 ml-auto mr-1 md:mr-2
                       w-[50%]
                        rounded-[3px] text-white 
                        bg-blue-700 hover:bg-blue-500 outline-orange-500/100 outline-2
                           flex items-center justify-center
                           "
              type="submit"
            >
              <MdEditDocument className="mr-1 text-2xl md:text-xl xl:text-2xl inline-block" />
              <span className="font-sans font-bold text-base inline">
                Update Password
              </span>
            </button>
          </div>
        </form>
      </div>
      <div className="absolute bottom-4 left-4">
        <ErrorMessageForLoginPage
          ErrorMessageShowed={ErrorMessageShowed}
          errorMessage={errorMessage}
          stageAnimations={stageAnimations}
        />
      </div>
      <div className="absolute bottom-4 left-4">
        <ForgotPasswordSuccessMessage
          SuccessMessageShowed={SuccessMessageShowed}
          successMessage={successMessage}
          stageAnimations={stageAnimations}
        />
      </div>
    </div>
  );
}

export default ForgotPassword;
