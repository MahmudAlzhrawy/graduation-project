"use client";
import { useState } from "react";
import { IoPersonOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { MdNoMeals } from "react-icons/md";
import { BsFillCalendarDateFill } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/Slices/auth/authSlice";
import { store } from "@/lib/store";

interface Props {
  sendFromChild: (change: boolean) => void;
  sendFromChildTwo: (click: boolean) => void;
}

export const AccountDropDownList = ({ sendFromChild, sendFromChildTwo }: Props) => {
  const router = useRouter();
  const dispatchStore = useDispatch();

  const handleLogout = () => {
    dispatchStore(logout());
    sendFromChild(false);
  };

  const isLoggedIn = store.getState().auth.userToken !== null;

  return (
    <div
      onMouseEnter={() => sendFromChildTwo(true)}
      onMouseLeave={() => sendFromChildTwo(false)}
      className="absolute top-[100%] right-[8%] z-50"
    >
      <div className="bg-white rounded-xl w-44 overflow-hidden shadow-lg">
        {isLoggedIn ? (
          <ul className="p-0.5 flex flex-col gap-y-2">
            <li className="text-blue-600 pl-2 py-2 border-b border-gray-300 bg-gray-50 hover:bg-gray-100 transition duration-300">
              <Link
                href="/en/Account/Profile"
                className="flex items-center gap-x-2 hover:translate-x-2 transition duration-300"
              >
                <IoPersonOutline className="text-2xl" />
                <span>My Profile</span>
              </Link>
            </li>
            <li className="text-blue-600 pl-2 py-2 border-b border-gray-300 bg-gray-50 hover:bg-gray-100 transition duration-300">
              <Link
                href="/en/Account/orders"
                className="flex items-center gap-x-2 hover:translate-x-2 transition duration-300"
              >
                <MdNoMeals className="text-2xl" />
                <span>My Orders</span>
              </Link>
            </li>
            <li className="text-blue-600 pl-2 py-2 border-b border-gray-300 bg-gray-50 hover:bg-gray-100 transition duration-300">
              <Link
                href="/en/Account/appointments"
                className="flex items-center gap-x-2 hover:translate-x-2 transition duration-300"
              >
                <BsFillCalendarDateFill className="text-2xl" />
                <span>Appointments</span>
              </Link>
            </li>
            <li
              onClick={handleLogout}
              className="text-blue-600 pl-2 py-2 border-b border-gray-300 bg-gray-50 hover:bg-gray-100 transition duration-300"
            >
              <Link
                href="/"
                className="flex items-center gap-x-2 hover:translate-x-2 transition duration-300"
              >
                <TbLogout2 className="text-2xl" />
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        ) : (
          <ul className="p-0.5 flex flex-col gap-y-2">
            <li className="text-blue-600 pl-2 py-2 border-b border-gray-300 bg-gray-50 hover:bg-gray-100 transition duration-300">
              <Link
                href="/login"
                className="block hover:translate-x-2 transition duration-300"
              >
                Login
              </Link>
            </li>
            <li className="text-blue-600 pl-2 py-2 bg-gray-50 hover:bg-gray-100 transition duration-300">
              <Link
                href="/register"
                className="block hover:translate-x-2 transition duration-300"
              >
                Signup
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};
