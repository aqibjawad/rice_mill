"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/paymentRecieves.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import MultilineInput from "../../components/generic/MultilineInput";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import Grid from "@mui/material/Grid";

import {
  buyer,
  banks,
  buyerLedger,
  bankCheque,
} from "../../networkApi/Constants";

import APICall from "../../networkApi/APICall";

import DropDown from "@/components/generic/dropdown";

import { useRouter } from "next/navigation";

const Page = () => {
  const api = new APICall();

  const router = useRouter();

  const [formData, setFormData] = useState({
    buyer_id: "",
    payment_type: "",
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

  const [tablePartyData, setPartyData] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    fetchBankData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.getDataWithToken(buyer);
      const data = response.data;

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
      console.error("Error fetching data:", error.message);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    try {
      let response;
      if (formData.payment_type === "cash") {
        response = await api.postDataWithToken(buyerLedger, formData);
        alert("Your Data is added!")
        router.push("/inflow");
      } else if (formData.payment_type === "cheque") {
        response = await api.postDataWithToken(bankCheque, formData);
        router.push("/inflow");
      } else {
        throw new Error("Invalid payment type");
      }
      console.log("Success:", response);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingSubmit(false);
    }
  };
  return (
    <div>
      <div className={styles.recievesHead}>Add Amount Recieves</div>
      <div>
        <Grid container spacing={2} className="mt-10">
          <Grid item xs={12} md={6}>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height={56} />
            ) : (
              <div className="mt-5">
                <DropDown
                  title="Select Buyer"
                  options={tablePartyData}
                  onChange={handleDropdownChange}
                  value={formData.buyer_id}
                  name="buyer_id"
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
          </div>

          <div className={styles.tabPaymentContent}>
            {activeTab === "cheque" || activeTab === "both" ? (
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
    </div>
  );
};

export default Page;
