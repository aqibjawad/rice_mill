"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/ledger1.module.css";

import Link from "next/link";

import { payment_Out } from "../../networkApi/Constants";

const Page = () => {

    const [tableData, setTableData] = useState([]);
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
            const response = await fetch(payment_Out);
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
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(payment_Out.delete(id), {
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
            <div className={styles.container}>
                <div className={styles.leftSection}>
                    Payments
                </div>
                <div className={styles.rightSection}>
                    <div className={styles.rightItemExp}>
                        <Link href="/payments">
                            Add
                        </Link>
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

            <div className={styles.tableSection}>
                <div className={styles.tableHeader}>
                    <div>Payment Type</div>
                    <div>Person</div>
                    <div>Description</div>
                    <div> Bank Id </div>
                    <div>Cheuqe No</div>
                    <div>cheque Date</div>
                    <div>Amount</div>
                </div>
                <div className={styles.tableBody}>
                    {tableData.map((row) => (
                        <div key={row.id} className={styles.tableRowData}>
                            <div>{row.payment_type}</div>
                            <div>{row.customer_id}</div>
                            <div>{row.description}</div>
                            <div>{row.bank_id}</div>
                            <div>{row.cheque_no}</div>
                            <div>{row.cheque_date}</div>
                            <div>{row.amount}</div>
                        </div>
                    ))}
                    <div className={styles.tableRowData}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div className={styles.tableFooter}>
                            <div>Total: {calculateTotalAmount()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page