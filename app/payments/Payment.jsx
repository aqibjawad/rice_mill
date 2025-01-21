"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/paymentRecieves.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import MultilineInput from "../../components/generic/MultilineInput";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Swal from "sweetalert2"; // Import SweetAlert2

import {
  buyer,
  banks,
  buyerLedger,
  investors,
  suppliers,
  supplierLedger,
} from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import DropDown from "@/components/generic/dropdown";

const Page = () => {
  const api = new APICall();
  const router = useRouter();

  const [formData, setFormData] = useState({
    buyer_id: "",
    sup_id: "",
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

  useEffect(() => {
    fetchData();
    fetchBankData();
    fetchSupplierData();
    fetchInvestorsData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.getDataWithToken(buyer);
      const data = response.data;
      console.log("Buyer Data:", data); // Log to check buyer data
      if (Array.isArray(data)) {
        const formattedData = data.map((buyers) => ({
          label: `${buyers.person_name} (Buyer)`,
          customer_type: buyers.customer_type,
          id: buyers.id,
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

  const fetchSupplierData = async () => {
    try {
      const response = await api.getDataWithToken(suppliers);
      const data = response.data;
      console.log("Supplier Data:", data); // Log to check supplier data
      if (Array.isArray(data)) {
        const formattedData = data.map((supplier) => ({
          label: `${supplier.person_name} (Supplier)`,
          customer_type: supplier.customer_type,
          id: supplier.id,
        }));

        setPartyData((prevData) => {
          // Avoid duplicating data by checking if it's already present
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
      console.log("Combined Party Data:", tablePartyData);
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

      if (selectedOption.customer_type === "buyer") {
        setFormData((prevState) => ({
          ...prevState,
          buyer_id: selectedOption.id,
          sup_id: "",
        }));
      } else if (selectedOption.customer_type === "supplier") {
        setFormData((prevState) => ({
          ...prevState,
          sup_id: selectedOption.id,
          buyer_id: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoadingSubmit(true);
    try {
      let response;
      let requestData = { ...formData };

      // Find the selected party based on buyer_id or sup_id
      const selectedParty = tablePartyData.find(
        (party) =>
          party.id === formData.buyer_id || party.id === formData.sup_id
      );

      if (selectedParty) {
        if (selectedParty.customer_type === "buyer") {
          // For buyers, use buyerLedger API
          requestData = {
            ...formData,
            buyer_id: formData.buyer_id,
            cash_amount: formData.cash_amount
              ? -Math.abs(formData.cash_amount)
              : "",
          };
          response = await api.postDataWithToken(buyerLedger, requestData);

          // Navigate to buyer page
          router.push("/Buyer");
        } else if (selectedParty.customer_type === "supplier") {
          // For suppliers, set the cash_amount as negative
          requestData = {
            ...formData,
            sup_id: formData.sup_id,
          };
          response = await api.postDataWithToken(supplierLedger, requestData);

          // Navigate to supplier page
          router.push("/supplier");
        } else {
          throw new Error("Invalid customer type");
        }

        setResponseData(response);
        Swal.fire("Success", "Your data has been added!", "success");
      } else {
        throw new Error("Selected party not found");
      }
    } catch (error) {
      console.error("Error submitting data:", error.message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div>
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

      <Grid container spacing={2} className="mt-5">
        <Grid item xs={12} md={6}>
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={56} />
          ) : (
            <div className="mt-5">
              <DropDown
                title="Select Party"
                options={tablePartyData}
                onChange={handleDropdownChange}
                value={selectedParty} // Use the selectedParty state here
                name={
                  selectedParty?.customer_type === "supplier"
                    ? "sup_id"
                    : "buyer_id"
                }
              />
            </div>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {activeTab === "cash" || activeTab === "both" ? (
            <InputWithTitle
              title="Amount"
              type="text"
              placeholder="Amount"
              value={formData.cash_amount}
              name="cash_amount"
              onChange={handleInputChange}
            />
          ) : null}
        </Grid>
      </Grid>

      <div className="mt-5">
        <div className={styles.tabPaymentContent}>
          {activeTab === "cheque" || activeTab === "both" ? (
            <Grid container spacing={2} className="mt-5">
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
          ) : null}

          {activeTab === "online" ? (
            <Grid container spacing={2} className="mt-5">
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
                  name="transection_id" // Changed from "cheque_no" to "transection_id"
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
          disabled={loadingSubmit}
        >
          {loadingSubmit ? "Submitting..." : "Submit Payments"}
        </button>
      </div>
    </div>
  );
};

export default Page;
