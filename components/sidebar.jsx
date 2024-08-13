import React, { useState, useEffect } from "react";
import styles from "../styles/sidebar.module.css";
import Link from "next/link";
import { FaHome, FaArrowRight, FaArrowLeft, FaBoxes, FaShoppingCart, FaBox, FaCreditCard, FaShoppingBag, FaTruck, FaUserTie } from 'react-icons/fa';

const SideBar = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <FaHome /> },
    { name: "In Flow", href: "/inflow", icon: <FaArrowRight /> },
    { name: "Out Flow", href: "/outflow", icon: <FaArrowLeft /> },
    // { name: "Customer", href: "/customer", icon: <FaUsers /> },
    { name: "Stock", href: "/stock", icon: <FaBoxes /> },
    { name: "Product", href: "/product", icon: <FaShoppingCart /> },
    { name: "Packing", href: "/packing", icon: <FaBox /> },
    { name: "Payments", href: "/payments", icon: <FaCreditCard /> },
    { name: "Purchase", href: "/purchase", icon: <FaShoppingBag /> },
    { name: "Supplier", href: "/supplier", icon: <FaTruck /> },
    { name: "Buyer", href: "/Buyer", icon: <FaUserTie /> },
    { name: "Supplier Ledger", href: "/supplier_ledger", icon: <FaUserTie /> },
  ];

  return (
    <>
      <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '←' : '→'}
      </button>
      <div className={`${styles.sideBarComp} ${isOpen ? styles.open : ''}`}>
        <div className={styles.imgContainer}>
          <img className={styles.logo} src="/logo.png" alt="Logo" />
        </div>
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <div
              className={`${styles.sideBarItem} ${activeItem === item.name ? styles.active : ""
                }`}
              onClick={() => setActiveItem(item.name)}
              style={index === 0 ? { marginTop: "5rem" } : {}}
            >
              <span className={styles.icon}>{item.icon}</span>
              {(!isMobile || isOpen) && <span className={styles.itemName}>{item.name}</span>}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default SideBar;