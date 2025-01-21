"use client";

import React, { useState, useEffect } from "react";
import { Modal, Box, CircularProgress } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import styles from "../../styles/ledger.module.css";
import InputWithTitle from "../generic/InputWithTitle";
import MultilineInput from "../generic/MultilineInput";
import { investors } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import Swal from "sweetalert2";

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

const top100Films = [{ label: "Self" }];

const AddInvestor = ({ open, handleClose, editData = null }) => {
  const [loading, setLoading] = useState(false);
  const api = new APICall();

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
        reference_id: "self",
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

    if (!formData.person_name.trim()) {
      alert("please enter investor name");
      return;
    } else if (!formData.contact.trim()) {
      alert("please enter investor contact");
      return;
    } else if (!formData.contact.trim()) {
      alert("please enter investor contact");
      return;
    } else if (!formData.firm_name.trim()) {
      alert("please enter investor firm_name");
      return;
    } else if (!formData.opening_balance.trim()) {
      alert("please enter investor opening_balance");
      return;
    }

    const data = new FormData();

    const fieldsToInclude = [
      "person_name",
      "contact",
      "address",
      "firm_name",
      "opening_balance",
      "description",
    ];

    fieldsToInclude.forEach((key) => {
      data.append(key, formData[key]);
    });

    setLoading(true); // Start loader

    try {
      const url = editData ? `${investors}/${editData.id}` : investors;

      const response = await api.postFormDataWithToken(url, formData);

      handleClose();
      alert("data Added!");
    } catch (error) {
      console.error("An error occurred", error);
      alert("An error occurred while processing your request.");
    } finally {
      setLoading(false);
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
          {editData ? "Edit Investor" : "Add Investor"}
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

          <div style={{ flex: 1 }}>
            <div className={styles.saveBtn} onClick={handleSubmit}>
              {loading ? (
                <CircularProgress color="inherit" size={24} />
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

export default AddInvestor;
