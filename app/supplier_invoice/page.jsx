"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/invoice.module.css";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import { getLocalStorage, supplierLedger } from "../../networkApi/Constants";

import APICall from "../../networkApi/APICall";

import { format } from 'date-fns';

const Invoice = () => {
  const api = new APICall();
  const [tableData, setTableData] = useState([]);
  const [rowData, setRowData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isPrinting, setIsPrinting] = useState(false);

  const supplierId = getLocalStorage("supplerId");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.getDataWithToken(
        `${supplierLedger}?sup_id=${supplierId}`
      );

      const data = response.data;

      setRowData(data);

      if (Array.isArray(data.ledgers)) {
        setTableData(data.ledgers);
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "d, MMMM , yyyy"); // e.g., "September 5, 2024"
  };

  useEffect(() => {
    if (tableData.length > 0 && !isPrinting) {
      setIsPrinting(true);
      setTimeout(() => {
        window.print();
        setIsPrinting(false);
      }, 1000);
    }
  }, [tableData]);

  return (
    <div className={styles.invoiceContainer}>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6} sm={6}>
          <div className={styles.invoiceCompName}>Ghulam Bari Rice Mills</div>
          <div className={styles.compAddress}>
            Hujra Road, Near Ghala Mandi Chunian. 0336 4046155, 0301 4046155,
            0300-7971654, 0300 5061234
          </div>
        </Grid>

        <Grid item xs={12} lg={6} sm={6}>
          <div className="flex">
            <div className="flex-grow"></div>

            <div>
              <img className={styles.img} src="/logo.png" alt="Company Logo" />
            </div>
          </div>
        </Grid>
      </Grid>

      <div className="mt-10">
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6} sm={6}>
            <div className={styles.issueDate}>{rowData?.person_name}</div>
            <div className={styles.buyerName}>{rowData?.address}</div>
          </Grid>

          <Grid item xs={12} lg={6} sm={6}>
            <div className="flex">
              <div className="flex-grow"></div>

              <div className={styles.buyerName}>{rowData?.contact}</div>
            </div>
          </Grid>
        </Grid>
      </div>

      <div className="mt-5">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Credit Amount</TableCell>
                <TableCell>Debit Amount</TableCell>
                <TableCell> Naam / Jama </TableCell>
                <TableCell>Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {error ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div>Error: {error}</div>
                  </TableCell>
                </TableRow>
              ) : loading ? (
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    {[...Array(5)].map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton animation="wave" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                tableData.map((row, index) => (
                  <TableRow onClick={() => handleViewDetails(row)} key={index}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{formatDate(row.created_at)}</TableCell>
                    <TableCell>{row.description || "Purchase"}</TableCell>
                    <TableCell>{row.cr_amount}</TableCell>
                    <TableCell>{row.dr_amount}</TableCell>
                    <TableCell>{row.balance < 0 ? "Naam" : "Jama"}</TableCell>
                    <TableCell>{row.balance}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* <div
            style={{
              width: "100%",
            }}
          >
            <div className={styles.tableTotalRow}>
              Total:{" "}
              <span className={styles.amountDue}>
                {" "}
                {calculateTotalAmount()}{" "}
              </span>
            </div>
          </div> */}
      </div>
    </div>
  );
};

export default Invoice;
