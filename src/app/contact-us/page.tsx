import ContactPage from "@/components/Contact Us/ContactPage";
import { Metadata } from "next";
export const generateMetadata =():Metadata=>{
  return{
    title:"Contact",
  }
}
  
export default function Contact() {
  return <ContactPage />;
}
