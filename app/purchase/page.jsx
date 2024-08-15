"use client";
import React, { useEffect, useState } from "react";
import styles from "../../styles/purchase.module.css";
import APICall from "../../networkApi/APICall";
import { purchaseBook } from "@/networkApi/Constants";
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

import { MdDelete, MdEdit } from "react-icons/md";

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
      const response = await api.getDataWithToken(purchaseBook);

      const data = response.data;

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
      const response = await api.deleteDataWithToken(`${purchaseBook}/${id}`, {
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
              <TableCell>Date</TableCell>
              <TableCell>Supplier ID</TableCell>
              <TableCell>Product ID</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Packing Type</TableCell>
              <TableCell>Bardaana Quantity</TableCell>
              <TableCell>Truck Number</TableCell>
              <TableCell>Freight</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Bank Tax</TableCell>
              <TableCell>Cash Amount</TableCell>
              <TableCell>Cheque Number</TableCell>
              <TableCell>Remaining Amount</TableCell>
              <TableCell>First Weight</TableCell>
              <TableCell>Second Weight</TableCell>
              <TableCell>Net Weight</TableCell>
              <TableCell>Packing Weight</TableCell>
              <TableCell>Bardaana Deduction</TableCell>
              <TableCell>Final Weight</TableCell>
              <TableCell>Payment Type</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Show skeletons while loading
              Array.from(new Array(5)).map((_, index) => (
                <TableRow key={index}>
                  {Array.from(new Array(22)).map((_, cellIndex) => (
                    <TableCell key={cellIndex}><Skeleton /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Display data
              tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.sup_id}</TableCell>
                  <TableCell>{row.pro_id}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.packing_type}</TableCell>
                  <TableCell>{row.bardaanaQuantity}</TableCell>
                  <TableCell>{row.truckNumber}</TableCell>
                  <TableCell>{row.freight}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.bankTax}</TableCell>
                  <TableCell>{row.cash_amount}</TableCell>
                  <TableCell>{row.chequeNumber}</TableCell>
                  <TableCell>{row.remainingAmount}</TableCell>
                  <TableCell>{row.first_weight}</TableCell>
                  <TableCell>{row.second_weight}</TableCell>
                  <TableCell>{row.net_weight}</TableCell>
                  <TableCell>{row.packing_weight}</TableCell>
                  <TableCell>{row.bardaanaDeduction}</TableCell>
                  <TableCell>{row.final_weight}</TableCell>
                  <TableCell>{row.payment_type}</TableCell>
                  <TableCell>
                    <div className={styles.iconContainer}>
                      <MdDelete onClick={() => handleDelete(row.id)} className={styles.deleteButton} />
                      <MdEdit onClick={() => handleEdit(row)} className={styles.editButton} />
                    </div>
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
