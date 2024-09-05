import React, { useState, useEffect } from "react";
import { Modal, Box, CircularProgress } from "@mui/material";
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
  width: 600,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
  outline: "none",
};

const AddProduct = ({ open, handleClose, editData = null }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState(""); // State for storing response message

  const api = new APICall();
  const [formData, setFormData] = useState({
    product_name: "",
    product_description: "",
    product_type: "",
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   const data = new FormData();
  //   for (const key in formData) {
  //     data.append(key, formData[key]);
  //   }

  //   try {
  //     let response;
  //     if (editData) {
  //       const url = `${products}/${editData.id}`;
  //       response = await api.updateFormDataWithToken(url, formData);
  //     } else {
  //       const url = products;
  //       response = await api.postFormDataWithToken(url, formData);
  //       console.log(response);

  //     }

  //     setResponseMessage(
  //       response.data.message || "Product has been successfully saved."
  //     );
  //     handleClose(); // Close modal after success
  //   } catch (error) {
  //     console.error("An error occurred", error);

  //     // Extract error message from the response
  //     const errorMessage =
  //       error.error?.message ;

  //       console.log(errorMessage);

  //     // Save the error message in state for later use
  //     setResponseMessage(errorMessage);

  //     Swal.fire({
  //       title: "Error!",
  //       text: errorMessage === "The product name has already been taken.",
  //       icon: "error",
  //       confirmButtonText: "OK",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

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
        // router.push("/purchase/");
      } else {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "The product name has already been taken",
        });
        handleClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeList = [
    { label: "Sale", value: "other" },
    { label: "Purchase", value: "paddy" },
  ];

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

        {/* <div className="mt-10">
          <DropDown
            title="Select Product Type"
            options={typeList}
            name="product_type"
            value={formData.product_type}
            onChange={handleDropDownChange}
          />
        </div> */}

        <div
          className="mt-5"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div style={{ flex: 1, marginRight: "10px" }}>
            <div className={styles.cancelBtn} onClick={handleClose}>
              Cancel
            </div>
          </div>
          <div style={{ flex: 1, marginRight: "10px" }}>
            <button
              className={styles.saveBtn}
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AddProduct;
