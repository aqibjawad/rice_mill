"use client";
import React, { useEffect, useState } from "react";
import styles from "../../styles/dashboard.module.css";
import AddItemToStock from "../../components/stock/AddItemToStock";
import APICall from "../../networkApi/APICall";
import { products } from "@/networkApi/Constants";

const Page = () => {
  const api = new APICall();
  const [openAddToStockModal, setOpenAddToStockMoal] = useState(false);

  // Sample data for the table
  const tableData = [
    {
      id: 1,
      sr: 1,
      paymentType: "Cash",
      person: "John Doe",
      description: "Office Supplies",
      amount: 500,
    },
    {
      id: 2,
      sr: 2,
      paymentType: "Bank Transfer",
      person: "Jane Smith",
      description: "Utility Bill",
      amount: 750,
    },
    {
      id: 2,
      sr: 2,
      paymentType: "Bank Transfer",
      person: "Jane Smith",
      description: "Utility Bill",
      amount: 750,
    },
    {
      id: 2,
      sr: 2,
      paymentType: "Bank Transfer",
      person: "Jane Smith",
      description: "Utility Bill",
      amount: 750,
    },
    {
      id: 2,
      sr: 2,
      paymentType: "Bank Transfer",
      person: "Jane Smith",
      description: "Utility Bill",
      amount: 750,
    },
    {
      id: 2,
      sr: 2,
      paymentType: "Bank Transfer",
      person: "Jane Smith",
      description: "Utility Bill",
      amount: 750,
    },
    {
      id: 2,
      sr: 2,
      paymentType: "Bank Transfer",
      person: "Jane Smith",
      description: "Utility Bill",
      amount: 750,
    },

    { id: 3, amount: "Total : 750" },
    // Add more rows as needed
  ];

  const openAddStockModal = () => {
    setOpenAddToStockMoal(true);
  };
  const closeStockModal = () => {
    setOpenAddToStockMoal(false);
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.leftSection}>Stock</div>
        <div className={styles.rightSection}>
          <div
            onClick={() => openAddStockModal()}
            className={styles.rightItemExp}
          >
            + Add Item in Stock
          </div>
          <div className={styles.rightItem}>date</div>
          <div className={styles.rightItem}>view all</div>
          <div className={styles.rightItemExp}>export</div>
        </div>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <div>Sr.</div>
          <div>Payment Type</div>
          <div>Person</div>
          <div>Description</div>
          <div>Amount</div>
        </div>
        <div className={styles.tableBody}>
          {tableData.map((row) => (
            <div key={row.id} className={styles.tableRowData}>
              <div>{row.sr}</div>
              <div>{row.paymentType}</div>
              <div>{row.person}</div>
              <div>{row.description}</div>
              <div>{row.amount}</div>
            </div>
          ))}
        </div>
      </div>
      <AddItemToStock
        open={openAddToStockModal}
        handleClose={closeStockModal}
      />
    </div>
  );
};

export default Page;
