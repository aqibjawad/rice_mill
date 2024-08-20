"use client";

import React, { useState, useEffect } from "react";
import { Modal, Box, CircularProgress } from "@mui/material";
import styles from "../../styles/paymentss.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import { expenseCat } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  outline: "none",
};

const AddExpense = ({ openExpense, handleCloseExpense, editData = null }) => {
  const api = new APICall();

  const [formData, setFormData] = useState({ expense_category: "" });
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false); 

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({ expense_category: "" });
    }
  }, [editData]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.getDataWithToken(expense);
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

    if (!formData.expense_category.trim()) {
      alert("Please enter an expense category.");
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
    } catch (error) {
      console.error("An error occurred", error);
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

        <div
          className="mt-10"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div style={{ flex: 1, marginRight: "10px" }}>
            <InputWithTitle
              title="Expense Category"
              type="text"
              placeholder="Add Expense Category"
              name="expense_category"
              value={formData.expense_category}
              onChange={handleInputChange}
            />

            <div
              className="mt-5"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
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
                  ) : editData ? (
                    "Update"
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, marginRight: "10px" }}>
            <div className={styles.bankList}>Expense Category List</div>

            <div className={styles.contentContainer}>
              <div className={styles.tableSection}>
                <>
                  <div className={styles.tableHeader}>
                    <div>Sr.</div>
                    <div>Name</div>
                    <div>Action</div>
                  </div>
                  <div className={styles.tableBody}>
                    {tableData.map((item, index) => (
                      <div key={item.id} className={styles.tableRowData}>
                        <div>{index + 1}</div>
                        <div>{item.expense_category}</div>
                        <div>
                          {/* Action buttons like Edit/Delete can be added here */}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AddExpense;
