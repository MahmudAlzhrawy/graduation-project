"use client";
import React, { useEffect, useReducer, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { fadeIn, fadeOut } from "react-animations";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import loginReducer, {
  initialState,
} from "../../Reducers/loginReducer/loginReducer";
import {
  checkCredentialsExistInSystem,
  HandelLoginSubmitButton,
} from "../../ExternalFunctions/AccountFunctions/Account";
import ErrorMessageForLoginPage, { stage } from "./ErrorMessageForLoginPage";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../lib/Slices/auth/authSlice";
import { actionTypes } from "@/Reducers/loginReducer/loginActionTypes";
import "../../styles/login.css";

const FadeIn = styled.div`
  animation: 1s ${keyframes`${fadeIn}`} ease-in-out;
`;

const FadeOut = styled.div`
  animation: 1s ${keyframes`${fadeOut}`} ease-in-out;
`;

function Login() {
  const [isOpened, setIsOpened] = useState(true);
  const dispatchStore = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, dispatch] = useReducer(loginReducer, initialState);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const loginForm = useRef<HTMLFormElement>(null);
  const [stageAnimations, setStageAnimations] = useState(stage.first);
  const [ErrorMessageShowed, setErrorMessageShowed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [disableSubmmitButton, setDisableSubmmitButton] = useState(false);


  useEffect(() => {
  if (typeof window === "undefined") return;

  const failedTrials = Number(localStorage.getItem("number_of_failed_trials") || "0");

  if (failedTrials >= 5) {
    setDisableSubmmitButton(true);

    const timer = setTimeout(() => {
      localStorage.setItem("number_of_failed_trials", "0");
      setDisableSubmmitButton(false);
      dispatch({
        type: actionTypes.SET_FAILED_TRIALS,
        payload: { failedTrials: 0 },
      });
    }, 30000);

    return () => clearTimeout(timer);
  }
}, []);


  useEffect(() => {
    if (ErrorMessageShowed && loginState.errors.value !== "") {
      setErrorMessage(loginState.errors?.value);
    }
  }, [ErrorMessageShowed, loginState.errors]);

  useEffect(() => {
    const fetch = async () => {
      if (
        !loginState.loggedIn.value &&
        loginState.errors.isExist &&
        loginState.number_of_failed_trials.value < 5
      ) {
        setErrorMessageShowed(true);
        setStageAnimations(stage.first);
        setTimeout(() => {
          setStageAnimations(stage.second);
          setTimeout(() => {
            setErrorMessageShowed(false);
          }, 500);
        }, 2000);
      } else {
        const checkCredentials = await checkCredentialsExistInSystem(
          loginState.email.value,
          loginState.password.value
        );

        if (checkCredentials.checked) {
          const payload = {
            userToken: checkCredentials.Token,
            user: checkCredentials.user,
          };
          dispatchStore(setCredentials(payload));
          dispatch({
            type: actionTypes.RESET_LOGIN_FORM,
            payload: { email: "", password: "" },
          });
          router.push("/");
        }
      }
    };
    fetch();
  }, [loginState]);

  const FormUI = (
    <form
      ref={loginForm}
      onSubmit={async (e) => {
        e.preventDefault();
        await HandelLoginSubmitButton(
          emailInputRef.current?.value,
          passwordInputRef.current?.value,
          dispatch
        );
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="username" className="text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          ref={emailInputRef}
          id="username"
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter your username"
        />
      </div>

      <div className="relative">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          ref={passwordInputRef}
          id="password"
          type={showPassword ? "text" : "password"}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 pr-10 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter your password"
        />
        {showPassword ? (
          <FaEyeSlash
            className="absolute right-3 top-10 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(false)}
          />
        ) : (
          <FaEye
            className="absolute right-3 top-10 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(true)}
          />
        )}
      </div>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          onClick={(e) => {
            e.preventDefault();
            router.push("/forgot-password");
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={disableSubmmitButton}
        className={`w-full py-2 mt-2 rounded-md font-semibold text-white transition-all ${
          disableSubmmitButton
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-500"
        }`}
      >
        Login Now
      </button>
    </form>
  );

  return (
    <div
      className="relative bg-blue-500 w-full h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/assets/Images/homepage.png')" }}
    >
      {isOpened ? (
        <FadeIn className="w-full max-w-md h-auto z-30 my-auto rounded-2xl bg-white/80 backdrop-blur-md shadow-2xl flex flex-col px-6 py-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-gray-800">Login</span>
            <IoIosClose
              onClick={() => {
                setIsOpened(false);
                setTimeout(() => router.push("/"), 500);
              }}
              className="text-gray-400 text-3xl cursor-pointer hover:text-gray-600 transition"
            />
          </div>

          {FormUI}

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Don&apos;t have an account? </span>
            <Link
              href="/register"
              onClick={(e) => {
                e.preventDefault();
                router.push("/register");
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up!
            </Link>
          </div>
        </FadeIn>
      ) : (
        <FadeOut className="w-full max-w-md h-auto z-30 my-auto rounded-2xl bg-white/80 backdrop-blur-md shadow-2xl flex flex-col px-6 py-8">
          {/* نفس المحتوى مثل FadeIn */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-gray-800">Login</span>
            <IoIosClose
              onClick={() => {
                setIsOpened(false);
                setTimeout(() => router.push("/"), 500);
              }}
              className="text-gray-400 text-3xl cursor-pointer hover:text-gray-600 transition"
            />
          </div>

          {FormUI}

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Don&apos;t have an account? </span>
            <Link
              href="/register"
              onClick={(e) => {
                e.preventDefault();
                router.push("/register");
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up!
            </Link>
          </div>
        </FadeOut>
      )}

      {/* Error Message */}
      <div className="z-20 absolute bottom-5 left-4">
        <ErrorMessageForLoginPage
          ErrorMessageShowed={ErrorMessageShowed}
          errorMessage={errorMessage}
          stageAnimations={stageAnimations}
        />
      </div>
    </div>
  );
}

export default Login;
