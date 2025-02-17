"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/bankCheque.module.css";
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
} from "@mui/material";
import { banks, getLocalStorage } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import DateFilters from "@/components/generic/DateFilter";

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";

const Page = () => {
  const api = new APICall();

  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const bankId = getLocalStorage("selectedRowId");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    setLoading(true); // Set loading to true when fetching data
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
    try {
      const response = await api.getDataWithToken(
        `${banks}/transection/detail/${bankId}?${queryString}`
      );
      const fetchedData = response.data;
      setData(fetchedData);

      if (Array.isArray(fetchedData.customer_ledger)) {
        const processedData = fetchedData.customer_ledger
          .map((entry, index) => ({
            ...entry,
            srNo: index + 1,
            customerName: entry.customer?.person_name || "N/A",
            customerType: entry.customer?.customer_type || "N/A",
            displayAmount:
              entry.customer?.customer_type === "self"
                ? entry.cash_amount
                : entry.entry_type === "cr"
                ? `-${entry.cr_amount}`
                : entry.dr_amount,
            amountType: entry.entry_type === "cr" ? "Credit" : "Debit",
          }))
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        setTableData(processedData);
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
    setLoading(true); // Start loading when date changes
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
      <div className={styles.container}>
        <Grid container spacing={2}>
          <Grid item lg={8} sm={12} xs={12} md={4}>
            <div className={styles.leftSection}>{data.bank_name}</div>
            <div className="mb-5">Bank Balance: {data.balance}</div>
          </Grid>
          <Grid>
            <DateFilters onDateChange={handleDateChange} />
          </Grid>
        </Grid>
      </div>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Customer Type</TableCell>
              <TableCell>Payment Type</TableCell>
              <TableCell>Amount Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Transaction ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from(new Array(8)).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : tableData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.srNo}</TableCell>
                    <TableCell>{row.description || "N/A"}</TableCell>
                    <TableCell>{row.customerName}</TableCell>
                    <TableCell>{row.customerType}</TableCell>
                    <TableCell>{row.payment_type}</TableCell>
                    <TableCell>{row.amountType}</TableCell>
                    <TableCell>{row.displayAmount}</TableCell>
                    <TableCell>{row.transection_id}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Page;
