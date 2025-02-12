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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const menuItems = [
    { href: "/dashboard/", icon: <FaHome />, label: "Dashboard" },
    { href: "/sale/", icon: <FaUserTie />, label: "Sales" },
    { href: "/purchase/", icon: <FaShoppingBag />, label: "Purchase" },
    { href: "/inflow/", icon: <FaArrowRight />, label: "Recieves" },
    { href: "/outflow/", icon: <FaArrowLeft />, label: "Payments" },
    { href: "/trialBalance/", icon: <FaTruck />, label: "Trial Balance" },
    { href: "/investor/", icon: <FaTruck />, label: "Investor" },
    { href: "/party/", icon: <FaUserTie />, label: "Party" },
    { href: "/expenses/", icon: <FaMoneyBill />, label: "Expenses" },
    { href: "/companyLedger/", icon: <FaMoneyBill />, label: "Ledger" },
    { href: "/bankCheque/", icon: <FaArrowRight />, label: "Banks" },
    { href: "/product/", icon: <FaShoppingCart />, label: "Products" },
    // { href: "/packing/", icon: <FaBox />, label: "Packing" },
    // { href: "/stock/", icon: <FaBoxes />, label: "Stock" },
  ];

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
              {menuItems.map((item, index) => (
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
          {menuItems.map((item, index) => (
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
