"use client";

import React, { useEffect, useState } from "react";
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

import { debitTrial, creditTrial } from "../../networkApi/Constants";
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
        const creditResponse = await api.getDataWithToken(`${creditTrial}`);

        const combinedData = [
          ...debitResponse.data.expense_categories,
          ...debitResponse.data.suppliers,
          ...debitResponse.data.banks,
          ...creditResponse.data.buyers,
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
    const balance = parseFloat(item.current_balance || 0);
    const isBuyer = item.customer_type === "buyer";

    // For Credit Column
    const creditAmount = () => {
      if (isBuyer) {
        // If buyer and positive balance -> show in credit
        if (balance > 0) return balance.toFixed(2);
        return "-";
      } else {
        // If not buyer and negative balance -> show absolute value in credit
        if (balance < 0) return Math.abs(balance).toFixed(2);
        return "-";
      }
    };

    // For Debit Column
    const debitAmount = () => {
      if (isBuyer) {
        // If buyer and negative balance -> show absolute value in debit
        if (balance < 0) return Math.abs(balance).toFixed(2);
        return "-";
      } else {
        // If not buyer and positive balance -> show in debit
        if (balance > 0) return balance.toFixed(2);
        return "-";
      }
    };

    return {
      credit: creditAmount(),
      debit: debitAmount(),
    };
  };

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
                  Sr
                </TableCell>
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
                    <TableCell align="center">{index+1}</TableCell>
                    <TableCell align="center">
                      {item.person_name ||
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
                  {tableData
                    .reduce((sum, item) => {
                      const balance = parseFloat(item.current_balance || 0);
                      const isBuyer = item.customer_type === "buyer";

                      if (
                        (isBuyer && balance > 0) ||
                        (!isBuyer && balance < 0)
                      ) {
                        return sum + Math.abs(balance);
                      }
                      return sum;
                    }, 0)
                    .toFixed(2)}
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  {tableData
                    .reduce((sum, item) => {
                      const balance = parseFloat(item.current_balance || 0);
                      const isBuyer = item.customer_type === "buyer";

                      if (
                        (isBuyer && balance < 0) ||
                        (!isBuyer && balance > 0)
                      ) {
                        return sum + Math.abs(balance);
                      }
                      return sum;
                    }, 0)
                    .toFixed(2)}
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
