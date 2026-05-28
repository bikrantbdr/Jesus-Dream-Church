"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, LogOut, Shield } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

type NavbarProps = {
  username: string | null;
};

export default function Navbar({ username }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll detection to add a subtle glass border and shadow without resizing height (prevent layout shift)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/events", label: "Events" },
  ];

  const handleLogout = async () => {
    await logoutAction();
    router.refresh();
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full h-20 transition-all duration-300 ease-in-out ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-md border-b border-secondary/60 shadow-sm" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Modern Brand LogoShape & Poppins Typographic Brand Name */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center gap-3.5 group">
            <Image 
              src="/LogoShape.svg" 
              alt="Jesus Dream Logo" 
              width={48} 
              height={48} 
              className="h-12 w-auto hover:scale-105 transition-transform duration-300 drop-shadow-sm"
              priority
            />
            <span className="font-poppins font-bold text-lg sm:text-xl tracking-[0.2em] uppercase text-deep-teal group-hover:text-terracotta transition-colors duration-300">
              JESUS DREAM
            </span>
          </Link>
        </div>

        {/* Desktop Navigation (No Icons, Sleek Animated Dots) */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative py-2 text-xs font-bold uppercase tracking-[0.15em] text-deep-teal/70 hover:text-terracotta transition-all duration-300 group"
              >
                <span className={`transition-colors duration-300 ${isActive ? "text-terracotta" : "group-hover:text-terracotta"}`}>
                  {link.label}
                </span>
                
                {/* Sleek dynamic indicator dot */}
                <span 
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-terracotta transition-all duration-300 ease-out ${
                    isActive 
                      ? "opacity-100 scale-100" 
                      : "opacity-0 scale-0 group-hover:opacity-40 group-hover:scale-75"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* User / Authentication Area (Only visible when logged in as admin) */}
        <div className="hidden md:flex items-center">
          {username && (
            <div className="flex items-center gap-3 bg-secondary/60 border border-border/80 px-4 py-1.5 rounded-full text-xs animate-fade-in shadow-sm select-none">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </span>
                <span className="font-bold text-teal-black flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-terracotta" />
                  <span>Admin: {username}</span>
                </span>
              </div>
              <div className="w-[1px] h-3 bg-deep-teal/15" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-teal-black/50 hover:text-terracotta transition-colors duration-300 cursor-pointer font-bold uppercase tracking-wider text-[10px]"
              >
                <LogOut className="h-3 w-3" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu toggle (Sleek Circle hover) */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-full text-deep-teal hover:text-terracotta hover:bg-secondary/60 focus:outline-none transition-all duration-300"
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? <X className="h-5 w-5 animate-fade-in" /> : <Menu className="h-5 w-5 animate-fade-in" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Clean, matching typography logo style) */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-fade-in bg-white/95 border-b border-secondary/50 shadow-lg absolute top-full left-0 right-0 z-40">
          <div className="px-4 py-4 space-y-1 sm:px-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold tracking-[0.15em] uppercase transition-all ${
                    isActive
                      ? "bg-secondary text-terracotta border-l-4 border-terracotta"
                      : "text-deep-teal hover:bg-secondary/50 hover:text-terracotta"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />}
                </Link>
              );
            })}

            {/* Mobile Admin session */}
            {username && (
              <div className="pt-4 border-t border-secondary mt-4 px-2 animate-fade-in">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] text-teal-black font-bold uppercase tracking-widest px-2 select-none">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    <span>Admin Session Active</span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-deep-teal font-bold py-3 px-4 rounded-xl transition-all border border-border cursor-pointer text-[10px] uppercase tracking-widest"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
