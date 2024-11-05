"use client";

import React, { useState, useEffect } from "react";
import {
  Grid,
  Container,
  Typography,
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
    fetchCredittData();
  }, []);

  const fetchDebitData = async () => {
    try {
      const response = await api.getDataWithToken(`${debitTrial}`);
      const data = response.data;
      setTableData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCredittData = async () => {
    try {
      const response = await api.getDataWithToken(`${creditTrial}`);
      const data = response.data;
      setTableCreditData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Grid container spacing={2}>
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
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Grid>

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
