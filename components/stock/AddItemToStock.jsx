"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Skeleton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { packings, products, stocks } from "@/networkApi/Constants";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import APICall from "../../networkApi/APICall";
import InputWithTitle from "../generic/InputWithTitle";
import MultilineInput from "../generic/MultilineInput";
import Swal from "sweetalert2";
import styles from "../../styles/paymentss.module.css";

import DropDown from "@/components/generic/dropdown";

const AddItemToStock = ({ open, handleClose, editingData, onItemUpdated }) => {

  const [fetchingProducts, setFetchingProducts] = useState(false);

  const [productsList, setProductsList] = useState([]);
  const [selectedProductID, setSelectedProductID] = useState([]);
  const [fetchingPackings, setFetchPackings] = useState(false);
  const [allPackingsList, setAllPackingsList] = useState([]);
  const [selectedPackingID, setSelectedPackingID] = useState([]);

  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const api = new APICall();

  useEffect(() => {
    if (open) {
      fetchProducts();
      fetchPacking();
      if (editingData) {
        setSelectedProductID([editingData.product_id]);
        setSelectedPackingID([editingData.packing_id]);
        setDescription(editingData.product_description);
        setQuantity(editingData.quantity.toString());
        setPrice(editingData.price.toString());
      } else {
        resetForm();
      }
    }
  }, [open, editingData]);

  const resetForm = () => {
    setSelectedProductID([]);
    setSelectedPackingID([]);
    setDescription("");
    setQuantity("");
    setPrice("");
  };

  // const fetchProducts = async () => {
  //   try {
  //     setFetchingProducts(true);

  //     const response = await api.getDataWithToken(
  //       `${products}?product_type=other`
  //     );
  //     const filteredProducts = response.data;
  //     setProductsList(filteredProducts);
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //     setError("Failed to fetch products. Please try again.");
  //   } finally {
  //     setFetchingProducts(false);
  //   }
  // };

  const fetchProducts = async () => {
    try {
      const response = await api.getDataWithToken(
        `${products}?product_type=other`
      );
      const data = response.data;
      if (Array.isArray(data)) {
        const formattedData = data.map((product) => ({
          label: product.product_name,
          id: product.id,
        }));
        setProductsList(formattedData);
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setFetchingProducts(false);
    }
  };

  const fetchPacking = async () => {
    setFetchPackings(true);
    try {
      const response = await api.getDataWithToken(packings);
      const list = response.data.map((item, index) => ({
        label: `${item.packing_size} ${item.packing_unit}`,
        index: index,
        id: item.id,
      }));
      setAllPackingsList(list);
    } catch (error) {
      console.error("Error fetching packings:", error);
      setError("Failed to fetch packings. Please try again.");
    } finally {
      setFetchPackings(false);
    }
  };

  const handleProductChange = (event, option) => {
    setSelectedProductID(option?.id ? [option.id] : []);
  };

  const handlePackingChange = (event, option) => {
    setSelectedPackingID(option?.id ? [option.id] : []);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  const handlePriceChange = (event) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  };

  const validateInputs = () => {
    // if (selectedProductID.length === 0) {
    //   setError("Please select a product.");
    //   return false;
    // }
    // if (selectedPackingID.length === 0) {
    //   setError("Please select a packing.");
    //   return false;
    // }
    if (!description.trim()) {
      setError("Please enter a description.");
      return false;
    }
    if (!quantity || parseInt(quantity) <= 0) {
      setError("Please enter a valid quantity.");
      return false;
    }
    if (!price || parseFloat(price) <= 0) {
      setError("Please enter a valid price.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    setError("");
    setIsSubmitting(true);

    try {
      let data;
      if (editingData) {
        data = {
          "product_id[0]": selectedProductID,
          "packing_id[0]": selectedPackingID,
          product_description: description.trim(),
          quantity: parseInt(quantity),
          price: parseFloat(price),
        };
      } else {
        data = {
          "product_id[0]": selectedProductID,
          "packing_id[0]": selectedPackingID,
          "product_description[0]": description.trim(),
          "quantity[0]": parseInt(quantity),
          "price[0]": parseFloat(price),
        };
      }

      let response;
      if (editingData) {
        response = await api.updateFormDataWithToken(
          `${stocks}/${editingData.id}`,
          data
        );
      } else {
        response = await api.postFormDataWithToken(stocks, data);
      }

      Swal.fire({
        title: "Success!",
        text: editingData
          ? "Item updated successfully."
          : "Item added to stock successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      handleClose();
      if (onItemUpdated) {
        onItemUpdated();
      }
    } catch (error) {
      console.error("Error submitting item:", error);
      setError("An error occurred. Please try again.");

      Swal.fire({
        title: "Error!",
        text: editingData
          ? "Failed to update item."
          : "Failed to add item to stock.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
    outline: "none",
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <div className="mb-10">
          <div className={styles.logocontainer}>
            <img className={styles.logo} src="/logo.png" alt="Logo" />
          </div>

          <div
            className={styles.ledgerHead}
            style={{ fontSize: "1.5rem", padding: "1rem" }}
          >
            {editingData ? "Update Item In Stock" : "Add Item In Stock"}
          </div>
          {fetchingProducts ? (
            <Skeleton height={70} />
          ) : (
            <>
              <DropDown
                title="Select Products"
                options={productsList}
                onChange={handleProductChange}
                value={
                  productsList.find(
                    (item) => item.id === selectedProductID[0]
                  ) || null
                }
                // value={formData.productsList}
                name="productsList"
              />
            </>
          )}
        </div>
        <div className="mb-5">
          {fetchingPackings ? (
            <Skeleton height={70} />
          ) : (
            <Autocomplete
              disablePortal
              id="packing-select"
              options={allPackingsList}
              value={
                allPackingsList.find(
                  (item) => item.id === selectedPackingID[0]
                ) || null
              }
              renderInput={(params) => (
                <TextField {...params} label="Select Packing" />
              )}
              onChange={handlePackingChange}
            />
          )}
        </div>

        <div className="mb-5">
          <MultilineInput
            title={"Add Product Description"}
            placeholder="Add Product Description"
            type="text"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
        <InputWithTitle
          title={"Add Quantity"}
          placeholder="Add Quantity"
          type="text"
          value={quantity}
          onChange={handleQuantityChange}
        />

        <div className="mt-5">
          <InputWithTitle
            title={"Add Price"}
            placeholder="Add Price"
            type="text"
            value={price}
            onChange={handlePriceChange}
          />
        </div>
        {error && (
          <Typography color="error" className="mt-3">
            {error}
          </Typography>
        )}
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
            ) : (
              "Save"
            )}
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default AddItemToStock;
