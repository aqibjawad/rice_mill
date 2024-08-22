"use client";
import React, { useState, useEffect } from "react";
import styles from "../../styles/bankCheque.module.css";
import { expenseCat } from "../../networkApi/Constants";
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
import APICall from "../../networkApi/APICall";
import Link from "next/link";

const Page = () => {
  const api = new APICall();

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
      const response = await api.getDataWithToken(expenseCat);

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
    localStorage.setItem("expenseId", id);
  };

  return (
    <>
      <h2> Expenses </h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell> Expense Category </TableCell>
              <TableCell> Expense Amount </TableCell>
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
                    <TableCell>{row.expense_category}</TableCell>
                    <TableCell>{row.expenses_sum_total_amount}</TableCell>
                    <TableCell>
                      <Link onClick={() => handleViewDetails(row.id)} href="/expenseDetails">
                          View Details
                      </Link>
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
