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
  width: "90%",
  maxWidth: "600px",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 10,
  p: 4,
  outline: "none",
  "@media (max-width: 600px)": {
    width: "100%",
    padding: "16px",
  },
};

const top100Films = [{ label: "Self" }];

const AddBuyer = ({ open, handleClose, editData = null }) => {
  const api = new APICall();
  const [sendingData, setSendingData] = useState(false);
  const [selectedTab, setSelectedTab] = useState("credit");

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
      // Determine initial tab based on opening balance sign
      const initialTab = editData.opening_balance.startsWith("-")
        ? "credit"
        : "debit";
      setSelectedTab(initialTab);

      setFormData({
        ...editData,
        // Remove negative sign if present for display
        opening_balance: editData.opening_balance.replace("-", ""),
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

    // Remove any non-numeric characters for opening_balance
    if (name === "opening_balance") {
      const numericValue = value.replace(/[^0-9.]/g, "");
      setFormData((prevState) => ({
        ...prevState,
        [name]: numericValue,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setFormData((prevState) => ({
      ...prevState,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (formData.person_name === "") {
      alert("Please enter a name");
    } else if (formData.contact === "") {
      alert("Please enter a contact");
    } else if (formData.address === "") {
      alert("Please enter an address");
    } else if (formData.firm_name === "") {
      alert("Please enter a firm name");
    } else if (formData.opening_balance === "") {
      alert("Please enter an opening balance");
    } else {
      try {
        setSendingData(true);

        // Prepare submission data with credit/debit logic
        const submissionData = {
          ...formData,
          // Add negative sign for credit, keep positive for debit
          opening_balance:
            selectedTab === "debit"
              ? `-${formData.opening_balance}`
              : formData.opening_balance,
        };

        const url = editData ? `${buyer}/${editData.id}` : buyer;
        const response = await api.postDataWithToken(url, submissionData);
        console.log(
          editData
            ? "Entry updated successfully"
            : "Form submitted successfully"
        );
        handleClose();
      } catch (error) {
        console.error("An error occurred", error);
        showErrorAlert(error);
      } finally {
        setSendingData(false);
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
          {/* Credit/Debit Tabs */}
          <div className="mt-8" style={{ flex: 1, marginRight: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <button
                className={`${styles.tabButton} ${
                  selectedTab === "credit" ? styles.activeTab : ""
                }`}
                onClick={() => handleTabChange("credit")}
              >
                Credit
              </button>
              <button
                className={`${styles.tabButton} ${
                  selectedTab === "debit" ? styles.activeTab : ""
                }`}
                onClick={() => handleTabChange("debit")}
              >
                Debit
              </button>
            </div>
          </div>

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
          <div style={{ flex: 1, marginRight: "10px", cursor: "pointer" }}>
            <div className={styles.editBtn} onClick={handleClose}>
              Cancel
            </div>
          </div>
          <div style={{ flex: 1, marginLeft: "10px", cursor: "pointer" }}>
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
