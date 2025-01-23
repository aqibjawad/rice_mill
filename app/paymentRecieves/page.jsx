"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/paymentRecieves.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import MultilineInput from "../../components/generic/MultilineInput";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Swal from "sweetalert2"; // Import SweetAlert2

import PaymentReceipt from "../paymentReciept/page";

import {
  party,
  banks,
  partyLedger,
  suppliers,
  investors,
  supplierLedger,
  investorLedger,
} from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import DropDown from "@/components/generic/dropdown";
import { useRouter } from "next/navigation";

const Page = () => {
  const api = new APICall();
  const router = useRouter();

  const [formData, setFormData] = useState({
    party_id: "",
    sup_id: "",
    investor_id: "",
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

  useEffect(() => {
    fetchData();
    fetchBankData();
    fetchInvestorsData();
  }, []);

  const fetchData = async () => {
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
      setSelectedParty(selectedOption);

      // Reset all IDs first
      setFormData((prevState) => ({
        ...prevState,
        party_id: "",
        investor_id: "",
      }));

      // Set the appropriate ID based on customer type
      if (selectedOption.customer_type === "party") {
        setFormData((prevState) => ({
          ...prevState,
          party_id: selectedOption.id,
          cash_amount: -Math.abs(parseFloat(formData.cash_amount)),
        }));
      } else if (selectedOption.customer_type === "investor") {
        setFormData((prevState) => ({
          ...prevState,
          investor_id: selectedOption.id,
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

      if (selectedParty) {
        if (selectedParty.customer_type === "party") {
          requestData = {
            ...formData,
            party_id: formData.party_id,
            cash_amount: -Math.abs(parseFloat(formData.cash_amount)),
          };
          response = await api.postDataWithToken(partyLedger, requestData);
        } else if (selectedParty.customer_type === "investor") {
          requestData = {
            ...formData,
            investor_id: formData.investor_id,
          };
          response = await api.postDataWithToken(investorLedger, requestData);
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
      Swal.fire("Error", "Failed to submit data. Please try again.", "error");
    } finally {
      setLoadingSubmit(false);
    }
  };

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
                    selectedParty?.customer_type === "party"
                      ? "sup_id"
                      : "buyer_id"
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
                value={formData.cash_amount}
                name="cash_amount"
                onChange={handleInputChange}
              />
            )}
          </Grid>
        </Grid>

        <div className="mt-10">
          <div className={styles.tabPaymentContent}>
            {(activeTab === "cheque" || activeTab === "both") && (
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

            {activeTab === "online" && (
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
            disabled={loadingSubmit}
          >
            {loadingSubmit ? "Submitting..." : "Submit Payments"}
          </button>
        </div>
      </div>

      {responseData && <PaymentReceipt data={responseData} />}
    </div>
  );
};

export default Page;
