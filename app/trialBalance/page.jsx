"use client";

import React, { useState, useEffect } from "react";
import {
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

import { debitTrial, investors } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";

const CombinedTable = () => {
  const api = new APICall();
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [debitResponse, investorsResponse] = await Promise.all([
          api.getDataWithToken(`${debitTrial}`),
          api.getDataWithToken(`${investors}`),
        ]);

        // Combine data from different sources
        const mergedData = [
          ...debitResponse.data.expense_categories.map((category) => ({
            ...category,
            type: "expense_category",
          })),
          ...debitResponse.data.parties.map((party) => ({
            ...party,
            type: "party",
          })),
          ...debitResponse.data.banks.map((bank) => ({
            ...bank,
            type: "bank",
          })),
          {
            is_cash: true,
            cash_amount: parseFloat(debitResponse.data.cash),
            type: "cash",
          },
          // Add investors data
          ...investorsResponse.data.map((investor) => ({
            ...investor,
            type: "investor",
          })),
        ];

        setCombinedData(mergedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const renderAmount = (item) => {
    let balance;
    switch (item.type) {
      case "party":
        balance = parseFloat(item.current_balance || 0);
        break;
      case "bank":
        balance = parseFloat(item.balance || 0);
        break;
      case "cash":
        balance = item.cash_amount || 0;
        break;
      case "expense_category":
        balance = parseFloat(item.expenses_sum_total_amount || 0);
        break;
      case "investor":
        balance = parseFloat(item.current_balance || 0);
        break;
      default:
        balance = 0;
    }

    return {
      debit: balance < 0 ? Math.abs(balance) : 0,
      credit: balance > 0 ? Math.abs(balance) : 0,
    };
  };

  const totalCredit = combinedData.reduce((sum, item) => {
    const { credit } = renderAmount(item);
    return sum + credit;
  }, 0);

  const totalDebit = combinedData.reduce((sum, item) => {
    const { debit } = renderAmount(item);
    return sum + debit;
  }, 0);

  return (
    <Container>
      <TableContainer component={Paper} style={{ marginTop: "10px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                Credit
              </TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                Debit
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Render Skeleton while loading
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell align="center">
                    <Skeleton variant="text" width="80%" />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="text" width="60%" />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="text" width="60%" />
                  </TableCell>
                </TableRow>
              ))
            ) : combinedData.length === 0 ? (
              <TableRow>
                <TableCell align="center" colSpan={3}>
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              combinedData.map((item, index) => {
                const amounts = renderAmount(item);

                return (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {item.is_cash
                        ? "Cash"
                        : item.person_name ||
                          item.expense_category ||
                          item.bank_name ||
                          "Unknown"}
                    </TableCell>
                    <TableCell align="center">
                      {amounts.credit.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {amounts.debit.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
            {!loading && (
              <TableRow>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Total
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  {totalCredit.toFixed(2)}
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  {totalDebit.toFixed(2)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CombinedTable;
