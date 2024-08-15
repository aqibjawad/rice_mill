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
} from "@mui/material";
import { MdDelete, MdEdit } from "react-icons/md"; // Import React Icons
import AddPacking from "../../components/stock/addPacking";
import { packings } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";

import Swal from 'sweetalert2';

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

  const handleCloseModal = () => {
    setOpen(false);
    setEditingData(null);
    fetchData();
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.leftSection}>Packing</div>
        <div className={styles.rightSection}>
          <div className={styles.rightItemExp} onClick={handleOpen}>
            + Add
          </div>
          <div className={styles.rightItem}>date</div>
          <div className={styles.rightItem}>view all</div>
          <div className={styles.rightItemExp}>export</div>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr.</TableCell>
                <TableCell>Packing Weight</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Skeleton variant="rectangular" width="100%" height={40} />
                    {[...Array(5)].map((_, index) => (
                      <Skeleton
                        key={index}
                        variant="rectangular"
                        width="100%"
                        height={30}
                        style={{ marginTop: "10px" }}
                      />
                    ))}
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={3}>Error: {error}</TableCell>
                </TableRow>
              ) : (
                tableData.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.packing_size}</TableCell>
                    <TableCell>
                      <div className="flex">
                        <MdDelete
                          onClick={() => handleDelete(row.id)}
                          className={styles.deleteButton}
                        />
                        <MdEdit
                          onClick={() => handleEdit(row)}
                          className={styles.editButton}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <AddPacking open={open} handleClose={handleCloseModal} editData={editingData} />
    </div>
  );
};

export default Page;
