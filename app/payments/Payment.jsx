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
  party,
  banks,
  partyLedger,
  investors,
  suppliers,
  supplierLedger,
  investorLedger,
} from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import DropDown from "@/components/generic/dropdown";

const Page = () => {
  const api = new APICall();
  const router = useRouter();

  const [formData, setFormData] = useState({
    party_id: "",
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
    fetchInvestorsData();
  }, []);

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

      const selectedParty = tablePartyData.find(
        (party) =>
          party.id === formData.party_id || party.id === formData.investor_id
      );

      if (selectedParty) {
        switch (selectedParty.customer_type) {
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
            response = await api.postDataWithToken(investorLedger, requestData);
            break;

          default:
            throw new Error("Invalid customer type");
        }

        // Check if the response status is "success"
        if (response?.status === "success") {
          setResponseData(response);
          Swal.fire("Success", "Your data has been added!", "success");

          // Redirect based on the customer type
          switch (selectedParty.customer_type) {
            case "buyer":
              // router.push("/Buyer");
              break;
            case "investor":
              router.push("/investor");
              break;
          }
        } else {
          throw new Error(response?.message || "Failed to process the request");
        }
      } else {
        throw new Error("Selected party not found");
      }
    } catch (error) {
      console.error("Error submitting data:", error.message);
      Swal.fire("Error", error.message, "error");
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
                  selectedParty?.customer_type === "party"
                    ? "sup_id"
                    : "party_id"
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
