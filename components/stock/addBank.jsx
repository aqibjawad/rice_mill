"use client";

import React, { useState, useEffect } from "react";
import { Modal, Box, Grid, CircularProgress } from "@mui/material";
import styles from "../../styles/paymentss.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import { banks as banksApi } from "../../networkApi/Constants";

import APICall from "../../networkApi/APICall";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 600 },
  height: { xs: "90%", sm: "auto" },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflow: { xs: "auto", sm: "initial" },
  outline: "none",
};

export const AddBank = ({
  openBank,
  handleCloseBank,
  editData = null,
  onBankUpdated,
}) => {
  const api = new APICall();

  const [formData, setFormData] = useState({ bank_name: "" });
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({ bank_name: "" });
    }
  }, [editData]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.getDataWithToken(banksApi);
      const data = response.data;
      if (Array.isArray(data)) {
        setTableData(data);
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bank_name.trim()) {
      alert("Please enter a bank name.");
      return;
    }

    setLoading(true); // Start loading

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const url = editData ? `${banksApi}/${editData.id}` : banksApi;

      await api.postFormDataWithToken(url, formData);
      alert("Bank saved successfully!");
      handleCloseBank(); // Close the modal
      if (onBankUpdated) onBankUpdated(); // Callback to refresh parent data
    } catch (error) {
      console.error("An error occurred", error);
      alert("An error occurred while saving the bank.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Modal
      open={openBank}
      onClose={handleCloseBank}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <div className={styles.logocontainer}>
          <img className={styles.logo} src="/logo.png" alt="Logo" />
        </div>

        <div
          className={styles.ledgerHead}
          style={{ fontSize: "1.5rem", padding: "1rem" }}
        >
          {editData ? "Edit Packing" : "Add Bank"}
        </div>

        <div
          style={{
            height: { xs: "calc(100% - 72px)", sm: "auto" },
            overflowY: { xs: "auto", sm: "initial" },
          }}
        >
          <Grid container spacing={2} className="mt-10">
            <Grid item lg={12} xs={12} sm={12}>
              <InputWithTitle
                title="Add Bank Name"
                type="text"
                placeholder="Add Bank Name"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleInputChange}
              />

              <div
                style={{ marginTop: "1rem", cursor:"pointer" }}
                className={styles.saveBtn}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : editData ? (
                  "Update"
                ) : (
                  "Save"
                )}
              </div>
            </Grid>
          </Grid>
        </div>
      </Box>
    </Modal>
  );
};
