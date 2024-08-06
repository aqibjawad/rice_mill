"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/product.module.css";

const Page = () => {
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
            const response = await fetch('https://backend-ghulambari.worldcitizenconsultants.com/api/product');
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
            const response = await fetch(`https://backend-ghulambari.worldcitizenconsultants.com/api/product/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete customer');
            }

            // Remove the deleted item from the state
            setTableData(tableData.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting customer:', error);
            // You might want to show an error message to the user here
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingData(null);
        fetchData(); // Refresh the data after closing the modal
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.container}>
                <div className={styles.leftSection}>
                    Product
                </div>
                <div className={styles.rightSection}>
                    <div className={styles.rightItemExp}>
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
                                <div>
                                    <img src="/delete.png" onClick={() => handleDelete(row.id)} className={styles.deleteButton} />
                                    <button 
                                        onClick={() => handleEdit(row)}
                                        className={styles.editButton}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;