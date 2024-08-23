"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/paymentRecieves.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import MultilineInput from "../../components/generic/MultilineInput";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Swal from 'sweetalert2'; // Import SweetAlert2

import { buyer, banks, buyerLedger, bankCheque } from "../../networkApi/Constants";
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
  const [activeTab, setActiveTab] = useState("cash");
  const [tablePartyData, setPartyData] = useState([]);

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
    const { buyer_id, payment_type, cash_amount, cheque_no, cheque_date, cheque_amount, bank_id } = formData;

    if (!buyer_id) {
      Swal.fire('Validation Error', 'Buyer is required', 'error');
      return false;
    }

    if (payment_type === "cash") {
      if (!cash_amount || isNaN(cash_amount) || parseFloat(cash_amount) <= 0) {
        Swal.fire('Validation Error', 'Valid cash amount is required', 'error');
        return false;
      }
    } else if (payment_type === "cheque") {
      if (!bank_id) {
        Swal.fire('Validation Error', 'Bank selection is required for cheque payment', 'error');
        return false;
      }
      if (!cheque_no) {
        Swal.fire('Validation Error', 'Cheque number is required', 'error');
        return false;
      }
      if (!cheque_date) {
        Swal.fire('Validation Error', 'Cheque date is required', 'error');
        return false;
      }
      if (!cheque_amount || isNaN(cheque_amount) || parseFloat(cheque_amount) <= 0) {
        Swal.fire('Validation Error', 'Valid cheque amount is required', 'error');
        return false;
      }
    } else {
      Swal.fire('Validation Error', 'Invalid payment type', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoadingSubmit(true);
    try {
      let response;
      if (formData.payment_type === "cash") {
        response = await api.postDataWithToken(buyerLedger, formData);
        Swal.fire('Success', 'Your data has been added!', 'success');
        router.push("/inflow");
      } else if (formData.payment_type === "cheque") {
        response = await api.postDataWithToken(bankCheque, formData);
        Swal.fire('Success', 'Your data has been added!', 'success');
        router.push("/inflow");
      } else {
        throw new Error("Invalid payment type");
      }
      console.log("Success:", response);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire('Error', 'An error occurred while submitting the payment', 'error');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div>
      <div className={styles.recievesHead}>Add Amount Receives</div>
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
                  value={tablePartyData.find(option => option.id === formData.buyer_id) || null}
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
