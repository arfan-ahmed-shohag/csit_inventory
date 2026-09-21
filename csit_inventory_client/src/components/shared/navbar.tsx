"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { logoutUser } from "@/services/authService/auth.client";
import { toast } from "sonner";
import { toastId } from "./toastId";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = useUser();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogOut = async () => {
    const res = await logoutUser();
    toggleMenu();
    toggleProfile();

    if (res.success) {
      localStorage.removeItem("accessToken");
      user?.setUser(null);
      toast.success(res.message || "Logged out successfully!", { id: toastId });
    }
    if (!res.success) {
      toast.error(res.errorMessage || "Logout failed!", { id: toastId });
    }
  };

  if (pathname === "/") {
    return null;
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/inventory", label: "Inventory" },
    { href: "/reports", label: "Reports" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg dark:shadow-xl border-b border-slate-200/50 dark:border-slate-800/50"
          : "bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"
      }`}
    >
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-indigo-400 to-blue-400 dark:from-indigo-600 dark:to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-25 transition-opacity duration-300"></div>
              <Image
                width={40}
                height={40}
                src="https://res.cloudinary.com/dwduymu1l/image/upload/v1769187917/Patuakhali_Science_and_Technology_University_logo_rv2zwu.png"
                alt="PSTU Logo"
                className="relative h-10 w-10"
              />
            </div>
            <div className="hidden sm:flex flex-col gap-0.5">
              <span className="text-sm font-bold bg-linear-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
                CSIT Inventory
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Management
              </span>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  pathname === link.href
                    ? "relative px-4 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400"
                    : "relative px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150 group"
                }
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-indigo-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Profile Section - Only render after hydration */}

            {user?.user ? (
              <div className="hidden md:block relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 group"
                >
                  <div className="relative">
                    <Image
                      width={32}
                      height={32}
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1"
                      alt="Profile"
                      unoptimized
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl dark:shadow-2xl border border-slate-200 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        John Doe
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Student ID: PST2021001
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        john.doe@pstu.edu.bd
                      </p>
                    </div>
                    <div className="py-2 space-y-1">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-150 group"
                      >
                        <User className="w-4 h-4 text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                        <span className="text-sm font-medium">My Profile</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-150 group"
                      >
                        <Settings className="w-4 h-4 text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                        <span className="text-sm font-medium">Settings</span>
                      </Link>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
                      <button
                        onClick={handleLogOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 group"
                      >
                        <LogOut className="w-4 h-4 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors" />
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button asChild className="hidden md:block relative">
                <Link href="/login">Login</Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden pb-4 space-y-1 border-t border-slate-200 dark:border-slate-800 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={toggleMenu}
                className={
                  pathname === link.href
                    ? "block px-4 py-2.5 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg font-medium text-sm transition-colors duration-150"
                    : "block px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg font-medium text-sm transition-colors duration-150"
                }
              >
                {link.label}
              </Link>
            ))}

            {user?.user ? (
              <>
                <div className="my-2 border-t border-slate-200 dark:border-slate-800"></div>
                <Link
                  href="/profile"
                  onClick={toggleMenu}
                  className="block px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg font-medium text-sm transition-colors duration-150"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogOut}
                  className="w-full text-left px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium text-sm transition-colors duration-150"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Button asChild className="w-full">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
