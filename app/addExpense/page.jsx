import React, { useState, useEffect } from 'react';
import { Modal, Box } from '@mui/material';

import styles from "../../styles/paymentss.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";

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
    const [formData, setFormData] = useState({
        packing_size: '',
    });

    useEffect(() => {
        if (editData) {
            setFormData(editData);
        } else {
            setFormData({ packing_size: '' });
        }
    }, [editData]);

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
                ? `https://backend-ghulambari.worldcitizenconsultants.com/api/packing/${editData.id}`
                : 'https://backend-ghulambari.worldcitizenconsultants.com/api/packing';

            const method = editData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: data
            });

            if (response.ok) {
                console.log(editData ? 'Entry updated successfully' : 'Form submitted successfully');
                handleCloseExpense();
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
                    {editData ? 'Edit Packing' : 'Add Expense'}
                </div>

                <div className='mt-10' style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, marginRight: '10px' }}>
                        <InputWithTitle
                            title="Add Bank Name"
                            type="text"
                            placeholder="Add Bank Name"
                            name="packing_size"
                            value={formData.packing_size}
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
                            Bank Name List
                        </div>

                        <div className={styles.contentContainer}>
                            <div className={styles.tableSection}>
                                <>
                                    <div className={styles.tableHeader}>
                                        <div>Sr.</div>
                                        <div> Name </div>
                                        <div>Action</div>
                                    </div>
                                    <div className={styles.tableBody}>
                                        <div className={styles.tableRowData}>
                                            <div>Sr.</div>
                                            <div> Name </div>
                                            <div>Action</div>
                                        </div>
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