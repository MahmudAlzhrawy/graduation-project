import { redirect } from "next/navigation";
interface Props {
  sendFromServicesDropDownList: (change: boolean) => void;
}
export const ServicesDropDownList = (props: Props) => {
  return (
    <div
      className="absolute top-[6%] right-[37%] translate-x-1/2 z-50"
      onMouseEnter={() => props.sendFromServicesDropDownList(true)}
      onMouseLeave={() => props.sendFromServicesDropDownList(false)}
    >
      <div className="Lis bg-white  rounded-xl  w-48 overflow-hidden ">
        <ul className="p-0.5 ">
          <li
            onClick={() => redirect("/services/schools")}
            className="pl-2 py-2 hover:cursor-pointer border-b border-gray-400  duration-500 ease-in-out hover:brightness-95 mb-1 bg-gray-50 hover:text-blue-700   text-blue-700 text-xl font-serif "
          >
            <span className=" hover:translate-x-4 duration-500 ease-in-out inline-block">
              Schools
            </span>
          </li>
          <li
            onClick={() => redirect("/services/hospitals")}
            className="pl-2 py-2 hover:cursor-pointer border-b border-gray-400  duration-500 ease-in-out hover:brightness-95 mb-1 bg-gray-50 hover:text-blue-700   text-blue-700 text-xl font-serif "
          >
            <span className=" hover:translate-x-4 duration-500 ease-in-out inline-block">
              Hospitals
            </span>
          </li>
          <li
            onClick={() => redirect("/doctors")}
            className="pl-2 py-2  hover:cursor-pointer  border-b border-gray-400  duration-500 ease-in-out hover:brightness-95 mb-1 bg-gray-50 hover:text-blue-700   text-blue-700 text-xl font-serif "
          >
            <span className=" hover:translate-x-4 duration-500 ease-in-out inline-block">
              Doctors
            </span>
          </li>
          <li
            onClick={() => redirect("/services/restaurants")}
            className="pl-2 py-2  hover:cursor-pointer  duration-500 ease-in-out hover:brightness-95 mb-1 bg-gray-50  hover:text-blue-700   text-blue-700 text-xl font-serif "
          >
            <span className=" hover:translate-x-4 duration-500 ease-in-out inline-block">
              Restuarant
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
