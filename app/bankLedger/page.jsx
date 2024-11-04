"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/bankCheque.module.css";
import { banks, bankCheque, getLocalStorage } from "../../networkApi/Constants";
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
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";
import APICall from "../../networkApi/APICall";

const Page = () => {
  const api = new APICall();

  const [selectedRowId, setSelectedRowId] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(); // State for action loading

  const [openBankCheque, setOpenBankCheque] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const bankId = getLocalStorage("selectedRowId");

  const fetchData = async () => {
    try {
      const response = await api.getDataWithToken(
        `${banks}/transection/detail/${bankId}`
      );
      const data = response.data;
      setData(data);

      if (Array.isArray(data.customer_ledger)) {
        setTableData(data.customer_ledger);
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
            <div className={styles.leftSection}> {data.bank_name} </div>
            <div className="mb-5"> {data.balance} </div>
          </Grid>

          <Grid item lg={4} sm={12} xs={12} md={8}>
            <div className={styles.rightSection}>
              <Grid container spacing={2}>
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
              <TableCell>Amount</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Customer Type</TableCell>
              <TableCell>Cheque Number</TableCell>
              <TableCell>Cheque Date</TableCell>
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
                    <TableCell>{row.cr_amount}</TableCell>
                    <TableCell>{row.balance}</TableCell>
                    <TableCell>{row.customer_type}</TableCell>
                    <TableCell>{row.cheque_no}</TableCell>
                    <TableCell>{row.cheque_date}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Page;
