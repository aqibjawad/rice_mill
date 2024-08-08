"use client";
import { Box, Modal, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { packings, products } from "@/networkApi/Constants";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import APICall from "../../networkApi/APICall";
import InputWithTitle from "../generic/InputWithTitle";
import PrimaryButton from "../generic/PrimaryButton";

const AddItemToStock = ({ open, handleClose }) => {
  const [allProducts, setAllproducts] = useState();
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [selectedProductID, setSelectedProductID] = useState();

  // packing
  const [allPackings, setAllPackings] = useState();
  const [fetchingPackings, setFetchPackings] = useState(false);
  const [allPackingsList, setAllPackingsList] = useState([]);

  const api = new APICall();
  useEffect(() => {
    if (open) {
      fetchProducts();
      fetchPacking();
    }
  }, [open]);

  const fetchProducts = async () => {
    setFetchingProducts(true);
    const response = await api.getDataWithToken(products);
    setAllproducts(response.data);
    var list = [];
    response.data.map((item, index) => {
      list.push({
        label: item.product_name,
        index: index,
        id: item.id,
      });
    });
    setProductsList(list);
    setFetchingProducts(false);
  };

  const fetchPacking = async () => {
    setFetchPackings(true);
    const response = await api.getDataWithToken(packings);

    var list = [];
    response.data.map((item, index) => {
      list.push({
        label: item.packing_size + " " + item.packing_unit,
        index: index,
        id: item.id,
      });

      setAllPackingsList(list);
      setFetchPackings(false);
    });
  };

  const handleReferenceChange = (event, option) => {
    setSelectedProductID(option.id);
  };

  const addItem = async () => {};

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2, // added this line
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
              id="combo-box-demo"
              options={productsList}
              renderInput={(params) => (
                <TextField {...params} label="Select Product" />
              )}
              onChange={handleReferenceChange}
            />
          )}
        </div>
        <div className="mb-5">
          {fetchingPackings ? (
            <Skeleton height={70} />
          ) : (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={allPackingsList}
              renderInput={(params) => (
                <TextField {...params} label="Select Packing" />
              )}
              onChange={handleReferenceChange}
            />
          )}
        </div>
        <InputWithTitle
          title={"Add Quantity"}
          placeholder="Add Quantity"
          type="text"
        />
        <div className="mt-10">
          <PrimaryButton onClick={() => addItem()} title={"Add Quantity"} />
        </div>
      </Box>
    </Modal>
  );
};

export default AddItemToStock;
