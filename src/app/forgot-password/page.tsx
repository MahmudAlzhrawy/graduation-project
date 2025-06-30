import ForgotPassword from "@/components/Account Pages/ForgotPassword";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return {
    title: "forgot-password",
  };
}
export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
