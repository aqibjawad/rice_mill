import React, { useState, useEffect } from "react";
import { format, startOfDay, endOfDay } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
} from "@mui/material";
import APICall from "../../networkApi/APICall";
import { getAmountReceives } from "../../networkApi/Constants";
import Buttons from "../../components/buttons";

const Page = () => {
  const api = new APICall();
  const [receivesData, setReceivesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      const queryParams =
        startDate && endDate
          ? [
              `start_date=${format(startOfDay(startDate), "yyyy-MM-dd")}`,
              `end_date=${format(endOfDay(endDate), "yyyy-MM-dd")}`,
            ]
          : [
              `start_date=${format(startOfDay(new Date()), "yyyy-MM-dd")}`,
              `end_date=${format(endOfDay(new Date()), "yyyy-MM-dd")}`,
            ];

      const response = await api.getDataWithToken(
        `${getAmountReceives}?${queryParams.join("&")}`
      );

      setReceivesData(response.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const calculateCashTotal = () => {
    const total = receivesData
      .filter((row) => row.payment_type === "cash")
      .reduce((sum, row) => sum + parseFloat(row.cash_amount || 0), 0);
    return total;
  };

  const calculateOnlineTotal = () => {
    const total = receivesData
      .filter((row) => row.payment_type === "online")
      .reduce((sum, row) => sum + parseFloat(row.cash_amount || 0), 0);
    return total;
  };

  return (
    <div>
      <Buttons
        leftSectionText="Amount Receives"
        addButtonLink="/paymentRecieves"
        onDateChange={handleDateChange}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Payment Type</TableCell>
              <TableCell>Person</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Bank</TableCell>
              <TableCell>Cheque No</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {receivesData.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.payment_type}</TableCell>
                <TableCell>{row.customer?.person_name || "N/A"}</TableCell>
                <TableCell>{row.description || "N/A"}</TableCell>
                <TableCell>{row.bank?.bank_name || "N/A"}</TableCell>
                <TableCell>{row.cheque_no || "N/A"}</TableCell>
                <TableCell>{row.cash_amount}</TableCell>
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

      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <Typography>Cash Total: {calculateCashTotal()}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Online Total: {calculateOnlineTotal()}</Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default Page;
