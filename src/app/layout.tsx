import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import VercelAnalytics from "@/components/VercelAnalytics";

export const metadata: Metadata = {
  title: "Chinese School",
  description: "Chinese learning app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        {process.env.NODE_ENV === "production" && <VercelAnalytics />}
      </body>
    </html>
  );
}
