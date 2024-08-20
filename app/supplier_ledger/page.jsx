"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/ledger.module.css";
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
import { MdDelete, MdEdit, MdOutlineDelete } from "react-icons/md";
import AddSupplier from "../../components/stock/addSupplier";


import Swal from "sweetalert2";
import Link from "next/link";
import APICall from "@/networkApi/APICall";
import { useSearchParams } from 'next/navigation'

import { supplierLedger } from "../../networkApi/Constants";



const Page = () => {


    const api = new APICall();

    const [openAddToStockModal, setOpenAddToStockModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingData, setEditingData] = useState(null);

    const searchParams = useSearchParams()
    const id = searchParams.get('sup_id')

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.getDataWithToken(`${supplierLedger}/?sup_id=${id}`);

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

    const handleEdit = (row) => {
        const encodedData = encodeURIComponent(JSON.stringify(row));
        window.location.href = `/addPurchase?editData=${encodedData}`;
    };

    const handleDelete = async (id) => {
        try {
            const response = await api.getDataWithToken(`${supplierLedger}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete Purchase Book item');
            }

            setTableData(tableData.filter(item => item.id !== id));

            Swal.fire({
                title: 'Deleted!',
                text: 'The purchase item has been deleted successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

        } catch (error) {
            console.error('Error deleting Purchase:', error);

            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete the purchase item.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };


    return (
        <div>
            <div className={styles.container}>
                <div className={styles.leftSection}> Supplier Ledger </div>
                <div className={styles.rightSection}>
                    <div className={styles.rightItemExp}>
                        <Link href="/addSupLedger">+ Add Ledger</Link>
                    </div>
                    <div className={styles.rightItem}>view all</div>
                    <div className={styles.rightItemExp}>export</div>
                </div>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sr No</TableCell>
                            <TableCell> Supplier Name </TableCell>
                            <TableCell>Balance</TableCell>
                            <TableCell>Cash Amount</TableCell>
                            <TableCell>Bank Id</TableCell>
                            <TableCell>Cheque Date</TableCell>
                            <TableCell>Cheque No</TableCell>
                            <TableCell>Cheque Amount</TableCell>
                            <TableCell>Cr Amount</TableCell>
                            <TableCell>Customer Id</TableCell>
                            <TableCell>Customer Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Dr Amount</TableCell>
                            <TableCell>Entry Type</TableCell>
                            <TableCell>Payment Type</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            // Skeleton loader
                            [...Array(5)].map((_, index) => (
                                <TableRow key={index}>
                                    {[...Array(15)].map((_, cellIndex) => (
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
                                    <TableCell>{row.customer.person_name}</TableCell>
                                    <TableCell>{row.balance}</TableCell>
                                    <TableCell>{row.cash_amount}</TableCell>
                                    <TableCell>{row.bank_id}</TableCell>
                                    <TableCell>{row.cheque_date}</TableCell>
                                    <TableCell>{row.cheque_no}</TableCell>
                                    <TableCell>{row.cheque_amount}</TableCell>
                                    <TableCell>{row.cr_amount}</TableCell>
                                    <TableCell>{row.customer_id}</TableCell>
                                    <TableCell>{row.customer_type}</TableCell>
                                    <TableCell>{row.description}</TableCell>
                                    <TableCell>{row.dr_amount}</TableCell>
                                    <TableCell>{row.entry_type}</TableCell>
                                    <TableCell>{row.payment_type}</TableCell>
                                    <TableCell>
                                        <div className={styles.iconContainer}>
                                            <MdOutlineDelete onClick={() => handleDelete(row.id)} className={styles.deleteButton} />
                                            <img src="/edit.jpg" onClick={() => handleEdit(row)} className={styles.editButton} alt="Edit" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Page;