"use client";

import { usePathname } from "next/navigation";
import SideBar from "../components/sidebar";
import Header from "../components/header";

export default function RootLayoutClient({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isInvoicePage = pathname === "/invoice/";

  const LayoutWithSidebar = ({ children }) => (
    <div className="layout-container">
      <div className="sidebar-container">
        <SideBar />
      </div>
      <div className="main-content">
        <main className="main-content-child">
          {children}
        </main>
      </div>
    </div>
  );

  const LayoutWithoutSidebar = ({ children }) => (
    <div className="layout-container home-layout">
      <div className="main-content">
        <main className="main-content-child full-width">
          {children}
        </main>
      </div>
    </div>
  );

  if (isHomePage || isInvoicePage) {
    console.log("ko;l");
    
    return <LayoutWithoutSidebar>{children}</LayoutWithoutSidebar>;
  } else {
    return <LayoutWithSidebar>{children}</LayoutWithSidebar>;
  }
}