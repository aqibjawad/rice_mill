"use client";

import React, { useState, useEffect } from "react";
import { Modal, Box, CircularProgress } from "@mui/material";
import styles from "../../styles/paymentss.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import { expenseCat, seasons } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import DropDown3 from "@/components/generic/dropdown3";

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

const AddExpense = ({ openExpense, handleCloseExpense, editData = null }) => {
  const api = new APICall();

  // Fixed formData initialization with proper fields
  const [formData, setFormData] = useState({
    expense_category: "",
    opening_expense: "", // Added opening_expense field
    season_id: "",
  });

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seasonsList, setSeasons] = useState([]);
  const [loadingSeasons, setLoadingSeasons] = useState(false); // Added missing state
  const [dropdownValues, setDropdownValues] = useState({ season_id: null }); // Added missing state
  const [selectedSeasonName, setSelectedSeasonName] = useState(""); // Added missing state
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        expense_category: editData.expense_category || "",
        opening_expense: editData.opening_expense || "",
        season_id: editData.season_id || "",
      });
    } else {
      setFormData({
        expense_category: "",
        opening_expense: "",
        season_id: "",
      });
    }
  }, [editData]);

  useEffect(() => {
    fetchData();
    fetchSeasons(); // Added call to fetch seasons
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.getDataWithToken(expenseCat); // Fixed: was 'expense', should be 'expenseCat'
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

  const fetchSeasons = async () => {
    try {
      setLoadingSeasons(true);
      const response = await api.getDataWithToken(seasons);
      const filteredProducts = response.data.map((item, index) => ({
        label: item.name,
        index: index,
        id: item.id,
      }));
      setSeasons(filteredProducts);

      // Auto-select the last season
      if (filteredProducts.length > 0) {
        const lastSeason = filteredProducts[filteredProducts.length - 1];
        setDropdownValues((prev) => ({
          ...prev,
          season_id: lastSeason,
        }));
        setFormData((prev) => ({
          ...prev,
          season_id: lastSeason.id,
        }));
        setSelectedSeasonName(lastSeason.label);
      }
    } catch (error) {
      console.error("Error fetching seasons:", error);
      setError("Failed to fetch seasons. Please try again.");
    } finally {
      setLoadingSeasons(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Added missing dropdown change handler
  const handleDropdownChange = (name, value) => {
    setDropdownValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormData((prev) => ({
      ...prev,
      [name]: value ? value.id : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.expense_category.trim()) {
      alert("Please enter an expense category.");
      return;
    }

    if (!formData.season_id) {
      alert("Please select a season.");
      return;
    }

    setIsSubmitting(true); // Start submitting

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const url = editData ? `${expenseCat}/${editData.id}` : expenseCat;

      const response = await api.postFormDataWithToken(url, formData);
      alert("Expense saved successfully!");
      fetchData(); // Refresh the table data
      handleCloseExpense();
    } catch (error) {
      console.error("An error occurred", error);
      alert("An error occurred while saving the expense.");
    } finally {
      setIsSubmitting(false); // End submitting
    }
  };

  return (
    <Modal
      open={openExpense}
      onClose={handleCloseExpense}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <div className={styles.logocontainer}>
          <img className={styles.logo} src="/logo.png" alt="Logo" />
        </div>

        <div className={styles.ledgerHead}>
          {editData ? "Edit Expense" : "Add Expense"}
        </div>

        <div className="mt-10">
          {/* First Row - All three fields in one row */}
          <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
            <div style={{ flex: 1 }}>
              <InputWithTitle
                title="Expense Category"
                type="text"
                placeholder="Add Expense Category"
                name="expense_category"
                value={formData.expense_category}
                onChange={handleInputChange}
              />
            </div>

            <div style={{ flex: 1 }}>
              <InputWithTitle
                title=" Opening Balance"
                type="number"
                placeholder="Add Opening Balance"
                name="opening_expense"
                value={formData.opening_expense}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <DropDown3
              title="Select Season"
              options={seasonsList}
              onChange={handleDropdownChange}
              value={dropdownValues.season_id}
              name="season_id"
            />
          </div>

          {/* Button Row */}
          <div
            className="mt-5"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div style={{ width: "200px" }}>
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
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AddExpense;
