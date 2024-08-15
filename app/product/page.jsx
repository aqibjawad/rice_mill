"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/product.module.css";
import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { products } from "../../networkApi/Constants";
import { MdDelete, MdEdit } from "react-icons/md";
import AddProduct from "../../components/stock/addProduct";
import APICall from "../../networkApi/APICall";
import Swal from 'sweetalert2';

const Page = () => {
    const api = new APICall();
    const [open, setOpen] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingData, setEditingData] = useState(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleEdit = (row) => {
        setEditingData(row);
        setIsModalOpen(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.getDataWithToken(products);
            const data = response.data;

            // Debug: Log the data fetched from the API
            console.log("Fetched data:", data);

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
            await api.deleteDataWithToken(`${products}/${id}`, {
                method: 'DELETE',
            });

            setTableData(prevData => prevData.filter(item => item.id !== id));

            Swal.fire({
                title: 'Deleted!',
                text: 'The Product item has been deleted successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

        } catch (error) {
            console.error('Error deleting Stock:', error);

            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete the product item.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingData(null);
        fetchData(); // Refresh the data after closing the modal
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.container}>
                <div className={styles.leftSection}>Product</div>
                <div className={styles.rightSection}>
                    <div className={styles.rightItemExp} onClick={handleOpen}>Add</div>
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
                                <TableCell>Product Name</TableCell>
                                <TableCell>Product Description</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Skeleton variant="text" />
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">{error}</TableCell>
                                </TableRow>
                            ) : (
                                tableData.map((row, index) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.product_name}</TableCell>
                                        <TableCell>{row.product_description}</TableCell>
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
            </div>
            <AddProduct open={open} handleClose={handleCloseModal} editData={editingData} />
        </div>
    );
};

export default Page;
