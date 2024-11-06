"use client";

import React, { useState, useEffect } from "react";
import {
  Grid,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
} from "@mui/material";

import { debitTrial, creditTrial } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";

const Page = () => {
  const api = new APICall();

  const [tableData, setTableData] = useState([]);
  const [tableCreditData, setTableCreditData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDebitData();
    fetchCreditData();
  }, []);

  const fetchDebitData = async () => {
    try {
      const response = await api.getDataWithToken(`${debitTrial}`);
      setTableData(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCreditData = async () => {
    try {
      const response = await api.getDataWithToken(`${creditTrial}`);
      setTableCreditData(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals for credit and debit
  // Calculate totals for credit and debit
  const creditTotal = tableCreditData?.buyers?.reduce(
    (acc, item) => acc + parseFloat(item.current_balance || 0),
    0
  );

  const debitTotal =
    (tableData?.banks?.reduce(
      (acc, item) => acc + parseFloat(item.balance || 0),
      0
    ) || 0) +
    (tableData?.expense_categories?.reduce(
      (acc, item) => acc + parseFloat(item.expenses_sum_total_amount || 0),
      0
    ) || 0) +
    (tableData?.suppliers?.reduce(
      (acc, item) => acc + parseFloat(item.current_balance || 0),
      0
    ) || 0);

  return (
    <Container>
      <Grid container spacing={2}>
        {/* Credit Table */}
        <Grid item xs={12} sm={6}>
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            Credit
          </div>
          <TableContainer component={Paper} style={{ marginTop: "10px" }}>
            {loading ? (
              <Skeleton variant="rectangular" height={200} />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{ fontWeight: "bold" }}>
                      Name
                    </TableCell>
                    <TableCell align="center" style={{ fontWeight: "bold" }}>
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableCreditData?.buyers?.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="center">{row.person_name}</TableCell>
                      <TableCell align="center">
                        {row.current_balance}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Total Row for Credit */}
                  <TableRow>
                    <TableCell align="center" style={{ fontWeight: "bold" }}>
                      Total
                    </TableCell>
                    <TableCell align="center" style={{ fontWeight: "bold" }}>
                      {creditTotal}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Grid>

        {/* Debit Table */}
        <Grid item xs={12} sm={6}>
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            Debit
          </div>
          <TableContainer component={Paper} style={{ marginTop: "10px" }}>
            {loading ? (
              <Skeleton variant="rectangular" height={200} />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{ fontWeight: "bold" }}>
                      Name
                    </TableCell>
                    <TableCell align="center" style={{ fontWeight: "bold" }}>
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData?.banks?.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="center">{row.bank_name}</TableCell>
                      <TableCell align="center">{row.balance}</TableCell>
                    </TableRow>
                  ))}
                  {tableData?.expense_categories?.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="center">
                        {row.expense_category}
                      </TableCell>
                      <TableCell align="center">
                        {row.expenses_sum_total_amount}
                      </TableCell>
                    </TableRow>
                  ))}
                  {tableData?.suppliers?.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="center">{row.person_name}</TableCell>
                      <TableCell align="center">
                        {row.current_balance}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Total Row for Debit */}
                  <TableRow>
                    <TableCell align="center" style={{ fontWeight: "bold" }}>
                      Total
                    </TableCell>
                    <TableCell align="center" style={{ fontWeight: "bold" }}>
                      {debitTotal}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Page;
