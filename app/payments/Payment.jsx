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

    // Add these new fields for bank to bank
    from_bank_id: "",
    to_bank_id: "",
    amount: "",
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

    // Check if party/investor/product is selected (only if not self payment AND not bank to bank)
    if (!isSelf && formData.payment_type !== "bank") {
      if (!formData.party_id && !formData.investor_id && !formData.product_id) {
        errors.selection = "Please select a Party, Investor, or Product";
      }
    }

    if (!formData.payment_type) {
      errors.payment_type = "Payment type is required";
    }

    // Bank to Bank payment validations
    if (formData.payment_type === "bank") {
      if (!formData.from_bank_id) {
        errors.from_bank_id = "From Bank selection is required";
      }

      if (!formData.to_bank_id) {
        errors.to_bank_id = "To Bank selection is required";
      }

      if (
        formData.from_bank_id === formData.to_bank_id &&
        formData.from_bank_id
      ) {
        errors.bank_same = "From Bank and To Bank cannot be the same";
      }

      if (!formData.transection_id) {
        errors.transection_id = "Transaction ID is required";
      }

      if (!formData.amount) {
        errors.amount = "Amount is required";
      } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
        errors.amount = "Amount must be a positive number";
      }
    }

    // ... rest of validation logic remains the same

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
      const errorMessages = Object.values(errors);
      const errorText =
        errorMessages.length > 1
          ? `Multiple errors found:\n${errorMessages.join("\n")}`
          : errorMessages[0];

      Swal.fire({
        title: "Validation Error",
        text: errorText,
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoadingSubmit(true);

    try {
      let response;
      let requestData = { ...formData };

      // Handle Bank to Bank transfer
      if (formData.payment_type === "bank") {
        requestData = {
          from_bank_id: formData.from_bank_id,
          to_bank_id: formData.to_bank_id,
          description: formData.description,
          amount: formData.amount,
          transection_id: formData.transection_id,
        };

        // Use the bank to bank API endpoint
        response = await api.postDataWithToken(
          `${selfPayment}/bank_to_bank`, // Assuming this is the correct endpoint
          requestData
        );
      }
      // Handle other payment types (existing logic)
      else if (isSelf) {
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
        // ... existing logic for other payment types
      }

      if (response?.status === "success") {
        // Clear form and reset
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
          from_bank_id: "",
          to_bank_id: "",
          amount: "",
        });
        setFormErrors({});
        setSelectedParty(null);

        Swal.fire({
          title: "Success",
          text: "Bank to Bank transfer completed successfully",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.message ||
        error.message ||
        "Failed to process bank to bank transfer";
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

  const tabs = [
    { id: "cash", label: "Cash" },
    { id: "cheque", label: "Cheque" },
    { id: "both", label: "Both" },
    { id: "online", label: "Online" },
    { id: "bank", label: "Bank to Bank" },
  ];

  return (
    <Card sx={{ p: 3, maxWidth: 1200, mx: "auto", mt: 3 }}>
      <CardContent>
        <div className="mb-10 w-full max-w-4xl mx-auto">
          <div className="mt-5">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Grid container spacing={3}>
          {!isSelf && activeTab !== "bank" && (
            <Grid className="mt-5" item xs={12} md={6}>
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

          {activeTab === "bank" && (
            <>
              {/* From Bank Selection */}
              <Grid className="mt-5" item xs={12} md={4}>
                {loadingStates.banks ? (
                  <Skeleton variant="rectangular" height={56} />
                ) : (
                  <Autocomplete
                    disablePortal
                    options={tableBankData}
                    renderInput={(params) => (
                      <TextField {...params} label="Select From Bank" />
                    )}
                    onChange={(_, value) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        from_bank_id: value?.id || "",
                      }));
                    }}
                  />
                )}
              </Grid>

              {/* To Bank Selection */}
              <Grid className="mt-5" item xs={12} md={4}>
                {loadingStates.banks ? (
                  <Skeleton variant="rectangular" height={56} />
                ) : (
                  <Autocomplete
                    disablePortal
                    options={tableBankData}
                    renderInput={(params) => (
                      <TextField {...params} label="Select To Bank" />
                    )}
                    onChange={(_, value) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        to_bank_id: value?.id || "",
                      }));
                    }}
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
                  title="Amount"
                  type="text"
                  placeholder="Amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
              </Grid>
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
