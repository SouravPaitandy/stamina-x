"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const { theme, setTheme } = useTheme();

  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <nav
      className={`fixed w-full z-20 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href='/' className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">         
              Stamina X            
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="font-medium text-blue-600 dark:text-blue-400"
            >
              Home
            </Link>
            {/* <Link
              href="/exercises"
              className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Exercises
            </Link> */}
            
            {/* <Link
              href="/about"
              className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              About
            </Link> */}
            <div className="pl-6 border-l border-gray-200 dark:border-gray-700">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                >
                  Log out
                </button>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                >
                  Log in
                </Link>
              )}
            </div>
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              {isLoggedIn ? "Dashboard" : "Get Started"}
            </Link>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
                aria-label="Toggle theme"
              >
                <div className="relative w-6 h-6 overflow-hidden">
                  {theme === "dark" ? (
                    <SunIcon className="w-6 h-6 text-yellow-500" />
                  ) : (
                    <MoonIcon className="w-6 h-6 text-blue-400" />
                  )}
                </div>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state. */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 py-4 px-2 rounded-lg shadow-xl mt-2 absolute w-full left-0 right-0 z-30 border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col space-y-4 px-2">
              <Link
                href="/"
                className="px-3 py-2 font-medium text-blue-600 dark:text-blue-400"
              >
                Home
              </Link>
              {/* <Link
                href="/exercises"
                className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300"
              >
                Exercises
              </Link> */}
              
              {/* <Link
                href="/about"
                className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300"
              >
                About
              </Link> */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300"
                >
                  Log out
                </button>
              ) : (
                <Link
                  href="/login"
                  className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300"
                >
                  Log in
                </Link>
              )}
              <Link
                href={isLoggedIn ? "/dashboard" : "/login"}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center font-medium rounded-lg"
              >
                {isLoggedIn ? "Dashboard" : "Get Started"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};


export default Navbar;
