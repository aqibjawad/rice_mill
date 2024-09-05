"use client";
import React, { useEffect, useState } from "react";
import styles from "../../styles/purchase.module.css";
import APICall from "../../networkApi/APICall";
import { purchaseBook } from "@/networkApi/Constants";
import Swal from "sweetalert2";
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

import Buttons from "../../components/buttons";

import { MdDelete, MdEdit } from "react-icons/md";

import withAuth from '@/utils/withAuth'; 

const Purchase = () => {
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
        throw new Error("Fetched data is not an array");
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
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete Purchase Book item");
      }

      setTableData(tableData.filter((item) => item.id !== id));

      Swal.fire({
        title: "Deleted!",
        text: "The purchase item has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error deleting Purchase:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to delete the purchase item.",
        icon: "error",
        confirmButtonText: "OK",
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
              <TableCell>Product</TableCell>
              <TableCell> Party </TableCell>
              <TableCell> Weight </TableCell>
              <TableCell> Amount </TableCell>
              <TableCell> Action </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? // Show skeletons while loading
                Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from(new Array(22)).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : // Display data
                tableData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.product?.product_name}</TableCell>
                    <TableCell>{row.supplier?.person_name}</TableCell>
                    <TableCell>{row.net_weight}</TableCell>
                    <TableCell>{row.total_amount}</TableCell>
                    <TableCell>View Details</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default withAuth(Purchase);
