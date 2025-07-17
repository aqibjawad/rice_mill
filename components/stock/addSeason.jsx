"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Grid,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import styles from "../../styles/paymentss.module.css";
import InputWithTitle from "../generic/InputWithTitle";
import { seasons } from "../../networkApi/Constants";

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

export const AddSeason = ({
  openSeason,
  handleCloseSeason,
  editData = null,
  onSeasonUpdated,
}) => {
  const api = new APICall();

  const [formData, setFormData] = useState({
    name: "",
    startYear: "",
    endYear: "",
    description: "",
    sale_amount: "",
    purchase_amount: "",
    expense_amount: "",
  });
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate years array (current year to next 10 years)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i <= 10; i++) {
      years.push(currentYear + i);
    }
    return years;
  };

  const years = generateYears();

  useEffect(() => {
    if (editData) {
      // If editing, try to parse the name to get start and end years
      const nameStr = editData.name || "";
      const years = nameStr.split("-");
      setFormData({
        ...editData,
        startYear: years[0] || "",
        endYear: years[1] || "",
      });
    } else {
      setFormData({
        name: "",
        startYear: "",
        endYear: "",
        description: "",
        sale_amount: "",
        purchase_amount: "",
        expense_amount: "",
      });
    }
  }, [editData]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.getDataWithToken(seasons);
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

  // Generate end years based on start year
  const getEndYears = () => {
    if (!formData.startYear) return [];
    const startYear = parseInt(formData.startYear);
    const endYears = [];
    for (let i = startYear + 1; i <= startYear + 10; i++) {
      endYears.push(i);
    }
    return endYears;
  };

  const handleStartYearChange = (event) => {
    const startYear = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      startYear: startYear,
      endYear: "", // Reset end year when start year changes
      name: startYear, // Update name temporarily
    }));
  };

  const handleEndYearChange = (event) => {
    const endYear = event.target.value;
    const concatenatedName = `${formData.startYear}-${endYear}`;
    setFormData((prevState) => ({
      ...prevState,
      endYear: endYear,
      name: concatenatedName, // Concatenate start and end year
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.startYear || !formData.endYear) {
      alert("Please select both start and end year.");
      return;
    }

    setLoading(true); // Start loading

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const url = editData ? `${seasons}/${editData.id}` : seasons;

      await api.postFormDataWithToken(url, formData);
      alert("Season saved successfully!");
      handleCloseSeason(); // Close the modal
      if (onSeasonUpdated) onSeasonUpdated(); // Callback to refresh parent data
    } catch (error) {
      console.error("An error occurred", error);
      alert("An error occurred while saving the season.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Modal
      open={openSeason}
      onClose={handleCloseSeason}
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
          {editData ? "Edit Season" : "Add Season"}
        </div>

        <div
          style={{
            height: { xs: "calc(100% - 72px)", sm: "auto" },
            overflowY: { xs: "auto", sm: "initial" },
          }}
        >
          <Grid container spacing={2} className="mt-10">
            {/* Start Year Dropdown */}
            <Grid item lg={6} xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Start Year</InputLabel>
                <Select
                  name="startYear"
                  value={formData.startYear || ""}
                  onChange={handleStartYearChange}
                  label="Start Year"
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year.toString()}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* End Year Dropdown */}
            <Grid item lg={6} xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>End Year</InputLabel>
                <Select
                  name="endYear"
                  value={formData.endYear || ""}
                  onChange={handleEndYearChange}
                  label="End Year"
                  disabled={!formData.startYear}
                >
                  {formData.startYear &&
                    getEndYears().map((year) => (
                      <MenuItem key={year} value={year.toString()}>
                        {year}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Description Field */}
            <Grid item lg={12} xs={12} sm={12}>
              <InputWithTitle
                title="Description"
                type="text"
                placeholder="Enter description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Sale Amount Field */}
            <Grid item lg={4} xs={12} sm={4}>
              <InputWithTitle
                title="Sale Amount"
                type="number"
                placeholder="Enter sale amount"
                name="sale_amount"
                value={formData.sale_amount}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Purchase Amount Field */}
            <Grid item lg={4} xs={12} sm={4}>
              <InputWithTitle
                title="Purchase Amount"
                type="number"
                placeholder="Enter purchase amount"
                name="purchase_amount"
                value={formData.purchase_amount}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Expense Amount Field */}
            <Grid item lg={4} xs={12} sm={4}>
              <InputWithTitle
                title="Expense Amount"
                type="number"
                placeholder="Enter expense amount"
                name="expense_amount"
                value={formData.expense_amount}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item lg={12} xs={12} sm={12}>
              <div
                style={{ marginTop: "1rem", cursor: "pointer" }}
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
