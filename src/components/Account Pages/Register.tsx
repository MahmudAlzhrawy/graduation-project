"use client";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { onlyNumbers } from "../../ExternalFunctions/AccountFunctions/HandelInput/HandelInputtyping";
import SubmitButton from "./submitButton";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

interface RegisterModel {
  nameU: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
}

const RegisterComponent: React.FC = () => {
  const router = useRouter();
  const registerForm = useRef<HTMLFormElement>(null);
  const [submitButtonStatus, setSubmitButtonStatus] = useState({
    loading: false,
    submitButtonText: "Register",
    isSubmitted: false,
  });
  const [isOpened, setIsOpened] = useState<boolean>(true);

  const validateUsername = async (value: string) => {
    try {
      const response = await fetch(
        `https://citypulse.runasp.net/api/User/IsUserNameUnique?userName=${value}`
      );
      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();
      return JSON.parse(data);
    } catch (error) {
      console.error("Username check error:", error);
      return false;
    }
  };

  const validateEmail = async (value: string) => {
    try {
      const response = await fetch(
        `https://citypulse.runasp.net/api/User/IsEmailUnique?email=${value}`
      );
      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();
      return JSON.parse(data);
    } catch (error) {
      console.error("Email check error:", error);
      return false;
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      phoneNumber: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      phoneNumber: Yup.string().required("Phone number is required"),
      userName: Yup.string()
        .required("Username is required")
        .test("unique-username", "Username is already taken", validateUsername),
      email: Yup.string()
        .email("Invalid email")
        .required("Email is required")
        .test("unique-email", "Email is already taken", validateEmail),
      password: Yup.string()
        .required("Password is required")
        .min(8, "At least 8 characters")
        .matches(/[A-Z]/, "At least one uppercase letter")
        .matches(/[a-z]/, "At least one lowercase letter")
        .matches(/[0-9]/, "At least one number")
        .matches(/[@$!%*?&]/, "At least one special character"),
      confirmPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
      address: Yup.string().required("Address is required"),
    }),
    onSubmit: async (values, { setFieldError, resetForm }) => {
      setSubmitButtonStatus({
        loading: true,
        submitButtonText: "Loading...",
        isSubmitted: true,
      });
      try {
        const user: RegisterModel = {
          nameU: values.name,
          userName: values.userName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          password: values.password,
          address: values.address,
        };

        const response = await fetch(
          "https://citypulse.runasp.net/api/User/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
          }
        );

        if (!response.ok) {
          if (response.status === 400) {
            const data = await response.json();
            if (data.errors?.PhoneNumber) {
              setFieldError("phoneNumber", data.errors.PhoneNumber[0]);
            }
          }
          throw new Error("Failed to register");
        }

        toast.success("Registration successful!");
        setSubmitButtonStatus({
          loading: false,
          submitButtonText: "Submitted successfully",
          isSubmitted: true,
        });
        setTimeout(() => {
          setSubmitButtonStatus({
            loading: false,
            submitButtonText: "Register",
            isSubmitted: false,
          });
          resetForm();
          router.push("/login");
        }, 2000);
      } catch (error) {
        toast.error("Registration failed!");
        console.error("Error:", error);
        setSubmitButtonStatus({
          loading: false,
          submitButtonText: "Failed to register",
          isSubmitted: true,
        });
        setTimeout(() => {
          setSubmitButtonStatus({
            loading: false,
            submitButtonText: "Register",
            isSubmitted: false,
          });
          resetForm();
        }, 2000);
      }
    },
  });

  useEffect(() => {
    if (!isOpened) {
      formik.setErrors({
        name: "",
        phoneNumber: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
      });
    }
  }, [isOpened]);

  const HandleSubmitButton = (arg: boolean) => {
    if (arg) registerForm.current?.dispatchEvent(new Event("submit"));
  };

  return (
    <div
      className={`relative flex justify-center items-center min-h-screen bg-blue-50 ${
        isOpened ? "show" : ""
      }`}
      style={{
        backgroundImage: "url('/assets/Images/homepage.png')",
        backgroundSize: "cover",
      }}
    >
      <Toaster position="top-right" />
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl">
        <form
          ref={registerForm}
          onSubmit={formik.handleSubmit}
          className="space-y-6"
        >
          <h1 className="text-4xl font-bold text-center text-blue-700">
            Create Account
          </h1>

          {[
            { label: "Full Name", id: "name" },
            { label: "Username", id: "userName" },
            {
              label: "Phone Number",
              id: "phoneNumber",
              onKeyDown: onlyNumbers,
            },
          ].map(({ label, id, onKeyDown }) => (
            <div key={id}>
              <label htmlFor={id} className="block font-medium text-gray-700">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                id={id}
                name={id}
                type="text"
                onKeyDown={onKeyDown}
                value={formik.values[id as keyof typeof formik.values]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 w-full border rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {formik.touched[id as keyof typeof formik.touched] &&
                formik.errors[id as keyof typeof formik.errors] && (
                  <span className="text-sm text-red-600">
                    {formik.errors[id as keyof typeof formik.errors]}
                  </span>
                )}
            </div>
          ))}

          <div>
            <label
              htmlFor="address"
              className="block font-medium text-gray-700"
            >
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 w-full border rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
            {formik.touched.address && formik.errors.address && (
              <span className="text-sm text-red-600">
                {formik.errors.address}
              </span>
            )}
          </div>

          <div className="flex gap-6">
            {[
              { id: "email", type: "email" },
              { id: "password", type: "password" },
            ].map(({ id, type }) => (
              <div className="w-1/2" key={id}>
                <label htmlFor={id} className="block font-medium text-gray-700">
                  {id.charAt(0).toUpperCase() + id.slice(1)}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  value={formik.values[id as keyof typeof formik.values]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onCopy={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  className="mt-1 w-full border rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {formik.touched[id as keyof typeof formik.touched] &&
                  formik.errors[id as keyof typeof formik.errors] && (
                    <span className="text-sm text-red-600">
                      {formik.errors[id as keyof typeof formik.errors]}
                    </span>
                  )}
              </div>
            ))}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block font-medium text-gray-700"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              className="mt-1 w-full border rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <span className="text-sm text-red-600">
                  {formik.errors.confirmPassword}
                </span>
              )}
          </div>

          <SubmitButton
            submitButtonStatus={submitButtonStatus}
            HandleSubmitButton={HandleSubmitButton}
          />

          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <button
              type="button"
              onClick={() => {
                setIsOpened(false);
                setTimeout(() => router.push("/login"), 1000);
              }}
              className="text-blue-700 font-semibold hover:underline"
            >
              Log in!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterComponent;
