import React from "react";
import AllSchools from "./AllSchools";
import MainHeaderForEachComponent, {
  ImainRestaurantHeader,
} from "../mainHeaderForEachComponent";

function Schools() {
  const mainHeaderForRestaurantComponent: ImainRestaurantHeader = {
    image:
      "url('/assets/Schools/mainComponentBackgroundInSchoolComponent.jpg')",
    text: "Schools In Assuit Government",
  };
  return (
    <div className="mb-8">
      <MainHeaderForEachComponent
        mainHeader={mainHeaderForRestaurantComponent}
      />
      <AllSchools />
    </div>
  );
}

export default Schools;
