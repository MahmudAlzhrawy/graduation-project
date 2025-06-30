import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineClose } from "react-icons/ai";
import "@/components/Restaurants/Orders/style.css";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Toast } from "@/sweetAlert2";
import { store } from "@/lib/store";
import { backendURL } from "@/lib/Slices/auth/authRules";
import { ManageRestoContext } from "@/app/Context/ManageRestoContext";

interface Meal {
  quantity: number;
  mealName: string;
  price: number;
}

interface props {
  totalPrice: number;
  filterd: Meal[];
  mealIds: number[];
  setCheckoutClick: Dispatch<SetStateAction<boolean>>;
  restoId: any;
}

export default function CheckoutService({
  setCheckoutClick,
  filterd,
  mealIds,
  restoId,
  totalPrice,
}: props) {
  const { removeAllItemsFromCart } = useContext(ManageRestoContext);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCashPayment = async () => {
    try {
      const response = await fetch(
        `${backendURL}/api/User/GetUserById/${store.getState().auth.user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${store.getState().auth.userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const userObject = await response.json();

        const res = await fetch(
          "https://citypulse.runasp.net/api/Restaurant/CreateOrder",
          {
            method: "POST",
            mode: "cors",
            headers: {
              Authorization: `Bearer ${store.getState().auth.userToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: store.getState().auth.user?.id,
              restaurantId: restoId,
              totalPrice: totalPrice,
              location: userObject.address,
              phoneNumber: userObject.phoneNumber,
              orderDetails: filterd.map((item) => ({
                mealName: item.mealName,
                quantity: item.quantity,
                subTotalPrice: item.price * item.quantity,
              })),
            }),
          }
        );

        if (res.ok) {
          const orderId: Promise<number> = await res.json();

          const thirdResponse = await fetch(
            "https://citypulse.runasp.net/api/User/SaveTransaction",
            {
              method: "POST",
              mode: "cors",
              headers: {
                Authorization: `Bearer ${store.getState().auth.userToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: store.getState().auth.user?.id,
                amount: totalPrice,
                paymentMethod: "Manual",
                status: "Pending",
                transactionType: "Order",
                referenceId: orderId,
              }),
            }
          );

          if (thirdResponse.ok) {
            Toast.fire({
              title: "Order created and paid in cash",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
            removeAllItemsFromCart(mealIds, restoId);
            setCheckoutClick(false);
          } else {
            const errorMessage = await thirdResponse.text();
            console.log("Server Error:", errorMessage);
            Toast.fire({
              title: "An error occurred while creating the order.",
              icon: "error",
              showConfirmButton: true,
              timer: 1500,
            });
          }
        } else {
          const errorMessage = await res.text();
          console.log("Server Error:", errorMessage);
          Toast.fire({
            title: "An error occurred while creating the order.",
            icon: "error",
            showConfirmButton: true,
            timer: 1500,
          });
        }
      }
    } catch (error) {
      console.log("Cash Order Error", error);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-lg z-50">
      <div className="relative bg-white/90 shadow-lg rounded-lg p-8 w-[400px] backdrop-blur-lg border border-gray-200">
        <AiOutlineClose
          className="absolute top-3 right-3 text-gray-700 text-2xl cursor-pointer hover:text-red-500 transition"
          onClick={() => setCheckoutClick(false)}
        />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-5">
          Checkout
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center pt-2">
            <div className="w-full border-t border-gray-300"></div>
            <span className="px-2 text-gray-400">OR</span>
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <button
            type="button"
            onClick={handleCashPayment}
            className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded shadow"
          >
            {loading ? "Processing..." : "Pay with Cash"}
          </button>
        </div>
      </div>
    </div>
  );
}
