"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/ledger.module.css";
import { Skeleton } from "@mui/material";

import AddBuyer from "../../components/stock/addBuyer"
import { buyer } from "../../networkApi/Constants"

import APICall from "@/networkApi/APICall";

import Swal from 'sweetalert2';

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
        fetchData(); 
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
            const response = await api.getDataWithToken(buyer);
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
            const response = await api.getDataWithToken(`${buyer}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete stock item');
            }

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
        <div className={styles.pageContainer}>

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
                                <div>Person Name</div>
                                <div>Contact</div>
                                <div>Address</div>
                                <div>Firm Name</div>
                                <div> customer Type </div>
                                <div>Description</div>
                                <div>Action</div>
                            </div>
                            <div className={styles.tableBody}>
                                {tableData.map((row) => (
                                    <div key={row.id} className={styles.tableRowData}>
                                        <div>{row.id}</div>
                                        <div>{row.person_name}</div>
                                        <div>{row.contact}</div>
                                        <div>{row.address}</div>
                                        <div>{row.firm_name}</div>
                                        <div>{row.customer_type}</div>
                                        <div>{row.description}</div>
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
            <AddBuyer open={open} handleClose={handleClose} editData={editingData} />
        </div>
    );
}

export default Page;