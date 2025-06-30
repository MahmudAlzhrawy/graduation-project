import { Star } from "lucide-react";
import { useEffect, useState } from "react";
interface review {
  nameU: string;
  ratingId: number;
  userId: number;
  restaurantId: number;
  ratingValue: number;
  review: string;
  ratingDate: string;
}
export default function Blog({ restoId }: { restoId: any }) {
  const [review, setReviews] = useState<review[]>([]);
  useEffect(() => {
    console.log("fetching reviews for restaurant with ID:", restoId);
    console.log("welcom11");

    const blogData = async () => {
      try {
        const res = await fetch(
          `https://citypulse.runasp.net/api/Restaurant/AllRestaurantRating /${restoId}`,
          {
            method: "GET",
          }
        );
        if (res.ok) {
          console.log("welcom");
          const data = await res.json();
          console.log("data fetched reviews", data);
          setReviews(data.$values);
        } else {
          console.log("error fetching data");
        }
      } catch (e) {
        console.error("Failed to fetch blog data");
      }
    };
    blogData();
  }, [restoId]);
  return (
    <div className="main mt-2">
      <div className="container w-[99%] mx-auto ">
        <div className="blog bg-white/20 h-[400px] overflow-y-scroll p-4 ">
          {review.map((data) => {
            return (
              <div
                key={data.ratingId}
                className="blogcard min-h-24 px-2 bg-white w-full rounded-md shadow-md mb-2"
              >
                <div className="top_part w-full flex justify-between  ">
                  <h1 className="text-2xl font-bold font-serif bg-white/30 p-2 rounded-lg">
                    {data.nameU}
                  </h1>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-8 h-8 cursor-pointer transition ${
                          star <= data.ratingValue
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="middle_part text-center py-4">
                  <p className="text-gray-600 text-xl ">{data.review}</p>
                </div>
                <div className="bottom_part ">
                  <p className=" text-gray-500 font-bold italic">
                    {data.ratingDate}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
