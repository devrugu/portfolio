import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MouseSpotlight from "@/components/MouseSpotlight";
import CustomCursor from "@/components/CustomCursor";
import { ThemeProvider } from "@/components/ThemeProvider";
import BackToTop from "@/components/BackToTop";
import TerminalEasterEgg from "@/components/TerminalEasterEgg";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Uğurcan Yılmaz — Software Engineer",
  description:
    "Software Engineer at TÜBİTAK BİLGEM specializing in high-performance, real-time signal processing software with C++ and Qt. Based in İstanbul, Türkiye.",
  keywords: [
    "Uğurcan Yılmaz",
    "Software Engineer",
    "C++",
    "Qt",
    "Signal Processing",
    "TÜBİTAK",
    "BİLGEM",
    "Istanbul",
    "Turkey",
  ],
  authors: [{ name: "Uğurcan Yılmaz", url: "https://www.ugurcanyilmaz.com" }],
  openGraph: {
    type: "website",
    url: "https://www.ugurcanyilmaz.com",
    title: "Uğurcan Yılmaz — Software Engineer",
    description:
      "Software Engineer at TÜBİTAK BİLGEM specializing in high-performance, real-time signal processing with C++ and Qt.",
    siteName: "Uğurcan Yılmaz",
    images: [
      {
        url: "https://www.ugurcanyilmaz.com/screenshot-homepage.png",
        width: 1200,
        height: 630,
        alt: "Uğurcan Yılmaz — Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uğurcan Yılmaz — Software Engineer",
    description:
      "Software Engineer at TÜBİTAK BİLGEM specializing in real-time signal processing with C++ and Qt.",
    images: ["https://www.ugurcanyilmaz.com/screenshot-homepage.png"],
  },
  metadataBase: new URL("https://www.ugurcanyilmaz.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      <body className={`${inter.className} hide-cursor-desktop`}>
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{
          __html: `
          (function() {
            try {
              var t = localStorage.getItem('theme');
              if (!t) t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
              document.documentElement.setAttribute('data-theme', t);
            } catch(e) {}
          })();
        `}} />
        <ThemeProvider>
          <CustomCursor />
          <MouseSpotlight />
          <div className="flex flex-col min-h-screen">
            <Header />
            <BackToTop />
            <TerminalEasterEgg />
            <div className="flex-grow container mx-auto max-w-5xl px-4 py-8">
              {children}
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}