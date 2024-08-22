"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/bankCheque.module.css";
import { expenseCat } from "../../networkApi/Constants";
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

  const [tableData, setTableData] = useState([]);

  const [rowData, setRowData] = useState();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const expenseId = localStorage.getItem("expenseId");

  const fetchData = async () => {
    try {
      const response = await api.getDataWithToken(`${expenseCat}/${expenseId}`);

      const data = response.data;

      setRowData(data);

      if (Array.isArray(data.expenses)) {
        setTableData(data.expenses);
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <Grid container spacing={2}>
          <Grid item lg={8} sm={12} xs={12} md={4}>
            <div className={styles.leftSection}> {rowData?.expense_category} </div>
          </Grid>
        </Grid>
      </div>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Cash Amount</TableCell>
              <TableCell>Cheque Amount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Payment Type</TableCell>
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
                    <TableCell>{row.cash_amount}</TableCell>
                    <TableCell>{row.cheque_amount || 0 }</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.total_amount}</TableCell>
                    <TableCell>{row.payment_type}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Page;
