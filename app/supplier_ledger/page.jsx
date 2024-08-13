"use client";
import React, { useEffect, useState } from "react";
import styles from "../../styles/purchase.module.css";
import APICall from "../../networkApi/APICall";
import { supplierLedger } from "@/networkApi/Constants";
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(supplierLedger);
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

  const handleEdit = (row) => {
    const encodedData = encodeURIComponent(JSON.stringify(row));
    window.location.href = `/addPurchase?editData=${encodedData}`;
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${supplierLedger}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete Purchase Book item');
      }

      setTableData(tableData.filter(item => item.id !== id));

      Swal.fire({
        title: 'Deleted!',
        text: 'The purchase item has been deleted successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

    } catch (error) {
      console.error('Error deleting Purchase:', error);

      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete the purchase item.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.leftSection}> Supplier Ledger </div>
        <div className={styles.rightSection}>
          <div className={styles.rightItemExp}>
            <Link href="/addSupLedger">+ Add Ledger</Link>
          </div>
          <div className={styles.rightItem}>view all</div>
          <div className={styles.rightItemExp}>export</div>
        </div>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <div>Sr No</div>
          <div>balance</div>
          <div>Cash Amount</div>
        
          <div>Bank Id</div>
          <div>Cheque Date</div>
          <div>Cheque No</div>
          <div>Cheque Amount</div>
          <div>Cr Amount</div>

          <div>Customer Id</div>
          <div>Customer Type</div>
          <div>Description</div>
          <div>Dr Amount</div>

          <div>Entry Type</div>
          <div>Payment Type</div>

          <div>Action</div>
        </div>
        <div className={styles.tableBody}>
          {tableData.map((row, index) => (
            <div key={index} className={styles.tableRowData}>

              <div>{row.id}</div>
              <div>{row.balance}</div>
              <div>{row.cash_amount}</div>
              
              <div>{row.bank_id}</div>
              <div>{row.cheque_date}</div>
              <div>{row.cheque_no}</div>
              <div>{row.cheque_amount}</div>
              <div>{row.cr_amount}</div>

              <div>{row.customer_id}</div>
              <div>{row.customer_type}</div>
              <div>{row.description}</div>
              <div>{row.dr_amount}</div>

              <div>{row.entry_type}</div>
              <div>{row.payment_type}</div>

              <div className={styles.iconContainer} style={{marginLeft:"3rem"}}>
                <img src="/delete.png" onClick={() => handleDelete(row.id)} className={styles.deleteButton} />
                <img src="/edit.jpg" onClick={() => handleEdit(row)} className={styles.editButton} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;