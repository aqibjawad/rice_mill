"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/paymentRecieves.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import MultilineInput from "../../components/generic/MultilineInput";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Swal from "sweetalert2";
import {
  banks,
  expense,
  expenseCat,
  seasons,
} from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import DropDown from "@/components/generic/dropdown";
import { useRouter } from "next/navigation";
import DropDown3 from "@/components/generic/dropdown3";

const Page = () => {
  const api = new APICall();
  const router = useRouter();

  const [formData, setFormData] = useState({
    expense_category_id: "", // Change from product_id to expense_category_id
    payment_type: "cash",
    description: "",
    cash_amount: "",
    bank_id: "",
    cheque_no: "",
    cheque_date: "",
    cheque_amount: "",
    transection_id: "",
  });
  const [selectedExpenseCat, setExpenseCatParty] = useState(null);
  const [seasonsList, setSeasons] = useState([]);
  const [loadingSeasons, setLoadingSeasons] = useState(true);
  const [tableBankData, setTableBankData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [activeTab, setActiveTab] = useState("cash");
  const [tablePartyData, setPartyData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [responseData, setResponseData] = useState();
  const [tableProductData, setTableProductData] = useState([]);
  const [dropdownValues, setDropdownValues] = useState({
    season_id: null,
  });

  // Permission states
  const [permissions, setPermissions] = useState({
    canAddParty: false,
    canAddInvestor: false,
    canAddProduct: false,
    hasAccess: false,
  });

  // Individual loading states for better UX
  const [loadingStates, setLoadingStates] = useState({
    parties: false,
    investors: false,
    products: false,
    banks: false,
  });

  // FIX: Add empty dependency array to prevent infinite loop
  useEffect(() => {
    fetchExpenseCatData();
    fetchBankData();
    fetchSeasons();
  }, []); // Empty dependency array means it runs only once on mount

  const displayPositiveAmount = (amount) => {
    if (!amount) return "";
    const numAmount = parseFloat(amount);
    return isNaN(numAmount) ? "" : Math.abs(numAmount).toString();
  };

  const convertToNegative = (amount) => {
    if (!amount) return "";
    const numAmount = parseFloat(amount);
    return isNaN(numAmount) ? "" : -Math.abs(numAmount);
  };

  const fetchBankData = async () => {
    setLoadingStates((prev) => ({ ...prev, banks: true }));
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
        throw new Error("Fetched bank data is not an array");
      }
    } catch (error) {
      console.error("Error fetching bank data:", error.message);
      Swal.fire("Error", "Failed to fetch bank data", "error");
    } finally {
      setLoadingStates((prev) => ({ ...prev, banks: false }));
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
      }
    } catch (error) {
      console.error("Error fetching seasons:", error);
      setError("Failed to fetch seasons. Please try again.");
    } finally {
      setLoadingSeasons(false);
    }
  };

  const fetchExpenseCatData = async () => {
    setLoadingStates((prev) => ({ ...prev, products: true }));
    try {
      const response = await api.getDataWithToken(expenseCat);
      const data = response.data;
      if (Array.isArray(data)) {
        const formattedData = data.map((item) => ({
          label: `${item.expense_category}`,
          id: item.id,
        }));

        // FIX: Use callback to prevent potential state update issues
        setPartyData(formattedData);
        setTableProductData(formattedData);
      } else {
        throw new Error("Fetched product data is not an array");
      }
    } catch (error) {
      console.error("Error fetching product data:", error.message);
      Swal.fire("Error", "Failed to fetch product data", "error");
    } finally {
      setLoadingStates((prev) => ({ ...prev, products: false }));
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setFormData((prevState) => ({
      ...prevState,
      payment_type: tab,
      cash_amount: "",
      cheque_amount: "",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDropdownChange = (name, selectedOption) => {
    if (name === "season_id") {
      setDropdownValues((prev) => ({
        ...prev,
        season_id: selectedOption,
      }));
      setFormData((prevState) => ({
        ...prevState,
        season_id: selectedOption?.id || "",
      }));
    } else {
      // Handle expense category selection
      if (selectedOption) {
        setExpenseCatParty(selectedOption);
        setFormData((prevState) => ({
          ...prevState,
          expense_category_id: selectedOption.id,
          cash_amount: "",
          cheque_amount: "",
          description: "",
          bank_id: "",
          cheque_no: "",
          cheque_date: "",
          transection_id: "",
        }));
      }
    }
  };

  const handleBankSelect = (_, value) => {
    setFormData((prevState) => ({
      ...prevState,
      bank_id: value?.id || "",
    }));
  };

  const validateForm = () => {
    if (!selectedExpenseCat || !formData.expense_category_id) {
      Swal.fire("Error", "Please select an expense category", "error");
      return false;
    }

    if (activeTab === "cash" && !formData.cash_amount) {
      Swal.fire("Error", "Please enter cash amount", "error");
      return false;
    }

    if (activeTab === "cheque") {
      if (!formData.bank_id) {
        Swal.fire("Error", "Please select a bank", "error");
        return false;
      }
      if (!formData.cheque_no) {
        Swal.fire("Error", "Please enter cheque number", "error");
        return false;
      }
      if (!formData.cheque_date) {
        Swal.fire("Error", "Please enter cheque date", "error");
        return false;
      }
      if (!formData.cheque_amount) {
        Swal.fire("Error", "Please enter cheque amount", "error");
        return false;
      }
    }

    if (activeTab === "online") {
      if (!formData.bank_id) {
        Swal.fire("Error", "Please select a bank", "error");
        return false;
      }
      if (!formData.transection_id) {
        Swal.fire("Error", "Please enter transaction ID", "error");
        return false;
      }
      if (!formData.cash_amount) {
        Swal.fire("Error", "Please enter transaction amount", "error");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoadingSubmit(true);
    try {
      let requestData = { ...formData };

      // You need to add the actual API call here
      // Replace 'YOUR_API_ENDPOINT' with your actual endpoint
      const response = await api.postFormDataWithToken(expense, requestData);

      // Alternative: if you have a specific method for payments
      // const response = await api.submitPayment(requestData);

      if (response?.status === "success") {
        setResponseData(response);
        Swal.fire({
          title: "Success",
          text: "Payment recorded successfully!",
          icon: "success",
          cancelButtonText: "Close",
        });
        window.location.reload();
      } else {
        throw new Error(response?.message || "Failed to submit payment");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      Swal.fire(
        "Error",
        error.message || "Failed to submit payment. Please try again.",
        "error"
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  const isAnyDataLoading = Object.values(loadingStates).some((state) => state);

  return (
    <div className="min-h-screen w-full overflow-x-hidden px-4 md:px-6">
      <div className={styles.recievesHead}>Add Expenses </div>

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
      </div>

      <div>
        <Grid container spacing={2} className="mt-10">
          <Grid item xs={12} md={6}>
            {isAnyDataLoading ? (
              <Skeleton variant="rectangular" width="100%" height={56} />
            ) : (
              <div className="mt-5">
                <DropDown
                  title="Select Expense Category"
                  options={tablePartyData}
                  onChange={handleDropdownChange}
                  value={selectedExpenseCat}
                  name={selectedExpenseCat}
                />
              </div>
            )}
          </Grid>
          <Grid item xs={6}>
            {loadingSeasons ? (
              <Skeleton variant="rectangular" height={56} />
            ) : (
              <div className="mt-5">
                <DropDown3
                  title="Select Season"
                  options={seasonsList}
                  onChange={handleDropdownChange}
                  value={dropdownValues.season_id} // Fix: use dropdownValues.season_id instead of season_id
                  name="season_id"
                />
              </div>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {activeTab === "cash" && (
              <InputWithTitle
                title="Amount"
                type="text"
                placeholder="Amount"
                value={formData.cash_amount}
                name="cash_amount"
                onChange={handleInputChange}
              />
            )}
          </Grid>
        </Grid>

        <div className="mt-10">
          <div className={styles.tabPaymentContent}>
            {activeTab === "cheque" && (
              <Grid container spacing={2} className="mt-10">
                <Grid item xs={12} md={4} className="mt-5">
                  {loadingStates.banks ? (
                    <Skeleton variant="rectangular" width="100%" height={56} />
                  ) : (
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={tableBankData}
                      renderInput={(params) => (
                        <TextField {...params} label="Select Bank" />
                      )}
                      onChange={handleBankSelect}
                    />
                  )}
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
                    value={displayPositiveAmount(formData.cheque_amount)}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            )}

            {activeTab === "online" && (
              <Grid container spacing={2} className="mt-10">
                <Grid item xs={12} md={4} className="mt-5">
                  {loadingStates.banks ? (
                    <Skeleton variant="rectangular" width="100%" height={56} />
                  ) : (
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={tableBankData}
                      renderInput={(params) => (
                        <TextField {...params} label="Select Bank" />
                      )}
                      onChange={handleBankSelect}
                    />
                  )}
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
                    value={displayPositiveAmount(formData.cash_amount)}
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
            className={styles.saveBtn}
            onClick={handleSubmit}
            disabled={loadingSubmit || isAnyDataLoading}
          >
            {loadingSubmit ? (
              <span>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Processing...
              </span>
            ) : (
              "Submit Payment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
