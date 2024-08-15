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
import { MdDelete, MdEdit } from "react-icons/md"; // Importing icons from react-icons
import AddBuyer from "../../components/stock/addBuyer";
import { buyer } from "../../networkApi/Constants";
import APICall from "@/networkApi/APICall";
import Swal from "sweetalert2";

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
        setLoading(true);
        try {
            const response = await api.getDataWithToken(buyer);
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
            const response = await api.getDataWithToken(`${buyer}/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete stock item");
            }

            setTableData((prevData) => prevData.filter((item) => item.id !== id));

            Swal.fire({
                title: "Deleted!",
                text: "The stock item has been deleted successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            console.error("Error deleting Stock:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to delete the stock item.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.container}>
                <div className={styles.leftSection}>Buyer</div>
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
                                <TableCell>Person Name</TableCell>
                                <TableCell>Contact</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Firm Name</TableCell>
                                <TableCell>Customer Type</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8}>
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
                                    <TableCell colSpan={8}>Error: {error}</TableCell>
                                </TableRow>
                            ) : (
                                tableData.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.person_name}</TableCell>
                                        <TableCell>{row.contact}</TableCell>
                                        <TableCell>{row.address}</TableCell>
                                        <TableCell>{row.firm_name}</TableCell>
                                        <TableCell>{row.customer_type}</TableCell>
                                        <TableCell>{row.description}</TableCell>
                                        <TableCell>
                                            <div className={styles.iconContainer}>
                                                <MdEdit
                                                    onClick={() => handleEdit(row)}
                                                    className={styles.editButton}
                                                    style={{ cursor: "pointer", color: "#316AFF" }}
                                                />
                                                <MdDelete
                                                    onClick={() => handleDelete(row.id)}
                                                    className={styles.deleteButton}
                                                    style={{ cursor: "pointer", color: "red", marginLeft: "10px" }}
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
            <AddBuyer open={open} handleClose={handleClose} editData={editingData} />
        </div>
    );
};

export default Page;
