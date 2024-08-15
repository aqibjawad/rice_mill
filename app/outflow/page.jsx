"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/ledger1.module.css";
import { payment_Out } from "../../networkApi/Constants";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Skeleton
} from '@mui/material';

import Buttons from "../../components/buttons"

import APICall from "../../networkApi/APICall";

const Page = () => {

  const api = new APICall();


    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.getDataWithToken(payment_Out);
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

    const calculateTotalAmount = () => {
        const total = tableData.reduce((total, row) => total + parseFloat(row.amount), 0);
        return total.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            style: 'currency',
            currency: 'PKR',
        });
    };

    return (
        <div>

            <Buttons leftSectionText="Payments"  addButtonLink="/payments" />

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Payment Type</TableCell>
                            <TableCell>Person</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Bank Id</TableCell>
                            <TableCell>Cheque No</TableCell>
                            <TableCell>Cheque Date</TableCell>
                            <TableCell>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            // Skeleton loader
                            [...Array(5)].map((_, index) => (
                                <TableRow key={index}>
                                    {[...Array(7)].map((_, cellIndex) => (
                                        <TableCell key={cellIndex}>
                                            <Skeleton animation="wave" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            // Actual data
                            tableData.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.payment_type}</TableCell>
                                    <TableCell>{row.customer_id}</TableCell>
                                    <TableCell>{row.description}</TableCell>
                                    <TableCell>{row.bank_id}</TableCell>
                                    <TableCell>{row.cheque_no}</TableCell>
                                    <TableCell>{row.cheque_date}</TableCell>
                                    <TableCell>{row.amount}</TableCell>
                                </TableRow>
                            ))
                        )}
                        <TableRow>
                            <TableCell colSpan={6} align="right">Total:</TableCell>
                            <TableCell>{calculateTotalAmount()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Page