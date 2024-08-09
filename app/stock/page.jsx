"use client";
import React, { useEffect, useState } from "react";
import styles from "../../styles/stock.module.css";
import AddItemToStock from "../../components/stock/AddItemToStock";
import APICall from "../../networkApi/APICall";
import { stocks } from "@/networkApi/Constants";

const Page = () => {
  const api = new APICall();
  const [openAddToStockModal, setOpenAddToStockMoal] = useState(false);


  const openAddStockModal = () => {
    setOpenAddToStockMoal(true);
  };
  const closeStockModal = () => {
    setOpenAddToStockMoal(false);
  };

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const handleEdit = (row) => {
    setEditingData(row);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(stocks);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      const data = result.data;
      if (Array.isArray(data)) {
        setTableData(data);
      } else {
        throw new Error('Fetched data is not an array');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(products.delete(id), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      setTableData(tableData.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingData(null);
    fetchData();
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
          <div>Sr No</div>
          <div>Pakcing Size</div>
          <div>Packing Unit</div>
          <div>Price</div>
          <div>Product Description</div>
          <div>Product Name</div>
          <div>Quantity</div>
          <div>Amount</div>
        </div>
        <div className={styles.tableBody}>
          {tableData.map((row) => (
            <div key={row.id} className={styles.tableRowData}>
              <div>{row.id}</div>
              <div>{row.packing_size}</div>
              <div>{row.packing_unit}</div>
              <div>{row.price}</div>
              <div>{row.product_description}</div>
              <div>{row.product_name}</div>
              <div>{row.quantity}</div>
              <div>{row.total_amount}</div>
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
