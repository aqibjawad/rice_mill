"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/product.module.css";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  IconButton,
  Box,
  Button,
  tableCellClasses,
  styled
} from "@mui/material";
import { products } from "../../networkApi/Constants";
import { MdDelete, MdEdit } from "react-icons/md";
import AddProduct from "../../components/stock/addProduct";
import APICall from "../../networkApi/APICall";
import Swal from "sweetalert2";

import Link from "next/link";


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
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingData(null);
    fetchData(); // Refresh the data after closing the modal
  };

  const handleEdit = (row) => {
    setEditingData(row);
    setOpen(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.getDataWithToken(products);
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
      await api.deleteDataWithToken(`${products}/${id}`, {
        method: "DELETE",
      });

      setTableData((prevData) => prevData.filter((item) => item.id !== id));

      Swal.fire({
        title: "Deleted!",
        text: "The Product item has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error deleting product:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to delete the product item.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
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
                <StyledTableCell>Product Name</StyledTableCell>
                <StyledTableCell>Weight in Stock</StyledTableCell>
                <StyledTableCell>Balance</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
                <StyledTableCell>View</StyledTableCell>
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
                        <Skeleton variant="text" width={150} />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Skeleton variant="text" width={150} />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                : tableData.map((row, index) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{row.product_name}</StyledTableCell>
                      <StyledTableCell>
                        {row.remaining_weight || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell>{row.balance || "N/A"}</StyledTableCell>
                      <StyledTableCell
                        sx={{
                          color:
                            parseFloat(row.balance) < 0
                              ? "error.main"
                              : "success.main",
                          fontWeight: "bold",
                        }}
                      >
                        <IconButton
                          onClick={() => handleDelete(row.id)}
                          color="error"
                        >
                          <MdDelete />
                        </IconButton>
                      </StyledTableCell>
                      <StyledTableCell>
                        {" "}
                        <Link href={`/productDetails/?id=${row.id}`}>
                          View Details
                        </Link>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <AddProduct
        open={open}
        handleClose={handleClose}
        editData={editingData}
      />
    </div>
  );
};

export default Page;
