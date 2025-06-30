"use client";
import { ManageRestoContext } from "@/app/Context/ManageRestoContext";
import { useContext } from "react";
import { FaMapMarkerAlt, FaPhone, FaDollarSign, FaUtensils } from "react-icons/fa";

export default function OrdersComponent() {
const { orders } = useContext(ManageRestoContext);

return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-16">
    <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-10 text-center">
        🧾 My Orders
        </h1>

        {orders.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No orders found.</p>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {orders.map((order) => (
            <div
                key={order.orderId}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 border-t-4 border-blue-600"
            >
                <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-blue-800">Order #{order.orderId}</h2>
                    <span
                    className={`
                        text-xs font-semibold px-3 py-1 rounded-full 
                        ${
                        order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }
                    `}
                    >
                    {order.status}
                    </span>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                    <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-600" /> 
                    <span className="font-medium">Location:</span> {order.location}
                    </p>
                    <p className="flex items-center gap-2">
                    <FaPhone className="text-blue-600" /> 
                    <span className="font-medium">Phone:</span> {order.phoneNumber}
                    </p>
                    <p className="flex items-center gap-2">
                    <FaDollarSign className="text-blue-600" /> 
                    <span className="font-medium">Total Price:</span>{" "}
                    ${order.orderDetails.reduce((acc, meal) => acc + (meal.subTotalPrice * meal.quantity), 0).toFixed(2)}
</p>
                </div>

                <div className="mt-6">
                    <h3 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <FaUtensils className="text-orange-500" /> Ordered Meals
                    </h3>
                    <ul className="divide-y divide-gray-200">
                    {order.orderDetails.map((meal, index) => (
                        <li key={index} className="py-2 text-sm flex justify-between items-center">
                        <span className="text-gray-800 font-medium">{meal.mealName}</span>
                        <span className="text-gray-600">
                            {meal.quantity} × ${meal.subTotalPrice}
                        </span>
                        </li>
                    ))}
                    </ul>
                </div>
                </div>
            </div>
            ))}
        </div>
        )}
    </div>
    </div>
);
}
