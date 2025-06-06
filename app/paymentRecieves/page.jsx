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
import PaymentReceipt from "../paymentReciept/page";
import {
  party,
  banks,
  partyLedger,
  investors,
  investorLedger,
  products,
  companyProduct,
} from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import DropDown from "@/components/generic/dropdown";
import { useRouter } from "next/navigation";

const Page = () => {
  const api = new APICall();
  const router = useRouter();

  const [formData, setFormData] = useState({
    party_id: "",
    investor_id: "",
    product_id: "",
    payment_type: "cash",
    description: "",
    cash_amount: "",
    bank_id: "",
    cheque_no: "",
    cheque_date: "",
    cheque_amount: "",
    transection_id: "",
  });

  const [selectedParty, setSelectedParty] = useState(null);
  const [tableBankData, setTableBankData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [activeTab, setActiveTab] = useState("cash");
  const [tablePartyData, setPartyData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [responseData, setResponseData] = useState();
  const [tableProductData, setTableProductData] = useState([]);

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
    banks: false
  });

  useEffect(() => {
    checkPermissions();
  }, []);

  // Modified useEffect to load APIs based on permissions
  useEffect(() => {
    // Only fetch data after permissions are checked
    if (permissions.hasAccess) {
      if (permissions.canAddParty) {
        fetchData(); // Load party data
      }
      if (permissions.canAddInvestor) {
        fetchInvestorsData(); // Load investor data
      }
      if (permissions.canAddProduct) {
        fetchProductData(); // Load product data
      }
      
      // Bank data is needed for cheque and online payments regardless of permission type
      fetchBankData();
    }
  }, [permissions]); // Add permissions as dependency

  const checkPermissions = () => {
    try {
      const storedPermissions = localStorage.getItem("permissions");

      if (storedPermissions) {
        const parsedPermissions = JSON.parse(storedPermissions);

        // Find Receives module permissions
        let canAddParty = false;
        let canAddInvestor = false;
        let canAddProduct = false; // Initialize this variable

        if (
          parsedPermissions.modules &&
          Array.isArray(parsedPermissions.modules)
        ) {
          const ReceivesModule = parsedPermissions.modules.find(
            (module) =>
              module.parent === "Receives" || module.name === "Receives"
          );

          if (ReceivesModule && ReceivesModule.permissions) {
            canAddParty = ReceivesModule.permissions.includes("Receives Party");
            canAddInvestor = ReceivesModule.permissions.includes("Receives Investor");
            // Fix the typo in the permission check
            canAddProduct = ReceivesModule.permissions.includes("Receives Product");
          }
        }

        setPermissions({
          canAddParty,
          canAddInvestor,
          canAddProduct,
          hasAccess: canAddParty || canAddInvestor || canAddProduct,
        });
      } else {
        // No permissions found - default behavior
        setPermissions({
          canAddParty: true,
          canAddInvestor: true,
          canAddProduct: true,
          hasAccess: true,
        });
      }
    } catch (error) {
      console.error("Error parsing permissions:", error);
      // Default to showing all on error
      setPermissions({
        canAddParty: true,
        canAddInvestor: true,
        canAddProduct: true,
        hasAccess: true,
      });
    }
  };

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

  const fetchData = async () => {
    setLoadingStates(prev => ({ ...prev, parties: true }));
    try {
      const response = await api.getDataWithToken(party);
      const data = response.data;
      if (Array.isArray(data)) {
        const formattedData = data.map((party) => ({
          label: `${party.person_name} (party)`,
          customer_type: party.customer_type,
          id: party.id,
        }));

        setPartyData((prevData) => {
          const existingIds = new Set(prevData.map((item) => item.id));
          const newData = formattedData.filter(
            (item) => !existingIds.has(item.id)
          );
          return [...prevData, ...newData];
        });
      } else {
        throw new Error("Fetched party data is not an array");
      }
    } catch (error) {
      console.error("Error fetching party data:", error.message);
      Swal.fire("Error", "Failed to fetch party data", "error");
    } finally {
      setLoadingStates(prev => ({ ...prev, parties: false }));
    }
  };

  const fetchInvestorsData = async () => {
    setLoadingStates(prev => ({ ...prev, investors: true }));
    try {
      const response = await api.getDataWithToken(investors);
      const data = response.data;
      if (Array.isArray(data)) {
        const formattedData = data.map((investor) => ({
          label: `${investor.person_name} (Investor)`,
          customer_type: investor.customer_type,
          id: investor.id,
        }));

        setPartyData((prevData) => {
          const existingIds = new Set(prevData.map((item) => item.id));
          const newData = formattedData.filter(
            (item) => !existingIds.has(item.id)
          );
          return [...prevData, ...newData];
        });
      } else {
        throw new Error("Fetched investor data is not an array");
      }
    } catch (error) {
      console.error("Error fetching investor data:", error.message);
      Swal.fire("Error", "Failed to fetch investor data", "error");
    } finally {
      setLoadingStates(prev => ({ ...prev, investors: false }));
    }
  };

  const fetchBankData = async () => {
    setLoadingStates(prev => ({ ...prev, banks: true }));
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
      setLoadingStates(prev => ({ ...prev, banks: false }));
      setLoading(false);
    }
  };

  const fetchProductData = async () => {
    setLoadingStates(prev => ({ ...prev, products: true }));
    try {
      const response = await api.getDataWithToken(products);
      const data = response.data;
      if (Array.isArray(data)) {
        const formattedData = data.map((product) => ({
          label: `${product.product_name} (Product)`,
          customer_type: "product", // Add customer_type for products
          id: product.id,
        }));

        // Add product data to the same tablePartyData that's used for the dropdown
        setPartyData((prevData) => {
          const existingIds = new Set(prevData.map((item) => item.id));
          const newData = formattedData.filter(
            (item) => !existingIds.has(item.id)
          );
          return [...prevData, ...newData];
        });

        // Also keep the product data separately if needed
        setTableProductData(formattedData);
      } else {
        throw new Error("Fetched product data is not an array");
      }
    } catch (error) {
      console.error("Error fetching product data:", error.message);
      Swal.fire("Error", "Failed to fetch product data", "error");
    } finally {
      setLoadingStates(prev => ({ ...prev, products: false }));
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

    if (name === "cash_amount" || name === "cheque_amount") {
      const cleanValue = value.replace(/[^\d.]/g, "");

      if (selectedParty?.customer_type === "investor") {
        // For investors, keep positive value
        setFormData((prevState) => ({
          ...prevState,
          [name]: cleanValue,
        }));
      } else {
        // For party and product, use negative values
        setFormData((prevState) => ({
          ...prevState,
          [name]: convertToNegative(cleanValue),
        }));
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleDropdownChange = (name, selectedOption) => {
    if (selectedOption) {
      setSelectedParty(selectedOption);

      setFormData((prevState) => ({
        ...prevState,
        party_id: "",
        investor_id: "",
        product_id: "",
        cash_amount: "",
        cheque_amount: "",
        description: "",
        bank_id: "",
        cheque_no: "",
        cheque_date: "",
        transection_id: "",
      }));

      if (selectedOption.customer_type === "party") {
        setFormData((prevState) => ({
          ...prevState,
          party_id: selectedOption.id,
        }));
      } else if (selectedOption.customer_type === "investor") {
        setFormData((prevState) => ({
          ...prevState,
          investor_id: selectedOption.id,
        }));
      } else if (selectedOption.customer_type === "product") {
        setFormData((prevState) => ({
          ...prevState,
          product_id: selectedOption.id,
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
    if (!selectedParty) {
      Swal.fire("Error", "Please select a party", "error");
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
      let response;
      let requestData = { ...formData };

      if (selectedParty.customer_type === "party") {
        requestData = {
          ...requestData,
          party_id: formData.party_id,
        };
        response = await api.postDataWithToken(partyLedger, requestData);
      } else if (selectedParty.customer_type === "investor") {
        requestData = {
          ...requestData,
          investor_id: formData.investor_id,
        };
        response = await api.postDataWithToken(investorLedger, requestData);
      } else if (selectedParty.customer_type === "product") {
        requestData = {
          ...requestData,
          product_id: formData.product_id,
          cash_amount: formData.cash_amount, // This should already be negative from handleInputChange
        };
        response = await api.postDataWithToken(companyProduct, requestData);
      }

      if (response?.status === "success") {
        setResponseData(response);
        Swal.fire({
          title: "Success",
          text: "Payment recorded successfully!",
          icon: "success",
          cancelButtonText: "Close",
        });
        // router.push("/dashboard");
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

  // Check if any data is still loading
  const isAnyDataLoading = Object.values(loadingStates).some(state => state);

  return (
    <div className="min-h-screen w-full overflow-x-hidden px-4 md:px-6">
      <div className={styles.recievesHead}>Add Amount Receives</div>

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
                  title="Select Party"
                  options={tablePartyData}
                  onChange={handleDropdownChange}
                  value={selectedParty}
                  name={
                    selectedParty?.customer_type === "party"
                      ? "party_id"
                      : selectedParty?.customer_type === "investor"
                      ? "investor_id"
                      : "product_id"
                  }
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
                value={displayPositiveAmount(formData.cash_amount)}
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

      {/* {responseData && <PaymentReceipt data={responseData} />} */}
    </div>
  );
};

export default Page;