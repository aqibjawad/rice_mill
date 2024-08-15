"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/packing.module.css";
import { Skeleton } from "@mui/material";

import AddPacking from "../../components/stock/addPacking"; 

import {packings} from "../../networkApi/Constants"

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
            const response = await api.getDataWithToken(packings);
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
            const response = await api.getDataWithToken(`${packings}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete customer');
            }

            setTableData(tableData.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting customer:', error);
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
                    Packing
                </div>
                <div className={styles.rightSection}>
                    <div className={styles.rightItemExp} onClick={handleOpen}>
                        + Add
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
                                <div> Packing Weight </div>
                                <div>  Actions </div>
                            </div>
                            <div className={styles.tableBody}>
                                {tableData.map((row) => (
                                    <div key={row.id} className={styles.tableRowData}>
                                        <div>{row.id}</div>
                                        <div>{row.packing_size}</div>

                                        <div className="flex">
                                            <div className="flex-grow">
                                                <div className="mr-5">
                                                    <img src="/delete.png" onClick={() => handleDelete(row.id)} className={styles.deleteButton} />

                                                </div>
                                            </div>
                                            <div>
                                                <div className="">
                                                    <img src="/edit.jpg" onClick={() => handleEdit(row)} className={styles.deleteButton} />

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            {/* Use the AddLedgerEntry component */}
            <AddPacking open={open} handleClose={handleClose} />
        </div>
    );
}

export default Page;