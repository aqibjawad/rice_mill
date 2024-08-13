"use client";

import React from "react";
import styles from "../../styles/addPurchase.module.css";

const Tabs = ({ activeTab, setActiveTab }) => {
    // Handle tab clicks and set the appropriate active tab
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Ensure activeTab has a default value
    const currentTab = activeTab || "cash";

    return (
        <div>
            <div className={styles.tabPaymentContainer}>
                <button 
                    className={`${styles.tabPaymentButton} ${currentTab === "cash" ? styles.active : ""}`} 
                    onClick={() => handleTabClick("cash")}
                >
                    Cash
                </button>
                <button 
                    className={`${styles.tabPaymentButton} ${currentTab === "cheque" ? styles.active : ""}`} 
                    onClick={() => handleTabClick("cheque")}
                >
                    Cheque
                </button>
                <button 
                    className={`${styles.tabPaymentButton} ${currentTab === "both" ? styles.active : ""}`} 
                    onClick={() => handleTabClick("both")}
                >
                    Both
                </button>
            </div>
        </div>
    );
}

export default Tabs;
