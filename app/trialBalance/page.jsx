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
    // Handling for cash
    if (item.is_cash) {
      const amount = parseFloat(item.cash_amount || 0);
      return {
        credit: amount > 0 ? amount.toFixed(2) : "-",
        debit: "-",
      };
    }

    // Handling for expense categories (always show as debit/negative)
    if (item.expense_category) {
      const amount = parseFloat(item.expenses_sum_total_amount || 0);
      return {
        credit: "-",
        debit: amount > 0 ? amount.toFixed(2) : "-",
      };
    }

    // Handling for banks
    if (item.bank_name) {
      const amount = parseFloat(item.balance || 0);
      return {
        credit: amount > 0 ? amount.toFixed(2) : "-",
        debit: amount < 0 ? Math.abs(amount).toFixed(2) : "-",
      };
    }

    // Handling for suppliers and buyers
    const balance = parseFloat(item.current_balance || 0);
    const isInvestor = item.customer_type === "investor";

    return {
      debit:
        (isInvestor && balance > 0) || (isInvestor && balance > 0)
          ? Math.abs(balance).toFixed(2)
          : "-",
    };
  };

  const calculateTotals = (dataType) => {
    return combinedData.reduce((sum, item) => {
      const amount = renderAmount(item);
      return sum + parseFloat(amount[dataType] !== "-" ? amount[dataType] : 0);
    }, 0);
  };

  const totalCredit = calculateTotals("credit");
  const totalDebit = calculateTotals("debit");

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
                const name = item.is_cash
                  ? "Cash"
                  : item.person_name ||
                    item.expense_category ||
                    item.bank_name ||
                    "Unknown";

                return (
                  <TableRow key={index}>
                    <TableCell align="center">{name}</TableCell>
                    <TableCell align="center">{amounts.credit}</TableCell>
                    <TableCell align="center">{amounts.debit}</TableCell>
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
