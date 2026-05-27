"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const hideNavigation = isAdminPage;

  return (
    <>
      {!hideNavigation && <Navbar />}
      <div className="flex-grow flex flex-col overflow-x-hidden">
        <main className={`flex-grow ${!hideNavigation ? "pt-20" : ""}`}> 
          {children}
        </main>
      </div>
      {!hideNavigation && <Footer />}
    </>
  );
}
