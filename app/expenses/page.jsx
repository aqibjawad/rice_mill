"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "../../styles/expenses.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import AddExpense from "@/components/stock/addExpense";
import DateFilter from "@/components/generic/DateFilter";
import { useGetexpenseCategoriesQuery } from "@/src/store/expenseApi";

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Date filter states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Modal states
  const [openExpense, setOpenExpense] = useState(false);
  const handleOpenExpense = () => setOpenExpense(true);
  const handleCloseExpense = () => setOpenExpense(false);

  // Permission states
  const [permissions, setPermissions] = useState({
    canAddExpense: false,
    canViewExpense: false,
    hasAccess: false,
  });

  // Redux query with conditional fetching based on permissions
  const {
    data: expenseData,
    error,
    isLoading,
    refetch,
  } = useGetexpenseCategoriesQuery(undefined, {
    skip: !permissions.canViewExpense, // Only fetch if user has view permission
  });

  // Extract data from Redux response
  const tableData = expenseData?.data || [];
  const totalCount = expenseData?.total || 0;

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    // Refetch data when date filters change
    if (permissions.canViewExpense && (startDate || endDate)) {
      refetch();
    }
  }, [startDate, endDate, permissions.canViewExpense, refetch]);

  const checkPermissions = () => {
    try {
      const storedPermissions = localStorage.getItem("permissions");

      if (storedPermissions) {
        const parsedPermissions = JSON.parse(storedPermissions);

        // Find Expense module permissions
        let canAddExpense = false;
        let canViewExpense = false;

        if (
          parsedPermissions.modules &&
          Array.isArray(parsedPermissions.modules)
        ) {
          const ExpenseModule = parsedPermissions.modules.find(
            (module) => module.parent === "Expense" || module.name === "Expense"
          );

          if (ExpenseModule && ExpenseModule.permissions) {
            canAddExpense = ExpenseModule.permissions.includes("Add Expense");
            canViewExpense = ExpenseModule.permissions.includes("View Expense");
          }
        }

        setPermissions({
          canAddExpense,
          canViewExpense,
          hasAccess: canAddExpense || canViewExpense,
        });
      } else {
        // No permissions found - default behavior
        setPermissions({
          canAddExpense: true,
          canViewExpense: true,
          hasAccess: true,
        });
      }
    } catch (error) {
      console.error("Error parsing permissions:", error);
      // Default to showing all on error
      setPermissions({
        canAddExpense: true,
        canViewExpense: true,
        hasAccess: true,
      });
    }
  };

  const handleViewDetails = (id) => {
    localStorage.setItem("expenseId", id);
    router.push("/expenseDetails");
  };

  // Filter out Product Expense category and calculate total
  const filteredTableData = tableData.filter(
    (item) => item.expense_category !== "Product Expense"
  );

  // Calculate total expenses - excluding Product Expense category
  const totalExpenses = filteredTableData.reduce(
    (total, item) => total + parseFloat(item.expenses_sum_total_amount || 0),
    0
  );

  // Handle loading state
  if (isLoading) {
    return (
      <div style={{ padding: 20 }}>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item>
            <Typography variant="h5" fontWeight="bold">
              Expenses
            </Typography>
          </Grid>
        </Grid>
        <Card style={{ marginTop: 20, marginBottom: 20, padding: 15 }}>
          <Typography variant="h6">Loading expenses...</Typography>
        </Card>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item>
            <Typography variant="h5" fontWeight="bold">
              Expenses
            </Typography>
          </Grid>
        </Grid>
        <Card style={{ marginTop: 20, marginBottom: 20, padding: 15 }}>
          <Typography variant="h6" color="error">
            Error loading expenses: {error.message || "Something went wrong"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => refetch()}
            style={{ marginTop: 10 }}
          >
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  // Handle no permissions
  if (!permissions.hasAccess) {
    return (
      <div style={{ padding: 20 }}>
        <Typography variant="h5" color="error">
          You dont have permission to access expenses.
        </Typography>
      </div>
    );
  }

  const handleAddExpenseClick = () => {
    router.push("/addExpenses"); // Redirect to add expenses page
  };

  return (
    <>
      <div style={{ padding: 20 }}>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item>
            <Typography variant="h5" fontWeight="bold">
              Expenses
            </Typography>
          </Grid>
          {permissions.canViewExpense && (
            <Grid item>
              {permissions.canAddExpense && (
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginRight: 10 }}
                  onClick={handleAddExpenseClick}
                >
                  Add Expense
                </Button>
              )}
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenExpense}
              >
                Expense Categories
              </Button>
            </Grid>
          )}
        </Grid>

        {permissions.canViewExpense && (
          <>
            {/* Date Filter Component - if you want to add it */}
            {/* <DateFilter 
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            /> */}

            <Card style={{ marginTop: 20, marginBottom: 20, padding: 15 }}>
              <Typography variant="h6" fontWeight="bold">
                Total Expenses: {totalExpenses.toFixed(2)}
              </Typography>
            </Card>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sr No</TableCell>
                    <TableCell>Expense Category</TableCell>
                    <TableCell>Expense Amount</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTableData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body1">
                          No expense categories found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTableData.map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.expense_category}</TableCell>
                        <TableCell>
                          {parseFloat(
                            row.expenses_sum_total_amount || 0
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            onClick={() => handleViewDetails(row.id)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </div>

      {permissions.canAddExpense && (
        <AddExpense
          openExpense={openExpense}
          handleCloseExpense={handleCloseExpense}
          onExpenseAdded={() => refetch()} // Refetch data when new expense is added
        />
      )}
    </>
  );
};

export default Page;
