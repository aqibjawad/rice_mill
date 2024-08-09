"use client";
import React, { useEffect, useState } from "react";
import styles from "../../styles/stock.module.css";
import AddItemToStock from "../../components/stock/AddItemToStock";
import APICall from "../../networkApi/APICall";
import { stocks } from "@/networkApi/Constants";
import DatePicker from "react-datepicker";

import Swal from 'sweetalert2';

import Link from "next/link";

const Page = () => {
  const api = new APICall();
  const [openAddToStockModal, setOpenAddToStockModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const openAddStockModal = () => {
    setEditingData(null);
    setOpenAddToStockModal(true);
  };

  const closeStockModal = () => {
    setOpenAddToStockModal(false);
    setEditingData(null);
  };

  const handleEdit = (row) => {
    setEditingData(row);
    setOpenAddToStockModal(true);
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      let url = stocks;
      if (selectedDate) {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        url += `?date=${formattedDate}`;
      }
      const response = await fetch(url);
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
      const response = await fetch(`${stocks}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete stock item');
      }

      setTableData(tableData.filter(item => item.id !== id));

      Swal.fire({
        title: 'Deleted!',
        text: 'The stock item has been deleted successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

    } catch (error) {
      console.error('Error deleting Stock:', error);

      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete the stock item.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.leftSection}>Purchase</div>
        <div className={styles.rightSection}>
          <div className={styles.rightItemExp}>
            <Link href="/addPurchase"> 
             + Add Purchase
            </Link>
          </div>
          <div className={styles.rightItem}>view all</div>
          <div className={styles.rightItem}>view all</div>
          <div className={styles.rightItemExp}>export</div>
        </div>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <div>Sr No</div>
          <div>Packing Size</div>
          <div>Packing Unit</div>
          <div>Price</div>
          <div>Product Description</div>
          <div>Product Name</div>
          <div>Quantity</div>
          <div>Amount</div>
          <div>Actions</div>
        </div>
        <div className={styles.tableBody}>
          {tableData.map((row, index) => (
            <div key={index} className={styles.tableRowData}>
              <div>{row.id}</div>
              <div>{row.packing_size}</div>
              <div>{row.packing_unit}</div>
              <div>{row.price}</div>
              <div>{row.product_description}</div>
              <div>{row.product_name}</div>
              <div>{row.quantity}</div>
              <div>{row.total_amount}</div>
              <div className={styles.iconContainer}>
                <img src="/delete.png" onClick={() => handleDelete(row.id)} className={styles.deleteButton} />
                <img src="/edit.jpg" onClick={() => handleEdit(row)} className={styles.editButton} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddItemToStock
        open={openAddToStockModal}
        handleClose={closeStockModal}
        editingData={editingData}
        onItemUpdated={fetchData}
      />
    </div>
  );
};

export default Page;