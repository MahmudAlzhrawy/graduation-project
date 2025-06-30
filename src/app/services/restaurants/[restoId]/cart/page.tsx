"use client";
import { ManageRestoProvider } from "@/app/Context/ManageRestoContext";
import CartItems from "@/components/Restaurants/Menu&Cart/Cart";
import { useParams } from "next/navigation";

export default function Cart() {
  const params = useParams() as { restoId?: string };

  const restoId = params?.restoId;

  if (!restoId) {
    return <div className="p-10 text-red-500">Restaurant ID not found in URL</div>;
  }

  return (
    <ManageRestoProvider>
      <CartItems restoId={restoId} />
    </ManageRestoProvider>
  );
}
