"use client"

import { usePathname } from 'next/navigation';
import SideBar from "../components/sidebar"

import Header from "../components/header"

export default function RootLayoutClient({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className={`layout-container ${isHomePage ? 'home-layout' : ''}`}>
      {!isHomePage && <SideBar />}

      <div className={`main-content`}>
        <Header />
        <main className={`main-content-child ${isHomePage ? 'full-width' : ''}`}>
          {children}
        </main>
      </div>

    </div>
  );
}