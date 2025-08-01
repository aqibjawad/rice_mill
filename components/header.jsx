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
import TrialBalanceModal from "./TrialBalanceModal"; // Import the modal component

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allowedMenuItems, setAllowedMenuItems] = useState([]);
  const [isTrialBalanceModalOpen, setIsTrialBalanceModalOpen] = useState(false);

  // All possible menu items - will show all for users with null permissions
  const allMenuItems = [
    {
      href: "/dashboard/",
      icon: <FaHome />,
      label: "Dashboard",
      parent: "Dashboard",
    },
    { href: "/sale/", icon: <FaUserTie />, label: "Sales", parent: "Sales" },
    {
      href: "/purchase/",
      icon: <FaShoppingBag />,
      label: "Purchase",
      parent: "Purchase",
    },
    {
      href: "/inflow/",
      icon: <FaArrowRight />,
      label: "Recieves",
      parent: "Recieves",
    },
    {
      href: "/outflow/",
      icon: <FaArrowLeft />,
      label: "Payments",
      parent: "Payments",
    },
    {
      href: "/trialBalance/",
      icon: <FaTruck />,
      label: "Trial Balance",
      parent: "TrialBalance",
      isModal: true,
    },
    {
      href: "/investor/",
      icon: <FaTruck />,
      label: "Investor",
      parent: "Investor",
    },
    { href: "/party/", icon: <FaUserTie />, label: "Party", parent: "Party" },
    {
      href: "/expenses/",
      icon: <FaMoneyBill />,
      label: "Expenses",
      parent: "Expenses",
    },
    {
      href: "/companyLedger/",
      icon: <FaMoneyBill />,
      label: "Add Capital",
      parent: "Ledger",
    },
    {
      href: "/bankCheque/",
      icon: <FaArrowRight />,
      label: "Banks",
      parent: "Banks",
    },
    {
      href: "/product/",
      icon: <FaShoppingCart />,
      label: "Products",
      parent: "Products",
    },
    {
      href: "/seasonSummary/",
      icon: <FaShoppingCart />,
      label: "Seasons",
      parent: "Seasons",
    },
    {
      href: "/bardaanaLists/",
      icon: <FaShoppingCart />,
      label: "Bardaana List",
      parent: "Seasons",
    },
    { href: "/user/", icon: <FaShoppingCart />, label: "User", parent: "User" },
    // { href: "/packing/", icon: <FaBox />, label: "Packing", parent: "Packing" },
    // { href: "/stock/", icon: <FaBoxes />, label: "Stock", parent: "Stock" },
  ];

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Get user and permissions from localStorage
    const user = localStorage.getItem("user");
    const permissions = localStorage.getItem("permissions");

    try {
      // Check if user exists and has null permissions
      if (user) {
        const parsedUser = JSON.parse(user);

        // If permissions is null (string "null" or actual null), show all menu items
        if (permissions === "null" || permissions === null || !permissions) {
          console.log("User has null permissions - showing all menu items");
          setAllowedMenuItems(allMenuItems);
          return;
        }

        // If permissions exist, filter based on permissions
        const parsedPermissions = JSON.parse(permissions);

        // Extract parent names from permissions modules
        const allowedParents = [];
        if (
          parsedPermissions.modules &&
          Array.isArray(parsedPermissions.modules)
        ) {
          parsedPermissions.modules.forEach((module) => {
            if (module.parent) {
              allowedParents.push(module.parent);
            }
          });
        }

        // Filter menu items: show if parent is null (always show) OR if parent is in allowed permissions
        const filteredMenuItems = allMenuItems.filter(
          (item) => item.parent === null || allowedParents.includes(item.parent)
        );

        console.log("Filtered menu items:", filteredMenuItems);
        setAllowedMenuItems(filteredMenuItems);
      } else {
        console.log("No user found in localStorage");
        setAllowedMenuItems([]);
      }
    } catch (error) {
      console.error("Error parsing user/permissions:", error);
      // If there's an error, show only items with null parent (always accessible)
      const alwaysShowItems = allMenuItems.filter(
        (item) => item.parent === null
      );
      setAllowedMenuItems(alwaysShowItems);
    }
  }, []);

  const logOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    window.location.href = "/";
  };

  const handleMenuItemClick = (item, e) => {
    if (item.isModal) {
      e.preventDefault();
      setIsTrialBalanceModalOpen(true);
      setIsDropdownOpen(false);
    }
  };

  const renderMenuItem = (item, index) => {
    const menuItemContent = (
      <div
        className={`${styles.navItem} ${
          pathname === item.href ? styles.active : ""
        }`}
        onClick={(e) => handleMenuItemClick(item, e)}
      >
        <span className={styles.icon}>{item.icon}</span>
        <span className={styles.label}>{item.label}</span>
      </div>
    );

    if (item.isModal) {
      return (
        <div key={index} style={{ cursor: "pointer" }}>
          {menuItemContent}
        </div>
      );
    }

    return (
      <Link href={item.href} key={index}>
        {menuItemContent}
      </Link>
    );
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src="/logo.png" alt="Logo" />
      </div>

      {/* Mobile Hamburger Icon with Dropdown */}
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
              {allowedMenuItems.map((item, index) =>
                renderMenuItem(item, index)
              )}
            </div>
          )}
        </div>
      )}

      {/* Tablet/Desktop Navbar - Scrollable for tablet */}
      {!isMobile && (
        <nav
          className={`${styles.navbar} ${isTablet ? styles.scrollableNav : ""}`}
        >
          {allowedMenuItems.map((item, index) => renderMenuItem(item, index))}
        </nav>
      )}

      <div className={styles.profileSection}>
        <button onClick={logOut} className={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {/* Trial Balance Modal */}
      <TrialBalanceModal
        isOpen={isTrialBalanceModalOpen}
        onClose={() => setIsTrialBalanceModalOpen(false)}
      />
    </header>
  );
};

export default Header;
