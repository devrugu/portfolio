import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MouseSpotlight from "@/components/MouseSpotlight";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Uğurcan Yılmaz - Personal Website", // Update the title
  description: "My professional resume and personal blog.", // Update the description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Add the GA component here */}
      <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      <body className={`${inter.className} bg-background text-on-background`}>
        <MouseSpotlight />
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex-grow container mx-auto max-w-5xl px-4 py-8">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}