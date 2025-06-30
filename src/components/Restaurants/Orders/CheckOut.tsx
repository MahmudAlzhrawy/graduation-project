import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineClose } from "react-icons/ai"; // استيراد أيقونة الإغلاق
import "@/components/Restaurants/Orders/style.css";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Toast } from "@/sweetAlert2";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import convertToSubCurrency from "@/ExternalFunctions/convertToSubCurrency";
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
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubCurrency(totalPrice) }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Client Secret from Stripe:", data.clientSecret);
        setClientSecret(data.clientSecret);
      });
  }, [totalPrice]);
  const token = localStorage.getItem("Token");
  const formik = useFormik({
    initialValues: {
      name: "",
      phoneNumber: "",
      address: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("This field is required"),
      phoneNumber: Yup.string()
        .matches(/^\d{11}$/, "Phone number must be exactly 11 digits")
        .required("This field is required"),
      address: Yup.string().required("This field is required"),
    }),
    onSubmit: async (values) => {
      console.log("token", token);

      const userId = localStorage.getItem("userId");
      if (!token || !userId) {
        console.log("Error: Missing token or userId");
        return;
      }

      try {
        const res = await fetch(
          "http://citypulse.runasp.net/api/Restaurant/CreateOrder",
          {
            method: "POST",
            mode: "cors",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId,
              restaurantId: restoId,
              totalPrice: totalPrice,
              location: values.address,
              phoneNumber: values.phoneNumber,
              orderDetails: filterd.map((item) => ({
                mealName: item.mealName,
                quantity: item.quantity,
                subTotalPrice: item.price * item.quantity,
              })),
            }),
          }
        );

        if (res.ok) {
          Toast.fire({
            title: "تم انشاء الطلب  بنجاح",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          setCheckoutClick(false);
        } else {
          const errorMessage = await res.text();
          console.log("Server Error:", errorMessage);
          Toast.fire({
            title: "هناك مشكله اثناء اتمام الطلب حاول مره اخرى",
            icon: "warning",
            showConfirmButton: true,
            timer: 1500,
          });
        }
      } catch (error) {
        console.log("Error", error);
      }
    },
  });
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(
        submitError.message !== undefined ? submitError.message : ""
      );
      setLoading(false);
      return;
    }

    // const { error } = await stripe.confirmPayment({
    //   elements,
    //   clientSecret,
    //   confirmParams: {
    //     return_url: `https://${location.host}/payment-success?amount=${totalPrice}`,
    //   },
    // });

    // if (error) {
    //   // This point is only reached if there's an immediate error when
    //   // confirming the payment. Show the error to your customer (for example, payment details incomplete)
    //   setErrorMessage(error.message !== undefined ? error.message : "");
    // } else {
    // The payment UI automatically closes with a success animation.
    // Your customer is redirected to your `return_url`.
    try {
      debugger;
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
                paymentMethod: "Visa",
                status: "Pending",
                transactionType: "Order",
                referenceId: orderId,
              }),
            }
          );
          if (thirdResponse.ok) {
            Toast.fire({
              title: "Order created and paid online",
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
            title: "There was a problem completing the request. Try again.",
            icon: "warning",
            showConfirmButton: true,
            timer: 1500,
          });
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
    // }

    setLoading(false);
  }
  async function handleCashPayment() {
    try {
      debugger;
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
          console.log(orderId);
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
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-lg z-50">
      <div className="relative bg-white/90 shadow-lg rounded-lg p-8 w-[400px] backdrop-blur-lg border border-gray-200">
        {/* زر الإغلاق (X) */}
        <AiOutlineClose
          className="absolute top-3 right-3 text-gray-700 text-2xl cursor-pointer hover:text-red-500 transition"
          onClick={() => setCheckoutClick(false)}
        />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-5">
          Checkout
        </h2>
        {!clientSecret || !stripe || !elements ? (
          <div className="flex items-center justify-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {clientSecret && <PaymentElement />}
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
            {clientSecret && stripe && elements && (
              <>
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
                  Pay with Cash
                </button>
              </>
            )}
            {/* Submit Button */}
            <button
              disabled={!stripe || loading}
              className="submit-button"
              type="submit"
            >
              {!loading ? `Pay EGP${totalPrice}` : "Processing..."}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
