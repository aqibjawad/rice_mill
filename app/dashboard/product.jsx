"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/product.module.css";
import AddProduct from "../../components/stock/addProduct";

import { Skeleton } from "@mui/material";
import { products } from "../../networkApi/Constants";
import { Grid} from '@mui/material';

const Product = () => {
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
            const response = await fetch(products);
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
            const response = await fetch(`${products}/${id}`, {
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

    return (
        <div className={styles.pageContainer}>
            <div className={styles.container}>
                <Grid container spacing={2}>
                    <Grid item lg={10} sm={12} xs={12} md={4}>
                        <div className={styles.leftSection}>
                            Product
                        </div>
                    </Grid>
                    <Grid item lg={2} sm={12} xs={12} md={8}>
                        <div className={styles.rightSection}>

                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={6} md={3}>
                                    <div className={styles.rightItemExp}>
                                        Add
                                    </div>
                                </Grid>
                                <Grid item xs={6} sm={6} md={3}>
                                    <div className={styles.rightItem}>
                                        date
                                    </div>
                                </Grid>
                                <Grid item xs={6} sm={6} md={3}>
                                    <div className={styles.rightItem}>
                                        view all
                                    </div>
                                </Grid>
                                <Grid item xs={6} sm={6} md={3}>
                                    <div className={styles.rightItemExp}>
                                        export
                                    </div>
                                </Grid>
                            </Grid>
                        </div>

                    </Grid>
                </Grid>
            </div>

            <div className={styles.contentContainer}>
                <div className={styles.tableSection}>
                    {loading ? (
                        <>
                            <Skeleton variant="rectangular" width="100%" height={40} />
                            {[...Array(5)].map((_, index) => (
                                <Skeleton key={index} variant="rectangular" width="100%" height={30} style={{ marginTop: '10px' }} />
                            ))}
                        </>
                    ) : error ? (
                        <div>Error: {error}</div>
                    ) : (
                        <>
                            <div className={styles.tableHeader}>
                                <div>Sr.</div>
                                <div> Product Name </div>
                                <div>Product Description</div>
                                <div>Action</div>
                            </div>
                            <div className={styles.tableBody}>
                                {tableData.map((row) => (
                                    <div key={row.id} className={styles.tableRowData}>
                                        <div>{row.id}</div>
                                        <div>{row.product_name}</div>
                                        <div>{row.product_description}</div>
                                        <div className={styles.iconContainer}>
                                            <img src="/delete.png" onClick={() => handleDelete(row.id)} className={styles.deleteButton} />
                                            <img src="/edit.jpg" onClick={() => handleEdit(row)} className={styles.editButton} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <AddProduct open={open} handleClose={handleClose} />
        </div>
    )
}

export default Product;