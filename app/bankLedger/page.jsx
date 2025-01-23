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

const Page = () => {
  const api = new APICall();

  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const bankId = getLocalStorage("selectedRowId");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.getDataWithToken(
        `${banks}/transection/detail/${bankId}`
      );
      const fetchedData = response.data;
      setData(fetchedData);

      if (Array.isArray(fetchedData.customer_ledger)) {
        const processedData = fetchedData.customer_ledger
          .map((entry, index) => ({
            ...entry,
            srNo: index + 1,
            customerName: entry.customer?.person_name || "N/A",
            displayAmount:
              entry.entry_type === "cr"
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

  if (loading)
    return <Skeleton variant="rectangular" width="100%" height={200} />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className={styles.container}>
        <Grid container spacing={2}>
          <Grid item lg={8} sm={12} xs={12} md={4}>
            <div className={styles.leftSection}>{data.bank_name}</div>
            <div className="mb-5">Bank Balance: {data.balance}</div>
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
              <TableCell>Payment Type</TableCell>
              <TableCell>Amount Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Transaction ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.srNo}</TableCell>
                <TableCell>{row.description || "N/A"}</TableCell>
                <TableCell>{row.customerName}</TableCell>
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
