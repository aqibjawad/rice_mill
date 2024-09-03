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

import { suppliers, banks, supplierLedger } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import DropDown from "@/components/generic/dropdown";

const Online = () => {
  const router = useRouter();
  const api = new APICall();

  const [formData, setFormData] = useState({
    sup_id: "",
    payment_type: "online",
    description: "",
    cash_amount: "",
    bank_id: "",
    transection_id: "",
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
      const response = await api.getDataWithToken(suppliers);
      const data = response.data;
      if (Array.isArray(data)) {
        const formattedData = data.map((supply) => ({
          label: supply.person_name,
          id: supply.id,
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
      setLoading(false); // Assuming bank data loading is also complete here
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

  const validateForm = () => {
    const {
      sup_id,
      payment_type,
      cash_amount,
      cheque_no,
      cheque_date,
      transection_id,
      bank_id,
      description,
    } = formData;

    if (!sup_id) {
      Swal.fire("Error", "Supplier is required", "error");
      return false;
    }

    if (payment_type === "online" && !cash_amount) {
      Swal.fire("Error", "Cash amount is required for cash payment", "error");
      return false;
    }

    if (payment_type === "online" && !description) {
      Swal.fire("Error", "Description is required for cash payment", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoadingSubmit(true);
    try {
      const response = await api.postDataWithToken(supplierLedger, formData);
      console.log("Success:", response);
      Swal.fire("Success", "Payments Added!", "success");
      router.push("/outflow");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire(
        "Error",
        "An error occurred while submitting the payment",
        "error"
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div>
      <div className="mt-10">
        <div className={styles.tabPaymentContent}>
          <Grid container spacing={2} className="mt-10">
            <Grid item xs={12} md={6}>
              {loading ? (
                <Skeleton variant="rectangular" width="100%" height={56} />
              ) : (
                <div className="mt-5">
                  <DropDown
                    title="Select Supplier"
                    options={tablePartyData}
                    onChange={handleDropdownChange}
                    value={
                      tablePartyData.find(
                        (option) => option.id === formData.sup_id
                      ) || null
                    }
                    name="sup_id"
                  />
                </div>
              )}
            </Grid>

            <Grid item xs={12} md={6} className="mt-5">
              {loading ? (
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
                value={formData.cash_amount}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

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

export default Online;
