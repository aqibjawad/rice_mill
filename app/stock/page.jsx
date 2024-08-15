"use client";
import React, { useEffect, useState } from "react";
import styles from "../../styles/stock.module.css";
import AddItemToStock from "../../components/stock/AddItemToStock";
import APICall from "../../networkApi/APICall";
import { stocks } from "@/networkApi/Constants";
import DatePicker from "react-datepicker";
import Swal from 'sweetalert2';

// MUI imports
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
  IconButton
} from '@mui/material';
import { MdDelete, MdEdit, MdAdd } from 'react-icons/md';

const Page = () => {
  const api = new APICall();
  const [openAddToStockModal, setOpenAddToStockModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const openAddStockModal = () => {
    setEditingData(null);
    setOpenAddToStockModal(true);
  };

  const closeStockModal = () => {
    setOpenAddToStockModal(false);
    setEditingData(null);
  };

  const handleEdit = (row) => {
    setEditingData(row);
    setOpenAddToStockModal(true);
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      let url = stocks;
      if (selectedDate) {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        url += `?date=${formattedDate}`;
      }
      const response = await api.getDataWithToken(url);

      const data = response.data;
      if (Array.isArray(data)) {
        setTableData(data);
      } else {
        throw new Error('Fetched data is not an array');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.deleteDataWithToken(`${stocks}/${id}`, {
        method: 'DELETE',
      });

      setTableData(tableData.filter(item => item.id !== id));

      Swal.fire({
        title: 'Deleted!',
        text: 'The stock item has been deleted successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

    } catch (error) {
      console.error('Error deleting Stock:', error);

      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete the stock item.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };



  return (
    <div>
      <div className={styles.container}>
        <div className={styles.leftSection}>Stock</div>
        <div className={styles.rightSection}>
          <div
            onClick={openAddStockModal}
            className={styles.rightItemExp}
          >
            + Add Item in Stock
          </div>
          <div className={styles.rightItem}>view all</div>
          <div className={styles.rightItem}>view all</div>
          <div className={styles.rightItemExp}>export</div>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="stock table">
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Packing Size</TableCell>
              <TableCell>Packing Unit</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Product Description</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Skeleton loader
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {[...Array(9)].map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton animation="wave" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Actual data
              tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.packing_size}</TableCell>
                  <TableCell>{row.packing_unit}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.product_description}</TableCell>
                  <TableCell>{row.product_name}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.total_amount}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(row.id)} color="error">
                      <MdDelete />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(row)} color="primary">
                      <MdEdit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddItemToStock
        open={openAddToStockModal}
        handleClose={closeStockModal}
        editingData={editingData}
        onItemUpdated={fetchData}
      />
    </div>
  );
};

export default Page;