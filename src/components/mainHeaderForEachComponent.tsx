"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
export interface ImainRestaurantHeader {
  image: string;
  text: string;
}
type Props = {
  mainHeader: ImainRestaurantHeader;
};
const MainHeaderForEachComponent: React.FC<Props> = (props) => {
  const info = useRef<HTMLDivElement>(null);
  const router = useRouter();
  return (
    <div
      className={
        "bg-cover w-full bg-gray-500 bg-blend-multiply h-[400px] flex flex-col justify-center"
      }
      style={{ backgroundImage: ` ${props.mainHeader.image} ` }}
    >
      <h1 className="text-white text-7xl font-serif font-bold mb-4 text-center">
        {props.mainHeader.text}
      </h1>
      <div className="flex flex-row justify-center gap-2">
        <h6
          className="text-white text-base font-sans font-normal cursor-pointer hover:text-blue-500"
          onClick={() => {
            if (info.current !== null) {
              info.current.style.display = "none";
              setTimeout(() => {
                router.push("/");
              }, 500);
            }
          }}
          onMouseOver={(e) => {
            const x: number = e.clientX;
            const y: number = e.clientY;
            if (info.current !== null) {
              info.current.style.left = x + 11 + "px";
              info.current.style.top = y + 28 + "px";
              setTimeout(() => {
                if (info.current !== null) {
                  info.current.style.display = "inline-block";
                }
              }, 1000);
            }
          }}
          onMouseLeave={() => {
            if (info.current !== null) {
              info.current.style.display = "none";
            }
          }}
        >
          home
        </h6>
        <div
          ref={info}
          style={{ display: "none" }}
          className="absolute w-16 h-6  bg-gray-100 flex justify-center items-center pb-2 px-2"
        >
          <div className="text-base text-gray-800">home</div>
        </div>

        <span className="text-white text-base font-sans font-normal">|</span>
        <h5 className="text-white text-base font-sans font-normal">
          {props.mainHeader.text}
        </h5>
      </div>
    </div>
  );
};

export default MainHeaderForEachComponent;
