"use client";
import React, { useEffect, useState } from "react";

import { Box, Modal, Skeleton, Typography } from "@mui/material";

import { packings, products, stocks } from "@/networkApi/Constants";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import APICall from "../../networkApi/APICall";

import InputWithTitle from "../generic/InputWithTitle";
import PrimaryButton from "../generic/PrimaryButton";
import MultilineInput from "../generic/MultilineInput";

const AddItemToStock = ({ open, handleClose }) => {
  const [allProducts, setAllproducts] = useState([]);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [selectedProductID, setSelectedProductID] = useState([]);

  const [allPackings, setAllPackings] = useState([]);
  const [fetchingPackings, setFetchPackings] = useState(false);
  const [allPackingsList, setAllPackingsList] = useState([]);
  const [selectedPackingID, setSelectedPackingID] = useState([]);

  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const api = new APICall();

  useEffect(() => {
    if (open) {
      fetchProducts();
      fetchPacking();
    }
  }, [open]);

  const fetchProducts = async () => {
    setFetchingProducts(true);
    try {
      const response = await api.getDataWithToken(products);
      setAllproducts(response.data);
      const list = response.data.map((item, index) => ({
        label: item.product_name,
        index: index,
        id: item.id,
      }));
      setProductsList(list);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again.");
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
    if (selectedProductID.length === 0) {
      setError("Please select a product.");
      return false;
    }
    if (selectedPackingID.length === 0) {
      setError("Please select a packing.");
      return false;
    }
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

  const addItem = async () => {
    if (!validateInputs()) return;
  
    setIsLoading(true);
    setError('');
  
    try {
      const data = {
        "product_id[0]": selectedProductID,
        "packing_id[0]": selectedPackingID[0],
        "product_description[0]": [description.trim()],
        quantity: parseInt(quantity),
        price: parseFloat(price)
      };
  
      const response = await api.postDataWithToken(stocks, data);
  
      if (response.status === 201) {
        handleClose();
      }
    } catch (error) {
      console.error('Error adding item:', error);
      setError('An error occurred while adding the item. Please try again.');
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
          {fetchingProducts ? (
            <Skeleton height={70} />
          ) : (
            <Autocomplete
              disablePortal
              id="product-select"
              options={productsList}
              renderInput={(params) => (
                <TextField {...params} label="Select Product" />
              )}
              onChange={handleProductChange}
            />
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
        <div className="mt-10">
          <PrimaryButton
            onClick={addItem}
            title={"Add Item"}
            disabled={isLoading}
          />
        </div>
      </Box>
    </Modal>
  );
};

export default AddItemToStock;