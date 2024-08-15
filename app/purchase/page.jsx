"use client";
import React, { useEffect, useState } from "react";
import styles from "../../styles/purchase.module.css";
import APICall from "../../networkApi/APICall";
import { purchaseOut } from "@/networkApi/Constants";
import Swal from 'sweetalert2';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
} from "@mui/material";

import Buttons from "../../components/buttons"

const Page = () => {
  const api = new APICall();

  const [openAddToStockModal, setOpenAddToStockModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.getDataWithToken(purchaseOut);
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
      const response = await api.getDataWithToken(`${purchaseOut}/${id}`, {
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
      <Buttons leftSectionText="Purchase" addButtonLink="/addPurchase" />

      <TableContainer component={Paper} className={styles.tableSection}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Bank Name</TableCell>
              <TableCell>Cheque Date</TableCell>
              <TableCell>Cheque No</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Expense Category</TableCell>
              <TableCell>Payment Flow Type</TableCell>
              <TableCell>Payment Type</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Show skeletons while loading
              Array.from(new Array(5)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                </TableRow>
              ))
            ) : (
              // Display data
              tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.bank_name}</TableCell>
                  <TableCell>{row.cheque_date}</TableCell>
                  <TableCell>{row.cheque_no}</TableCell>
                  <TableCell>{row.customer_id}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.expense_category_id}</TableCell>
                  <TableCell>{row.payment_flow_type}</TableCell>
                  <TableCell>{row.payment_type}</TableCell>
                  <TableCell className={styles.iconContainer}>
                    <img src="/delete.png" onClick={() => handleDelete(row.id)} className={styles.deleteButton} alt="Delete" />
                    <img src="/edit.jpg" onClick={() => handleEdit(row)} className={styles.editButton} alt="Edit" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Page;
