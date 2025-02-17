import React, { useState, useEffect } from "react";
import { Modal, Box, CircularProgress, Grid } from "@mui/material";
import styles from "../../styles/product.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import MultilineInput from "../../components/generic/MultilineInput";
import APICall from "@/networkApi/APICall";
import { products } from "../../networkApi/Constants";
import Swal from "sweetalert2";
import DropDown from "../generic/dropdown";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%", // Make modal width responsive
  maxWidth: "600px", // Max width for larger screens
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 10,
  p: 4,
  outline: "none",
  "@media (max-width: 600px)": {
    width: "100%", // Full width for very small screens
    padding: "16px", // Smaller padding on small screens
  },
};

const AddProduct = ({ open, handleClose, editData = null }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState(""); // State for storing response message

  const api = new APICall();
  const [formData, setFormData] = useState({
    product_name: "",
    product_description: "",
    product_type: "",
    opening_weight: "",
    opening_price: "",
    opening_price_mann: "",
    opening_total_amount: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({
        product_name: "",
        product_description: "",
        product_type: "",
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

  const handleDropDownChange = (name, selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await api.postDataWithToken(products, formData);

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data has been added successfully!",
        });
        handleClose();
        // router.back();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `${response?.error?.message}`,
        });
        handleClose();
      }
    } finally {
      setIsSubmitting(false);
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

        <Grid container spacing={2} className="mt-10">
          <Grid item xs={12}>
            <InputWithTitle
              title="Product Name"
              type="text"
              placeholder="Product Name"
              name="product_name"
              value={formData.product_name}
              onChange={handleInputChange}
              required={true}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputWithTitle
              title="Opening Weight"
              type="text"
              placeholder="Opening Weight"
              name="opening_weight"
              value={formData.opening_weight}
              onChange={handleInputChange}
              required={true}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputWithTitle
              title="Price in Kgs"
              type="text"
              placeholder="Price in Kgs"
              name="opening_price"
              value={formData.opening_price}
              onChange={handleInputChange}
              required={true}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputWithTitle
              title="Price in Munds"
              type="text"
              placeholder="Price in Munds"
              name="opening_price_mann"
              value={formData.opening_price_mann}
              onChange={handleInputChange}
              required={true}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputWithTitle
              title="Total Amount"
              type="text"
              placeholder="Total Amount"
              name="opening_total_amount"
              value={formData.opening_total_amount}
              onChange={handleInputChange}
              required={true}
            />
          </Grid>

          <Grid item xs={12}>
            <MultilineInput
              title="Description"
              placeholder="Description"
              name="product_description"
              value={formData.product_description}
              onChange={handleInputChange}
              required={true}
            />
          </Grid>

          {/* Uncomment if needed */}
          {/* <Grid item xs={12}>
        <DropDown
          title="Select Product Type"
          options={typeList}
          name="product_type"
          value={formData.product_type}
          onChange={handleDropDownChange}
        />
      </Grid> */}

          <Grid item xs={12} container spacing={2}>
            <Grid item xs={6}>
              <div className={styles.cancelBtn} onClick={handleClose}>
                Cancel
              </div>
            </Grid>
            <Grid item xs={6}>
              <button
                className={styles.saveBtn}
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : editData ? (
                  "Update"
                ) : (
                  "Save"
                )}
              </button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default AddProduct;
