"use client";

import React, { useState, useEffect } from "react";
import { Grid, Skeleton, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import InputWithTitle from "@/components/generic/InputWithTitle";
import DropDown from "../../components/generic/dropdown";
import styles from "../../styles/addPurchase.module.css";
import APICall from "../../networkApi/APICall";
import Tabs from "./tabs";
import Swal from "sweetalert2";
import { purchaseBook, suppliers, products } from "../../networkApi/Constants";

const AddPurchaseContent = () => {
  const router = useRouter();
  const api = new APICall();

  const [formData, setFormData] = useState({
    sup_id: "",
    date: "",
    pro_id: "",
    quantity: "",
    packing_type: "",
    bardaanaQuantity: "",
    truckNumber: "",
    freight: "",
    price: "",
    bankTax: "",
    cash_amount: "",
    chequeNumber: "",
    first_weight: "",
    second_weight: "",
    net_weight: "",
    packing_weight: 1,
    bardaanaDeduction: "",
    final_weight: "",
    payment_type: "cash",
  });

  const validateForm = () => {
    const requiredFields = [
      "sup_id",
      "date",
      "pro_id",
      "quantity",
      "packing_type",
      "truckNumber",
      "first_weight",
      "second_weight",
      "net_weight",
      "final_weight",
      "freight",
      "price",
      "cash_amount",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: `Please fill in the following fields: ${missingFields.join(
          ", "
        )}`,
      });
      return false;
    }

    if (formData.payment_type !== "cash" && !formData.chequeNumber) {
      Swal.fire({
        icon: "error",
        title: "Missing Cheque Number",
        text: "Please enter the cheque number for non-cash payments.",
      });
      return false;
    }

    return true;
  };

  const [dropdownValues, setDropdownValues] = useState({
    sup_id: null,
    pro_id: null,
    packing_type: null,
  });

  const [productList, setProducts] = useState([]);
  const [supplierList, setSuppliers] = useState([]);
  const [error, setError] = useState("");
  const [selectedBardaana, setSelectedBardaana] = useState(null);
  const [activeTab, setActiveTab] = useState("cash");

  // Loading states
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [totalAmount, setTotalAmount] = useState(0);

  const [remainingAmount, setRemainingAmount] = useState("0.00");

  const bardaanaList = [
    { id: 1, label: "add" },
    { id: 2, label: "return" },
    { id: 3, label: "paid" },
  ];

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  useEffect(() => {
    const quantity = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.price) || 0;
    const cashAmount = parseFloat(formData.cash_amount) || 0;
    const total = quantity * price;

    // Update total amount
    setTotalAmount(total);

    // Calculate remaining amount
    const remaining = total - cashAmount;

    // Set remaining amount (allow negative values)
    setRemainingAmount(remaining.toFixed(2));
  }, [
    formData.quantity,
    formData.price,
    formData.cash_amount,
    setTotalAmount,
    setRemainingAmount,
  ]);

  useEffect(() => {
    const netWeight = parseFloat(formData.net_weight) || 0;
    const firstWeight = parseFloat(formData.first_weight) || 0;
    const secondWeight = parseFloat(formData.second_weight) || 0;
    const bardaanaDeduction = parseFloat(formData.bardaanaDeduction) || 0;
    const bardaanaQuantity = parseFloat(formData.bardaanaQuantity) || 0;

    const finalWeight =
      netWeight - firstWeight - secondWeight - bardaanaDeduction;
    setFormData((prevData) => ({
      ...prevData,
      final_weight: finalWeight.toFixed(2), // Format to 2 decimal places
    }));

    const weightPerBag = finalWeight
      ? ( finalWeight/ bardaanaQuantity).toFixed(2)
      : 0;
    setFormData((prevData) => ({
      ...prevData,
      weightPerBag,
    }));
  }, [
    formData.net_weight,
    formData.first_weight,
    formData.second_weight,
    formData.bardaanaDeduction,
    formData.bardaanaQuantity,
  ]);
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
      setLoadingSuppliers(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true); // Set loading state to true at the beginning of the fetch

      const response = await api.getDataWithToken(products);
      const filteredProducts = response.data
        .filter((item) => item.product_type === "paddy")
        .map((item, index) => ({
          label: `${item.product_name}`,
          index: index,
          id: item.id,
        }));

      setProducts(filteredProducts); // Set filtered products in the state
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoadingProducts(false); // Set loading state to false once the fetch is complete
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDropdownChange = (name, selectedOption) => {
    setDropdownValues((prev) => ({
      ...prev,
      [name]: selectedOption,
    }));

    if (selectedOption) {
      if (name === "packing_type") {
        setFormData((prev) => ({
          ...prev,
          [name]: selectedOption.label,
        }));
      } else if (name === "sup_id" || name === "pro_id") {
        setFormData((prev) => ({
          ...prev,
          [name]: selectedOption.id.toString(),
        }));
      }
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData((prevState) => ({
      ...prevState,
      payment_type: tab,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoadingSubmit(true);

    try {
      const response = await api.postDataWithToken(purchaseBook, formData);
      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data has been added successfully!",
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add data. Please try again.",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <form>
      <Grid container spacing={2}>
        <Grid className="mt-10" item xs={12} sm={4}>
          {loadingSuppliers ? (
            <Skeleton variant="rectangular" width="100%" height={56} />
          ) : (
            <DropDown
              title="Select Party"
              options={supplierList}
              onChange={handleDropdownChange}
              value={dropdownValues.sup_id}
              name="sup_id"
            />
          )}
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
          {loadingProducts ? (
            <Skeleton variant="rectangular" width="100%" height={56} />
          ) : (
            <DropDown
              title="Select Product"
              options={productList}
              onChange={handleDropdownChange}
              value={dropdownValues.pro_id}
              name="pro_id"
            />
          )}
        </Grid>

        <Grid className="mt-10" item xs={12} sm={4}>
          <DropDown
            title="Select Bardaana"
            options={bardaanaList}
            onChange={handleDropdownChange}
            value={dropdownValues.packing_type}
            name="packing_type"
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

        <Grid className="mt-5" item xs={12} sm={4}>
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
            title={"Net Weight"}
            placeholder={"Net Weight"}
            name="net_weight"
            value={formData.net_weight}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-10" item xs={12} sm={4}>
          <InputWithTitle
            title={"Khoot"}
            placeholder={"Khoot"}
            name="first_weight"
            value={formData.first_weight}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-10" item xs={12} sm={4}>
          <InputWithTitle
            title={"Chungi"}
            placeholder={"Chungi"}
            name="second_weight"
            value={formData.second_weight}
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
            title={"Final Weight"}
            placeholder={"Final Weight"}
            name="final_weight"
            value={formData.final_weight}
            readOnly
          />
        </Grid>

        <Grid className="mt-5" item xs={12} sm={4}>
          <InputWithTitle
            title={"Bardaana Quantity"}
            placeholder={"Enter Bardaana Quantity"}
            name="bardaanaQuantity"
            value={formData.bardaanaQuantity}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-5" item xs={12} sm={4}>
          <InputWithTitle
            title={"Weight Per Bag"}
            placeholder={"Enter Weight Per Bag"}
            name="weightPerBag"
            value={formData.weightPerBag}
            readOnly
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

        <Grid className="mt-5" item xs={12} sm={4}>
          <InputWithTitle
            title={"Enter Quantity"}
            placeholder={"Enter Quantity"}
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-5" item xs={12} sm={4}>
          <InputWithTitle
            title={"Enter Rate"}
            placeholder={"Enter Rate"}
            name="price"
            value={formData.price}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-5" item xs={12} sm={4}>
          <InputWithTitle
            title={"Total Amount"}
            placeholder={"Total Amount"}
            name="price"
            value={totalAmount.toFixed(2)}
            disable
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
            title={"Cash Amount"}
            placeholder={"Cash Amount"}
            name="cash_amount"
            value={formData.cash_amount}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-10" item xs={12} sm={4}>
          <InputWithTitle
            title={"Remaining Amount"}
            placeholder={"Remaining Amount"}
            name="remainingAmount"
            value={remainingAmount} // Display only
            disable
          />
        </Grid>
      </Grid>

      <div className={styles.button_container}>
        <button
          onClick={handleSubmit}
          type="submit"
          className={styles.saveBtn}
          disabled={loadingSubmit}
        >
          {loadingSubmit ? (
            <CircularProgress color="inherit" size={24} />
          ) : formData.id ? (
            "Update"
          ) : (
            "Save"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddPurchaseContent;
