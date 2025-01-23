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
} from "@mui/material";

import { party } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";

const CombinedTable = () => {
  const api = new APICall();
  const [partyData, setPartyData] = useState([]);

  useEffect(() => {
    const fetchPartyData = async () => {
      try {
        const response = await api.getDataWithToken(`${party}`);
        setPartyData(response.data);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchPartyData();
  }, []);

  const renderAmount = (item) => {
    const balance = parseFloat(item.current_balance || 0);
    return {
      debit: balance < 0 ? Math.abs(balance) : 0,
      credit: balance > 0 ? Math.abs(balance) : 0,
    };
  };

  // Calculate totals
  const totalCredit = partyData.reduce((sum, item) => {
    const { credit } = renderAmount(item);
    return sum + credit;
  }, 0);

  const totalDebit = partyData.reduce((sum, item) => {
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
            {partyData.length === 0 && (
              <TableRow>
                <TableCell align="center" colSpan={3}>
                  No data available
                </TableCell>
              </TableRow>
            )}
            {partyData.map((item, index) => {
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
                  <TableCell align="center">
                    {amounts.credit.toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    {amounts.debit.toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })}
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
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CombinedTable;
