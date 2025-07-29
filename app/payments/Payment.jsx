"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/paymentRecieves.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import MultilineInput from "../../components/generic/MultilineInput";
import {
  Box,
  Tab,
  Tabs,
  Grid,
  Autocomplete,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Skeleton,
} from "@mui/material";
import Swal from "sweetalert2";

import {
  party,
  banks,
  partyLedger,
  investors,
  companyProduct,
  investorLedger,
  selfPayment,
  products,
} from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import DropDown from "@/components/generic/dropdown";

const Page = () => {
  const api = new APICall();
  const router = useRouter();

  const [formData, setFormData] = useState({
    party_id: "",
    sup_id: "",
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
  const [responseData, setResponseData] = useState();
  const [isSelf, setIsSelf] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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

  // Check permissions on component mount
  useEffect(() => {
    checkPermissions();
  }, []);

  // Load data based on permissions
  useEffect(() => {
    if (permissions.hasAccess) {
      loadDataBasedOnPermissions();
    }
  }, [permissions]);

  const checkPermissions = () => {
    try {
      const storedPermissions = localStorage.getItem("permissions");

      if (storedPermissions) {
        const parsedPermissions = JSON.parse(storedPermissions);

        // Check if permissions is null - give full access
        if (parsedPermissions === null || parsedPermissions === "null") {
          setPermissions({
            canAddParty: true,
            canAddInvestor: true,
            canAddProduct: true,
            hasAccess: true,
          });
          console.log("Permissions are null - granting full access");
          return;
        }

        let canAddParty = false;
        let canAddInvestor = false;
        let canAddProduct = false;

        if (
          parsedPermissions.modules &&
          Array.isArray(parsedPermissions.modules)
        ) {
          const PaymentsModule = parsedPermissions.modules.find(
            (module) =>
              module.parent === "Payments" || module.name === "Payments"
          );

          if (PaymentsModule && PaymentsModule.permissions) {
            // Check for exact permission names
            canAddParty = PaymentsModule.permissions.includes("Payment Party");
            canAddInvestor =
              PaymentsModule.permissions.includes("Payment Investor");
            canAddProduct =
              PaymentsModule.permissions.includes("Payment Product");
          }
        }

        setPermissions({
          canAddParty,
          canAddInvestor,
          canAddProduct,
          hasAccess: canAddParty || canAddInvestor || canAddProduct,
        });

        console.log("Permissions set:", {
          canAddParty,
          canAddInvestor,
          canAddProduct,
        });
      } else {
        // No permissions found in localStorage - give full access
        setPermissions({
          canAddParty: true,
          canAddInvestor: true,
          canAddProduct: true,
          hasAccess: true,
        });
        console.log(
          "No permissions found in localStorage - granting full access"
        );
      }
    } catch (error) {
      console.error("Error parsing permissions:", error);
      // Default to full access on error (assuming null permissions)
      setPermissions({
        canAddParty: true,
        canAddInvestor: true,
        canAddProduct: true,
        hasAccess: true,
      });
    }
  };

  const loadDataBasedOnPermissions = async () => {
    setLoading(true);

    // Always load bank data for cheque and online payments
    await fetchBankData();

    // Load data based on permissions
    const promises = [];

    if (permissions.canAddParty) {
      setLoadingStates((prev) => ({ ...prev, parties: true }));
      promises.push(fetchPartyData());
    }

    if (permissions.canAddInvestor) {
      setLoadingStates((prev) => ({ ...prev, investors: true }));
      promises.push(fetchInvestorsData());
    }

    if (permissions.canAddProduct) {
      setLoadingStates((prev) => ({ ...prev, products: true }));
      promises.push(fetchProductData());
    }

    // Wait for all API calls to complete
    await Promise.allSettled(promises);

    setLoading(false);
  };

  const fetchPartyData = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, parties: true }));
      const response = await api.getDataWithToken(party);
      const data = response.data;

      if (Array.isArray(data)) {
        const formattedData = data.map((parties) => ({
          label: `${parties.person_name} (Party)`,
          customer_type: "party",
          id: parties.id,
        }));

        setPartyData((prevData) => {
          const existingIds = new Set(prevData.map((item) => item.id));
          const newData = formattedData.filter(
            (item) => !existingIds.has(item.id)
          );
          return [...prevData, ...newData];
        });
      }
    } catch (error) {
      console.error("Error fetching party data:", error.message);
      Swal.fire("Error", "Failed to fetch party data", "error");
    } finally {
      setLoadingStates((prev) => ({ ...prev, parties: false }));
    }
  };

  const fetchInvestorsData = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, investors: true }));
      const response = await api.getDataWithToken(investors);
      const data = response.data;

      if (Array.isArray(data)) {
        const formattedData = data.map((investor) => ({
          label: `${investor.person_name} (Investor)`,
          customer_type: "investor",
          id: investor.id,
        }));

        setPartyData((prevData) => {
          const existingIds = new Set(prevData.map((item) => item.id));
          const newData = formattedData.filter(
            (item) => !existingIds.has(item.id)
          );
          return [...prevData, ...newData];
        });
      }
    } catch (error) {
      console.error("Error fetching investor data:", error.message);
      Swal.fire("Error", "Failed to fetch investor data", "error");
    } finally {
      setLoadingStates((prev) => ({ ...prev, investors: false }));
    }
  };

  const fetchProductData = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, products: true }));
      const response = await api.getDataWithToken(products);
      const data = response.data;

      if (Array.isArray(data)) {
        const formattedData = data.map((product) => ({
          label: `${product.product_name} (Product)`,
          customer_type: "product",
          id: product.id,
        }));

        setPartyData((prevData) => {
          const existingIds = new Set(prevData.map((item) => item.id));
          const newData = formattedData.filter(
            (item) => !existingIds.has(item.id)
          );
          return [...prevData, ...newData];
        });
      }
    } catch (error) {
      console.error("Error fetching product data:", error.message);
      Swal.fire("Error", "Failed to fetch product data", "error");
    } finally {
      setLoadingStates((prev) => ({ ...prev, products: false }));
    }
  };

  const fetchBankData = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, banks: true }));
      const response = await api.getDataWithToken(banks);
      const data = response.data;

      if (Array.isArray(data)) {
        const formattedData = data.map((bank) => ({
          label: bank.bank_name,
          id: bank.id,
        }));
        setTableBankData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching bank data:", error.message);
      Swal.fire("Error", "Failed to fetch bank data", "error");
    } finally {
      setLoadingStates((prev) => ({ ...prev, banks: false }));
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setFormData((prevState) => ({
      ...prevState,
      payment_type: tab,
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
    if (selectedOption) {
      setSelectedParty(selectedOption);

      // Reset all IDs first
      setFormData((prevState) => ({
        ...prevState,
        party_id: "",
        investor_id: "",
        product_id: "",
      }));

      // Set the appropriate ID based on customer type
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

      console.log("Selected option:", selectedOption);
    }
  };

  const handleBankSelect = (_, value) => {
    setFormData((prevState) => ({
      ...prevState,
      bank_id: value?.id || "",
    }));
  };

  const validateForm = () => {
    const errors = {};

    // Common validations
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.trim().length < 3) {
      errors.description = "Description must be at least 3 characters long";
    }

    if (!formData.payment_type) {
      errors.payment_type = "Payment type is required";
    }

    // Cash payment validations
    if (formData.payment_type === "cash") {
      if (!formData.cash_amount) {
        errors.cash_amount = "Cash amount is required";
      } else if (
        isNaN(formData.cash_amount) ||
        parseFloat(formData.cash_amount) <= 0
      ) {
        errors.cash_amount = "Cash amount must be a positive number";
      } else if (parseFloat(formData.cash_amount) > 1000000) {
        errors.cash_amount = "Cash amount cannot exceed 1,000,000";
      }
    }

    // Bank payment validations
    if (formData.payment_type === "bank") {
      if (!formData.bank_id) {
        errors.bank_id = "Bank selection is required";
      }

      if (!formData.cash_amount) {
        errors.cash_amount = "Amount is required for bank payment";
      } else if (
        isNaN(formData.cash_amount) ||
        parseFloat(formData.cash_amount) <= 0
      ) {
        errors.cash_amount = "Amount must be a positive number";
      }
    }

    // Cheque payment validations
    if (formData.payment_type === "cheque") {
      if (!formData.bank_id) {
        errors.bank_id = "Bank selection is required for cheque";
      }

      if (!formData.cheque_no.trim()) {
        errors.cheque_no = "Cheque number is required";
      } else if (formData.cheque_no.trim().length < 3) {
        errors.cheque_no = "Cheque number must be at least 3 characters";
      }

      if (!formData.cheque_date) {
        errors.cheque_date = "Cheque date is required";
      } else {
        const chequeDate = new Date(formData.cheque_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (chequeDate < today) {
          errors.cheque_date = "Cheque date cannot be in the past";
        }
      }

      if (!formData.cheque_amount) {
        errors.cheque_amount = "Cheque amount is required";
      } else if (
        isNaN(formData.cheque_amount) ||
        parseFloat(formData.cheque_amount) <= 0
      ) {
        errors.cheque_amount = "Cheque amount must be a positive number";
      }
    }

    // Online payment validations
    if (formData.payment_type === "online") {
      if (!formData.bank_id) {
        errors.bank_id = "Bank selection is required for online payment";
      }

      if (!formData.transection_id.trim()) {
        errors.transection_id = "Transaction ID is required";
      } else if (formData.transection_id.trim().length < 5) {
        errors.transection_id = "Transaction ID must be at least 5 characters";
      }

      if (!formData.cash_amount) {
        errors.cash_amount = "Amount is required for online payment";
      } else if (
        isNaN(formData.cash_amount) ||
        parseFloat(formData.cash_amount) <= 0
      ) {
        errors.cash_amount = "Amount must be a positive number";
      }
    }

    // Customer selection validations (when not self payment)
    if (!isSelf) {
      const hasParty = formData.party_id;
      const hasInvestor = formData.investor_id;
      const hasProduct = formData.product_id;

      if (!hasParty && !hasInvestor && !hasProduct) {
        errors.customer_selection =
          "Please select a party, investor, or product";
      }

      // Ensure only one customer type is selected
      const selectedCount = [hasParty, hasInvestor, hasProduct].filter(
        Boolean
      ).length;
      if (selectedCount > 1) {
        errors.customer_selection = "Please select only one customer type";
      }
    } else {
      // Self payment specific validations
      if (!formData.bank_id) {
        errors.bank_id = "Bank selection is required for self payment";
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setFormErrors({});

    // Validate form
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);

      // Show validation error alert
      Swal.fire({
        title: "Validation Error",
        text: "Please fix the errors in the form before submitting",
        icon: "error",
        confirmButtonText: "OK",
      });

      return; // Stop submission if there are errors
    }

    setLoadingSubmit(true);

    try {
      let response;
      let requestData = { ...formData };

      if (isSelf) {
        requestData = {
          bank_id: formData.bank_id,
          amount: formData.cash_amount,
          description: formData.description,
        };
        response = await api.postDataWithToken(
          `${selfPayment}/bank_to_cash`,
          requestData
        );
      } else {
        const selectedItem = tablePartyData.find(
          (item) =>
            (item.customer_type === "party" && item.id === formData.party_id) ||
            (item.customer_type === "investor" &&
              item.id === formData.investor_id) ||
            (item.customer_type === "product" &&
              item.id === formData.product_id)
        );

        if (selectedItem) {
          switch (selectedItem.customer_type) {
            case "party":
              requestData = {
                ...formData,
                party_id: formData.party_id,
              };
              response = await api.postDataWithToken(partyLedger, requestData);
              break;

            case "investor":
              requestData = {
                ...formData,
                investor_id: formData.investor_id,
                cash_amount: formData.cash_amount
                  ? -Math.abs(formData.cash_amount)
                  : "",
              };
              response = await api.postDataWithToken(
                investorLedger,
                requestData
              );
              break;

            case "product":
              requestData = {
                ...formData,
                product_id: formData.product_id,
                cash_amount: formData.cash_amount,
              };
              response = await api.postDataWithToken(
                companyProduct,
                requestData
              );
              break;

            default:
              throw new Error("Invalid customer type");
          }
        } else {
          throw new Error("Selected party not found");
        }
      }

      if (response?.status === "success") {
        // Clear form and errors on success
        setFormData({
          party_id: "",
          sup_id: "",
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
        setFormErrors({});

        setResponseData(response);
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
        Swal.fire(
          "Error",
          response?.message ||
            "The cash amount cannot be greater than the available company balance",
          "error"
        );
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      const errorMessage =
        error.response?.message ||
        error.message ||
        "The cash amount cannot be greater than the available company balance";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Show loading if no permissions or still checking
  if (!permissions.hasAccess) {
    return (
      <Card sx={{ p: 3, maxWidth: 1200, mx: "auto", mt: 3 }}>
        <CardContent>
          <Box sx={{ textAlign: "center", py: 4 }}>
            {loading ? (
              <>
                <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
                <Skeleton variant="text" />
              </>
            ) : (
              ""
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3, maxWidth: 1200, mx: "auto", mt: 3 }}>
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <div className="mt-5">
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
                  activeTab === "both" ? styles.active : ""
                }`}
                onClick={() => handleTabClick("both")}
              >
                Both
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
        </Box>

        <Grid container spacing={3}>
          {!isSelf && (
            <Grid item xs={12} md={6}>
              {loading ||
              loadingStates.parties ||
              loadingStates.investors ||
              loadingStates.products ? (
                <Skeleton variant="rectangular" height={56} />
              ) : (
                <DropDown
                  title="Select Party"
                  options={tablePartyData}
                  onChange={handleDropdownChange}
                  value={selectedParty}
                  name={
                    selectedParty?.customer_type === "party"
                      ? "sup_id"
                      : selectedParty?.customer_type === "investor"
                      ? "party_id"
                      : "product_id"
                  }
                />
              )}
              {tablePartyData.length === 0 && !loading && (
                <Box
                  sx={{ mt: 1, color: "text.secondary", fontSize: "0.875rem" }}
                >
                  No data available based on your permissions
                </Box>
              )}
            </Grid>
          )}

          {(activeTab === "cash" || activeTab === "both") && (
            <Grid item xs={12} md={6}>
              <InputWithTitle
                title="Amount"
                type="text"
                placeholder="Amount"
                name="cash_amount"
                value={formData.cash_amount}
                onChange={handleInputChange}
              />
            </Grid>
          )}

          {(activeTab === "cheque" || activeTab === "both") && (
            <>
              <Grid item xs={12} md={4}>
                {loadingStates.banks ? (
                  <Skeleton variant="rectangular" height={56} />
                ) : (
                  <Autocomplete
                    disablePortal
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
                  value={formData.cheque_amount}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <InputWithTitle
                  title="Bank Tax"
                  placeholder="Bank Tax"
                  name="bank_tax"
                  value={formData.bank_tax}
                  onChange={handleInputChange}
                />
              </Grid>
            </>
          )}

          {activeTab === "online" && (
            <>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isSelf}
                      onChange={(e) => setIsSelf(e.target.checked)}
                    />
                  }
                  label="Self Payment"
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid className="mt-5" item xs={12} md={4}>
                {loadingStates.banks ? (
                  <Skeleton variant="rectangular" height={56} />
                ) : (
                  <Autocomplete
                    disablePortal
                    options={tableBankData}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Bank" />
                    )}
                    onChange={handleBankSelect}
                  />
                )}
              </Grid>

              {!isSelf && (
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
              )}

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

              {!isSelf && (
                <Grid item xs={12} md={4}>
                  <InputWithTitle
                    title="Bank Tax"
                    placeholder="Bank Tax"
                    name="bank_tax"
                    value={formData.bank_tax}
                    onChange={handleInputChange}
                  />
                </Grid>
              )}
            </>
          )}

          <Grid item xs={12}>
            <MultilineInput
              title="Description"
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loadingSubmit || tablePartyData.length === 0}
            sx={{ minWidth: 200 }}
          >
            {loadingSubmit ? "Submitting..." : "Submit Payment"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Page;
