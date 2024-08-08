"use client"

import { usePathname } from 'next/navigation';
import SideBar from "../components/sidebar"
import Header from "../components/header"

export default function RootLayoutClient({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className={`layout-container ${isHomePage ? 'home-layout' : ''}`}>
      {!isHomePage && (
        <div className="sidebar-container">
          <SideBar />
        </div>
      )}

      <div className={`main-content`}>
        {!isHomePage && (
          <div className="header-component">
            <Header />
          </div>
        )}
        <main className={`main-content-child ${isHomePage ? 'full-width' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}