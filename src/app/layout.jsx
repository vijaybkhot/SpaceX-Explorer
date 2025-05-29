import { Geist } from "next/font/google";
import "@/globals.css";
import Navbar from "@/components/NavBar";

const geistSans = Geist({
  subsets: ["latin"],
  preload: false,
});

export const metadata = {
  title: "SpaceX Explorer",
  description: "View all launches, payloads, rockets, and more!",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
