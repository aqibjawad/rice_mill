"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/ledger.module.css";
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
import { MdDelete } from "react-icons/md";
import AddInvestor from "../../components/stock/addInvestor";
import { investors } from "../../networkApi/Constants";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { FaMoneyBillWave, FaUniversity } from "react-icons/fa";
import ButtonsWithOutDate from "../../components/buttonsWithOutDate";

import APICall from "@/networkApi/APICall";

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
  const router = useRouter();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingData(null);
    fetchData();
  };

  const handleEdit = (row) => {
    setEditingData(row);
    setOpen(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.getDataWithToken(investors);
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

  const handleDelete = async (id) => {
    try {
      const response = await api.deleteDataWithToken(`${investors}/${id}`, {
        method: "DELETE",
      });

      if ((response.status = "success")) {
        setTableData((prevData) => prevData.filter((item) => item.id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "The investor has been deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the investor.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error deleting Investor:", error);
    }
  };

  const handleViewDetails = (id) => {
    localStorage.setItem("investorId", id);
    router.push("/investor_ledger");
  };

  // Calculate total balance
  const totalBalance = tableData.reduce(
    (total, row) => total + parseFloat(row.current_balance || 0),
    0
  );

  return (
    <div>
      <Box sx={{ p: 3 }}>
        <div className={styles.container}>
          <div className={styles.leftSection}>Investors</div>
          <div className={styles.rightSection}>
            <div className={styles.rightItemExp} onClick={handleOpen}>
              + Add
            </div>
          </div>
        </div>
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
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
        </Grid>

        {/* Main Table */}
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Sr No</StyledTableCell>
                <StyledTableCell>Person Name</StyledTableCell>
                <StyledTableCell>Contact</StyledTableCell>
                <StyledTableCell>Firm Name</StyledTableCell>
                <StyledTableCell>Balance</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.person_name}</StyledTableCell>
                  <StyledTableCell>
                    {row.customer?.contact || "N/A"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {row.bank?.address || "N/A"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {row.firm_name}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      color:
                        parseFloat(row.balance) < 0
                          ? "error.main"
                          : "success.main",
                      fontWeight: "bold",
                    }}
                  >
                    {row.current_balance}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <AddInvestor
        open={open}
        handleClose={handleClose}
        editData={editingData}
      />
    </div>
  );
};

export default Page;
