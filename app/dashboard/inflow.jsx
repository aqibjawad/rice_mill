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
  Card,
  CardContent,
  Box,
  CircularProgress,
  Chip,
  tableCellClasses,
  styled,
} from "@mui/material";
import { FaMoneyBillWave, FaUniversity } from "react-icons/fa";
import APICall from "../../networkApi/APICall";
import { getAmountReceives } from "../../networkApi/Constants";
import Buttons from "../../components/buttons";

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const TotalCard = styled(Card)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.background.default,
  "&:hover": {
    boxShadow: theme.shadows[4],
    transform: "translateY(-2px)",
    transition: "all 0.3s",
  },
}));

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
    return total.toFixed(2);
  };

  const calculateOnlineTotal = () => {
    const total = receivesData
      .filter((row) => row.payment_type === "online")
      .reduce((sum, row) => sum + parseFloat(row.cash_amount || 0), 0);
    return total.toFixed(2);
  };

  const getPaymentTypeChip = (type) => {
    return (
      <Chip
        label={type}
        color={type === "cash" ? "success" : "primary"}
        size="small"
        variant="outlined"
      />
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Buttons
          leftSectionText="Amount Receives"
          addButtonLink="/paymentRecieves"
          onDateChange={handleDateChange}
        />
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TotalCard>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <FaMoneyBillWave color="#2e7d32" size={24} />
                <Typography variant="h6" component="div">
                  Cash Total
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2, color: "success.main" }}>
                {calculateCashTotal()}
              </Typography>
            </CardContent>
          </TotalCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <TotalCard>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <FaUniversity color="#1976d2" size={24} />
                <Typography variant="h6" component="div">
                  Online Total
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2, color: "primary.main" }}>
                {calculateOnlineTotal()}
              </Typography>
            </CardContent>
          </TotalCard>
        </Grid>
      </Grid>

      {/* Main Table */}
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Sr No</StyledTableCell>
              <StyledTableCell>Payment Type</StyledTableCell>
              <StyledTableCell>Person</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Bank</StyledTableCell>
              <StyledTableCell>Cheque No</StyledTableCell>
              <StyledTableCell align="right">Amount</StyledTableCell>
              <StyledTableCell align="right">Balance</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {receivesData.map((row, index) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>
                  {getPaymentTypeChip(row.payment_type)}
                </StyledTableCell>
                <StyledTableCell>
                  {row.customer?.person_name || "N/A"}
                </StyledTableCell>
                <StyledTableCell>{row.description || "N/A"}</StyledTableCell>
                <StyledTableCell>
                  {row.bank?.bank_name || "N/A"}
                </StyledTableCell>
                <StyledTableCell>{row.cheque_no || "N/A"}</StyledTableCell>
                <StyledTableCell align="right">
                  {parseFloat(row.cash_amount).toFixed(2)}
                </StyledTableCell>
                <StyledTableCell
                  align="right"
                  sx={{
                    color:
                      parseFloat(row.balance) < 0
                        ? "error.main"
                        : "success.main",
                    fontWeight: "bold",
                  }}
                >
                  {parseFloat(row.balance).toFixed(2)}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Page;
