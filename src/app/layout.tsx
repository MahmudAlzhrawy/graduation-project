// app/layout.tsx
"use client"
import "./globals.css";
import localFont from "next/font/local";
import AppWrapper from "@/components/AppWrapper"; // <- NEW wrapper
import { Provider } from "react-redux";
import { store } from "@/lib/store";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


// export const generateMetadata =  ():Metadata=> {
//   return {
//     title:{
//       default:"City Guide",
//       template:"%s|City Guide"
//     },
//     description: "This is the description of the page.",
    
//   };
// };



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-[100vw] overflow-x-hidden`}
      >
        <ClientProvider>
          <AppWrapper>{children}</AppWrapper>
        </ClientProvider>
      </body>
    </html>
  );
}
export function ClientProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
