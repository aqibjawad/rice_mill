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

  const [selectedRowId, setSelectedRowId] = useState(null);
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

  const showChequeDetails = tableData.some(
    (row) => row.payment_type === "cheque"
  );

  const { debitTotal, creditTotal } = tableData.reduce(
    (totals, row) => {
      const amount = parseFloat(row.cr_amount) || 0;
      if (row.customer_type === "buyer") {
        totals.creditTotal += amount;
      } else {
        totals.debitTotal += amount;
      }
      return totals;
    },
    { debitTotal: 0, creditTotal: 0, finalBalance: 0 }
  );

  const finalBalance = debitTotal - creditTotal;

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
              <TableCell>Name</TableCell>
              <TableCell>Amount Type</TableCell>
              {showChequeDetails && <TableCell>Cheque Number</TableCell>}
              {showChequeDetails && <TableCell>Cheque Date</TableCell>}
              <TableCell>Transaction ID</TableCell>
              <TableCell> Bank Amount</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    {[...Array(7)].map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : tableData.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row?.customer?.person_name || "-"}</TableCell>
                    <TableCell>
                      {row.customer_type === "buyer" ? "Debit" : "Credit"}
                    </TableCell>

                    {/* Show Cheque Details if payment_type is "cheque" */}
                    {row.payment_type === "cheque" ? (
                      <>
                        <TableCell>{row.cheque_no || "-"}</TableCell>
                        <TableCell>{row.cheque_date || "-"}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                      </>
                    )}

                    {/* Show Online Details if payment_type is "online" */}
                    {row.payment_type === "online" ? (
                      <>
                        <TableCell>{row.transaction_id || "-"}</TableCell>
                        <TableCell>{row.cash_amount || "-"}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                      </>
                    )}

                    {/* Display cr_amount in Balance column */}
                    <TableCell>{row.cr_amount || "-"}</TableCell>
                  </TableRow>
                ))}

            {/* Display total balance row */}
            <TableRow>
              <TableCell colSpan={7} style={{ fontWeight: "bold" }}>
                Total Balance
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                {Math.abs(finalBalance)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Page;
