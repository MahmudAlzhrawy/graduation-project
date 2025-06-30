import {
  Patua_One,
  Patrick_Hand,
  Noto_Sans_Arabic,
  Noto_Naskh_Arabic,
  Atkinson_Hyperlegible,
} from "next/font/google";

// Fonts
export const patua = Patua_One({ subsets: ["latin"], weight: "400" });
export const patrik_hand = Patrick_Hand({ subsets: ["latin"], weight: "400" });
export const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["600", "300", "500"],
});
export const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["500", "600", "700"],
});
export const Atkinson_HyperlegibleFont = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400"],
});

// DoctorCard interface
export interface DoctorCard {
  id: string;
  name: string;
  title: string;
  specialty: string[];
  description: string;
  image: string;
  rating: number;
  ratingCount: number;
  hygieneBadge: string;
  location: string;
  city: string;
  area: string;
  fees: number | undefined;
  waitingTime: string;
  phone: string;
  schedule: object[];
  gender: "Male" | "Female";
}

// Dummy data
export const doctorCards: DoctorCard[] = [ /* بياناتك كما هي */ ];
