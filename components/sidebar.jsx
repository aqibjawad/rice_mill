import React, { useState, useEffect } from "react";
import styles from "../styles/sidebar.module.css";
import { useRouter } from "next/navigation";
import MobileMenuButton from "./MobileMenuButton";
import { FaHome, FaArrowRight, FaArrowLeft, FaShoppingCart, FaBox, FaBoxes, FaCreditCard, FaShoppingBag, FaTruck, FaUserTie } from 'react-icons/fa';

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

  const logOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: <FaHome /> },
  { name: "Banks", href: "/bank", icon: <FaArrowRight /> },
  { name: "Bank Cheque", href: "/bankCheque", icon: <FaArrowRight /> },
  { name: "Recieves", href: "/inflow", icon: <FaArrowRight /> },
  { name: "Outflow", href: "/outflow", icon: <FaArrowLeft /> },
  { name: "Product", href: "/product", icon: <FaShoppingCart /> },
  { name: "Packing", href: "/packing", icon: <FaBox /> },
  { name: "Stock", href: "/stock", icon: <FaBoxes /> },
  { name: "Payments", href: "/payments", icon: <FaCreditCard /> },
  { name: "Purchase", href: "/purchase", icon: <FaShoppingBag /> },
  { name: "Supplier", href: "/supplier", icon: <FaTruck /> },
  { name: "Buyer", href: "/buyer", icon: <FaUserTie /> },
  { name: "Sale", href: "/sale", icon: <FaUserTie /> },
]
  return (
    <>
      {isMobile && (
        <MobileMenuButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      )}
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
            key={index}
          >
            <div
              className={`${styles.sideBarItem} ${
                activeItem === item.name ? styles.active : ""
              }`}
              style={index === 0 ? { marginTop: "5rem" } : {}}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.itemName}>{item.name}</span>
            </div>
          </div>
        ))}

        <div>
          <div className={styles.profileHead}>Profile</div>
          <div className={styles.picCont}>
            <img className={styles.userPic} src="/userPic.png" />
          </div>

          <div className={styles.userName}>Sarah Webb</div>

          <div className={styles.userEmail}>sarahweb456@gmail.com</div>

          <div className={styles.logoutCont}>
            <div onClick={logOut} className={styles.logoutBtn}>
              Logout
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
