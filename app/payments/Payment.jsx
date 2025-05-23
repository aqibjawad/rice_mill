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
import Swal from "sweetalert2"; // Import SweetAlert2

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
  const [dataFetched, setDataFetched] = useState(false); // Flag to track if both data have been fetched
  const [responseData, setResponseData] = useState();
  const [isSelf, setIsSelf] = useState(false);

  const [tableProductData, setTableProductData] = useState([]);
  const [producttData, setProductData] = useState([]);

  useEffect(() => {
    fetchData();
    fetchBankData();
    fetchInvestorsData();
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
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
      setLoading(false);
    }
  }; 

  const fetchData = async () => {
    try {
      const response = await api.getDataWithToken(party);
      const data = response.data;
      console.log("party Data:", data); // Log to check party data
      if (Array.isArray(data)) {
        const formattedData = data.map((parties) => ({
          label: `${parties.person_name} (Party)`,
          customer_type: parties.customer_type,
          id: parties.id,
        }));

        setPartyData((prevData) => {
          const existingIds = new Set(prevData.map((item) => item.id));
          const newData = formattedData.filter(
            (item) => !existingIds.has(item.id)
          );
          return [...prevData, ...newData];
        });
      } else {
        throw new Error("Fetched buyer data is not an array");
      }
    } catch (error) {
      console.error("Error fetching buyer data:", error.message);
    } finally {
      setLoading(false);
      setDataFetched(true); // Mark as fetched
    }
  };

  const fetchInvestorsData = async () => {
    try {
      const response = await api.getDataWithToken(investors);
      const data = response.data;
      if (Array.isArray(data)) {
        const formattedData = data.map((supplier) => ({
          label: `${supplier.person_name} (Investor)`,
          customer_type: supplier.customer_type,
          id: supplier.id,
        }));

        setPartyData((prevData) => {
          const existingIds = new Set(prevData.map((item) => item.id));
          const newData = formattedData.filter(
            (item) => !existingIds.has(item.id)
          );
          return [...prevData, ...newData];
        });
      } else {
        throw new Error("Fetched supplier data is not an array");
      }
    } catch (error) {
      console.error("Error fetching supplier data:", error.message);
    } finally {
      setLoading(false);
      setDataFetched(true); // Mark as fetched
    }
  };

  useEffect(() => {
    if (dataFetched) {
    }
  }, [tablePartyData, dataFetched]);

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
      console.error("Error fetching bank data:", error.message);
    } finally {
      setLoading(false);
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
      setSelectedParty(selectedOption); // Store the selected party

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

      // Add a console log to see what's happening
      console.log("Selected option:", selectedOption);
    }
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
      let response;
      let requestData = { ...formData };

      if (isSelf) {
        // Self payment logic remains the same
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
        // Find the selected item (party, investor, or product)
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

      // Check response status
      if (response?.status === "success") {
        setResponseData(response);
        Swal.fire({
          title: "Success",
          text: "Your data has been added",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            // router.push("/dashboard");
            window.location.reload();
          }
        });
      } else {
        // Handle API error response
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
              {loading ? (
                <Skeleton variant="rectangular" height={56} />
              ) : (
                <DropDown
                  title="Select Party"
                  options={tablePartyData}
                  onChange={handleDropdownChange}
                  value={selectedParty}
                  // name={
                  //   selectedParty?.customer_type === "party"
                  //     ? "sup_id"
                  //     : "party_id"
                  // }
                  name={
                    selectedParty?.customer_type === "party"
                      ? "sup_id"
                      : selectedParty?.customer_type === "investor"
                      ? "party_id"
                      : "product_id"
                  }
                />
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
                <Autocomplete
                  disablePortal
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
                <Autocomplete
                  disablePortal
                  options={tableBankData}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Bank" />
                  )}
                  onChange={handleBankSelect}
                />
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
            disabled={loadingSubmit}
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
