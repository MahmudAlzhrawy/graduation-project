"use client";
import { useContext, useEffect, useState } from "react";
import { ManageRestoContext } from "@/app/Context/ManageRestoContext";
import { store } from "@/lib/store";
import CheckoutService from "../Orders/CheckOut";

interface Meal {
  id: number;
  quantity: number;
  mealId: number;
  mealName: string;
  description: string;
  price: number;
  mealImage: string;
  restaurantId: number;
}

export default function CartItems({ restoId }: any) {
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [checkoutclick, setCheckoutClick] = useState<boolean>(false);
  const { cartItems, removeItemFromCart } = useContext(ManageRestoContext);

  const filterd = cartItems.filter((item) => item.restaurantId == restoId);
  const mealIds = filterd.map((meal) => meal.id);

  useEffect(() => {
    setTotalPrice(
      filterd.reduce((total, item) => total + item.price * item.quantity, 0)
    );
  }, [cartItems]);

  return (
    <>
      {checkoutclick && (
        <CheckoutService
          totalPrice={totalPrice}
          restoId={restoId}
          filterd={filterd}
          mealIds={mealIds}
          setCheckoutClick={setCheckoutClick}
        />
      )}

      <div className={`main my-10`} style={filterd.length === 0 ? { height: "500px" } : {}}>
        <h1
          className="text-5xl text-gray-400 font-bold font-serif tracking-tighter text-center italic"
          style={filterd.length === 0 ? { marginBottom: "50px" } : {}}
        >
          Cart
        </h1>
        <div className="container border mx-auto p-2">
          {filterd.length > 0 && (
            <div className="flex justify-evenly items-center">
              <h2 className="border p-5 text-blue-950 font-bold">
                Total:
                <span className=" inline-block text-red-400 text-bolde font-mono px-2">
                  {totalPrice}
                </span>
                <span className="inline-block text-sm ">EGP</span>
              </h2>
              <button
                onClick={() => {
                  if (
                    store.getState().auth.userToken !== null &&
                    store.getState().auth.user?.roles === "User"
                  ) {
                    setCheckoutClick((el) => !el);
                  } else {
                    location.replace("/login");
                  }
                }}
                className="bg-gradient-to-tr from-violet-600 to-violet-300 p-3 hover:brightness-75 text-white font-bold rounded-lg  text-center translate-x-1/2"
              >
                Checkout
              </button>
            </div>
          )}

          {filterd.length > 0 ? (
            <div className="overflow-scroll h-80">
              {filterd.map((item: Meal, index) => (
                <div
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-blue-100"
                  } 
                  container rounded-lg hover:brightness-90 px-4 py-3 w-4/5 mx-auto 
                  flex items-center gap-4 my-2`}
                >
                  <img
                    src={`https://citypulse.runasp.net${item.mealImage}`}
                    alt={item.mealName}
                    className="rounded-full w-[100px] h-[100px] object-cover border-2 border-gray-300"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.mealName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                    <p className="text-md font-medium text-gray-700 mt-2">
                      <span className="font-semibold text-gray-800">
                        Quantity:
                      </span>{" "}
                      {item.quantity}
                    </p>
                    <p className="text-md font-medium text-gray-700">
                      <span className="font-semibold text-gray-800">
                        Price:
                      </span>{" "}
                      ${item.price * item.quantity}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                      onClick={() =>
                        removeItemFromCart(item.mealId, item.restaurantId)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">
              <h1 className="text-center align-middle duration-500 my-20 font-serif animate-pulse text-blue-900 text-6xl font-bold">
                Empty Cart
              </h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
