"use client";
import React, { useState, useEffect } from "react";
import styles from "../../styles/expenses.module.css";
import { expenseCat } from "../../networkApi/Constants";
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
import APICall from "../../networkApi/APICall";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import AddExpense from "@/components/stock/addExpense";
import DateFilter from "@/components/generic/DateFilter";

const Page = () => {
  const api = new APICall();
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [openExpense, setOpenExpense] = useState(false);
  const handleOpenExpense = () => setOpenExpense(true);
  const handleCloseExpense = () => setOpenExpense(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = [];

      if (startDate && endDate) {
        queryParams.push(`start_date=${startDate}`);
        queryParams.push(`end_date=${endDate}`);
      } else {
        const currentDate = format(new Date(), "yyyy-MM-dd");
        queryParams.push(`start_date=${currentDate}`);
        queryParams.push(`end_date=${currentDate}`);
      }

      const response = await api.getDataWithToken(`${expenseCat}`);

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

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleViewDetails = (id) => {
    localStorage.setItem("expenseId", id);
    router.push("/expenseDetails");
  };

  // Calculate total expenses
  const totalExpenses = tableData.reduce(
    (total, item) => total + parseFloat(item.expenses_sum_total_amount || 0),
    0
  );

  return (
    <>
      <div style={{ padding: 20 }}>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item>
            <Typography variant="h5" fontWeight="bold">
              Expenses
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: 10 }}
            >
              Add Expense
            </Button>
            <Button variant="contained" color="secondary">
              Expense Categories
            </Button>
          </Grid>
        </Grid>

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
              {loading
                ? [...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      {[...Array(4)].map((_, cellIndex) => (
                        <TableCell key={cellIndex}>Loading...</TableCell>
                      ))}
                    </TableRow>
                  ))
                : tableData.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.expense_category}</TableCell>
                      <TableCell>{row.expenses_sum_total_amount}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => handleViewDetails(row.id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
            {/* <TableFooter>
              <TableRow>
                <TableCell colSpan={2} align="right">
                  <strong>Total Expenses:</strong>
                </TableCell>
                <TableCell>
                  <strong>{totalExpenses.toFixed(2)}</strong>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter> */}
          </Table>
        </TableContainer>
      </div>

      <AddExpense
        openExpense={openExpense}
        handleCloseExpense={handleCloseExpense}
      />
    </>
  );
};

export default Page;
