import React, { useState, useEffect, memo } from "react";
import styles from "../styles/sidebar.module.css";
import { useRouter, usePathname } from "next/navigation";
import MobileMenuButton from "./MobileMenuButton";
import {
  FaHome,
  FaArrowRight,
  FaArrowLeft,
  FaShoppingCart,
  FaBox,
  FaBoxes,
  FaCreditCard,
  FaShoppingBag,
  FaTruck,
  FaUserTie,
  FaMoneyBill,
} from "react-icons/fa";

import Link from "next/link";

const SideBar = () => {
  const router = useRouter();
  const pathname = usePathname();
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
    { name: "Dashboard", href: "/dashboard/", icon: <FaHome /> },
    { name: "Sale", href: "/sale/", icon: <FaUserTie /> },
    { name: "Purchase", href: "/purchase/", icon: <FaShoppingBag /> },
    { name: "Recieves", href: "/inflow/", icon: <FaArrowRight /> },
    { name: "Payments", href: "/outflow/", icon: <FaArrowLeft /> },
    { name: "Suppliers", href: "/supplier/", icon: <FaTruck /> },
    { name: "Buyers", href: "/Buyer/", icon: <FaUserTie /> },
    { name: "Expenses", href: "/expenses/", icon: <FaMoneyBill /> },
    { name: "Company Ledger", href: "/companyLedger/", icon: <FaMoneyBill /> },
    { name: "Bank Cheque", href: "/bankCheque/", icon: <FaArrowRight /> },
    { name: "Product", href: "/product/", icon: <FaShoppingCart /> },
    { name: "Packing", href: "/packing/", icon: <FaBox /> },
    { name: "Stock", href: "/stock/", icon: <FaBoxes /> },
  ];

  console.log(pathname);

  return (
    <>
      {isMobile && (
        <MobileMenuButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      )}
      <div className={`${styles.sideBarComp} ${isOpen ? styles.open : ""}`}>
        <div className={styles.imgContainer}>
          <img
            className={styles.logo}
            src="/logo.png"
            alt="Logo"
            height={100}
          />
        </div>
        {menuItems.map((item, index) => (
          <Link href={item.href} key={index}>
            <div
              className={`${styles.sideBarItem} ${
                pathname === item.href ? styles.active : ""
              }`}
              style={index === 0 ? { marginTop: "5rem" } : {}}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.itemName}>{item.name}</span>
            </div>
          </Link>
        ))}

        <div>
          <div className={styles.profileHead}>Profile</div>
          <div className={styles.picCont}>
            <img className={styles.userPic} src="/userPic.png" alt="User" />
          </div>

          <div className="m-5">
            <div className={styles.userEmail}>Admin</div>
          </div>
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

const MemoizedSideBar = memo(SideBar);
export default MemoizedSideBar;
