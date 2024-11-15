"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/paymentRecieves.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import MultilineInput from "../../components/generic/MultilineInput";
import DropDown2 from "@/components/generic/DropDown2";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Swal from "sweetalert2";
import PaymentReceipt from "../paymentReciept/page";
import {
  buyer,
  suppliers,
  banks,
  buyerLedger,
  supplierLedger,
  bankCheque,
} from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import { useRouter } from "next/navigation";

const Page = () => {
  const api = new APICall();
  const router = useRouter();

  const [formData, setFormData] = useState({
    buyer_id: "",
    sup_iid: "",
    customer_type: "",
    payment_type: "cash",
    description: "",
    cash_amount: "",
    bank_id: "",
    cheque_no: "",
    cheque_date: "",
    cheque_amount: "",
    transection_id: "",
  });

  const [tableBankData, setTableBankData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [activeTab, setActiveTab] = useState("cash");
  const [responseData, setResponseData] = useState(null); // Ensure this is defined
  const [tablePartyData, setTablePartyData] = useState(null); // Ensure this is defined

  console.log(tablePartyData);

  useEffect(() => {
    fetchData();
    fetchBankData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch both endpoints simultaneously
      const [suppliersResponse, buyersResponse] = await Promise.all([
        api.getDataWithToken(suppliers),
        api.getDataWithToken(buyer),
      ]);

      // Combine and format data
      const formattedData = [
        ...(suppliersResponse.data || []),
        ...(buyersResponse.data || []),
      ].map((item) => ({
        id: item.id,
        label: `${item.person_name} (${
          item.customer_type.charAt(0).toUpperCase() +
          item.customer_type.slice(1)
        })`,
        customer_type: item.customer_type,
      }));

      setTablePartyData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBankData = async () => {
    try {
      const response = await api.getDataWithToken(banks);
      const data = response.data.map((bank) => ({
        label: bank.bank_name,
        id: bank.id,
      }));
      setTableBankData(data);
    } catch (error) {
      console.error("Error fetching bank data:", error.message);
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
      // Clear both IDs first
      buyer_id: "",
      sup_id: "",
      // Set the appropriate ID based on customer type
      ...(selectedOption.customer_type === "buyer"
        ? { buyer_id: selectedOption.id }
        : { sup_id: selectedOption.id }),
      customer_type: selectedOption.customer_type,
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
      const endpoint =
        formData.customer_type === "buyer" ? buyerLedger : supplierLedger;

      // Prepare request data based on payment type
      let requestData = { ...formData };

      // Remove the unused ID field before sending
      if (formData.customer_type === "buyer") {
        delete requestData.sup_id;
      } else {
        delete requestData.buyer_id;
      }

      let response;
      if (["cash", "online"].includes(formData.payment_type)) {
        response = await api.postDataWithToken(endpoint, requestData);
      } else if (formData.payment_type === "cheque") {
        response = await api.postDataWithToken(bankCheque, requestData);
      } else {
        throw new Error("Invalid payment type");
      }

      setResponseData(response);
      router.push(`/${formData.customer_type}`);
      Swal.fire("Success", "Your data has been added!", "success");
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("Error", "Failed to submit data. Please try again.", "error");
    } finally {
      setLoadingSubmit(false);
    }
  };
  return (
    <div className="min-h-screen w-full overflow-x-hidden px-4 md:px-6">
      <div className={styles.recievesHead}>Add Amount Receives</div>

      {/* Payment Type Tabs */}
      <div className="mt-10">
        <div className={styles.tabPaymentContainer}>
          {["cash", "cheque", "online"].map((type) => (
            <button
              key={type}
              className={`${styles.tabPaymentButton} ${
                activeTab === type ? styles.active : ""
              }`}
              onClick={() => handleTabClick(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Grid container spacing={2} className="mt-10">
          <Grid className="mt-5" item xs={12} md={6}>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height={56} />
            ) : (
              <DropDown2
                title="Select Buyer/Supplier"
                options={tablePartyData}
                onChange={(option) =>
                  handleDropdownChange("customer_id", option)
                }
                value={
                  tablePartyData.find((option) => option.id === formData.id) ||
                  null
                }
                name="customer_id"
              />
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {activeTab === "cash" && (
              <InputWithTitle
                title="Amount"
                type="number"
                placeholder="Amount"
                value={formData.cash_amount}
                name="cash_amount"
                onChange={(e) => {
                  let value = e.target.value;

                  // Remove any existing negative sign first
                  value = value.replace("", "-");

                  // For supplier, always make the value negative
                  const finalValue =
                    formData.customer_type === "supplier" ? `-${value}` : value;

                  setFormData((prev) => ({
                    ...prev,
                    cash_amount: finalValue,
                  }));
                }}
                // Disable direct negative input
                onKeyDown={(e) => {
                  if (e.key === "-" || e.keyCode === 189) {
                    e.preventDefault();
                  }
                }}
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
