"use client"

import { usePathname } from 'next/navigation';
import SideBar from "../components/sidebar"

export default function RootLayoutClient({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className={`layout-container ${isHomePage ? 'home-layout' : ''}`}>
      {!isHomePage && <SideBar />}
      <main className={`main-content ${isHomePage ? 'full-width' : ''}`}>
        {children}
      </main>
    </div>
  );
}