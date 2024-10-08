"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/product.module.css";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import { products } from "../../networkApi/Constants";
import { MdDelete, MdEdit } from "react-icons/md";
import AddProduct from "../../components/stock/addProduct";
import APICall from "../../networkApi/APICall";
import Swal from "sweetalert2";

const Page = () => {
  const api = new APICall();
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingData(null);
    fetchData(); // Refresh the data after closing the modal
  };

  const handleEdit = (row) => {
    setEditingData(row);
    setOpen(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.getDataWithToken(products);
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

  const handleDelete = async (id) => {
    try {
      await api.deleteDataWithToken(`${products}/${id}`, {
        method: "DELETE",
      });

      setTableData((prevData) => prevData.filter((item) => item.id !== id));

      Swal.fire({
        title: "Deleted!",
        text: "The Product item has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error deleting product:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to delete the product item.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <Grid container spacing={2}>
          <Grid item lg={11} sm={12} xs={12} md={4}>
            <div className={styles.leftSection}>Product</div>
          </Grid>

          <Grid item lg={1} sm={12} xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid lg={3} item xs={6} sm={6} md={3}>
                <div onClick={handleOpen} className={styles.rightItem}>
                  Add
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>

      <div className={styles.contentContainer}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr.</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Product Description</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Skeleton variant="text" />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {error}
                  </TableCell>
                </TableRow>
              ) : (
                tableData.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.product_name}</TableCell>
                    <TableCell>{row.product_description}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDelete(row.id)}
                        color="error"
                      >
                        <MdDelete />
                      </IconButton>
                      <IconButton
                        onClick={() => handleEdit(row)}
                        color="primary"
                      >
                        <MdEdit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <AddProduct
        open={open}
        handleClose={handleClose}
        editData={editingData}
      />
    </div>
  );
};

export default Page;
