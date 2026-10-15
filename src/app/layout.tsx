import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { getAdminSession } from "./actions/auth";

export const metadata: Metadata = {
  title: "Jesus Dream Church",
  description: "A warm and inviting christian community in Frankfurt. Join us for worship, prayer, fellowship, and events.",
  keywords: ["church", "frankfurt", "christianity", "fellowship", "grace", "worship", "jesus dream", "Nepali", "mandali", "nepali church", "nepali mandali", "nepali mandali frankfurt", "nepali church frankfurt"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const username = await getAdminSession();

  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-background-primary text-foreground font-sans antialiased">
        {/* Navigation Header */}
        <Navbar username={username} />

        {/* Core Content */}
        <main className="flex-grow flex flex-col w-full">
          {children}
        </main>

        {/* Premium Footer Section */}
        <footer className="bg-secondary text-foreground border-t border-border">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
              {/* Brand Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Image 
                    src="/Logo.svg" 
                    alt="Jesus Dream Logo" 
                    width={40} 
                    height={40} 
                    className="h-10 w-auto drop-shadow-sm" 
                  />
                  <span className="font-serif text-lg font-bold tracking-wider text-black">
                    JESUS DREAM
                  </span>
                </div>
                <p className="text-sm text-foreground/80 max-w-sm font-light leading-relaxed">
                  We are a Christ-centered community dedicated to sharing God's grace, growing together in faith, and loving our city. You are welcome here exactly as you are.
                </p>
                <div className="text-xs text-foreground/50 font-medium">
                  Located in Frankfurt, Germany.
                </div>
              </div>

              {/* Service Timings Column */}
              <div className="space-y-4">
                <h4 className="font-serif text-xs font-bold text-primary tracking-[0.2em] uppercase">
                  Service Times
                </h4>
                <ul className="space-y-4 text-sm text-foreground/85 font-light leading-relaxed">
                  <li>
                    <span className="font-bold text-black block mb-1 uppercase tracking-wider text-[11px]">Sunday Worship</span>
                    <span className="text-foreground/80">12:00 PM - 2:00 PM</span>
                  </li>
                  <li>
                    <span className="font-bold text-black block mb-1 uppercase tracking-wider text-[11px]">Fellowship Cafe</span>
                    <span className="text-foreground/80">After service (snacks & coffee)</span>
                  </li>
                </ul>
              </div>

              {/* Contact Column */}
              <div className="space-y-4">
                <h4 className="font-serif text-xs font-bold text-primary tracking-[0.2em] uppercase">
                  Get in Touch
                </h4>
                <ul className="space-y-3.5 text-sm text-foreground/85 font-light leading-relaxed">
                  <li className="flex flex-col gap-0.5">
                    <span className="font-bold text-black text-[11px] uppercase tracking-wider">Pastor Aadarsh Rajbhandari</span>
                    <a href="tel:017662028078" className="text-foreground/80 hover:text-primary transition-colors">0176 62028078</a>
                  </li>
                  <li className="flex flex-col gap-0.5">
                    <span className="font-bold text-black text-[11px] uppercase tracking-wider">Elder Khadga Magar</span>
                    <a href="tel:015775969277" className="text-foreground/80 hover:text-primary transition-colors">0157 75969277</a>
                  </li>
                  <li>
                    <span className="font-bold text-black block mb-1 uppercase tracking-wider text-[11px]">Email</span>
                    <a href="mailto:info2fellowship@gmail.com" className="hover:text-primary transition-colors text-foreground/80">
                      info2fellowship@gmail.com
                    </a>
                  </li>
                  <li>
                    <span className="font-bold text-black block mb-1 uppercase tracking-wider text-[11px]">Worship Address</span>
                    <a 
                      href="https://maps.google.com/?q=Eschersheimer+Landstra%C3%9Fe+46,+60322+Frankfurt+am+Main"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/80 hover:text-primary transition-colors block leading-normal group/address"
                    >
                      <span>Eschersheimer Landstraße 46, 60322 Frankfurt am Main </span>
                      <span className="inline-block text-[10px] text-primary opacity-75 group-hover/address:opacity-100 transition-all duration-300 ml-0.5">↗</span>
                    </a>
                  </li>
                  <li className="pt-2">
                    <a 
                      href="https://www.facebook.com/Nepali.Christian.Sangati.Frankfurt" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 bg-black/5 hover:bg-primary text-black hover:text-white font-bold text-[10px] uppercase tracking-[0.15em] px-4 py-2 rounded-full transition-all duration-300 border border-black/10 hover:border-transparent shadow-sm"
                    >
                      <span>Facebook Fellowship</span>
                      <span className="text-[11px]">→</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-foreground/55 gap-4">
              <div>
                © 2017 - {new Date().getFullYear()} Jesus Dream. All rights reserved.
              </div>
              <div>
                <a 
                  href="/admin/login" 
                  className="hover:text-primary transition-colors font-bold uppercase tracking-[0.15em] text-[10px] flex items-center gap-1.5 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black/30 group-hover:bg-primary transition-all duration-300" />
                  <span>Admin Portal</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
