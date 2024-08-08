"use client";

import React, {useState, useEffect} from "react";
import styles from "../../styles/ledger1.module.css";

import Link from "next/link";

import { payment_In } from "../../networkApi/Constants";

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
            const response = await fetch(payment_In);
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
            const response = await fetch(packings.delete(id), {
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

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.leftSection}>
                    Amount Recieves
                </div>
                <div className={styles.rightSection}>
                    <div className={styles.rightItemExp}>
                        <Link href="/amountRecieves">
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
                    <div>Amount</div>
                    <div> Bank Id </div>
                    <div>Cheuqe No</div>
                    <div>cheque Date</div>
                </div>
                <div className={styles.tableBody}>
                    {tableData.map((row) => (
                        <div key={row.id} className={styles.tableRowData}>
                            <div>{row.payment_type}</div>
                            <div>{row.customer_id}</div>
                            <div>{row.description}</div>
                            <div>{row.amount}</div>
                            <div>{row.bank_id}</div>
                            <div>{row.cheque_no}</div>
                            <div>{row.cheque_date}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Page