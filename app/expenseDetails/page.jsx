"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/bankCheque.module.css";
import { expenseCat, getLocalStorage } from "../../networkApi/Constants";
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
import { format } from "date-fns";

import APICall from "../../networkApi/APICall";
import Buttons from "@/components/buttons";

const Page = () => {
  const api = new APICall();

  const [tableData, setTableData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    const expenseId = getLocalStorage("expenseId");
    try {
      setLoading(true);
      const queryParams = [];

      if (startDate && endDate) {
        queryParams.push(`start_date=${startDate}`);
        queryParams.push(`end_date=${endDate}`);
      } else {
        const currentDate = format(new Date(), "yyyy-MM-dd");
        queryParams.push(`start_date=${currentDate}`);
        queryParams.push(`end_date=${currentDate}`);
      }

      const response = await api.getDataWithToken(
        `${expenseCat}/${expenseId}?${queryParams.join("&")}`
      );

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

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const calculateTotalAmount = () => {
    const total = tableData.reduce(
      (total, row) => total + parseFloat(row.total_amount || 0),
      0
    );
    return total.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "PKR",
    });
  };

  return (
    <div>
      <div className={styles.container}>
        <Buttons
          leftSectionText={rowData?.expense_category}
          addButtonLink="/payments"
          onDateChange={handleDateChange} // Pass the handler
        />
      </div>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Name</TableCell>
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
                    <TableCell>{row.user?.name || "Admin"}</TableCell>
                    <TableCell>{row.cash_amount || 0}</TableCell>
                    <TableCell>{row.cheque_amount || 0}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.total_amount}</TableCell>
                    <TableCell>{row.payment_type}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className={styles.tableTotalRow}>
        Total: {calculateTotalAmount()}
      </div>

      {error && <div className={styles.error}>Error: {error}</div>}
    </div>
  );
};

export default Page;
