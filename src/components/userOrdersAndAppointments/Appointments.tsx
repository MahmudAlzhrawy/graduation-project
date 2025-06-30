"use client";
import { ManageRestoContext } from "@/app/Context/ManageRestoContext";
import { useContext } from "react";
import {
FaUser,
FaMapMarkerAlt,
FaDollarSign,
FaClipboardList,
} from "react-icons/fa";

export default function AppointmentComponent() {
const { appointments } = useContext(ManageRestoContext);

return (
<div className="p-6 bg-gray-100 min-h-screen">
    <h1 className="text-3xl font-bold text-blue-700 mb-10 text-center">
    📅 My Appointments
    </h1>

    {appointments.length === 0 ? (
    <p className="text-gray-500 text-center text-lg">
        No appointments found.
    </p>
    ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {appointments.map((appointment: any) => {
        const total = appointment.appointmentDetails.reduce(
            (acc: number, detail: any) => acc + detail.subTotalPrice,
            0
        );

        return (
            <div
            key={appointment.appointmentId}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 border-t-4 border-blue-600"
            >
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-800">
                    Appointment #{appointment.appointmentId}
                </h2>
                <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full 
                    ${
                        appointment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : appointment.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                >
                    {appointment.status}
                </span>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                <p className="flex items-center gap-2">
                    <FaUser className="text-blue-600" />
                    <span className="font-medium">Patient:</span>{" "}
                    {appointment.patientName}
                </p>
                <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-600" />
                    <span className="font-medium">Address:</span>{" "}
                    {appointment.patientAddress}
                </p>
                <p className="flex items-center gap-2">
                    <FaDollarSign className="text-blue-600" />
                    <span className="font-medium">Total Price:</span>{" "}
                    {total.toFixed(2)} EGP
                </p>
                </div>

                <div className="mt-5">
                <h3 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <FaClipboardList className="text-orange-500" />
                    Services
                </h3>
                <ul className="divide-y divide-gray-200">
                    {appointment.appointmentDetails.map(
                    (detail: any, index: number) => (
                        <li
                        key={index}
                        className="py-2 text-sm flex justify-between items-center"
                        >
                        <span className="text-gray-800 font-medium">
                            Service ID: {detail.servicesId}
                        </span>
                        <span className="text-gray-600">
                            {detail.subTotalPrice} EGP
                        </span>
                        </li>
                    )
                    )}
                </ul>
                </div>
            </div>
            </div>
        );
        })}
    </div>
    )}
</div>
);
}
