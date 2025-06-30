"use client";
import { useState } from "react";
import { IoPersonOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { MdNoMeals } from "react-icons/md";
import { BsFillCalendarDateFill } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { store } from "@/lib/store";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/Slices/auth/authSlice";
interface Props {
  sendFromChild: (change: boolean) => void;
  sendFromChildTwo: (click: boolean) => void;
}
export const AccountDropDownList = (props: Props) => {
  const router = useRouter();
  const dispatchStore = useDispatch();
  const [logoutClicked, setLogoutClicked] = useState<boolean>(false);
  return (
    <div
      onMouseEnter={() => props.sendFromChildTwo(true)}
      onMouseLeave={() => props.sendFromChildTwo(false)}
      className="absolute top-[100%] right-[8%] z-50"
    >
      <div className="Lis bg-white  rounded-xl w-44 overflow-hidden ">
        {store.getState().auth.userToken !== null ? (
          <ul className="p-0.5 flex flex-col gap-y-2">
            <li
              onClick={() => {
                router.push("/en/Account/Profile");
              }}
              className="w-full text-blue-600 pl-2 py-2 border-b border-gray-400  duration-500 ease-in-out hover:brightness-95 mb-1 bg-gray-50 hover:text-blue-700 text-xl font-serif "
            >
              <Link
                className="flex flex-row gap-x-2 hover:translate-x-4 duration-500 ease-in-out"
                href={"/en/Account/Profile"}
              >
                <IoPersonOutline className="text-2xl" />
                <span className="space-x-2">My Profile</span>
              </Link>
            </li>
            <li
              onClick={() => {
                router.push("/en/Account/orders");
              }}
              className="w-full text-blue-600 pl-2 py-2 border-b border-gray-400  duration-500 ease-in-out hover:brightness-95 mb-1 bg-gray-50 hover:text-blue-700 text-xl font-serif "
            >
              <Link
                className="flex flex-row gap-x-2 hover:translate-x-4 duration-500 ease-in-out"
                href={"/en/Account/orders"}
              >
                <MdNoMeals className="text-2xl" />
                <span className="space-x-2">My Orders</span>
              </Link>
            </li>
            <li
              onClick={() => {
                router.push("/en/Account/appointments");
              }}
              className="w-full text-blue-600 pl-2 py-2 border-b border-gray-400  duration-500 ease-in-out hover:brightness-95 mb-1 bg-gray-50 hover:text-blue-700 text-xl font-serif "
            >
              <Link
                className="flex flex-row gap-x-2 hover:translate-x-4 duration-500 ease-in-out"
                href={"/en/Account/appointments"}
              >
                <BsFillCalendarDateFill className="text-2xl" />
                <span>Appoint...</span>
              </Link>
            </li>

            <li
              onClick={() => {
                dispatchStore(logout());
                setLogoutClicked(true);
                props.sendFromChild(false);
              }}
              className="w-full text-blue-600 pl-2 py-2 border-b border-gray-400  duration-500 ease-in-out hover:brightness-95 mb-1 bg-gray-50 hover:text-blue-700 text-xl font-serif "
            >
              <Link
                className="flex flex-row gap-x-2 hover:translate-x-4 duration-500 ease-in-out"
                href={"/"}
              >
                <TbLogout2 className="text-2xl" />
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        ) : (
          <ul className="p-0.5 ">
            <li
              onClick={() => {
                router.push("/login");
              }}
              className="pl-2 py-2  border-b border-gray-400  duration-500 ease-in-out hover:brightness-95 mb-1 bg-gray-50 text-blue-600 hover:text-blue-700 text-xl font-serif "
            >
              <Link
                className=" hover:translate-x-4 duration-500 ease-in-out inline-block"
                href={"/login"}
              >
                Login
              </Link>
            </li>
            <li
              onClick={() => {
                router.push("/register");
              }}
              className="pl-2 py-2   duration-500 ease-in-out hover:brightness-95 mb-1 bg-gray-50 text-blue-600 hover:text-blue-700 text-xl font-serif "
            >
              <Link
                href="/register"
                className=" hover:translate-x-4 duration-500 ease-in-out inline-block"
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
