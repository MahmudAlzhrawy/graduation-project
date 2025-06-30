"use client";
import { ManageRestoProvider } from "@/app/Context/ManageRestoContext";
import { useParams } from "next/navigation";
import Menu from "@/components/Restaurants/Menu&Cart/Menu";

export default function ShowMenu() {
  const params = useParams() as { restoId?: string };

  const restoId = params?.restoId;

  if (!restoId) {
    return <div className="p-6 text-red-600">Restaurant ID is missing in the URL</div>;
  }

  return (
    <div className="menu">
      <ManageRestoProvider>
        <Menu restoId={restoId} />
      </ManageRestoProvider>
    </div>
  );
}
