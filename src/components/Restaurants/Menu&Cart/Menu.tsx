"use client";
import { ManageRestoContext } from "@/app/Context/ManageRestoContext";
import CartBar from "./CartBar";
import Card from "@/Ui/Card";
import { useContext, useEffect, useState } from "react";
interface Meal {
  quantity: number;
  id: number;
  mealId: number;
  mealName: string;
  description: string;
  price: number;
  mealImage: string;
  restaurantId: number;
}
export default function Menu({ restoId }: any) {
  const [clicked, setClicked] = useState<boolean>(() => {
    return JSON.parse(localStorage.getItem("Clicked") || "false");
  });
  useEffect(() => {
    setID(restoId);
  }, [restoId]);
  useEffect(() => {
    localStorage.setItem("Clicked", JSON.stringify(clicked));
  }, [clicked]);
  const { cartItems, menuItems, setID, addItemToCart } =
    useContext(ManageRestoContext);

  //const filterd= menuItems.filter((item:Meal)=>item.restaurantId == restoId)
  const cartfilterd = cartItems.filter((item) => item.restaurantId == restoId);

  return (
    <div
      className="main"
      style={
        menuItems.length === 0
          ? {
              height: "500px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }
          : {}
      }
    >
      <div className="container border-2 border-blue-300 bg-blue-50 my-10 p-6 w-[95%] mx-auto shadow-lg rounded-lg">
        <h1 className="text-center text-blue-600 text-5xl font-mono font-bold italic my-5 drop-shadow-lg">
          Menu
        </h1>
        <div className="menuContent max-[600px]:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 mx-auto grid gap-6 grid-cols-4">
          {menuItems.map((item: Meal, index) => (
            <Card
              key={index}
              className="bg-white border border-blue-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className=" menuItem flex flex-col hover:brightness-90 duration-300">
                <div className="img h-48 overflow-hidden rounded-t-lg">
                  <img
                    className="h-full w-full object-cover"
                    src={`http://citypulse.runasp.net${item.mealImage}`}
                    alt="Notfound"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-center h-[12%] text-blue-700 text-2xl font-mono font-bold">
                    {item.mealName}
                  </h3>
                  <p className="text-center h-[12%] mb-2  text-gray-600 font-mono font-semibold">
                    {item.description.length > 10
                      ? item.description.slice(0, 10) + "..."
                      : item.description}
                  </p>
                  <p className="text-center mt-2 text-lg">
                    <span className="font-mono font-bold text-blue-500">
                      {item.price}
                    </span>{" "}
                    EGP
                  </p>
                </div>
                <button
                  className=" bg-blue-500 hover:bg-blue-600 transition-all duration-300 rounded-b-lg w-full text-white font-bold p-3"
                  onClick={() => {
                    addItemToCart(item);
                    setClicked(true);
                    localStorage.setItem("Clicked", JSON.stringify(true));
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="cart">
        <CartBar
          restoId={restoId}
          setClicked={setClicked}
          clicked={clicked}
          counter={cartfilterd.length}
        />
      </div>
    </div>
  );
}
