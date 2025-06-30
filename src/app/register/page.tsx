import RegisterComponent from "@/components/Account Pages/Register";
import { Metadata } from "next";
export function generateMetadata(): Metadata {
  return {
    title: "Register",
  };
}
export default function Register() {
  return <RegisterComponent />;
}
