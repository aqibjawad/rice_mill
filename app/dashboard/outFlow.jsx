"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/ledger1.module.css";
import { expense, getSupplierPaidAmounts } from "../../networkApi/Constants";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";
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
  Typography,
} from "@mui/material";

import Buttons from "../../components/buttons";
import APICall from "../../networkApi/APICall";

const Page = () => {
  const api = new APICall();

  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [cashTotal, setCashTotal] = useState(0);
  const [chequeOnlineTotal, setChequeOnlineTotal] = useState(0);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = [];

      if (startDate && endDate) {
        queryParams.push(`start_date=${startDate}`);
        queryParams.push(`end_date=${endDate}`);
      } else {
        const now = new Date();
        const monthStartDate = startOfDay(now);
        const monthEndDate = endOfDay(now);

        const formattedStartDate = format(monthStartDate, "yyyy-MM-dd");
        const formattedEndDate = format(monthEndDate, "yyyy-MM-dd");

        queryParams.push(`start_date=${formattedStartDate}`);
        queryParams.push(`end_date=${formattedEndDate}`);
      }
      const queryString = queryParams.join("&");

      const [expenseResponse, supplierResponse] = await Promise.all([
        api.getDataWithToken(`${expense}?${queryString}`),
        api.getDataWithToken(`${getSupplierPaidAmounts}?${queryString}`),
      ]);

      const expenseData = expenseResponse.data;
      const supplierData = supplierResponse.data;

      if (Array.isArray(expenseData) && Array.isArray(supplierData)) {
        const combinedData = [...expenseData, ...supplierData];
        setTableData(combinedData);
        calculateTotals(combinedData);
      } else {
        throw new Error("Fetched data is not in array format");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (data) => {
    let cashSum = 0;
    let chequeOnlineSum = 0;

    data.forEach((row) => {
      if (row.payment_type === "cash") {
        cashSum += parseFloat(row.cash_amount || 0);
      } else if (["cheque", "online"].includes(row.payment_type)) {
        chequeOnlineSum += parseFloat(row.cr_amount || 0); // Fixed here - removed duplicate addition
      }
    });

    setCashTotal(cashSum);
    setChequeOnlineTotal(chequeOnlineSum);
  };

  const handleDateChange = (start, end) => {
    if (start === "this-month") {
      const now = new Date();
      const monthStartDate = startOfMonth(now);
      const monthEndDate = endOfMonth(now);

      const formattedStartDate = format(monthStartDate, "yyyy-MM-dd");
      const formattedEndDate = format(monthEndDate, "yyyy-MM-dd");

      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);
    } else {
      setStartDate(start);
      setEndDate(end);
    }
  };

  return (
    <div>
      <Buttons
        leftSectionText="Payments"
        addButtonLink="/payments"
        onDateChange={handleDateChange}
      />

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "400px", // Adjust the max height as needed
          overflow: "auto",
        }}
      >
        <Table
          sx={{
            minWidth: 650,
            position: "relative", // Important for proper alignment
            borderCollapse: "separate",
          }}
          stickyHeader // Ensures the header stays fixed
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Payment Type</TableCell>
              <TableCell>Person</TableCell>
              <TableCell>Expense Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Bank Name</TableCell>
              <TableCell>Cheque No</TableCell>
              <TableCell>Cheque Date</TableCell>
              <TableCell>Credit Amount</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    {[...Array(10)].map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton animation="wave" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : tableData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.payment_type}</TableCell>
                    <TableCell>{row.customer?.person_name || "N/A"}</TableCell>
                    <TableCell>
                      {row.expense_category?.expense_category || "N/A"}
                    </TableCell>
                    <TableCell>{row.description || "N/A"}</TableCell>
                    <TableCell>{row.bank?.bank_name || "N/A"}</TableCell>
                    <TableCell>{row.cheque_no || "N/A"}</TableCell>
                    <TableCell>{row.cheque_date || "N/A"}</TableCell>
                    <TableCell>{row.cr_amount || row.cash_amount}</TableCell>
                    <TableCell>{row.balance || "Expense"}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && (
        <Grid container className={styles.tableTotalRow}>
          <Grid item xs={12} sm={6}>
            <Typography> Cash Payments: {cashTotal.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>
              Cheque/Online Payments: {chequeOnlineTotal.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Page;
