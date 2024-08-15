"use client";

import React, { useState, useEffect } from "react";
import { Modal, Box, CircularProgress } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import styles from "../../styles/ledger.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import MultilineInput from "../../components/generic/MultilineInput";
import APICall from "@/networkApi/APICall";
import { buyer } from "../../networkApi/Constants";
import { showErrorAlert } from "@/networkApi/Helper";

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
  outline: "none",
};

const top100Films = [{ label: "Self" }];

const AddBuyer = ({ open, handleClose, editData = null }) => {
  const api = new APICall();
  const [sendingData, setSendingData] = useState(false);
  const [formData, setFormData] = useState({
    person_name: "",
    reference_id: "self",
    contact: "",
    address: "",
    firm_name: "",
    opening_balance: "",
    description: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        reference_id: "self", // Ensure reference_id is always "self"
      });
    } else {
      setFormData({
        person_name: "",
        reference_id: "self",
        contact: "",
        address: "",
        firm_name: "",
        opening_balance: "",
        description: "",
      });
    }
  }, [editData, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.person_name === "") {
      alert("Please enter a name");
    } else if (formData.contact === "") {
      alert("Please enter a contact");
    } else if (formData.address === "") {
      alert("Please enter Addres");
    } else if (formData.firm_name === "") {
      alert("Please enter Firm Name");
    } else if (formData.opening_balance === "") {
      alert("Please enter Opening Balance");
    } else {
      try {
        setSendingData(true);
        const url = editData ? `${buyer}/${editData.id}` : buyer;
        const response = await api.postDataWithToken(url, formData);
        console.log(
          editData
            ? "Entry updated successfully"
            : "Form submitted successfully"
        );
        handleClose();
        setSendingData(false);
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
          {editData ? "Edit buyer" : "Add buyer"}
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

          <div className="mt-5" style={{ flex: 1, marginLeft: "10px" }}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={top100Films}
              renderInput={(params) => (
                <TextField {...params} label="Reference" />
              )}
              value={{ label: "Self" }}
              disabled
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
            <div className={styles.editBtn} onClick={handleClose}>
              Cancel
            </div>
          </div>
          <div style={{ flex: 1, marginLeft: "10px" }}>
            <div className={styles.saveBtn} onClick={handleSubmit}>
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

export default AddBuyer;
