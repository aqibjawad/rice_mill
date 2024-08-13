"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Grid } from "@mui/material";
import { useSearchParams } from 'next/navigation';
import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "../../components/generic/dropdown";
import styles from "../../styles/addPurchase.module.css";
import { supplierLedger, suppliers, products } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import Tabs from "./tabs";

export const dynamic = 'force-dynamic';

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
  const api = new APICall();

  const [formData, setFormData] = useState({
    customer_id: "",
    date: "",
    product_id: "",
    quantity: "",
    bardaana: "",
    bardaanaQuantity: "",
    truckNumber: "",
    freight: "",
    totalAmount: "",
    bankTax: "",
    amount: "",
    chequeNumber: "",
    remainingAmount: "",
    firstWeight: "",
    secondWeight: "",
    netWeight: "",
    bardaanaDeduction: "",
    saafiWeight: "",
    payment_type: "cash"
  });

  const [productList, setProducts] = useState([]);
  const [supplierList, setSuppliers] = useState([]);
  const [error, setError] = useState('');
  const [selectedBardaana, setSelectedBardaana] = useState(null);
  const [activeTab, setActiveTab] = useState("cash");

  const bardaanaList = [
    { id: 1, name: 'Jama' },
    { id: 2, name: 'Wapisi' },
    { id: 3, name: 'Ada Shuda' },
  ];

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();

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
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.getDataWithToken(products);
      const list = response.data.map((item, index) => ({
        label: `${item.product_name}`,
        index: index,
        id: item.id,
      }));
      setProducts(list);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again.");
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
        customer_id: selectedOption.id.toString()
      }));
    }   
  };

  const handleProductChange = (event, selectedOption) => {
    if (selectedOption && selectedOption.id) {
      setFormData(prevState => ({
        ...prevState,
        product_id: selectedOption.id.toString()
      }));
    }
  };

  const handleBardaanaChange = (selectedOption) => {
    if (selectedOption && selectedOption.name) {
      setFormData(prevState => ({
        ...prevState,
        bardaana: selectedOption.name
      }));
      setSelectedBardaana(selectedOption);
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
    try {
      let response;
      if (formData.id) {
        response = await api.putDataWithToken(`${supplierLedger}/${formData.id}`, formData);
      } else {
        response = await api.postDataWithToken(supplierLedger, formData);
      }
      
      if (response.status === 200) {
        alert('Form submitted successfully');
        window.location.href = '/purchase';
      } else {
        alert('Error submitting form');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting form');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid className="mt-10" item xs={12} sm={4}>
          <Dropdown
            title="Select Party"
            options={supplierList}
            onChange={handlePartyChange}
            value={supplierList.find(supplier => supplier.id.toString() === formData.customer_id)}
          /> 
        </Grid>

        <Grid className="mt-3" item xs={12} sm={5}>
          <InputWithTitle
            title={"Select Date"}
            type="date"
            placeholder={"Select Date"}
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-6" item xs={12} sm={3}>
          <Tabs activeTab={activeTab} setActiveTab={handleTabChange} />
        </Grid>

        <Grid className="mt-10" item xs={12} sm={4}>
          <Dropdown
            title="Select Product"
            options={productList}
            onChange={handleProductChange}
            value={productList.find(product => product.id.toString() === formData.product_id)}
          />
        </Grid>

        <Grid className="mt-5" item xs={12} sm={4}>
          <InputWithTitle
            title={"Enter Quantity"}
            placeholder={"Enter Quantity"}
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-10" item xs={12} sm={4}>
          <Dropdown
            title="Select Bardaana"
            options={bardaanaList}
            onChange={handleBardaanaChange}
            value={bardaanaList.find(b => b.name === formData.bardaana)}
          />
        </Grid>

        {selectedBardaana && selectedBardaana.id === 1 && (
          <Grid className="mt-10" item xs={12} sm={4}>
            <InputWithTitle
              title={"Bardaana Quantity"}
              placeholder={"Enter Bardaana Quantity"}
              name="bardaanaQuantity"
              value={formData.bardaanaQuantity}
              onChange={handleInputChange}
            />
          </Grid>
        )}

        <Grid className="mt-10" item xs={12} sm={4}>
          <InputWithTitle
            title={"Truck Number"}
            placeholder={"Enter Truck Number"}
            name="truckNumber"
            value={formData.truckNumber}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-10" item xs={12} sm={4}>
          <InputWithTitle
            title={"Freight"}
            placeholder={"Enter Freight"}
            name="freight"
            value={formData.freight}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-10" item xs={12} sm={4}>
          <InputWithTitle
            title={"Total Amount"}
            placeholder={"Total Amount"}
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-10" item xs={12} sm={4}>
          <InputWithTitle
            title={"Bank Tax"}
            placeholder={"Bank Tax"}
            name="bankTax"
            value={formData.bankTax}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-10" item xs={12} sm={4}>
          <InputWithTitle
            title={"Net Amount"}
            placeholder={"Net Amount"}
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
          />
        </Grid>

        {activeTab !== "cash" && (
          <Grid className="mt-10" item xs={12} sm={4}>
            <InputWithTitle
              title={"Cheque Number"}
              placeholder={"Cheque Number"}
              name="chequeNumber"
              value={formData.chequeNumber}
              onChange={handleInputChange}
            />
          </Grid>
        )}

        <Grid className="mt-10" item xs={12} sm={4}>
          <InputWithTitle
            title={"Remaining Amount"}
            placeholder={"Remaining Amount"}
            name="remainingAmount"
            value={formData.remainingAmount}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-10" item xs={12} sm={4}>
          <InputWithTitle
            title={"First Weight"}
            placeholder={"First Weight"}
            name="firstWeight"
            value={formData.firstWeight}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-10" item xs={12} sm={4}>
          <InputWithTitle
            title={"Second Weight"}
            placeholder={"Second Weight"}
            name="secondWeight"
            value={formData.secondWeight}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-10" item xs={12} sm={4}>
          <InputWithTitle
            title={"Net Weight"}
            placeholder={"Net Weight"}
            name="netWeight"
            value={formData.netWeight}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-10" item xs={12} sm={4}>
          <InputWithTitle
            title={"Bardaana Deduction"}
            placeholder={"Bardaana Deduction"}
            name="bardaanaDeduction"
            value={formData.bardaanaDeduction}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-10" item xs={12} sm={4}>
          <InputWithTitle
            title={"Saafi Weight"}
            placeholder={"Saafi Weight"}
            name="saafiWeight"
            value={formData.saafiWeight}
            onChange={handleInputChange}
          />
        </Grid>

        <div className={styles.button_container}>
          <button type="submit" className={styles.saveBtn}>
            {formData.id ? 'Update' : 'Save'}
          </button>
        </div>
      </Grid>
    </form>
  );
}

export default AddSupplierLedger;