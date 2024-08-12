"use client";

import React from "react";
import styles from "../../styles/addPurchase.module.css"

const Tabs = ({ activeTab, setActiveTab }) => {
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Ensure activeTab has a default value
    const currentTab = activeTab || "cash";

    

    return (
        <div>
            <div className={styles.tabPaymentContainer}>
                <button 
                    className={`${styles.tabPaymentButton} ${currentTab.includes("cash") ? styles.active : ""}`} 
                    onClick={() => handleTabClick(currentTab === "cheque" ? "both" : "cash")}
                >
                    Cash
                </button>
                <button 
                    className={`${styles.tabPaymentButton} ${currentTab.includes("cheque") ? styles.active : ""}`} 
                    onClick={() => handleTabClick(currentTab === "cash" ? "both" : "cheque")}
                >
                    Cheque
                </button>
            </div>
        </div>
    )
}

export default Tabs;