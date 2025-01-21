import React, { useState, useEffect } from "react";
import { format, startOfDay, endOfDay } from "date-fns";
import styles from "../../styles/ledger1.module.css";
import { getAmountReceives, investorLedger } from "../../networkApi/Constants";
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
} from "@mui/material";
import APICall from "../../networkApi/APICall";
import Buttons from "../../components/buttons";

const Page = () => {
  const api = new APICall();

  const [amountReceivesData, setAmountReceivesData] = useState([]);
  const [investorLedgerData, setInvestorLedgerData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  const [amountReceivesLoading, setAmountReceivesLoading] = useState(true);
  const [investorLedgerLoading, setInvestorLedgerLoading] = useState(true);

  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchAmountReceivesData();
    fetchInvestorLedgerData();
  }, [startDate, endDate]);

  useEffect(() => {
    if (!amountReceivesLoading && !investorLedgerLoading) {
      const combined = [...amountReceivesData, ...investorLedgerData];
      setCombinedData(combined);
    }
  }, [
    amountReceivesLoading,
    investorLedgerLoading,
    amountReceivesData,
    investorLedgerData,
  ]);

  const getQueryParams = () => {
    if (startDate && endDate) {
      return [`start_date=${startDate}`, `end_date=${endDate}`];
    }

    const now = new Date();
    const monthStartDate = startOfDay(now);
    const monthEndDate = endOfDay(now);

    return [
      `start_date=${format(monthStartDate, "yyyy-MM-dd")}`,
      `end_date=${format(monthEndDate, "yyyy-MM-dd")}`,
    ];
  };

  const fetchAmountReceivesData = async () => {
    try {
      setAmountReceivesLoading(true);
      const queryParams = getQueryParams();
      const response = await api.getDataWithToken(
        `${getAmountReceives}?${queryParams.join("&")}`
      );

      if (Array.isArray(response.data)) {
        setAmountReceivesData(response.data);
      } else {
        throw new Error("Amount receives data is not an array");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setAmountReceivesLoading(false);
    }
  };

  const fetchInvestorLedgerData = async () => {
    try {
      setInvestorLedgerLoading(true);
      const queryParams = getQueryParams();
      const response = await api.getDataWithToken(
        `${investorLedger}?${queryParams.join("&")}`
      );

      if (Array.isArray(response.data)) {
        setInvestorLedgerData(response.data);
      } else {
        throw new Error("Investor ledger data is not an array");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setInvestorLedgerLoading(false);
    }
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "PKR",
      signDisplay: "auto",
    });
  };

  const calculateCashTotal = () => {
    const total = combinedData.reduce((total, row) => {
      const paymentType = (row.payment_type || "").toLowerCase();
      if (paymentType === "cash") {
        return total + parseFloat(row.cash_amount || 0);
      }
      return total;
    }, 0);
    return formatCurrency(total);
  };

  const calculateOnlineChequeTotal = () => {
    const total = combinedData.reduce((total, row) => {
      const paymentType = (row.payment_type || "").toLowerCase();
      if (paymentType === "online" || paymentType === "cheque") {
        return (
          total +
          parseFloat(row.cash_amount || 0) +
          parseFloat(row.cr_amount || 0)
        );
      }
      return total;
    }, 0);
    return formatCurrency(total);
  };

  const isLoading = amountReceivesLoading || investorLedgerLoading;

  return (
    <div>
      <Buttons
        leftSectionText="Amount Receives"
        addButtonLink="/paymentRecieves"
        onDateChange={handleDateChange}
      />

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "400px", // Adjust the max height as needed
          overflow: "auto",
        }}
      >
        <Table
          sx={{
            minWidth: 650,
            position: "relative", // Important for proper alignment
            borderCollapse: "separate",
          }}
          stickyHeader // Ensures the header stays fixed
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Payment Type</TableCell>
              <TableCell>Person</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Bank Name</TableCell>
              <TableCell>Cheque No</TableCell>
              <TableCell>Cheque Date</TableCell>
              <TableCell>Credit Amount</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    {[...Array(9)].map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton animation="wave" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : combinedData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.payment_type}</TableCell>
                    <TableCell>{row.customer?.person_name}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.bank?.bank_name || "N/A"}</TableCell>
                    <TableCell>{row.cheque_no || "N/A"}</TableCell>
                    <TableCell>{row.cheque_date || "N/A"}</TableCell>
                    <TableCell>{row.cr_amount}</TableCell>
                    <TableCell
                      style={{
                        color: parseFloat(row.balance) < 0 ? "red" : "inherit",
                      }}
                    >
                      {row.balance}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!isLoading && (
        <Grid container className={styles.tableTotalRow}>
          <Grid item xs={12} md={6}>
            <Typography>Cash Amount Total: {calculateCashTotal()}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography>
              Online/Cheque Balance Total: {calculateOnlineChequeTotal()}
            </Typography>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Page;
