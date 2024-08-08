"use client";

import React, { useState } from "react";
import styles from "../../styles/paymentss.module.css";
import Expense from "./Expense"
import Payment from "./Payment"

const Page = () => {
    const [activeTab, setActiveTab] = useState("tab1");

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className={styles.container}>
            <div className={styles.tabContainer}>
                <button className={`${styles.tabButton} ${activeTab === "tab1" ? styles.active : ""}`} onClick={() => handleTabClick("tab1")}>
                    Payment
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === "tab2" ? styles.active : ""}`}
                    onClick={() => handleTabClick("tab2")}
                >
                    Expense
                </button>
            </div>
            <div className={styles.tabContent}>
                {activeTab === "tab1" && (
                    <div>
                        <Payment />
                    </div>
                )}
                {activeTab === "tab2" && (
                    <div>
                        <Expense />

                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;