import Hospitals from "@/components/Hospitals/Hospitals";
import Restaurants from "@/components/Restaurants/Restaurants";
import Schools from "@/components/Schools/Schools";
import { notFound } from "next/navigation";

// Metadata function
export async function generateMetadata({ params }) {
  const { serviceName } = params;
  return {
    title: serviceName.charAt(0).toUpperCase() + serviceName.slice(1),
  };
}

// Page Component
export default async function Service({ params }) {
  const { serviceName } = params;

  switch (serviceName) {
    case "restaurants":
      return <Restaurants />;
    case "schools":
      return <Schools />;
    case "hospitals":
      return <Hospitals />;
    default:
      notFound();
  }
}
