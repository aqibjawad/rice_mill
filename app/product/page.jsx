"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/product.module.css";
import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { products } from "../../networkApi/Constants";

// Import icons from react-icons
import { MdDelete, MdEdit } from "react-icons/md";

import AddProduct from "../../components/stock/addProduct";

import APICall from "../../networkApi/APICall";

const Page = () => {

    const api = new APICall();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingData, setEditingData] = useState(null);

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
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            const data = result.data;
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
            const response = await api.getDataWithToken(`${products}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            setTableData(tableData.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingData(null);
        fetchData();
    };
 
    return (
        <div className={styles.pageContainer}>
            <div className={styles.container}>
                <div className={styles.leftSection}>
                    Product
                </div>
                <div className={styles.rightSection}>
                    <div className={styles.rightItemExp} onClick={handleOpen}>
                        Add
                    </div>
                    <div className={styles.rightItem}>
                        date
                    </div>
                    <div className={styles.rightItem}>
                        view all
                    </div>
                    <div className={styles.rightItemExp}>
                        export
                    </div>
                </div>
            </div>

            <div className={styles.contentContainer}>
                <TableContainer component={Paper} className={styles.tableSection}>
                    {loading ? (
                        <Skeleton variant="rectangular" width="100%" height={40} />
                    ) : error ? (
                        <div>Error: {error}</div>
                    ) : (
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
                                {tableData.map((row) => (
                                    <TableRow key={row.id} className={styles.tableRowData}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.product_name}</TableCell>
                                        <TableCell>{row.product_description}</TableCell>
                                        <TableCell className={styles.iconContainer}>
                                            <MdDelete 
                                                onClick={() => handleDelete(row.id)} 
                                                className={styles.deleteButton} 
                                                style={{ cursor: 'pointer', color: 'red' }} 
                                                size={24} 
                                                title="Delete"
                                            />
                                            <MdEdit 
                                                onClick={() => handleEdit(row)} 
                                                className={styles.editButton} 
                                                style={{ cursor: 'pointer', color: 'blue', marginLeft: '10px' }} 
                                                size={24} 
                                                title="Edit"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
            </div>
            <AddProduct open={open} handleClose={handleClose} />
        </div>
    );
}

export default Page;
