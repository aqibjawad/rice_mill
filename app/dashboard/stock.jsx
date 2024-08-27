"use client";
import React, { useEffect, useState } from "react";
import styles from "../../styles/stock.module.css";
import AddItemToStock from "../../components/stock/AddItemToStock";
import APICall from "../../networkApi/APICall";
import { stocks } from "@/networkApi/Constants";
import Swal from "sweetalert2";
import { Grid, Typography, TextField } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  IconButton,
} from "@mui/material";
import { MdDelete, MdEdit } from "react-icons/md";
import DateFilters from "@/components/generic/DateFilter";
import { format } from "date-fns";

const Page = () => {
  const api = new APICall();
  const [openAddToStockModal, setOpenAddToStockModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = [];

      if (startDate && endDate) {
        queryParams.push(`start_date=${format(new Date(startDate), "yyyy-MM-dd")}`);
        queryParams.push(`end_date=${format(new Date(endDate), "yyyy-MM-dd")}`);
      } else {
        const currentDate = format(new Date(), "yyyy-MM-dd");
        queryParams.push(`start_date=${currentDate}`);
        queryParams.push(`end_date=${currentDate}`);
      }

      const response = await api.getDataWithToken(`${stocks}?${queryParams.join("&")}`);

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

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteDataWithToken(`${stocks}/${id}`, {
        method: "DELETE",
      });

      setTableData(tableData.filter((item) => item.id !== id));

      Swal.fire({
        title: "Deleted!",
        text: "The stock item has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error deleting Stock:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to delete the stock item.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <Grid container spacing={2}>
          <Grid item lg={8} sm={12} xs={12} md={4}>
            <div className={styles.leftSection}>Stock</div>
          </Grid>
          <Grid item lg={4} sm={12} xs={12} md={8}>
            <div className={styles.rightSection}>
              <Grid container spacing={2}>
                <Grid lg={3} item xs={6} sm={6} md={3}>
                  <div onClick={openAddStockModal} className={styles.rightItem}>
                    Add
                  </div>
                </Grid>

                <Grid lg={3} item xs={6} sm={6} md={3}>
                  <DateFilters onDateChange={handleDateChange} />
                </Grid>

                <Grid item lg={3} xs={6} sm={6} md={3}>
                  <div className={styles.rightItem}>view</div>
                </Grid>

                <Grid item lg={3} xs={6} sm={6} md={3}>
                  <div className={styles.rightItemExp}>export</div>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="stock table">
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Packing Size</TableCell>
              <TableCell>Packing Unit</TableCell>
              <TableCell>Product Description</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {[...Array(7)].map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton animation="wave" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : tableData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography variant="h6" align="center" color="textSecondary">
                    No data for the selected date
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.packing_size}</TableCell>
                  <TableCell>{row.packing_unit}</TableCell>
                  <TableCell>{row.product_description}</TableCell>
                  <TableCell>{row.product_name}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(row.id)} color="error">
                      <MdDelete />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(row)} color="primary">
                      <MdEdit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
