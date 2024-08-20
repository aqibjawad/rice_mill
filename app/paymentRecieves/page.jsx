"use client";

import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import styles from "../../styles/paymentRecieves.module.css";

import DropDown from "@/components/generic/dropdown";

import buyer from "../../networkApi/Constants";

import APICall from "@/networkApi/APICall";

import InputWithTitle from "@/components/generic/InputWithTitle";
import MultilineInput from "@/components/generic/MultilineInput";

const Page = () => {
  const api = new APICall();

  const [buyerData, setBuyerData] = useState([]);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("tab1");

  useEffect(() => {
    fetchBuyerData();
  }, []);

  const fetchBuyerData = async () => {
    try {
      const response = await api.getDataWithToken(buyer);
      console.log("API Response:", response);
      const data = response.data;
      if (Array.isArray(data)) {
        const formattedData = data.map((buyers) => ({
          label: buyers.expense_category,
          id: buyers.id,
        }));
        setBuyerData(formattedData);
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setError(error.message);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
        <div className={styles.paymentHeader}>
            Add Recieve Payments
        </div>
      <div className={styles.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={6}>
            <DropDown
              title="Select Expense Category"
              options={buyerData}
              // onChange={handleDropdownChange}
              // value={formData.expense_category_id}
              // name="expense_category_id"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={6}>
            <div className={styles.tabPaymentContainer}>
              <button
                className={`${styles.tabPaymentButton} ${
                  activeTab === "tab1" ? styles.active : ""
                }`}
                onClick={() => handleTabClick("tab1")}
              >
                Cash
              </button>
              <button
                className={`${styles.tabPaymentButton} ${
                  activeTab === "tab2" ? styles.active : ""
                }`}
                onClick={() => handleTabClick("tab2")}
              >
                Cheque
              </button>
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={12}>
            <div className={styles.tabPaymentContent}>
              {activeTab === "tab1" && (
                <Grid container spacing={2} className="">
                  <Grid item xs={12} md={4} lg={6}>
                    <InputWithTitle
                      title="Cash Amount"
                      type="text"
                      placeholder="Cash Amount"
                      name="cheque_no"
                      // value={formData.cheque_no}
                      // onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={4} lg={6}>
                    <MultilineInput
                      title="Description"
                      type="text"
                      placeholder="Description"
                      name="cheque_no"
                      // value={formData.cheque_no}
                      // onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              )}
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={12}>
            <div className={styles.tabPaymentContent}>
              {activeTab === "tab2" && (
                <Grid container spacing={2} className="">
                  <Grid item xs={12} md={4} lg={6}>
                    <InputWithTitle
                      title="Cheque Number"
                      type="text"
                      placeholder="Cheque Number"
                      name="cheque_no"
                      // value={formData.cheque_no}
                      // onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={4} lg={6}>
                    <InputWithTitle
                      title="Cheque Amount"
                      type="text"
                      placeholder="Cheque Amount"
                      name="cheque_no"
                      // value={formData.cheque_no}
                      // onChange={handleInputChange}
                    />
                  </Grid>

                  <Grid className="mt-5" item xs={12} md={4} lg={12}>
                    <MultilineInput
                      title="Description"
                      type="text"
                      placeholder="Description"
                      name="cheque_no"
                      // value={formData.cheque_no}
                      // onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              )}
            </div>
          </Grid>
        </Grid>

        <div className={styles.btnCont}>
          <div className={styles.saveBtn}>Submit Your Information</div>
        </div>
      </div>
    </div>
  );
};

export default Page;
