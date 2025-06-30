
import AboutClient from "@/components/AboutClient";
import { Metadata } from "next";


export  const generateMetadata=():Metadata=>{
return{
    title:"About",
}
}
export default function  About (){
    return <AboutClient/>
}