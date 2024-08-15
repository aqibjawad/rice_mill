"use client";

import React from "react";
import styles from "../../styles/addPurchase.module.css";

const Tabs = ({ activeTab, setActiveTab }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const currentTab = activeTab || "cash";

  return (
    <div>
      <div className={styles.tabPaymentContainer}>
        <div
          className={`${styles.tabPaymentButton} ${
            currentTab === "cash" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("cash")}
        >
          Cash
        </div>
        <div
          className={`${styles.tabPaymentButton} ${
            currentTab === "cheque" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("cheque")}
        >
          Cheque
        </div>
        <div
          className={`${styles.tabPaymentButton} ${
            currentTab === "both" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("both")}
        >
          Both
        </div>
      </div>
    </div>
  );
};

export default Tabs;
