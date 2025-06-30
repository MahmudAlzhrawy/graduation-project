"use client";

import { usePathname, useRouter } from "next/navigation";
import { Provider, useSelector } from "react-redux";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log(children);
  const pathname = usePathname();
  const router = useRouter();
  const auth = useSelector((state: any) => state.auth);
  const isLoading = auth === undefined;
  useEffect(() => {
    if (!isLoading) {
      if (auth !== undefined) {
        if (
          pathname === "/login" &&
          auth?.userToken &&
          auth.user?.roles !== "User"
        ) {
        } else if (
          pathname === "/register" &&
          auth?.userToken &&
          auth.user?.roles !== "User"
        ) {
        } else if (
          pathname === "/unauthorized" &&
          auth?.userToken &&
          auth.user?.roles !== "User"
        ) {
        } else if (auth?.userToken && auth.user?.roles !== "User") {
          location.replace("/login");
        } else if (pathname === "/en/Account/Profile" && !auth.userToken) {
          router.push("/login");
        } else if (
          pathname === "/en/Account/Profile" &&
          auth?.userToken &&
          auth.user?.roles !== "User"
        ) {
          router.push("/unauthorized");
        }
      }
    }
  }, [isLoading, auth]);

  const hideUIPaths = [
    "/unauthorized",
    "/login",
    "/en/Account/Profile",
    "/en/Account/appointments",
    "/en/Account/orders",
    "/register",
    "/en/doctors/Reservation/create",
    "/admin",
    "/admin/dashboard",
    "/admin/recent-orders",
    "/admin-doctor",
    "/admin-doctor/dashboard",
    "/admin-doctor/admin-doctor-appointments",
    "/admin-doctor/admin-doctor-profile",
    "/admin-doctor/scheduling_the_days_of_the_week",
    "/admin-doctor/admin-doctor-reports",
    "/admin-doctor/admin-doctor-medical-services",
    "/admin-doctor/create-service",
    "/admin-doctor/update-service",
    "/admin-doctor/show-all-schduling-dates",
    "/admin-doctor/update-scheduling-date",
    "/payment-success",
  ];

  const showUI = !hideUIPaths.includes(pathname!);

  return (
    <>
      {showUI && <Navbar />}
      <Toaster position="bottom-center" />
      {children}
      {showUI && <Footer />}
    </>
  );
}
