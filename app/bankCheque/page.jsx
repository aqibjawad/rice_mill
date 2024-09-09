"use client";
import React, { useState, useEffect } from "react";
import styles from "../../styles/bankCheque.module.css";
import { banks } from "../../networkApi/Constants";
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
import { useRouter } from "next/navigation";

const Page = () => {
  const api = new APICall();
  const router = useRouter();

  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openBankCheque, setOpenBankCheque] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.getDataWithToken(banks);

      const data = response.data;
      if (Array.isArray(data)) {
        setTableData(data);
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // New function to handle saving ID to local storage
  const handleViewDetails = (id) => {
    localStorage.setItem("selectedRowId", id);
    router.push("/bankDetails");
  };

  return (
    <>
      <div className={styles.container}>
        <Grid container spacing={2}>
          <Grid item lg={6} sm={12} xs={12} md={4}>
            <div className={styles.leftSection}>Bank Cheques</div>
          </Grid>
          <Grid item lg={6} sm={12} xs={12} md={8}>
            <div className={styles.rightSection}>
              <Grid container spacing={2}>
                <Grid lg={3} item xs={6} sm={6} md={3}>
                  <div className={styles.rightItem}>
                    Add Banks
                  </div>
                </Grid>

                <Grid item lg={3} xs={6} sm={6} md={3}>
                  <div className={styles.rightItem}>Date</div>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Bank Name</TableCell>
              <TableCell>No of Cheque</TableCell>
              <TableCell>Advance Cheque Amount</TableCell>
              <TableCell>Total Balance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? // Skeleton loader
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    {[...Array(7)].map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : // Actual data
                tableData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.bank_name}</TableCell>
                    <TableCell>{row.advance_cheques_count}</TableCell>
                    <TableCell>
                      {row.advance_cheques_sum_cheque_amount || 0}
                    </TableCell>
                    <TableCell>{row.balance}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleViewDetails(row.id)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Page;
