import React, { useState, useEffect } from 'react';
import { Modal, Box } from '@mui/material';

import styles from "../../styles/paymentss.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";

import {banks} from "../../networkApi/Constants"

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

const AddPacking = ({ open: isOpen, handleClose: onClose, editData = null }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [formData, setFormData] = useState({
        bank_name: '',
    });

    useEffect(() => {
        if (editData) {
            setFormData(editData);
        } else {
            setFormData({ bank_name: '' });
        }
    }, [editData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target; // Destructure `name` and `value` from e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value // Use `name` as the key in formData
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const url = banks;

            const method = editData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: data
            });

            if (response.ok) {
                console.log(editData ? 'Entry updated successfully' : 'Form submitted successfully');
                handleClose();
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
                    <img className={styles.logo} src="/logo.png" />
                </div>

                <div className={styles.ledgerHead}> 
                    {editData ? 'Edit Packing' : 'Add Bank'}
                </div>

                <div className='mt-10' style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, marginRight: '10px' }}>
                        <InputWithTitle
                            title="Add Bank Name"
                            type="text"
                            placeholder="Add Bank Name"
                            name="bank_name"
                            value={formData.bank_name}
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

export default AddPacking;