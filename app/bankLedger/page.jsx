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
  const [data, setData] = useState({
    bank_name: "",
    balance: "0.00",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    credit: 0,
    debit: 0,
  });

  const bankId = getLocalStorage("selectedRowId");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
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
    try {
      const response = await api.getDataWithToken(
        `${banks}/transection/detail/${bankId}`
      );
      const fetchedData = response.data;
      setData({
        bank_name: fetchedData.bank_name,
        balance: fetchedData.balance,
      });

      if (Array.isArray(fetchedData.bank_ledger)) {
        const processedData = fetchedData.bank_ledger
          .map((entry, index) => ({
            ...entry,
            srNo: index + 1,
            customerName: entry.linkable?.person_name || "N/A",
            customerType: entry.linkable?.customer_type || "N/A",
          }))
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        // Calculate totals
        let creditTotal = 0;
        let debitTotal = 0;

        processedData.forEach((entry) => {
          creditTotal += parseFloat(entry.cr_amount || 0);
          debitTotal += parseFloat(entry.dr_amount || 0);
        });

        setTotals({
          credit: creditTotal.toFixed(2),
          debit: debitTotal.toFixed(2),
        });

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
    setLoading(true);
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
          <Grid item>
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
              <TableCell>Transaction ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Debit</TableCell>
              <TableCell>Credit</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from(new Array(7)).map((_, cellIndex) => (
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
                    <TableCell>{row.transection_id || "N/A"}</TableCell>
                    <TableCell>{row.customerName}</TableCell>
                    <TableCell>
                      {parseFloat(row.dr_amount) > 0 ? row.dr_amount : "-"}
                    </TableCell>
                    <TableCell>
                      {parseFloat(row.cr_amount) > 0 ? row.cr_amount : "-"}
                    </TableCell>
                    <TableCell>{row.balance}</TableCell>
                  </TableRow>
                ))}
            {!loading && (
              <TableRow className={styles.totalRow}>
                <TableCell colSpan={4} align="right">
                  <strong>Total</strong>
                </TableCell>
                <TableCell>
                  <strong>{totals.debit}</strong> 
                </TableCell>
                <TableCell>
                  <strong>{totals.credit}</strong>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Page;
