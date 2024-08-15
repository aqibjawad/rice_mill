"use client";

import React, { useState, useEffect } from 'react';
import { Modal, Box, Grid } from '@mui/material';
import styles from "../../styles/paymentss.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import { banks as banksApi } from "../../networkApi/Constants";

import APICall from "../../networkApi/APICall";

const style = {
    
    position: 'absolute', 
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 600 },
    height: { xs: '90%', sm: 'auto' },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflow: { xs: 'auto', sm: 'initial' },
};

export const AddBank = ({ open: isOpen, handleClose: onClose, editData = null }) => {

    const api = new APICall();

    const [formData, setFormData] = useState({ bank_name: '' });
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (editData) {
            setFormData(editData);
        } else {
            setFormData({ bank_name: '' });
        }
    }, [editData]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await getDataWithToken(banksApi);
            const data = response.data;
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
                ? `${banksApi}/${editData.id}`
                : banksApi;

            const method = editData ? 'PUT' : 'POST';

            const response = await postFormDataWithToken(url, {
                method: method,
                body: data
            });

            if (response.ok) {
                const result = await response.json();
                if (editData) {
                    setTableData(tableData.map(item => item.id === editData.id ? result.data : item));
                } else {
                    setTableData([...tableData, result.data]);
                }
                console.log(editData ? 'Entry updated successfully' : 'Form submitted successfully');
                onClose();
            } else {
                console.error(editData ? 'Entry update failed' : 'Form submission failed');
            }
        } catch (error) {
            console.error('An error occurred', error);
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                <div className={styles.logocontainer}>
                    <img className={styles.logo} src="/logo.png" alt="Logo" />
                </div>

                <div className={styles.ledgerHead} style={{ fontSize: '1.5rem', padding: '1rem' }}>
                    {editData ? 'Edit Packing' : 'Add Bank'}
                </div>

                <div style={{ height: { xs: 'calc(100% - 72px)', sm: 'auto' }, overflowY: { xs: 'auto', sm: 'initial' } }}>
                    <Grid container spacing={2} className="mt-10">
                        <Grid item lg={6} xs={12} sm={12}>
                            <InputWithTitle
                                title="Add Bank Name" 
                                type="text"
                                placeholder="Add Bank Name"
                                name="bank_name"
                                value={formData.bank_name}
                                onChange={handleInputChange}
                            />

                            <div style={{ marginTop: "1rem" }} className={styles.saveBtn} onClick={handleSubmit}>
                                {editData ? 'Update' : 'Save'}
                            </div>
                        </Grid>

                        <Grid item lg={6} xs={12} sm={12}>
                            <div className={styles.bankList}>Bank Name List</div>
                            <div className={styles.contentContainer}>
                                <div className={styles.tableSection}>
                                    <>
                                        <div className={styles.tableHeader}>
                                            <div>Sr.</div>
                                            <div> Name </div>
                                            <div>Action</div>
                                        </div>
                                        <div className={styles.tableBody}>
                                            {loading ? (
                                                <div>Loading...</div>
                                            ) : error ? (
                                                <div>Error: {error}</div>
                                            ) : (
                                                tableData.map((row) => (
                                                    <div key={row.id} className={styles.tableRowData}>
                                                        <div>{row.id}</div>
                                                        <div>{row.bank_name}</div>
                                                        <div>Action</div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Box>
        </Modal>
    );
};