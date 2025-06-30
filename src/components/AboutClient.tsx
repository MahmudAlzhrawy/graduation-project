"use client";
import { useEffect, useState } from "react";

interface Mempers {
  id: number;
  name: string;
  major: string;
  technology: string;
  email: string;
  linkedIn: string;
  imageUrl: string;
}

const AboutClient = () => {
  const [mempers, setMempers] = useState<Mempers[]>();

  useEffect(() => {
    const fetchMempersData = async () => {
      const res = await fetch("/jsons/teamMempers-data.json");
      const data = await res.json();
      setMempers(data);
    };
    fetchMempersData();
  }, []);

  return (
    <div className="main">
      <div className="content w-[90%] mx-auto mt-8">
        <div className="presentation font"></div>
        <div className="teamMempers text-center">
          <div className="memper w-1/2 mx-auto h-full">
            {mempers?.map((memper) => (
              <div
                key={memper.id}
                className="hover:brightness-95 overflow-hidden mempcont h-full mb-10 border-4 shadow-lg shadow-blue-200 bg-slate-200"
              >
                <img
                  className="hover:scale-110 duration-700 ease-in-out"
                  height={300}
                  src={`/assets/Images/home3.jpg`}
                  alt="Not Found"
                />
                <div className="personal p-3">
                  <h2 className="text-3xl font-sans font-bold tracking-tight">
                    {memper.name}
                  </h2>
                  <p className="font-serif text-lg">
                    <span className="font-bold">Major</span>: {memper.major}
                  </p>
                  <p className="font-serif text-lg">{memper.technology}</p>
                  <div className="linkes flex justify-between">
                    <p>{memper.email}</p>
                    <p>{memper.linkedIn}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutClient;
