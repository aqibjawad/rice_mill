import React, { useState, useEffect } from "react";
import styles from "../styles/sidebar.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaArrowRight,
  FaArrowLeft,
  FaBoxes,
  FaShoppingCart,
  FaBox,
  FaCreditCard,
  FaShoppingBag,
  FaTruck,
  FaUserTie,
} from "react-icons/fa";

const SideBar = () => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);





  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <FaHome /> },
    { name: "Recieves", href: "/inflow", icon: <FaArrowRight /> },
    { name: "Outflow", href: "/outflow", icon: <FaArrowLeft /> },
    { name: "Stock", href: "/stock", icon: <FaBoxes /> },
    { name: "Product", href: "/product", icon: <FaShoppingCart /> },
    { name: "Packing", href: "/packing", icon: <FaBox /> },
    { name: "Payments", href: "/payments", icon: <FaCreditCard /> },
    { name: "Purchase", href: "/purchase", icon: <FaShoppingBag /> },
    { name: "Supplier", href: "/supplier", icon: <FaTruck /> },
    { name: "Buyer", href: "/Buyer", icon: <FaUserTie /> },
    { name: "Sale", href: "/sale", icon: <FaUserTie /> },
  ];

  return (
    <>
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "←" : "→"}
      </button>
      <div className={`${styles.sideBarComp} ${isOpen ? styles.open : ""}`}>
        <div className={styles.imgContainer}>
          <img className={styles.logo} src="/logo.png" alt="Logo" />
        </div>
        {menuItems.map((item, index) => (

          <div
            onClick={() => {
              setActiveItem(item.name);
              router.push(item.href);
            }}
            key={index}>
            <div
              className={`${styles.sideBarItem} ${activeItem === item.name ? styles.active : ""
                }`}

              style={index === 0 ? { marginTop: "5rem" } : {}}
            >
              <span className={styles.icon}>{item.icon}</span>
              {(!isMobile || isOpen) && (
                <span className={styles.itemName}>{item.name}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SideBar;
