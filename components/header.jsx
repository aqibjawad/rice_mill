import React from "react";
import styles from "../styles/header.module.css";

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.nameCont}>
        <div className={styles.userName}>Ghulam Bari</div>
        <div className={styles.userEmail}>Ghulam Bari@gmail.com</div>
      </div>

      <div className={styles.companyName}>Ghulam Bari Rice Mill</div>

      <div className={styles.logoutBtn}>Logout</div>
    </div>
  );
};

export default Header;
