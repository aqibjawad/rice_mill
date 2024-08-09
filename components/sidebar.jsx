import React, { useState } from "react";
import styles from "../styles/sidebar.module.css";
import Link from "next/link";

const SideBar = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "In Flow", href: "/inflow" },
    { name: "Out Flow", href: "/outflow" },
    { name: "Customer", href: "/customer" },
    { name: "Stock", href: "/stock" },
    { name: "Product", href: "/product" },
    { name: "Packing", href: "/packing" },
    { name: "Payments", href: "/payments" },
    { name: "Purchase", href: "/purchase" },
    { name: "Supplier", href: "/supplier" },
    { name: "Buyer", href: "/Buyer" },
  ];

  return (
    <div className={styles.sideBarComp}>
      <div className={styles.imgContainer}>
        <img className={styles.logo} src="/logo.png" alt="Logo" />
      </div>
      {menuItems.map((item, index) => (
        <Link key={index} href={item.href} passHref>
          <div
            className={`${styles.sideBarText} ${
              activeItem === item.name ? styles.active : ""
            }`}
            onClick={() => setActiveItem(item.name)}
            style={index === 0 ? { marginTop: "5rem" } : {}}
          >
            {item.name}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SideBar;
