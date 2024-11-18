"use client";

import React, { useState } from "react";
import styles from "../../styles/paymentss.module.css";
import ExpensePayments from "./Expense";
import Payment from "./Payment";
import Online from "./online";

const Page = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.container}>
      <div className={styles.payment}>Payments</div>

      <div className={styles.tabPaymentContainer}>
        <button 
          className={`${styles.tabPaymentButton} ${
            activeTab === "tab1" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("tab1")}
        >
          Payments
        </button>
        <button
          className={`${styles.tabPaymentButton} ${
            activeTab === "tab2" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("tab2")}
        >
          Expenses
        </button>

        {/* <button
          className={`${styles.tabPaymentButton} ${
            activeTab === "tab3" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("tab3")}
        >
          Online
        </button> */}
      </div>

      <div className={styles.tabContent}>
        {activeTab === "tab1" && (
          <div>
            <Payment />
          </div>
        )}

        {activeTab === "tab2" && (
          <div>
            <ExpensePayments />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
