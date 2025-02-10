"use client";

import { usePathname } from "next/navigation";
import Header from "../components/header";

export default function RootLayoutClient({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isTrial = pathname === "/trialBalance/";

  const LayoutWithSidebar = ({ children }) => (
    <div className="layout-container">
      {/* Header and Sidebar Together */}
      <div className="top-bar">
        <Header />
      </div>

      {/* Main Content */}
      <div className="main-content">
        <main>{children}</main>
      </div>
    </div>
  );

  const LayoutWithoutSidebar = ({ children }) => (
    <div className="layout-container home-layout">
      <div className="main-content">
        <main className="main-content-child full-width">{children}</main>
      </div>
    </div>
  );
  if (isHomePage || isTrial) {
    return <LayoutWithoutSidebar>{children}</LayoutWithoutSidebar>;
  } else {
    return <LayoutWithSidebar>{children}</LayoutWithSidebar>;
  }
}
