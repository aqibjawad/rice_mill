"use client";
import React, { useEffect, useState } from "react";
import styles from "../../styles/stock.module.css";
import AddItemToStock from "../../components/stock/AddItemToStock";
import APICall from "../../networkApi/APICall";
import { stocks } from "@/networkApi/Constants";
import Swal from "sweetalert2";
import {
  Grid,
  Typography,
  Box,
  Paper,
  IconButton,
  Skeleton,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import { MdDelete, MdEdit } from "react-icons/md";
import DateFilters from "@/components/generic/DateFilter";
import { format } from "date-fns";

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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Page = () => {
  const api = new APICall();
  const [openAddToStockModal, setOpenAddToStockModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const openAddStockModal = () => {
    setEditingData(null);
    setOpenAddToStockModal(true);
  };

  const closeStockModal = () => {
    setOpenAddToStockModal(false);
    setEditingData(null);
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = [];

      if (startDate && endDate) {
        queryParams.push(
          `start_date=${format(new Date(startDate), "yyyy-MM-dd")}`
        );
        queryParams.push(`end_date=${format(new Date(endDate), "yyyy-MM-dd")}`);
      } else {
        const currentDate = format(new Date(), "yyyy-MM-dd");
        queryParams.push(`start_date=${currentDate}`);
        queryParams.push(`end_date=${currentDate}`);
      }

      const response = await api.getDataWithToken(
        `${stocks}?${queryParams.join("&")}`
      );
      const data = response.data;

      if (Array.isArray(data)) {
        setTableData(data);
      } else {
        throw new Error("Fetched data is not an array");
      }
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

  const handleDelete = async (id) => {
    setDeletingId(id); // Show loader on delete button

    try {
      await api.deleteDataWithToken(`${stocks}/${id}`);

      setTableData((prevData) => prevData.filter((item) => item.id !== id));

      Swal.fire({
        title: "Deleted!",
        text: "The stock item has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error deleting stock:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the stock item.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <div className={styles.container}>
        <Grid container spacing={2}>
          <Grid item lg={8} sm={12} xs={12} md={4}>
            <Typography variant="h5" fontWeight="bold">
              Stock
            </Typography>
          </Grid>
          <Grid item lg={4} sm={12} xs={12} md={8}>
            <Grid container spacing={2} justifyContent="flex-end">
              <Grid item>
                <div onClick={openAddStockModal} className={styles.rightItem}>
                  Add
                </div>
              </Grid>
              <Grid item>
                <DateFilters onDateChange={handleDateChange} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>

      {/* Main Table */}
      <TableContainer component={Paper} elevation={3} sx={{ mt: 3 }}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Sr No</StyledTableCell>
              <StyledTableCell>Weight</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Quantity</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? // Show skeleton loaders while data is being fetched
                [...Array(5)].map((_, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>
                      <Skeleton width={30} />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Skeleton width={60} />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Skeleton width={120} />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Skeleton width={50} />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Skeleton variant="circular" width={30} height={30} />
                      <Skeleton
                        variant="circular"
                        width={30}
                        height={30}
                        sx={{ ml: 1 }}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              : tableData.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{row.packing_size}</StyledTableCell>
                    <StyledTableCell>{row.product_name}</StyledTableCell>
                    <StyledTableCell>{row.quantity}</StyledTableCell>
                    <StyledTableCell align="right">
                      <div className="flex">
                        <IconButton
                          onClick={() => handleDelete(row.id)}
                          disabled={deletingId === row.id}
                        >
                          {deletingId === row.id ? (
                            <Skeleton
                              variant="circular"
                              width={24}
                              height={24}
                            />
                          ) : (
                            <MdDelete className={styles.deleteButton} />
                          )}
                        </IconButton>
                        {/* <IconButton
                          onClick={() =>
                            setEditingData(row) || setOpenAddToStockModal(true)
                          }
                        >
                          <MdEdit className={styles.editButton} />
                        </IconButton> */}
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddItemToStock
        open={openAddToStockModal}
        handleClose={closeStockModal}
        editingData={editingData}
        onItemUpdated={fetchData}
      />
    </Box>
  );
};

export default Page;
