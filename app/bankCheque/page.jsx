"use client";
import React, { useState, useEffect } from "react";
import styles from "../../styles/bankCheque.module.css";
import { banks } from "../../networkApi/Constants";
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
  Button,
  Box,
  styled,
  tableCellClasses,
} from "@mui/material";
import APICall from "../../networkApi/APICall";
import { useRouter } from "next/navigation";

import { AddBank } from "@/components/stock/addBank";


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


const Page = () => {
  const api = new APICall();
  const router = useRouter();

  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openBankCheque, setOpenBankCheque] = useState(false);
  const [editData, setEditData] = useState(null);

  const [openBank, setOpenBank] = useState(false);
  const handleOpenBank = () => setOpenBank(true);
  const handleCloseBank = () => setOpenBank(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.getDataWithToken(banks);

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
    localStorage.setItem("selectedRowId", id);
    router.push("/bankDetails");
  };

  const handleViewLedger = (id) => {
    localStorage.setItem("selectedRowId", id);
    router.push("/bankLedger");
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Left Section */}
          <Grid item xs={12} md={4} lg={6}>
            <Box sx={{ fontSize: "24px", fontWeight: 600 }}>Party</Box>
          </Grid>

          {/* Right Section */}
          <Grid item xs={12} md={8} lg={6}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="flex-end"
            >
              {/* Add Button */}
              <Grid item xs={6} sm={6} md={4} lg={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: "20px",
                    fontWeight: "bold",
                    textTransform: "none",
                    height: "40px",
                  }}
                  onClick={handleOpenBank}
                >
                  + Add
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Summary Cards */}
        {/* <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TotalCard>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <FaMoneyBillWave color="#2e7d32" size={24} />
                  <Typography variant="h6" component="div">
                    Total Balance
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ mt: 2, color: "success.main" }}>
                  {totalBalance}
                </Typography>
              </CardContent>
            </TotalCard>
          </Grid>
        </Grid> */}

        {/* Main Table */}
        <TableContainer className="mt-5" component={Paper} elevation={3}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Sr No</StyledTableCell>
                <StyledTableCell>Bank Name</StyledTableCell>
                <StyledTableCell>Total Balance</StyledTableCell>
                <StyledTableCell>View Ledger</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? [...Array(5)].map((_, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>
                        <Skeleton variant="text" width={30} />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Skeleton variant="text" width={120} />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Skeleton variant="text" width={100} />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Skeleton variant="text" width={150} />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                : tableData.map((row, index) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{row.bank_name}</StyledTableCell>
                      <StyledTableCell>{row.balance || "N/A"}</StyledTableCell>

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
                        <Button onClick={() => handleViewLedger(row.id)}>
                          View Ledger
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <AddBank openBank={openBank} handleCloseBank={handleCloseBank} />
    </>
  );
};

export default Page;
