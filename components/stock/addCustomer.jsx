// AddCustomer.jsx

"use client";
import React, { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import styles from "../../styles/ledger.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import MultilineInput from "../../components/generic/MultilineInput";

import { customers } from "../../networkApi/Constants";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 10,
  p: 4,
};

const top100Films = [{ label: "Self" }];

const AddCustomer = ({ open, handleClose, editData = null }) => {
  const [formData, setFormData] = useState({
    person_name: "",
    reference_id: "",
    contact: "",
    address: "",
    firm_name: "",
    opening_balance: "",
    description: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleReferenceChange = (event, value) => {
    setFormData((prevState) => ({
      ...prevState,
      reference_id: value ? value.label : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const url = customers;

      const method = editData ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        body: data,
      });

      if (response.ok) {
        console.log(
          editData
            ? "Entry updated successfully"
            : "Form submitted successfully"
        );
        handleClose();
      } else {
        console.error(
          editData ? "Entry update failed" : "Form submission failed"
        );
      }
    } catch (error) {
      console.error("An error occurred", error);
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
          {editData ? "Edit Customer" : "Add Customer"}
        </div>

        <div
          className="mt-10"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div style={{ flex: 1, marginRight: "10px" }}>
            <InputWithTitle
              title="Name"
              type="text"
              placeholder="Name"
              name="person_name"
              value={formData.person_name}
              onChange={handleInputChange}
            />
          </div>
          <div style={{ flex: 1, marginLeft: "10px" }}>
            <InputWithTitle
              title="Contact"
              type="text"
              placeholder="Contact"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div
          className="mt-10"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div style={{ flex: 1, marginRight: "10px" }}>
            <InputWithTitle
              title="Address"
              type="text"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div style={{ flex: 1, marginLeft: "10px" }}>
            <InputWithTitle
              title="Firm Name"
              type="text"
              placeholder="Firm Name"
              name="firm_name"
              value={formData.firm_name}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div
          className="mt-10"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div style={{ flex: 1, marginLeft: "10px" }}>
            <InputWithTitle
              title="Opening Balance"
              type="text"
              placeholder="Opening Balance"
              name="opening_balance"
              value={formData.opening_balance}
              onChange={handleInputChange}
            />
          </div>

          <div className="mt-4" style={{ flex: 1, marginLeft: "10px" }}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={top100Films}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Reference" />
              )}
              onChange={handleReferenceChange}
              value={formData.reference_id}
            />
          </div>
        </div>

        <div className="mt-10">
          <MultilineInput
            title="Description"
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <div
          className="mt-5"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div style={{ flex: 1, marginRight: "10px" }}>
            <div className={styles.saveBtn} onClick={handleSubmit}>
              {editData ? "Update" : "Save"}
            </div>
          </div>
          <div style={{ flex: 1, marginLeft: "10px" }}>
            <div className={styles.editBtn} onClick={handleClose}>
              Cancel
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AddCustomer;
