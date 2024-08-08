import React, { useState, useEffect } from 'react';
import { Modal, Box, Grid, Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import styles from "../../styles/ledger.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import MultilineInput from "../../components/generic/MultilineInput";

import { customers } from "../../networkApi/Constants"

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
    outline:"none"
};

const top100Films = [
    { label: 'Self' },
];

const AddLedgerEntry = ({ open, handleClose, editData = null }) => {
    const [formData, setFormData] = useState({
        person_name: '',
        reference_id: '',
        contact: '',
        address: '',
        firm_name: '',
        opening_balance: '',
        description: ''
    });

    useEffect(() => {
        if (editData) {
            setFormData(editData);
        }
    }, [editData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleReferenceChange = (event, value) => {
        setFormData(prevState => ({
            ...prevState,
            reference_id: value ? value.label : ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const url = customers

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
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                <div className={styles.ledgerHead} style={{ fontSize: '1.5rem', padding: '1rem' }}>
                    {editData ? 'Edit Customer' : 'Add Customer'}
                </div>

                <Grid container spacing={2} className="mt-10">
                    <Grid item xs={12} sm={6}>
                        <InputWithTitle
                            title="Name"
                            type="text"
                            placeholder="Name"
                            name="person_name"
                            value={formData.person_name}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputWithTitle
                            title="Contact"
                            type="text"
                            placeholder="Contact"
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2} className="mt-10">
                    <Grid item xs={12} sm={6}>
                        <InputWithTitle
                            title="Address"
                            type="text"
                            placeholder="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputWithTitle
                            title="Firm Name"
                            type="text"
                            placeholder="Firm Name"
                            name="firm_name"
                            value={formData.firm_name}
                            onChange={handleInputChange}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2} className="mt-10">
                    <Grid item xs={12} sm={6}>
                        <InputWithTitle
                            title="Opening Balance"
                            type="text"
                            placeholder="Opening Balance"
                            name="opening_balance"
                            value={formData.opening_balance}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={top100Films}
                            sx={{ width: '100%' }}
                            renderInput={(params) => <TextField {...params} label="Reference" />}
                            onChange={handleReferenceChange}
                            value={formData.reference_id}
                        />
                    </Grid>
                </Grid>

                <div className='mt-10'>
                    <MultilineInput
                        title="Description"
                        placeholder="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </div>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} className="mt-5">
                    <div className={styles.saveBtn} onClick={handleSubmit}>
                        {editData ? 'Update' : 'Save'}
                    </div>
                    <div className={styles.editBtn} onClick={handleClose}>
                        Cancel
                    </div>
                </Stack>
            </Box>
        </Modal>
    );
};

export default AddLedgerEntry;