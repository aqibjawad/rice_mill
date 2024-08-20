"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/paymentss.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import MultilineInput from "../../components/generic/MultilineInput";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import Grid from "@mui/material/Grid";

import { suppliers, banks, payment_Out } from "../../networkApi/Constants";

import APICall from "../../networkApi/APICall";

import AddExpense from "@/components/stock/addExpense";
import DropDown from "@/components/generic/dropdown";

const Payment = () => {
  const api = new APICall();

  const [formData, setFormData] = useState({
    expense_category_id: "",
    payment_type: "cash",
    description: "",
    cash_amount: "",
    bank_id: "",
    cheque_no: "",
    cheque_date: "",
    cheque_amount: "",
  });

  const [tableBankData, setTableBankData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [activeTab, setActiveTab] = useState("tab1");

  const [openExpense, setOpenExpense] = useState(false);
  const handleOpenExpense = () => setOpenExpense(true);
  const handleCloseExpense = () => setOpenExpense(false);
  const [tablePartyData, setPartyData] = useState([]);

  useEffect(() => {
    fetchData();
    fetchBankData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.getDataWithToken(suppliers);
      const data = result.response;

      if (Array.isArray(data)) {
        const formattedData = data.map((supplier) => ({
          label: supplier.person_name,
          id: supplier.id,
        }));
        setPartyData(formattedData);
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBankData = async () => {
    try {
      const response = await api.getDataWithToken(banks);
      const data = response.data;
      if (Array.isArray(data)) {
        const formattedData = data.map((bank) => ({
          label: bank.bank_name,
          id: bank.id,
        }));
        setTableBankData(formattedData);
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDropdownChange = (name, selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: selectedOption.id,
    }));
    setSelectedExpenseCategory(selectedOption);
  };

  const handleBankSelect = (_, value) => {
    setFormData((prevState) => ({
      ...prevState,
      bank_id: value?.id || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    try {
      const response = await api.postDataWithToken(expense, formData);
      console.log("Success:", response);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div>
      <Grid container spacing={2} className="mt-10">
        <Grid className="" item xs={12} md={6}>
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={56} />
          ) : (
            <>
              <div className="mt-5">
                <DropDown
                  title="Select Supplier"
                  options={tablePartyData}
                  onChange={handleDropdownChange}
                  value={formData.expense_category_id}
                  name="expense_category_id"
                />
              </div>
            </>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <InputWithTitle
            title="Amount"
            type="text"
            placeholder="Amount"
            value={formData.cash_amount}
            name="cash_amount"
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      <div className="mt-10">
        <div className={styles.tabPaymentContainer}>
          <button
            className={`${styles.tabPaymentButton} ${
              activeTab === "tab1" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("tab1")}
          >
            Cash
          </button>
          <button
            className={`${styles.tabPaymentButton} ${
              activeTab === "tab2" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("tab2")}
          >
            Cheque
          </button>
        </div>

        <div className={styles.tabPaymentContent}>
          {activeTab === "tab2" && (
            <Grid container spacing={2} className="mt-10">
              <Grid className="mt-5" item xs={12} md={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={tableBankData}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Bank" />
                  )}
                  onChange={handleBankSelect}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <InputWithTitle
                  title="Cheque Number"
                  type="text"
                  placeholder="Cheque Number"
                  name="cheque_no"
                  value={formData.cheque_no}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <InputWithTitle
                  title="Cheque Date"
                  type="date"
                  placeholder="Cheque Date"
                  name="cheque_date"
                  value={formData.cheque_date}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <InputWithTitle
                  title="Cheque Amount"
                  type="text"
                  placeholder="Cheque Amount"
                  name="cheque_amount"
                  value={formData.cheque_amount}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          )}
          <Grid className="mt-5" item xs={12} md={4} lg={8}>
            <MultilineInput
              title="Description"
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Grid>
        </div>
      </div>

      <div className={styles.btnCont}>
        <button
          className={styles.paymentInBtn}
          onClick={handleSubmit}
          disabled={loadingSubmit}
        >
          {loadingSubmit ? "Submitting..." : "Submit Payments"}
        </button>
      </div>
    </div>
  );
};

export default Payment;
