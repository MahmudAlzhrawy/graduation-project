"use client";
import Link from "next/link";
import { useEffect } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { ChevronDoubleRightIcon } from "@heroicons/react/solid";
export default function Footer() {
  const Services = [
    { name: "Hospital", link: "/services/hospitals" },
    { name: "School", link: "/services/schools" },
    { name: "Clinics", link: "/doctors" },
    { name: "Restaurant", link: "/services/restaurants" },
  ];
  const About = [
    { name: "Contact us", link: "/contact-us" },
    { name: "About us", link: "#" },
    { name: "Terms and Conditions", link: "#" },
    { name: "Privacy Policy", link: "#" },
  ];
  const tex = "City Guide |";
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = index % tex.length;
      const asiu: HTMLElement | null = document.getElementById("asiu");
      asiu!.textContent = tex
        .substring(0, index)
        .concat(" " + tex[tex.length - 1]);
      index++;
    }, 250);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="Main bg-gray-800 py-8">
      <div className="feildes w-[95%] py-3  mx-auto grid grid-cols-3">
        <div className="social ">
          <h2
            id="asiu"
            className="  h-10 text-2xl text-blue-400 font-normal "
          ></h2>
          <div style={{ display: "flex", gap: "1rem" }}>
            <FaFacebook style={{ color: "#4267B2", fontSize: "2rem" }} />
            <FaInstagram style={{ color: "#E1306C", fontSize: "2rem" }} />
            <FaWhatsapp style={{ color: "#25D366", fontSize: "2rem" }} />
            <FaLinkedin style={{ color: "#0A66C2", fontSize: "2rem" }} />
            <FaTwitter style={{ color: "#1DA1F2", fontSize: "2rem" }} />
          </div>
          <div className="text-lg mt-[10%] font-medium text-gray-500">
            cityguide@gmail.com
          </div>
        </div>
        <div className="services">
          <h2 className="text-center text-2xl text-gray-200 font-bold">
            Services
          </h2>
          {Services.map((service, index) => (
            <div
              key={index}
              className={`${
                index === Services.length - 1
                  ? "border-transparent"
                  : "border-b-2 border-gray-600"
              } serviceItem translate-x-16   w-[85%]  pb-3 pt-1  text-lg font-medium text-gray-500`}
            >
              <span>
                <ChevronDoubleRightIcon className="h-6 w-6 inline-block text-blue-500 mr-2" />
              </span>
              <Link href={service.link}>{service.name}</Link>
            </div>
          ))}
        </div>
        <div className="about">
          <h2 className="text-center text-2xl text-gray-200 font-bold">
            About Us
          </h2>
          {About.map((about, index) => (
            <div
              key={index}
              className={`${
                index === About.length - 1
                  ? "border-transparent"
                  : "border-b-2 border-gray-600"
              } aboutItem translate-x-16  w-[85%] pb-3 pt-1  text-lg font-medium text-gray-500`}
            >
              <span>
                <ChevronDoubleRightIcon className="h-6 w-6 inline-block text-blue-500 mr-2" />
              </span>
              <Link href={about.link}>{about.name}</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
