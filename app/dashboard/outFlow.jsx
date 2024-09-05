"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/ledger1.module.css";
import {
  expense,
  supplierLedger,
  getSupplierPaidAmounts,
} from "../../networkApi/Constants";
import { format } from "date-fns";
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

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
        const currentDate = format(new Date(), "yyyy-MM-dd");
        queryParams.push(`start_date=${currentDate}`);
        queryParams.push(`end_date=${currentDate}`);
      }
      const queryString = queryParams.join("&");

      // Fetch data from both endpoints with the date filter
      const [expenseResponse, supplierResponse] = await Promise.all([
        api.getDataWithToken(`${expense}?${queryString}`),
        api.getDataWithToken(`${getSupplierPaidAmounts}?${queryString}`),
      ]);

      const expenseData = expenseResponse.data;
      console.log(`${expense}?${queryString}`);
      const supplierData = supplierResponse.data;

      // Check if both responses are arrays
      if (Array.isArray(expenseData) && Array.isArray(supplierData)) {
        // Combine both arrays into one
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

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const calculateTotalAmount = () => {
    const total = tableData.reduce((total, row) => {
      const cashAmount = parseFloat(row.cash_amount) || 0;
      const crAmount = parseFloat(row.cr_amount) || 0;

      // Sum the amounts
      return total + cashAmount + crAmount;
    }, 0);

    return total.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "PKR",
    });
  };

  //   return total.toLocaleString("en-IN", {
  //     maximumFractionDigits: 2,
  //     style: "currency",
  //     currency: "PKR",
  //   });
  // };

  return (
    <div>
      <Buttons
        leftSectionText="Payments"
        addButtonLink="/payments"
        onDateChange={handleDateChange}
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell> Sr No </TableCell>
              <TableCell>Payment Type</TableCell>
              <TableCell>Person</TableCell>
              <TableCell> Expense Category </TableCell>
              <TableCell>Description</TableCell>

              <TableCell>Bank Id</TableCell>
              <TableCell>Bank Name</TableCell>
              <TableCell>Cheque No</TableCell>
              <TableCell>Cheque Date</TableCell>
              <TableCell>Credit Amount</TableCell>

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
                tableData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.payment_type}</TableCell>
                    <TableCell>{row.customer?.person_name || "N/A"}</TableCell>
                    <TableCell>
                      {row.expense_category?.expense_category || "N/A"}
                    </TableCell>
                    <TableCell>{row.description || "N/A"}</TableCell>
                    <TableCell>{row.bank_id || "N/A"}</TableCell>
                    <TableCell>{row.bank?.bank_name || "N/A"}</TableCell>{" "}
                    <TableCell>{row.cheque_no || "N/A"}</TableCell>
                    <TableCell>{row.cheque_date || "N/A"}</TableCell>
                    <TableCell>{row.cr_amount || row.cash_amount}</TableCell>
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
