"use client";
import React, { useState, useEffect } from "react";
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
import { expenseCat } from "@/networkApi/Constants";
import APICall from "@/networkApi/APICall";

const Page = () => {
  const router = useRouter();
  const api = new APICall();

  // Date filter states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Modal states
  const [openExpense, setOpenExpense] = useState(false);
  const handleOpenExpense = () => setOpenExpense(true);
  const handleCloseExpense = () => setOpenExpense(false);

  // API data states
  const [expenseData, setExpenseData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Permission states
  const [permissions, setPermissions] = useState({
    canAddExpense: false,
    canViewExpense: false,
    hasAccess: false,
  });

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    // Fetch data when permissions are loaded and user has view permission
    if (permissions.canViewExpense) {
      fetchData();
    }
  }, [permissions.canViewExpense, startDate, endDate]);

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

  const fetchData = async () => {
    setIsLoading(true); // Set loading to true at start
    setError(null); // Clear any previous errors
    try {
      const response = await api.getDataWithToken(expenseCat);
      const data = response.data;
      if (Array.isArray(data)) {
        setExpenseData(data); // Fixed: was setTableData, should be setExpenseData
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false); // Fixed: was setLoading, should be setIsLoading
    }
  };

  // Refetch function for manual refresh
  const refetch = () => {
    if (permissions.canViewExpense) {
      fetchData(); // Fixed: was fetchExpenseCategories, should be fetchData
    }
  };

  const handleViewDetails = (id) => {
    localStorage.setItem("expenseId", id);
    router.push("/expenseDetails");
  };

  // Filter out Product Expense category and sort alphabetically by expense_category
  const filteredTableData = expenseData
    .filter((item) => item.expense_category !== "Product Expense")
    .sort((a, b) => {
      const categoryA = (a.expense_category || "").toLowerCase();
      const categoryB = (b.expense_category || "").toLowerCase();
      return categoryA.localeCompare(categoryB);
    });

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
            Error loading expenses: {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={refetch}
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
          You don't have permission to access expenses.
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
          onExpenseAdded={refetch} // Refetch data when new expense is added
        />
      )}
    </>
  );
};

export default Page;
