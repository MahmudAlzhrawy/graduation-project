import Login from "@/components/Account Pages/Login";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return {
    title: "login",
  };
}
export default function LoginPage() {
  return <Login />;
}
