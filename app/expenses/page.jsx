"use client";
import React, { useState, useEffect } from "react";
import styles from "../../styles/expenses.module.css";
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
  Button,
  Grid,
  TableFooter,
  TablePagination,
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
      <div className={styles.container}>
        <Grid container spacing={2}>
          <Grid item lg={6} sm={12} xs={12} md={3}>
            <div className={styles.leftSection}>Expense</div>
          </Grid>
          <Grid item lg={6} sm={12} xs={12} md={9}>
            <div className={styles.rightSection}>
              <Grid container spacing={2}>
                <Grid lg={4} item xs={6} sm={6} md={6}>
                  <div onClick={handleOpenExpense} className={styles.rightItem}>
                    Expenses Categories
                  </div>
                </Grid>

                <Grid lg={4} item xs={6} sm={6} md={6}>
                  <div className={styles.rightItem}>Add Expense</div>
                </Grid>

                <Grid item lg={4} xs={6} sm={6} md={5}>
                  <DateFilter onDateChange={handleDateChange} />
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
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
                      <TableCell key={cellIndex}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : tableData.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.expense_category}</TableCell>
                    <TableCell>{row.expenses_sum_total_amount}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleViewDetails(row.id)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} align="right">
                <strong>Total Expenses:</strong>
              </TableCell>
              <TableCell>
                <strong>{totalExpenses.toFixed(2)}</strong>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <AddExpense
        openExpense={openExpense}
        handleCloseExpense={handleCloseExpense}
      />
    </>
  );
};

export default Page;
