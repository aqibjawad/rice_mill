"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/ledger1.module.css";
import { payment_In } from "../../networkApi/Constants";
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

import APICall from "../../networkApi/APICall";

import Buttons from "../../components/buttons"

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
            const response = await api.getDataWithToken(payment_In);
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

    return (
        <div>
            <Buttons leftSectionText="Amount Recieves" addButtonLink="/payments" />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Payment Type</TableCell>
                            <TableCell>Person</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Bank Id</TableCell>
                            <TableCell>Cheque No</TableCell>
                            <TableCell>Cheque Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            // Skeleton rows while loading
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
                            // Actual data rows
                            tableData.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.payment_type}</TableCell>
                                    <TableCell>{row.customer_id}</TableCell>
                                    <TableCell>{row.description.slice(0, 10)}...</TableCell>
                                    <TableCell>{row.amount}</TableCell>
                                    <TableCell>{row.bank_id}</TableCell>
                                    <TableCell>{row.cheque_no}</TableCell>
                                    <TableCell>{row.cheque_date}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Page