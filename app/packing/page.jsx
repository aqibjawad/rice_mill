"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/packing.module.css";
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
  Box,
  tableCellClasses,
  styled,
  Card,
} from "@mui/material";
import { MdDelete, MdEdit } from "react-icons/md"; // Import React Icons
import AddPacking from "../../components/stock/addPacking";
import { packings } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";

import Swal from "sweetalert2";

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
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const handleEdit = (row) => {
    setEditingData(row);
    setOpen(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.getDataWithToken(packings);
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
      const response = await api.deleteDataWithToken(`${packings}/${id}`, {
        method: "DELETE",
      });

      setTableData(tableData.filter((item) => item.id !== id));

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

  const handleCloseModal = () => {
    setOpen(false);
    setEditingData(null);
    fetchData();
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <div className={styles.container}>
          <div className={styles.leftSection}>Packings</div>
          <div className={styles.rightSection}>
            <div className={styles.rightItemExp} onClick={handleOpen}>
              + Add
            </div>
          </div>
        </div>
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
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Sr No</StyledTableCell>
                <StyledTableCell>Weight</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.packing_size}</StyledTableCell>
                  <StyledTableCell align="right">
                    {" "}
                    <div className="flex">
                      <MdDelete
                        onClick={() => handleDelete(row.id)}
                        className={styles.deleteButton}
                      />
                      {/* <MdEdit
                          onClick={() => handleEdit(row)}
                          className={styles.editButton}
                        /> */}
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <AddPacking
        open={open}
        handleClose={handleCloseModal}
        editData={editingData}
      />
    </>
  );
};

export default Page;
