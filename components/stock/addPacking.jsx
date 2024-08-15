"use client";

import React, { useState, useEffect } from 'react';
import { Modal, Box, CircularProgress } from '@mui/material';
import styles from "../../styles/ledger.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import { packings } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import Swal from 'sweetalert2';

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

const AddPacking = ({ open, handleClose, editData = null }) => {
    const api = new APICall();

    const [sendingData, setSendingData] = useState(false);


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

        if (!formData.packing_size.trim()) {
            Swal.fire({
                title: 'Error!',
                text: 'Please enter a packing weight.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        setSendingData(true);

        try {
            let response;
            if (editData) {
                const url = `${packings}/${editData.id}`;
                response = await api.updateFormDataWithToken(url, formData);
            } else {
                const url = packings;
                response = await api.postFormDataWithToken(url, formData);
            }

            handleClose();

            Swal.fire({
                title: 'Success!',
                text: `Packing has been ${editData ? 'updated' : 'added'} successfully.`,
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            console.error('An error occurred', error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while processing your request.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                <div className={styles.ledgerHead}>
                    {editData ? 'Edit Packing' : 'Add Packing'}
                </div>

                <div className='mt-10' style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, marginRight: '10px' }}>
                        <InputWithTitle
                            title="Packing Weight"
                            type="text"
                            placeholder="Packing Weight"
                            name="packing_size"
                            value={formData.packing_size}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className='mt-5' style={{ display: 'flex', justifyContent: 'space-between' }}>

                    <div style={{ flex: 1, marginRight: '10px' }}>
                        <div className={styles.editBtn} onClick={handleClose}>
                            Cancel
                        </div>
                    </div>
                    <div style={{ flex: 1, marginRight: '10px' }}>
                        <div className={styles.saveBtn} onClick={handleSubmit}>
                            {sendingData ? (
                                <CircularProgress color="inherit" size={20} />
                            ) : editData ? (
                                "Update"
                            ) : (
                                "Save"
                            )}
                        </div>
                    </div>

                </div>
            </Box>
        </Modal>
    );
};

export default AddPacking;
