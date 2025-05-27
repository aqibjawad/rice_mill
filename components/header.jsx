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
  FaBars, // Hamburger Icon
} from "react-icons/fa";
import styles from "../styles/header.module.css";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allowedMenuItems, setAllowedMenuItems] = useState([]);

  // All possible menu items
  const allMenuItems = [
    { href: "/dashboard/", icon: <FaHome />, label: "Dashboard", parent: "Dashboard" },
    { href: "/sale/", icon: <FaUserTie />, label: "Sales", parent: "Sales" },
    { href: "/purchase/", icon: <FaShoppingBag />, label: "Purchase", parent: "Purchase" },
    { href: "/inflow/", icon: <FaArrowRight />, label: "Recieves", parent: "Recieves" },
    { href: "/outflow/", icon: <FaArrowLeft />, label: "Payments", parent: "Payments" },
    { href: "/trialBalance/", icon: <FaTruck />, label: "Trial Balance", parent: "Trial Balance" },
    { href: "/investor/", icon: <FaTruck />, label: "Investor", parent: "Investor" },
    { href: "/party/", icon: <FaUserTie />, label: "Party", parent: "Party" },
    { href: "/expenses/", icon: <FaMoneyBill />, label: "Expenses", parent: "Expenses" },
    { href: "/companyLedger/", icon: <FaMoneyBill />, label: "Ledger", parent: "Ledger" },
    { href: "/bankCheque/", icon: <FaArrowRight />, label: "Banks", parent: "Banks" },
    { href: "/product/", icon: <FaShoppingCart />, label: "Products", parent: "Products" },
    { href: "/user/", icon: <FaShoppingCart />, label: "User", parent: "User" },
    // { href: "/packing/", icon: <FaBox />, label: "Packing", parent: "Packing" },
    // { href: "/stock/", icon: <FaBoxes />, label: "Stock", parent: "Stock" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Get permissions from localStorage
    const permissions = localStorage.getItem("permissions");
    
    if (permissions) {
      try {
        const parsedPermissions = JSON.parse(permissions);
        
        // Extract parent names from permissions modules
        const allowedParents = [];
        if (parsedPermissions.modules && Array.isArray(parsedPermissions.modules)) {
          parsedPermissions.modules.forEach(module => {
            if (module.parent) {
              allowedParents.push(module.parent);
            }
          });
        }
        
        // Filter menu items based on allowed parents
        const filteredMenuItems = allMenuItems.filter(item => 
          allowedParents.includes(item.parent)
        );
        
        setAllowedMenuItems(filteredMenuItems);
      } catch (error) {
        console.error("Error parsing permissions:", error);
        // If there's an error, show all menu items
        setAllowedMenuItems(allMenuItems);
      }
    } else {
      // If no permissions found, show all menu items
      setAllowedMenuItems(allMenuItems);
    }
  }, []);

  const logOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    window.location.href = "/";
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src="/logo.png" alt="Logo" />
      </div>

      {/* Hamburger Icon with Dropdown */}
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
              {allowedMenuItems.map((item, index) => (
                <Link
                  href={item.href}
                  key={index}
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
              ))}
            </div>
          )}
        </div>
      )}

      {/* Desktop Navbar */}
      {!isMobile && (
        <nav className={styles.navbar}>
          {allowedMenuItems.map((item, index) => (
            <Link href={item.href} key={index}>
              <div
                className={`${styles.navItem} ${
                  pathname === item.href ? styles.active : ""
                }`}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.label}</span>
              </div>
            </Link>
          ))}
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