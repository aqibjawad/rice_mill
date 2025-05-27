import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  FaHome,
  FaUserTie,
  FaShoppingBag,
  FaArrowRight,
  FaArrowLeft,
  FaTruck,
  FaMoneyBill,
  FaShoppingCart,
  FaBox,
  FaBoxes,
  FaBars,
  FaUser,
  FaUniversity,
} from "react-icons/fa";
import styles from "../styles/header.module.css";
import { usePermissions } from "./userPermissions";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Use the permissions hook
  const { hasAnyModulePermission, isAdmin, isLoaded, userId, debug } = usePermissions();

  // All possible menu items with their corresponding permission parent names
  const allMenuItems = [
    { href: "/dashboard/", icon: <FaHome />, label: "Dashboard", parent: "Dashboard" },
    { href: "/sale/", icon: <FaUserTie />, label: "Sales", parent: "Sales" },
    { href: "/purchase/", icon: <FaShoppingBag />, label: "Purchase", parent: "Purchase" },
    { href: "/inflow/", icon: <FaArrowRight />, label: "Receives", parent: "Receives" },
    { href: "/outflow/", icon: <FaArrowLeft />, label: "Payments", parent: "Payments" },
    { href: "/trialBalance/", icon: <FaTruck />, label: "Trial Balance", parent: "Trial Balance" },
    { href: "/investor/", icon: <FaTruck />, label: "Investor", parent: "Investor" },
    { href: "/party/", icon: <FaUserTie />, label: "Party", parent: "Party" },
    { href: "/expenses/", icon: <FaMoneyBill />, label: "Expenses", parent: "Expenses" },
    { href: "/companyLedger/", icon: <FaMoneyBill />, label: "Ledger", parent: "Ledger" },
    { href: "/bankCheque/", icon: <FaUniversity />, label: "Banks", parent: "Banks" },
    { href: "/product/", icon: <FaShoppingCart />, label: "Products", parent: "Products" },
    { href: "/user/", icon: <FaUser />, label: "User", parent: "User" },
    // Commented out items can be uncommented when permissions are available
    // { href: "/packing/", icon: <FaBox />, label: "Packing", parent: "Packing" },
    // { href: "/stock/", icon: <FaBoxes />, label: "Stock", parent: "Stock" },
  ];

  // Filter menu items based on permissions
  const allowedMenuItems = allMenuItems.filter(item => {
    // If permissions not loaded yet, don't show any items
    if (!isLoaded) {
      console.log("Permissions not loaded yet, hiding all menu items");
      return false;
    }
    
    // Admin can see all menu items
    if (isAdmin()) {
      console.log(`Admin user (ID: ${userId}) - showing all menu items`);
      return true;
    }
    
    // For regular users, check if they have any permission for this module
    const hasAccess = hasAnyModulePermission(item.parent);
    console.log(`Menu item ${item.label} (${item.parent}): ${hasAccess ? 'ALLOWED' : 'HIDDEN'}`);
    return hasAccess;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Log permission summary for debugging
  useEffect(() => {
    if (isLoaded) {
      console.log("=== HEADER PERMISSION SUMMARY ===");
      console.log("User ID:", userId);
      console.log("Is Admin:", isAdmin());
      console.log("Total menu items available:", allMenuItems.length);
      console.log("Allowed menu items:", allowedMenuItems.length);
      console.log("Allowed menu labels:", allowedMenuItems.map(item => item.label));
      console.log("Raw permissions:", debug);
      console.log("================================");
    }
  }, [isLoaded, allowedMenuItems.length]);

  const logOut = () => {
    console.log("Logging out - clearing all auth data");
    // Clear all auth-related data
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    localStorage.removeItem("persist:root");
    window.location.href = "/";
  };

  // Show loading state while permissions are being loaded
  if (!isLoaded) {
    return (
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img className={styles.logo} src="/logo.png" alt="Logo" />
        </div>
        <div className={styles.loading}>
          <span>Loading permissions...</span>
        </div>
        <div className={styles.profileSection}>
          <button onClick={logOut} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src="/logo.png" alt="Logo" />
      </div>

      {/* Hamburger Icon with Dropdown for Mobile */}
      {isMobile && (
        <div className={styles.hamburgerDropdown}>
          <div
            className={styles.hamburger}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <FaBars />
          </div>
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {allowedMenuItems.length > 0 ? (
                allowedMenuItems.map((item, index) => (
                  <Link
                    href={item.href}
                    key={`mobile-${index}`}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <div
                      className={`${styles.navItem} ${
                        pathname === item.href ? styles.active : ""
                      }`}
                    >
                      <span className={styles.icon}>{item.icon}</span>
                      <span className={styles.label}>{item.label}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className={styles.noAccess}>
                  <span>No menu access available</span>
                  <small>Contact admin for permissions</small>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Desktop Navbar */}
      {!isMobile && (
        <nav className={styles.navbar}>
          {allowedMenuItems.length > 0 ? (
            allowedMenuItems.map((item, index) => (
              <Link href={item.href} key={`desktop-${index}`}>
                <div
                  className={`${styles.navItem} ${
                    pathname === item.href ? styles.active : ""
                  }`}
                  title={`${item.label} - ${item.parent} module`}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.label}>{item.label}</span>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.noAccess}>
              <span>No menu access available</span>
              <small>Contact admin for permissions</small>
            </div>
          )}
        </nav>
      )}

      <div className={styles.profileSection}>        
        <button onClick={logOut} className={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;