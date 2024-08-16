"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Grid, Skeleton, CircularProgress } from "@mui/material";
import { useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2'; // Import SweetAlert2

import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "../../components/generic/dropdown";
import MultilineInput from "@/components/generic/MultilineInput";

import styles from "../../styles/addPurchase.module.css";
import { supplierLedger, suppliers, banks } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import Tabs from "./tabs"; 

export const dynamic = 'force-dynamic';

import { useRouter } from "next/navigation"; 
import withAuth from "@/utils/withAuth";

const SearchParamsWrapper = ({ children }) => {
  const searchParams = useSearchParams();
  return children(searchParams);
};

const AddSupplierLedger = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsWrapper>
        {(searchParams) => <AddSupplierContent searchParams={searchParams} />}
      </SearchParamsWrapper>
    </Suspense>
  );
};

const AddSupplierContent = ({ searchParams }) => {

  const router = useRouter();

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true); 
  const [loadingBanks, setLoadingBanks] = useState(true); 

  const api = new APICall();

  const [formData, setFormData] = useState({
    sup_id: "",
    payment_type: "cash",
    description: "",
    cheque_amount: "",
    cash_amount: "",
    cheque_no: "",
    cheque_date: "",
    bank_id: ""
  });

  const [supplierList, setSuppliers] = useState([]);
  const [bankList, setBanks] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState("cash");

  useEffect(() => {
    fetchSuppliers();
    fetchBanks();

    const editData = searchParams.get('editData');
    if (editData) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(editData));
        setFormData(prevState => ({
          ...prevState,
          ...decodedData
        }));
        setActiveTab(decodedData.payment_type || "cash");
      } catch (error) {
        console.error('Error parsing edit data:', error);
      }
    }
  }, [searchParams]);

  const fetchSuppliers = async () => {
    try {
      const response = await api.getDataWithToken(suppliers);
      const list = response.data.map((item, index) => ({
        label: `${item.person_name}`,
        index: index,
        id: item.id,
      }));
      setSuppliers(list);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setError("Failed to fetch suppliers. Please try again.");
    } finally {
      setLoadingSuppliers(false); // Set loading to false after fetching
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await api.getDataWithToken(banks);
      const list = response.data.map((item, index) => ({
        label: `${item.bank_name}`,
        index: index,
        id: item.id,
      }));
      setBanks(list);
    } catch (error) {
      console.error("Error fetching banks:", error);
      setError("Failed to fetch banks. Please try again.");
    } finally {
      setLoadingBanks(false); // Set loading to false after fetching
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePartyChange = (event, selectedOption) => {
    if (selectedOption && selectedOption.id) {
      setFormData(prevState => ({
        ...prevState,
        sup_id: selectedOption.id.toString()
      }));
    }
  };

  const handleBankChange = (event, selectedOption) => {
    if (selectedOption && selectedOption.id) {
      setFormData(prevState => ({
        ...prevState,
        bank_id: selectedOption.id.toString()
      }));
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData(prevState => ({
      ...prevState,
      payment_type: tab
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true); // Start loading

    try {
      let response;
      if (formData.id) {
        response = await api.updateFormDataWithToken(`${supplierLedger}/${formData.id}`, formData);
      } else {
        response = await api.postDataWithToken(supplierLedger, formData);
      }

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Data saved successfully!',
        });
        window.location.href = '/purchase';
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to submit the form. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred. Please try again later.',
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid className="mt-10" item xs={12} sm={4} lg={6}>
          {loadingSuppliers ? (
            <Skeleton variant="rectangular" height={56} />
          ) : (
            <Dropdown
              title="Select Party"
              options={supplierList}
              onChange={handlePartyChange}
              value={supplierList.find(supplier => supplier.id.toString() === formData.sup_id)}
            />
          )}
        </Grid>

        <Grid className="mt-6" item xs={12} sm={3} lg={6}>
          <Tabs activeTab={activeTab} setActiveTab={handleTabChange} />
        </Grid>

        <Grid className="mt-10" item xs={12} sm={4} lg={6}>
          <InputWithTitle
            title={"Cash amount"}
            placeholder={"Cash Amount"}
            name="cash_amount"
            value={formData.cash_amount}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-10" item xs={12} sm={4} lg={6}>
          <MultilineInput
            title={"description"}
            placeholder={"description"}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </Grid>

        {activeTab !== "cash" && (
          <>
            <Grid style={{ marginTop: "4rem" }} item xs={12} sm={4} lg={3}>
              {loadingBanks ? (
                <Skeleton variant="rectangular" height={56} />
              ) : (
                <Dropdown
                  title="Select Bank"
                  options={bankList}
                  onChange={handleBankChange}
                  value={bankList.find(banks => banks.id.toString() === formData.bank_id)}
                />
              )}
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4} lg={3}>
              <InputWithTitle
                title={"Cheque Number"}
                placeholder={"Cheque Number"}
                name="cheque_no"
                value={formData.cheque_no}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4} lg={3}>
              <InputWithTitle
                title={"Cheque Amount"}
                placeholder={"Cheque Amount"}
                name="cheque_amount"
                value={formData.cheque_amount}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4} lg={3}>
              <InputWithTitle
                title={"Cheque date"}
                type={"date"}
                placeholder={"Cheque date"}
                name="cheque_date"
                value={formData.cheque_date}
                onChange={handleInputChange}
              />
            </Grid>
          </>
        )}
      </Grid>

      <div className={styles.button_container}>
        <button type="submit" className={styles.saveBtn} disabled={loadingSubmit}>
          {loadingSubmit ? (
            <CircularProgress color="inherit" size={24} />
          ) : (
            formData.id ? 'Update' : 'Save'
          )}
        </button>
      </div>
    </form>
  );
}

export default withAuth(AddSupplierLedger);
