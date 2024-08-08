import React, { useState, useEffect } from 'react';
import { Modal, Box } from '@mui/material';

import styles from "../../styles/paymentss.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";

import { expense } from "../../networkApi/Constants";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    outline: 'none',
};

const AddExpense = ({ openExpense, handleCloseExpense, editData = null }) => {
    const [formData, setFormData] = useState({ expense_category: '' });
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (editData) {
            setFormData(editData);
        } else {
            setFormData({ expense_category: '' });
        }
    }, [editData]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(expense); // Fetch initial bank data
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const url = editData
                ? `${expense}/${editData.id}` // URL for updating existing bank
                : expense; // URL for adding new bank

            const method = editData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: data
            });

            if (response.ok) {
                const result = await response.json();
                if (editData) {
                    // Update existing bank in the table data
                    setTableData(tableData.map(item => item.id === editData.id ? result.data : item));
                } else {
                    // Add new bank to the table data
                    setTableData([...tableData, result.data]);
                }
                console.log(editData ? 'Entry updated successfully' : 'Form submitted successfully');
                handleCloseExpense(); // Close modal
            } else {
                console.error(editData ? 'Entry update failed' : 'Form submission failed');
            }
        } catch (error) {
            console.error('An error occurred', error);
        }
    };

    return (
        <Modal
            open={openExpense}
            onClose={handleCloseExpense}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                <div className={styles.logocontainer}>
                    <img className={styles.logo} src="/logo.png" alt="Logo" />
                </div>

                <div className={styles.ledgerHead}>
                    {editData ? 'Edit Expense' : 'Add Expense'}
                </div>

                <div className='mt-10' style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, marginRight: '10px' }}>
                        <InputWithTitle
                            title="Expense Category"
                            type="text" 
                            placeholder="Add Expense Category"
                            name="expense_category"
                            value={formData.expense_category}
                            onChange={handleInputChange}
                        />

                        <div className='mt-5' style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ flex: 1, marginRight: '10px' }}>
                                <div className={styles.saveBtn} onClick={handleSubmit}>
                                    {editData ? 'Update' : 'Save'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, marginRight: '10px' }}>
                        <div className={styles.bankList}>
                            Expense Category List
                        </div>

                        <div className={styles.contentContainer}>
                            <div className={styles.tableSection}>
                                <>
                                    <div className={styles.tableHeader}>
                                        <div>Sr.</div>
                                        <div>Name</div>
                                        <div>Action</div>
                                    </div>
                                    <div className={styles.tableBody}>
                                        {tableData.map((item, index) => (
                                            <div key={item.id} className={styles.tableRowData}>
                                                <div>{index + 1}</div>
                                                <div>{item.expense_category}</div>
                                                <div>
                                                    {/* Action buttons like Edit/Delete can be added here */}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            </div>
                        </div>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default AddExpense;
