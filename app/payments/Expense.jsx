"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/paymentss.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import MultilineInput from "../../components/generic/MultilineInput";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import DropDown from "@/components/generic/dropdown";
import DropDown3 from "@/components/generic/dropdown3"; // Added missing import
import AddExpense from "../../components/stock/addExpense";
import {
  banks,
  expenseCat,
  expense,
  seasons,
} from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const ExpensePayments = () => {
  const api = new APICall();
  const router = useRouter();

  const [formData, setFormData] = useState({
    expense_category_id: "",
    payment_type: "cash",
    description: "",
    cash_amount: "",
    bank_id: "",
    cheque_no: "",
    cheque_date: "",
    cheque_amount: "",
    transection_id: "",
    bank_tax: "",
    season_id: "", // Added missing season_id
  });

  const [tableBankData, setTableBankData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSeasons, setLoadingSeasons] = useState(false); // Added missing state
  const [activeTab, setActiveTab] = useState("cash");

  const [error, setError] = useState(null);
  const [tableExpenseData, setTableExpenseData] = useState([]);
  const [openExpense, setOpenExpense] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState(null);

  const [seasonsList, setSeasons] = useState([]);
  const [dropdownValues, setDropdownValues] = useState({
    // Added missing state
    season_id: null,
  });
  const [selectedSeasonName, setSelectedSeasonName] = useState(""); // Added missing state

  const handleOpenExpense = () => setOpenExpense(true);
  const handleCloseExpense = () => setOpenExpense(false);

  useEffect(() => {
    fetchBankData();
    fetchExpenseData();
    fetchSeasons();
  }, []);

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

  const fetchExpenseData = async () => {
    try {
      const response = await api.getDataWithToken(expenseCat);
      const data = response.data;

      if (Array.isArray(data)) {
        const formattedData = data.map((expense) => ({
          label: expense.expense_category,
          id: expense.id,
        }));
        setTableExpenseData(formattedData);
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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setFormData((prevState) => ({
      ...prevState,
      payment_type: tab,
    }));
  };

  const handleDropdownChange = (name, selectedOption) => {
    if (name === "season_id") {
      setDropdownValues((prev) => ({
        ...prev,
        season_id: selectedOption,
      }));
      setSelectedSeasonName(selectedOption.label);
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: selectedOption.id,
    }));
  };

  const handleBankSelect = (_, value) => {
    setFormData((prevState) => ({
      ...prevState,
      bank_id: value?.id || "",
    }));
  };

  const validateForm = () => {
    const {
      expense_category_id,
      payment_type,
      cash_amount,
      cheque_no,
      cheque_date,
      cheque_amount,
      bank_id,
      description,
    } = formData;

    if (payment_type === "cash" && !cash_amount) {
      Swal.fire("Error", "Cash amount is required for cash payment", "error");
      return false;
    }

    if (payment_type === "cash" && !description) {
      Swal.fire("Error", "Description is required for cash payment", "error");
      return false;
    }

    if (payment_type === "cheque" || payment_type === "both") {
      if (!bank_id) {
        Swal.fire(
          "Error",
          "Bank selection is required for cheque payment",
          "error"
        );
        return false;
      }
      if (!cheque_no) {
        Swal.fire("Error", "Cheque number is required", "error");
        return false;
      }
      if (!cheque_date) {
        Swal.fire("Error", "Cheque date is required", "error");
        return false;
      }
      if (!cheque_amount) {
        Swal.fire("Error", "Cheque amount is required", "error");
        return false;
      }
      if (!description) {
        Swal.fire("Error", "Description is required", "error");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;

    setLoadingSubmit(true);
    try {
      const response = await api.postDataWithToken(expense, formData);

      // Check if response status is "success"
      if (response?.status === "success") {
        Swal.fire({
          title: "Success",
          text: "Your data has been added",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else {
        throw new Error(response?.message || "Failed to add expenses.");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div>
      <Grid container spacing={2} className="mt-10">
        <Grid item xs={12} md={6}>
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={56} />
          ) : (
            <>
              <div
                className={styles.bankHead}
                onClick={handleOpenExpense}
                style={{ cursor: "pointer", marginBottom: "1rem" }}
              >
                Add Expense
              </div>

              <DropDown
                title="Select Expense Category"
                options={tableExpenseData}
                onChange={handleDropdownChange}
                value={
                  tableExpenseData.find(
                    (option) => option.id === formData.expense_category_id
                  ) || null
                }
                name="expense_category_id"
              />

              <Grid className="mt-10" item xs={12} lg={4} sm={4}>
                {loadingSeasons ? (
                  <Skeleton variant="rectangular" height={56} />
                ) : (
                  <DropDown3
                    title="Select Season"
                    options={seasonsList}
                    onChange={handleDropdownChange}
                    value={dropdownValues.season_id}
                    name="season_id"
                  />
                )}
              </Grid>
            </>
          )}
        </Grid>

        {activeTab === "cash" ? (
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
        ) : null}
      </Grid>

      <div className="mt-10">
        <div className={styles.tabPaymentContainer}>
          <button
            className={`${styles.tabPaymentButton} ${
              activeTab === "cash" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("cash")}
          >
            Cash
          </button>
          <button
            className={`${styles.tabPaymentButton} ${
              activeTab === "cheque" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("cheque")}
          >
            Cheque
          </button>

          <button
            className={`${styles.tabPaymentButton} ${
              activeTab === "online" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("online")}
          >
            Online
          </button>
        </div>

        <div className={styles.tabPaymentContent}>
          {activeTab === "cheque" && (
            <Grid container spacing={2} className="mt-5">
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

              <Grid className="" item xs={12} sm={4}>
                <InputWithTitle
                  title={"Bank Tax"}
                  placeholder={"Bank Tax"}
                  name="bank_tax"
                  value={formData.bank_tax}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          )}

          {activeTab === "online" ? (
            <Grid container spacing={2} className="mt-10">
              <Grid item xs={12} md={4} className="mt-5">
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
                  title="Transaction Number"
                  type="text"
                  placeholder="Transaction Number"
                  name="transection_id"
                  value={formData.transection_id}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <InputWithTitle
                  title="Transaction Amount"
                  type="text"
                  placeholder="Transaction Amount"
                  name="cash_amount"
                  value={formData.cash_amount}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid className="" item xs={12} sm={4}>
                <InputWithTitle
                  title={"Bank Tax"}
                  placeholder={"Bank Tax"}
                  name="bank_tax"
                  value={formData.bank_tax}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          ) : null}
        </div>
      </div>

      <div>
        <div className="mt-10">
          <MultilineInput
            title="Description"
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className={styles.btnCont}>
        <button
          className={styles.paymentInBtn}
          onClick={handleSubmit}
          disabled={loadingSubmit}
        >
          {loadingSubmit ? "Submitting..." : "Submit Expenses"}
        </button>
      </div>

      <AddExpense
        openExpense={openExpense}
        handleCloseExpense={handleCloseExpense}
      />
    </div>
  );
};

export default ExpensePayments;
