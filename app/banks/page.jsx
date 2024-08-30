"use client";
import React, { useEffect, useState } from "react";
import styles from "../../styles/stock.module.css";
import APICall from "../../networkApi/APICall";
import { stocks } from "@/networkApi/Constants";
import Swal from "sweetalert2";

import addBank from "../../components/stock/addBank";

import { Grid, Typography } from "@mui/material";

// MUI imports
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

const Page = () => {
  const api = new APICall();

  const [openBankModal, setOpenBankModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const openAddBankModal = () => {
    setOpenBankModal(true);
  };

  const closeBankModal = () => {
    setOpenBankModal(false);
  };

  const handleEditBank = (row) => {
    setEditingBankData(row);
    setOpenBankModal(true);
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      let url = stocks;
      if (selectedDate) {
        const formattedDate = selectedDate.toISOString().split("T")[0];
        url += `?date=${formattedDate}`;
      }
      const response = await api.getDataWithToken(url);

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
            <div className={styles.leftSection}>Banks</div>
          </Grid>
          <Grid item lg={4} sm={12} xs={12} md={8}>
            <div className={styles.rightSection}>
              <Grid container spacing={2}>
                <Grid lg={3} item xs={6} sm={6} md={3}>
                  <div onClick={openAddBankModal} className={styles.rightItem}>
                    Add
                  </div>
                </Grid>

                <Grid lg={3} item xs={6} sm={6} md={3}>
                  <div className={styles.rightItem}>date</div>
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
              <TableCell>Bank Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Skeleton loader
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
              // Actual data
              tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.packing_size}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <addBank
        openBank={openBankModal}
        handleCloseBank={closeBankModal}
        // editData={editingBankData}
        onBankUpdated={fetchData}
      />
    </div>
  );
};

export default Page;
