// AddProduct.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Box } from '@mui/material';
import styles from "../../styles/product.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import MultilineInput from "../../components/generic/MultilineInput";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
};

const AddProduct = ({ open, handleClose, editData = null }) => {
    const [formData, setFormData] = useState({
        product_name: '',
        product_description: ''
    });

    useEffect(() => {
        if (editData) {
            setFormData(editData);
        } else {
            // Reset form when adding new product
            setFormData({
                product_name: '',
                product_description: ''
            });
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
                ? `https://backend-ghulambari.worldcitizenconsultants.com/api/product/${editData.id}`
                : 'https://backend-ghulambari.worldcitizenconsultants.com/api/product';

            const method = editData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: data
            });

            if (response.ok) {
                console.log(editData ? 'Product updated successfully' : 'Product added successfully');
                handleClose();
            } else {
                console.error(editData ? 'Product update failed' : 'Product addition failed');
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
                <div className={styles.ledgerHead}>
                    {editData ? 'Edit Product' : 'Add Product'}
                </div>

                <div className='mt-10'>
                    <InputWithTitle
                        title="Product Name"
                        type="text"
                        placeholder="Product Name"
                        name="product_name"
                        value={formData.product_name}
                        onChange={handleInputChange}
                    />
                </div>

                <div className='mt-10'>
                    <MultilineInput
                        title="Description"
                        placeholder="Description"
                        name="product_description"
                        value={formData.product_description}
                        onChange={handleInputChange}
                    />
                </div>

                <div className='mt-5' style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, marginRight: '10px' }}>
                        <div className={styles.saveBtn} onClick={handleSubmit}>
                            {editData ? 'Update' : 'Save'}
                        </div>
                    </div>
                    <div style={{ flex: 1, marginLeft: '10px' }}>
                        <div className={styles.editBtn} onClick={handleClose}>
                            Cancel
                        </div>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default AddProduct;