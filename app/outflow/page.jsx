"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/ledger1.module.css";
import { expense, supplierLedger } from "../../networkApi/Constants";

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
import APICall from "../../networkApi/APICall";

const Page = () => {
  const api = new APICall();
  
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expenseResponse, supplierResponse] = await Promise.all([
        api.getDataWithToken(expense),
        api.getDataWithToken(supplierLedger),
      ]);

      const expenseData = expenseResponse.data;
      const supplierData = supplierResponse.data;

      if (Array.isArray(expenseData) && Array.isArray(supplierData)) {
        const combinedData = [...expenseData, ...supplierData];
        setTableData(combinedData);
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = () => {
    const total = tableData.reduce(
      (total, row) => total + parseFloat(row.balance || 0),
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
      <Buttons leftSectionText="Payments" addButtonLink="/payments" />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
               <TableRow>
              <TableCell>Payment Type</TableCell>
              <TableCell>Person</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Cash Amount</TableCell>

              <TableCell>Bank Id</TableCell>
              <TableCell>Bank Name</TableCell>
              <TableCell>Cheque No</TableCell>
              <TableCell>Cheque Date</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? // Skeleton loader
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    {[...Array(7)].map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton animation="wave" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : // Actual data
                tableData.map((row) => (
                    <TableRow key={row.id}>
                    <TableCell>{row.payment_type}</TableCell>
                    {/* <TableCell>{row.customer.person_name || "N/A"}</TableCell> */}
                    <TableCell> testing name just </TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.cash_amount}</TableCell>

                    <TableCell>{row.bank_id || "N/A"}</TableCell>
                    <TableCell>{row.bank?.bank_name || "N/A"}</TableCell>{" "}
                    <TableCell>{row.cheque_no || "N/A"}</TableCell>
                    <TableCell>{row.cheque_date || "N/A"}</TableCell>
                    <TableCell>{row.balance || "Expense"}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={styles.tableTotalRow}>
        Total: {calculateTotalAmount()}
      </div>
    </div>
  );
};

export default Page;
