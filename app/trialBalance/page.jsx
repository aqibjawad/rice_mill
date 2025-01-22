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

import { debitTrial, creditTrial, investors } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";

const CombinedTable = () => {
  const api = new APICall();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCombinedData = async () => {
      try {
        const debitResponse = await api.getDataWithToken(`${debitTrial}`);
        const investorsResponse = await api.getDataWithToken(`${investors}`);
        const creditResponse = await api.getDataWithToken(`${creditTrial}`);

        // Add cash as a separate entry if it exists
        const cashEntry = debitResponse.data.cash
          ? [{ is_cash: true, balance: debitResponse.data.cash }]
          : [];

        const combinedData = [
          ...cashEntry,
          ...debitResponse.data.expense_categories,
          ...debitResponse.data.suppliers,
          ...debitResponse.data.banks,
          ...creditResponse.data.buyers,
          ...investorsResponse.data,
        ];

        setTableData(combinedData);
      } catch (error) {
        setError(error.message);
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCombinedData();
  }, []);

  const renderAmount = (item) => {
    // Handling for cash
    if (item.is_cash) {
      const amount = parseFloat(item.balance || 0);
      return {
        credit: amount > 0 ? amount.toFixed(2) : "-",
        debit: "-", // Cash will always show on credit side if positive
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

    // Handling for investors
    if (item.current_balance !== undefined) {
      const amount = parseFloat(item.current_balance || 0);
      return {
        credit: "-",
        debit: Math.abs(amount).toFixed(2),
      };
    }

    // Handling for suppliers and buyers
    const balance = parseFloat(item.current_balance || 0);
    const isSupplier = item.customer_type === "supplier";
    const isBuyer = item.customer_type === "buyer";

    return {
      debit:
        (isSupplier && balance > 0) || (isBuyer && balance < 0)
          ? Math.abs(balance).toFixed(2)
          : "-",
      credit:
        (isSupplier && balance < 0) || (isBuyer && balance > 0)
          ? Math.abs(balance).toFixed(2)
          : "-",
    };
  };

  // Calculate total credit
  const totalCredit = tableData
    .reduce((sum, item) => {
      const amounts = renderAmount(item);
      const credit = parseFloat(amounts.credit || 0);
      return sum + (isNaN(credit) ? 0 : credit);
    }, 0)
    .toFixed(2);

  // Calculate total debit
  const totalDebit = tableData
    .reduce((sum, item) => {
      const amounts = renderAmount(item);
      const debit = parseFloat(amounts.debit || 0);
      return sum + (isNaN(debit) ? 0 : debit);
    }, 0)
    .toFixed(2);

  return (
    <Container>
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
                  Credit
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Debit
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.length === 0 && (
                <TableRow>
                  <TableCell align="center" colSpan={3}>
                    No data available
                  </TableCell>
                </TableRow>
              )}
              {tableData.map((item, index) => {
                const amounts = renderAmount(item);

                return (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {item.is_cash
                        ? "Cash"
                        : item.person_name ||
                          item.expense_category ||
                          item.bank_name}
                    </TableCell>
                    <TableCell align="center">{amounts.credit}</TableCell>
                    <TableCell align="center">{amounts.debit}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Total
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  {totalCredit}
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  {totalDebit}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Container>
  );
};

export default CombinedTable;
