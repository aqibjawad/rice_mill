// AddProduct.jsx
"use client";
import React, { useState, useEffect } from "react";
import { Modal, Box, CircularProgress } from "@mui/material";
import styles from "../../styles/product.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import MultilineInput from "../../components/generic/MultilineInput";
import APICall from "@/networkApi/APICall";
import { products } from "../../networkApi/Constants";
import { showErrorAlert } from "@/networkApi/Helper";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
  outline: "none",
};

const AddProduct = ({ open, handleClose, editData = null }) => {
  const api = new APICall();
  const [sendingData, setSendingData] = useState(false);
  const [formData, setFormData] = useState({
    product_name: "",
    product_description: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      // Reset form when adding new product
      setFormData({
        product_name: "",
        product_description: "",
        product_type: "paddy",
      });
    }
  }, [editData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (formData.product_name === "") {
      alert("Please select a product Name");
    } else if (formData.product_description === "") {
      alert("Please Write any Description");
    } else {
      try {
        setSendingData(true);
        const response = await api.postFormDataWithToken(products, formData);
        setSendingData(false);
        console.log(
          editData
            ? "Product updated successfully"
            : "Product added successfully"
        );
        handleClose();
      } catch (error) {
        console.error("An error occurred", error);
      }
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
          {editData ? "Edit Product" : "Add Product"}
        </div>

        <div className="mt-10">
          <InputWithTitle
            title="Product Name"
            type="text"
            placeholder="Product Name"
            name="product_name"
            value={formData.product_name}
            onChange={handleInputChange}
            required={true}
          />
        </div>

        <div className="mt-10">
          <MultilineInput
            title="Description"
            placeholder="Description"
            name="product_description"
            value={formData.product_description}
            onChange={handleInputChange}
            required={true}
          />
        </div>

        <div
          className="mt-5"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div style={{ flex: 1, marginRight: "10px" }}>
            <div className={styles.saveBtn} onClick={handleClose}>
              Cancel
            </div>
          </div>
          <div style={{ flex: 1, marginLeft: "10px" }}>
            <div className={styles.editBtn} onClick={handleSubmit}>
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

export default AddProduct;
