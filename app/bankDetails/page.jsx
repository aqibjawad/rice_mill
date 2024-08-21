"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/bankCheque.module.css";
import { banks, bankCheque } from "../../networkApi/Constants";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Grid,
  Button,
} from "@mui/material";

import APICall from "../../networkApi/APICall";

const Page = () => {
  const api = new APICall();

  const [selectedRowId, setSelectedRowId] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openBankCheque, setOpenBankCheque] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const bankId = localStorage.getItem("selectedRowId");

  const fetchData = async () => {
    try {
      const response = await api.getDataWithToken(`${banks}/${bankId}`);
      const data = response.data;
      if (Array.isArray(data.advance_cheques)) {
        setTableData(data.advance_cheques);
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id) => {
    try {
      const response = await api.getDataWithToken(
        `${bankCheque}/is_deferred/${id}/0`,
        { status: "Cash" }
      );

      if (response.status === 200) {
        setTableData((prevData) =>
          prevData.map((row) =>
            row.id === id ? { ...row, status: "Cash" } : row
          )
        );

        Swal.fire({
          title: "Success!",
          text: "Cheque status updated to Cash.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error updating cheque status:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to update cheque status.",
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
            <div className={styles.leftSection}> Bank Names </div>
          </Grid>
          <Grid item lg={4} sm={12} xs={12} md={8}>
            <div className={styles.rightSection}>
              <Grid container spacing={2}>

                <Grid lg={4} item xs={6} sm={6} md={3}>
                  <div className={styles.rightItem}>date</div>
                </Grid>

                <Grid item lg={4} xs={6} sm={6} md={3}>
                  <div className={styles.rightItem}>view</div>
                </Grid>

                <Grid item lg={4} xs={6} sm={6} md={3}>
                  <div className={styles.rightItemExp}>export</div>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Party</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    {[...Array(6)].map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : tableData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.cheque_date}</TableCell>
                    <TableCell>{row.customer.person_name}</TableCell>
                    <TableCell>{row.cheque_amount}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleStatusUpdate(row.id)}
                        className={styles.cash}
                      >
                        Cash
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Page;
