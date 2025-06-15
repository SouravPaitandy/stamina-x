import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ThemeProviderWrapper from "./ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Stamina X | More Than Just Stamina. It's Mastery",
  description: "Stamina X is a personalized men's wellness app focused on improving stamina, core strength, breathing control, and overall male energy through science-backed daily routines. Designed for the modern man's lifestyle.",
  keywords: "fitness tracker, workout app, exercise tracking, stamina improvement, fitness goals, Men’s stamina app, Sex stamina training app, Kegel routine for men, Male pelvic floor exercises, Breathing for performance, Men's wellness and discipline tracker, Performance improvement for men",
  authors: [{ name: "StaminaX Team, aka Sourav Paitandy" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "Stamina X | More Than Just Stamina. It's Mastery",
    description: "A science-backed training app for improving your performance, focus, stamina, and pelvic power. Built to help you feel stronger, perform better, and master yourself—daily.",    url: "https://staminax.app",
    siteName: "StaminaX",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: "#2563eb",
  manifest: "/manifest.json"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#2563eb" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900`}
       suppressHydrationWarning
      >
        <ThemeProvider attribute="class">
          <AuthProvider>
            <ThemeProviderWrapper>
              <Navbar />
              {children}
            </ThemeProviderWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
