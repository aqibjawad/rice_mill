"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/ledger.module.css";
import {
  Skeleton,
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
  TextField,
  Button,
  tableCellClasses,
  styled,
} from "@mui/material";
import { MdDelete } from "react-icons/md";
import AddBuyer from "../../components/stock/addBuyer";
import { party } from "../../networkApi/Constants";
import APICall from "@/networkApi/APICall";
import Swal from "sweetalert2";
import { AiOutlineSearch } from "react-icons/ai";

import SearchInput from "@/components/generic/searchInput";

import { useRouter } from "next/navigation";

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

  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [filteredData, setFilteredData] = useState([]);

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

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(tableData);
    } else {
      const filtered = tableData.filter((item) =>
        item.person_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, tableData]);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.getDataWithToken(party);
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
      const response = await api.deleteDataWithToken(`${party}/${id}`);

      setTableData((prevData) => prevData.filter((item) => item.id !== id));

      Swal.fire({
        title: "Deleted!",
        text: "The stock item has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error deleting Stock:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the stock item.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleViewDetails = (id) => {
    localStorage.setItem("buyerId", id);
    router.push("/buyer_ledger");
  };

  return (
    <div>
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
              {/* Search Input */}
              <Grid item xs={6} sm={6} md={8} lg={8}>
                <SearchInput
                  placeholder="Search by person name"
                  value={searchQuery}
                  onSearch={handleSearch}
                />
              </Grid>

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
                  onClick={handleOpen}
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
                <StyledTableCell>Person Name</StyledTableCell>
                <StyledTableCell>Contact</StyledTableCell>
                <StyledTableCell>Address</StyledTableCell>
                <StyledTableCell>Balance</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
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
                      <StyledTableCell>
                        <Skeleton variant="text" width={120} />
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Skeleton variant="text" width={80} />
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Skeleton
                          variant="rectangular"
                          width={50}
                          height={25}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                : filteredData.map((row, index) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{row.person_name}</StyledTableCell>
                      <StyledTableCell>{row.contact || "N/A"}</StyledTableCell>
                      <StyledTableCell>{row.address || "N/A"}</StyledTableCell>
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
                      <StyledTableCell>View Details</StyledTableCell>
                    </StyledTableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <AddBuyer open={open} handleClose={handleClose} editData={editingData} />
    </div>
  );
};

export default Page;
