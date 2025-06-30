"use client";
import { Toast } from "@/sweetAlert2";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
  useEffect,
} from "react";

interface City {
  cityCode: string;
  cityName: string;
}
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
interface cartMeal {
  id: number;
  quantity: number;
  mealId: number;
  mealName: string;
  description: string;
  price: number;
  mealImage: string;
  restaurantId: number;
  userId: string | null;
}
interface order {
  userId: number;
  orderId: number;
  restaurantId: number;
  totalPrice: number;
  status: string;
  location: string;
  phoneNumber: string;
  orderDetails: orderedMeals[];
}
interface AppointmentDetail {
  subTotalPrice: number;
  servicesId: number;
}
interface Appointment {
  appointmentId: number;
  workingHourId: number;
  userId: number;
  clinicId: number;
  totalPrice: number;
  status: string;
  patientName: string;
  patientAddress: string;
  appointmentDetails: AppointmentDetail[];
}
interface orderedMeals {
  mealName: string;
  quantity: number;
  subTotalPrice: number;
}
interface ManageRestoProviderProps {
  children: ReactNode;
}
interface ManageRestoType {
  Cities: City[];
  appointments: Appointment[];
  orders: order[];
  counter: number;
  cartItems: cartMeal[];
  menuItems: Meal[];
  setID: Dispatch<SetStateAction<any>>;
  addItemToCart: (meal: Meal) => void;
  removeItemFromCart: (mealId: number, restId: number) => void;
  removeAllItemsFromCart: (mealIds: number[], restaurantId: number) => void;
  clearCart: () => void;
}

export const ManageRestoContext = createContext<ManageRestoType>({
  Cities: [],
  appointments: [],
  orders: [],
  counter: 0,
  menuItems: [],
  cartItems: [],
  setID: () => {},
  addItemToCart: () => {},
  removeItemFromCart: () => {},
  removeAllItemsFromCart: () => {},
  clearCart: () => {},
});

export const ManageRestoProvider: React.FC<ManageRestoProviderProps> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<Meal[]>([]);
  const [id, setID] = useState<any>();
  const [cartItems, setCartItems] = useState<cartMeal[]>([]);
  const [counter, setCounter] = useState<number>(0);
  const [orders, setOrders] = useState<order[]>([]);
  const [appointments, setAppointment] = useState<Appointment[]>([]);
  const [Cities, setCity] = useState<City[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ تحميل البيانات من localStorage بعد التأكد أن window موجودة
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      const storedToken = localStorage.getItem("Token");
      const storedUserId = localStorage.getItem("userId");

      setCartItems(storedCart ? JSON.parse(storedCart) : []);
      setToken(storedToken);
      setUserId(storedUserId);
    }
  }, []);

  // ✅ تحديث cart في localStorage عند التغيير
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
    setCounter(cartItems.length);
  }, [cartItems]);

  const addItemToCart = (meal: Meal) => {
    if (!userId || !token) {
      Toast.fire({
        title: "Please log in to add items to the cart.",
        icon: "warning",
        showConfirmButton: true,
        timer: 1500,
      });
      return;
    }
    setCartItems((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.mealId === meal.mealId && item.restaurantId === meal.restaurantId
      );

      if (existingItem) {
        Toast.fire({
          title: "This meal is already served.",
          icon: "success",
          showConfirmButton: true,
          timer: 1500,
        });
        return prevCart.map((item) =>
          item.mealId === meal.mealId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        Toast.fire({
          title: "The meal was added to the cart successfully.",
          icon: "success",
          showConfirmButton: true,
          timer: 1500,
        });
        return [...prevCart, { ...meal, quantity: 1,userId: userId }];
      }
    });
  };

  const removeAllItemsFromCart = (mealIds: number[]) => {
    const updated = cartItems.filter((item) => !mealIds.includes(item.mealId));
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
  };

  const removeItemFromCart = (mId: number, restId: number) => {
    Toast.fire({
      title: "The meal was deleted successfully",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
    const updated = cartItems.filter((item) => item.mealId !== mId);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
  };

  const clearCart = () => {
    
  };
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(`https://citypulse.runasp.net/api/School/ALlcities`);
        if (res.ok) {
          const data = await res.json();
          setCity(data.$values);
        } else {
          console.error("Failed to fetch cities");
        }
      } catch (err) {
        console.error("Error fetching cities", err);
      }
    };
    fetchCities();
  },[])
  // ✅ جلب البيانات بعد توفر userId و token
  useEffect(() => {
    if (!userId || !token) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `https://citypulse.runasp.net/api/User/AllOrdersByUserID?UserId=${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        const formatted = data?.$values?.map((order: any) => ({
          userId: order.userId,
          orderId: order.orderId,
          restaurantId: order.restaurantId,
          totalPrice: order.totalPrice,
          status: order.status,
          location: order.location,
          phoneNumber: order.phoneNumber,
          orderDetails: order.orderDetails?.$values || [],
        })) || [];
        setOrders(formatted);
      } catch (err) {
        console.log("Error fetching orders", err);
      }
    };

    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `https://citypulse.runasp.net/api/User/AllAppointmentsByUserID?UserId=${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        const formatted = data?.$values?.map((appoint: any) => ({
          appointmentId: appoint.appointmentId,
          workingHourId: appoint.workingHourId,
          userId: appoint.userId,
          clinicId: appoint.clinicId,
          totalPrice: appoint.totalPrice,
          status: appoint.status,
          patientName: appoint.patientName,
          patientAddress: appoint.patientAddress,
          appointmentDetails: appoint.appointmentDetails?.$values || [],
        })) || [];
        setAppointment(formatted);
      } catch (err) {
        console.log("Error fetching appointments", err);
      }
    };

    

    fetchOrders();
    fetchAppointments();
  }, [token, userId]);

  // ✅ Fetch meals by restaurant id
  useEffect(() => {
    const fetchMeals = async () => {
      if (!id) return;
      try {
        const res = await fetch(`https://citypulse.runasp.net/api/Restaurant/AllMeals/${id}`);
        const data = await res.json();
        if (res.ok) {
          setMenuItems(data.$values);
        }
      } catch (err) {
        console.log("Error fetching meals", err);
      }
    };

    fetchMeals();
  }, [id]);

  return (
    <ManageRestoContext.Provider
      value={{
        Cities,
        appointments,
        orders,
        menuItems,
        setID,
        cartItems,
        addItemToCart,
        removeItemFromCart,
        removeAllItemsFromCart,
        clearCart,
        counter,
      }}
    >
      {children}
    </ManageRestoContext.Provider>
  );
};
