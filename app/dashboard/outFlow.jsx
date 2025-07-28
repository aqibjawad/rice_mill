"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/ledger1.module.css";
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
  Alert,
} from "@mui/material";
import { FaMoneyBillWave, FaUniversity } from "react-icons/fa";

import Buttons from "../../components/buttons";
// Import Redux hooks
import { useGetCombinedDataQuery } from "../../src/store/paymentsApi";

const Page = () => {
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

  // Set default date range
  useEffect(() => {
    const now = new Date();
    const monthStartDate = startOfDay(now);
    const monthEndDate = endOfDay(now);

    setStartDate(format(monthStartDate, "yyyy-MM-dd"));
    setEndDate(format(monthEndDate, "yyyy-MM-dd"));
  }, []);

  // Redux API call with parameters
  const {
    data: combinedData,
    error,
    isLoading,
    refetch,
  } = useGetCombinedDataQuery(
    {
      startDate,
      endDate,
    },
    {
      skip: !startDate || !endDate, // Skip query if dates are not set
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = () => {
    try {
      const storedPermissions = localStorage.getItem("permissions");

      if (storedPermissions) {
        const parsedPermissions = JSON.parse(storedPermissions);

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
        setPermissions({
          canAddPayments: true,
          canViewPayments: true,
          hasAccess: true,
        });
      }
    } catch (error) {
      console.error("Error parsing permissions:", error);
      setPermissions({
        canAddPayments: true,
        canViewPayments: true,
        hasAccess: true,
      });
    }
  };

  // Calculate totals when data changes
  useEffect(() => {
    if (combinedData?.combined) {
      calculateTotals(combinedData.combined);
    }
  }, [combinedData]);

  const calculateTotals = (data) => {
    let cashSum = 0;
    let chequeOnlineSum = 0;

    data.forEach((row) => {
      if (row.payment_type === "cash") {
        // For cash payments, use cash_amount
        cashSum += parseFloat(row.cash_amount || 0);
      } else if (row.payment_type === "cheque") {
        // For cheque payments from expense API, use cheque_amount
        // For cheque payments from paid_party API, use cr_amount
        const chequeAmount = row.cheque_amount || row.cr_amount || 0;
        chequeOnlineSum += parseFloat(chequeAmount);
      } else if (row.payment_type === "online") {
        // For online payments, use cr_amount (from paid_party API)
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

  // Get table data from combined response
  const tableData = combinedData?.combined || [];

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
          {/* Error handling */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Error loading data: {error.message || "Something went wrong"}
              <Button onClick={refetch} sx={{ ml: 2 }}>
                Retry
              </Button>
            </Alert>
          )}

          {/* Data Summary */}
          {/* {combinedData && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Total Records: {combinedData.totalCombined} | Expense Records:{" "}
                {combinedData.ExpenseAmount?.total || 0} | Paid Party Records:{" "}
                {combinedData.PaidPartyAmount?.total || 0}
              </Typography>
            </Box>
          )} */}

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <FaUniversity color="#1976d2" size={24} />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      Cash Total
                    </Typography>
                  </Box>
                  <Typography variant="h4" color="success.main">
                    {isLoading ? (
                      <Skeleton width={100} />
                    ) : (
                      cashTotal.toFixed(2)
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <FaMoneyBillWave color="#2e7d32" size={24} />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      Cheque/Online Total
                    </Typography>
                  </Box>
                  <Typography variant="h4" color="primary.main">
                    {isLoading ? (
                      <Skeleton width={100} />
                    ) : (
                      chequeOnlineTotal.toFixed(2)
                    )}
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
                  <TableCell sx={{ color: "white" }}>Payment Date</TableCell>
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
                {isLoading
                  ? [...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        {[...Array(10)].map((_, cellIndex) => (
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
                          {row?.created_at
                            ? new Date(row.created_at).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.payment_type || "N/A"}
                            size="small"
                            sx={{
                              backgroundColor:
                                row.payment_type === "cash"
                                  ? "#e8f5e9"
                                  : row.payment_type === "cheque"
                                  ? "#fff3e0"
                                  : "#e3f2fd",
                              color:
                                row.payment_type === "cash"
                                  ? "#2e7d32"
                                  : row.payment_type === "cheque"
                                  ? "#f57c00"
                                  : "#1976d2",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {row.customer?.person_name ||
                            row.expense_category?.expense_category ||
                            "N/A"}
                        </TableCell>
                        <TableCell>{row.description || "N/A"}</TableCell>
                        <TableCell>{row.bank?.bank_name || "N/A"}</TableCell>
                        <TableCell>
                          {row.cheque_no || row.transection_id || "N/A"}
                        </TableCell>
                        <TableCell>
                          {row.payment_type === "cash"
                            ? row.cash_amount
                            : row.payment_type === "cheque"
                            ? row.cheque_amount || row.cr_amount || "0"
                            : row.cr_amount || "0"}
                        </TableCell>
                        <TableCell sx={{ color: "success.main" }}>
                          {row.balance || "Expense"}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* No data message */}
          {!isLoading && tableData.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No payment records found for the selected date range
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Page;
