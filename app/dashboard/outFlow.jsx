"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/ledger1.module.css";
import { expense, getSupplierPaidAmounts } from "../../networkApi/Constants";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";
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
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
} from "@mui/material";
import { FaMoneyBillWave, FaUniversity } from "react-icons/fa";

import Buttons from "../../components/buttons";
import APICall from "../../networkApi/APICall";

const Page = () => {
  const api = new APICall();

  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [cashTotal, setCashTotal] = useState(0);
  const [chequeOnlineTotal, setChequeOnlineTotal] = useState(0);

  // Permission states
  const [permissions, setPermissions] = useState({
    canAddPayments: false,
    canViewPayments: false,
    hasAccess: false,
  });

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = () => {
    try {
      const storedPermissions = localStorage.getItem("permissions");

      if (storedPermissions) {
        const parsedPermissions = JSON.parse(storedPermissions);

        // Find Payments module permissions
        let canAddPayments = false;
        let canViewPayments = false;

        if (
          parsedPermissions.modules &&
          Array.isArray(parsedPermissions.modules)
        ) {
          const PaymentsModule = parsedPermissions.modules.find(
            (module) =>
              module.parent === "Payments" || module.name === "Payments"
          );

          if (PaymentsModule && PaymentsModule.permissions) {
            canAddPayments =
              PaymentsModule.permissions.includes("Add Payments");
            canViewPayments =
              PaymentsModule.permissions.includes("View Payments");
          }
        }

        setPermissions({
          canAddPayments,
          canViewPayments,
          hasAccess: canAddPayments || canViewPayments,
        });
      } else {
        // No permissions found - default behavior
        setPermissions({
          canAddPayments: true,
          canViewPayments: true,
          hasAccess: true,
        });
      }
    } catch (error) {
      console.error("Error parsing permissions:", error);
      // Default to showing all on error
      setPermissions({
        canAddPayments: true,
        canViewPayments: true,
        hasAccess: true,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = [];

      if (startDate && endDate) {
        queryParams.push(`start_date=${startDate}`);
        queryParams.push(`end_date=${endDate}`);
      } else {
        const now = new Date();
        const monthStartDate = startOfDay(now);
        const monthEndDate = endOfDay(now);

        const formattedStartDate = format(monthStartDate, "yyyy-MM-dd");
        const formattedEndDate = format(monthEndDate, "yyyy-MM-dd");

        queryParams.push(`start_date=${formattedStartDate}`);
        queryParams.push(`end_date=${formattedEndDate}`);
      }
      const queryString = queryParams.join("&");

      const [expenseResponse, supplierResponse] = await Promise.all([
        api.getDataWithToken(`${expense}?${queryString}`),
        api.getDataWithToken(`${getSupplierPaidAmounts}?${queryString}`),
      ]);

      const expenseData = expenseResponse.data;
      const supplierData = supplierResponse.data;

      if (Array.isArray(expenseData) && Array.isArray(supplierData)) {
        const combinedData = [...expenseData, ...supplierData];
        setTableData(combinedData);
        calculateTotals(combinedData);
      } else {
        throw new Error("Fetched data is not in array format");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (data) => {
    let cashSum = 0;
    let chequeOnlineSum = 0;

    data.forEach((row) => {
      if (row.payment_type === "cash") {
        cashSum += parseFloat(row.cash_amount || 0);
      } else if (["cheque", "online"].includes(row.payment_type)) {
        chequeOnlineSum += parseFloat(row.cr_amount || 0);
      }
    });

    setCashTotal(cashSum);
    setChequeOnlineTotal(chequeOnlineSum);
  };

  const handleDateChange = (start, end) => {
    if (start === "this-month") {
      const now = new Date();
      const monthStartDate = startOfMonth(now);
      const monthEndDate = endOfMonth(now);

      const formattedStartDate = format(monthStartDate, "yyyy-MM-dd");
      const formattedEndDate = format(monthEndDate, "yyyy-MM-dd");

      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);
    } else {
      setStartDate(start);
      setEndDate(end);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {permissions.canAddPayments && (
        <Box sx={{ mb: 4 }}>
          <Buttons
            leftSectionText="Payments"
            addButtonLink="/payments"
            onDateChange={handleDateChange}
          />
        </Box>
      )}

      {permissions.canViewPayments && (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <FaUniversity color="#1976d2" size={24} />
                    <Typography variant="h6">Cash Total</Typography>
                  </Box>
                  <Typography variant="h4" color="success.main">
                    {cashTotal.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <FaMoneyBillWave color="#2e7d32" size={24} />
                    <Typography variant="h6">Online Total</Typography>
                  </Box>
                  <Typography variant="h4" color="primary.main">
                    {chequeOnlineTotal.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "primary.main" }}>
                  <TableCell sx={{ color: "white" }}>Sr No</TableCell>
                  <TableCell sx={{ color: "white" }}>Cashier</TableCell>
                  <TableCell sx={{ color: "white" }}>Payment Type</TableCell>
                  <TableCell sx={{ color: "white" }}>Person</TableCell>
                  <TableCell sx={{ color: "white" }}>Description</TableCell>
                  <TableCell sx={{ color: "white" }}>Bank</TableCell>
                  <TableCell sx={{ color: "white" }}>Cheque No</TableCell>
                  <TableCell sx={{ color: "white" }}>Amount</TableCell>
                  <TableCell sx={{ color: "white" }}>Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? [...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        {[...Array(8)].map((_, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton animation="wave" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : tableData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.user?.name || "Admin"}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.payment_type}
                            size="small"
                            sx={{
                              backgroundColor:
                                row.payment_type === "cash"
                                  ? "#e8f5e9"
                                  : "#e3f2fd",
                              color:
                                row.payment_type === "cash"
                                  ? "#2e7d32"
                                  : "#1976d2",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {row.customer?.person_name || "N/A"}
                        </TableCell>
                        <TableCell>{row.description || "N/A"}</TableCell>
                        <TableCell>{row.bank?.bank_name || "N/A"}</TableCell>
                        <TableCell>{row.cheque_no || "N/A"}</TableCell>
                        <TableCell>
                          {row.cr_amount || row.cash_amount}
                        </TableCell>
                        <TableCell sx={{ color: "success.main" }}>
                          {row.balance || "Expense"}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default Page;
