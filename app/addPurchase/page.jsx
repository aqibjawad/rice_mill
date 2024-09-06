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
import {
  purchaseBook,
  suppliers,
  products,
  banks,
} from "../../networkApi/Constants";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const MUND_TO_KG = 40; // 1 mund equals 40 kg

const AddPurchaseContent = () => {
  const router = useRouter();
  const api = new APICall();

  const [formData, setFormData] = useState({
    sup_id: "",
    date: "",
    pro_id: "",
    quantity: "",
    bardaana_type: "",
    bardaana_quantity: "",
    truckNumber: "",
    freight: "",
    price_mann: "",
    bank_tax: 0,
    cash_amount: "",
    cheque_amount: "",
    cheque_no: "",
    khoot: "",
    chungi: "",
    net_weight: "",
    packing_weight: 1,
    bardaana_deduction: "",
    final_weight: "",
    payment_type: "cash",
    transection_id: "",
    bank_id: "",
  });

  const validateForm = () => {
    const requiredFields = [
      "sup_id",
      "date",
      "pro_id",
      "bardaana_type",
      "truckNumber",
      "khoot",
      "chungi",
      "net_weight",
      "final_weight",
      "freight",
      "price_mann",
      "cash_amount",
      "bank_id",
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

    if (formData.payment_type !== "cash" && !formData.cheque_no) {
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
    bardaana_type: null,
    bank_id: null,
  });

  const [productList, setProducts] = useState([]);

  const [supplierList, setSuppliers] = useState([]);
  const [bank, setBank] = useState([]);

  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("cash");

  console.log(activeTab);

  // Loading states
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);

  const [loadingProducts, setLoadingProducts] = useState(true);

  const [loadingBanks, setLoadingBanks] = useState(true);

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [munds, setMunds] = useState("");
  const [kgs, setKgs] = useState("");

  const [totalAmount, steTotalAmounts] = useState(0);

  const [selectedBardaanaId, setSelectedBardaanaId] = useState(1);

  const bardaanaList = [
    { id: 1, label: "add" },
    { id: 2, label: "return" },
    { id: 3, label: "paid" },
  ];

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
    fetchBanks();
  }, []);

  const calculateMunds = (weight) => {
    const weightInKg = parseFloat(weight);
    if (isNaN(weightInKg)) {
      setMunds("");
      setKgs("");
      return;
    }

    const fullMunds = Math.floor(weightInKg / MUND_TO_KG);
    const remainderKg = weightInKg % MUND_TO_KG;

    setMunds(fullMunds.toFixed(0));
    setKgs(remainderKg.toFixed(2));
  };

  useEffect(() => {
    const netWeight = parseFloat(formData.net_weight) || 0;
    const firstWeight = parseFloat(formData.khoot) || 0;
    const secondWeight = parseFloat(formData.chungi) || 0;
    const bardaana_deduction = parseFloat(formData.bardaana_deduction) || 0;
    const bardaana_quantity = parseFloat(formData.bardaana_quantity) || 0;

    const finalWeight =
      netWeight - firstWeight - secondWeight - bardaana_deduction;
    setFormData((prevData) => ({
      ...prevData,
      final_weight: finalWeight.toFixed(2), // Format to 2 decimal places
    }));

    const weightPerBag = finalWeight
      ? (finalWeight / bardaana_quantity).toFixed(2)
      : 0;
    setFormData((prevData) => ({
      ...prevData,
      weightPerBag,
    }));

    // Calculate munds and kgs based on final weight
    calculateMunds(finalWeight);
  }, [
    formData.net_weight,
    formData.khoot,
    formData.chungi,
    formData.bardaana_deduction,
    formData.bardaana_quantity,
  ]);

  const calculatAmount = () => {
    const price_per_munds = formData.price_mann / 40;

    const totalAmount = price_per_munds * formData.final_weight;

    steTotalAmounts(totalAmount);
  };

  useEffect(() => {
    calculatAmount();
  }, [formData]);

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

  const fetchBanks = async () => {
    try {
      const response = await api.getDataWithToken(banks);
      const list = response.data.map((item, index) => ({
        label: `${item.bank_name}`,
        index: index,
        id: item.id,
      }));
      setBank(list);
    } catch (error) {
      console.error("Error fetching banks:", error);
      setError("Failed to fetch banks. Please try again.");
    } finally {
      setLoadingBanks(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true); // Set loading state to true at the beginning of the fetch

      const response = await api.getDataWithToken(products);
      const filteredProducts = response.data.map((item, index) => ({
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
      if (name === "bardaana_type") {
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
    // if (!validateForm()) return;

    setLoadingSubmit(true);

    try {
      const response = await api.postDataWithToken(purchaseBook, formData);

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data has been added successfully!",
        });
        router.push("/purchase/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to add data. Please try again.",
        });
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <form>
      <div className={styles.payment}>Payments</div>

      <Grid container spacing={2}>
        <Grid className="mt-10" item xs={12} lg={4} sm={4}>
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

        <Grid className="mt-3" item xs={12} lg={4} sm={5}>
          <InputWithTitle
            title={"Select Date"}
            type="date"
            placeholder={"Select Date"}
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />
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

        <Grid style={{ marginTop: "4rem" }} item xs={12} sm={4}>
          <DropDown
            title="Select Bardaana"
            options={bardaanaList}
            onChange={handleDropdownChange}
            value={dropdownValues.bardaana_type}
            name="bardaana_type"
          />
        </Grid>

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
            name="khoot"
            value={formData.khoot}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-10" item xs={12} sm={4}>
          <InputWithTitle
            title={"Chungi"}
            placeholder={"Chungi"}
            name="chungi"
            value={formData.chungi}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid className="mt-10" item xs={12} sm={4}>
          <InputWithTitle
            title={"Bardaana Deduction"}
            placeholder={"Bardaana Deduction"}
            name="bardaana_deduction"
            value={formData.bardaana_deduction}
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

        {selectedBardaanaId === 1 && (
          <Grid className="mt-5" item xs={12} sm={4}>
            <InputWithTitle
              title={"Bardaana Quantity"}
              placeholder={"Enter Bardaana Quantity"}
              name="bardaana_quantity"
              value={formData.bardaana_quantity}
              onChange={handleInputChange}
            />
          </Grid>
        )}

        <Grid className="mt-5" item xs={12} sm={4}>
          <InputWithTitle
            title={"Weight Per Bag"}
            placeholder={"Enter Weight Per Bag"}
            name="weightPerBag"
            value={formData.weightPerBag}
            readOnly
          />
        </Grid>

        {/* <Grid className="mt-5" item xs={12} sm={4}>
          <InputWithTitle
            title={"Enter Price Munds"}
            placeholder={"Enter Price Munds"}
            name="price_mann"
            value={formData.price_mann}
            onChange={handleInputChange}
          />
        </Grid> */}

        <Grid className="mt-5" item xs={12} sm={4}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Munds</TableCell>
                  <TableCell>Kgs</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{munds}</TableCell>
                  <TableCell>{kgs}</TableCell>
                  <TableCell>
                    <Grid className="mt-5" item lg={12} xs={12} sm={4}>
                      <InputWithTitle
                        title={"Enter Price Munds"}
                        placeholder={"Enter Price Munds"}
                        name="price_mann"
                        value={formData.price_mann}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
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

        <Grid className="mt-10" item lg={4} xs={6}>
          <InputWithTitle title={"Amount"} value={totalAmount} readOnly />
        </Grid>

        <Grid className="mt-6" item xs={12} lg={12} md={12} sm={12}>
          <Tabs activeTab={activeTab} setActiveTab={handleTabChange} />
        </Grid>

        {activeTab === "cash" && (
          <Grid className="mt-10" item lg={6} xs={12} sm={4}>
            <InputWithTitle
              title={"Cash Amount"}
              placeholder={"Cash Amount"}
              name="cash_amount"
              value={formData.cash_amount}
              onChange={handleInputChange}
            />
          </Grid>
        )}

        {activeTab === "both" && (
          <Grid className="mt-10" item lg={4} xs={12} sm={4}>
            <InputWithTitle
              title={"Cash Amount"}
              placeholder={"Cash Amount"}
              name="cash_amount"
              value={formData.cash_amount}
              onChange={handleInputChange}
            />
          </Grid>
        )}

        {activeTab === "cheque" && (
          <>
            <Grid style={{ marginTop: "4rem" }} item xs={12} sm={4}>
              {loadingBanks ? (
                <Skeleton variant="rectangular" width="100%" height={56} />
              ) : (
                <DropDown
                  title="Select Banks"
                  options={bank}
                  onChange={handleDropdownChange}
                  value={dropdownValues.bank_id}
                  name="bank_id"
                />
              )}
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
              <InputWithTitle
                title={"Cheque Number"}
                placeholder={"Cheque Number"}
                name="cheque_no"
                value={formData.cheque_no}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
              <InputWithTitle
                title={"Cheque Amount"}
                placeholder={"Cheque Amount"}
                name="cheque_amount"
                value={formData.cheque_amount}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
              <InputWithTitle
                title={"Bank Tax"}
                placeholder={"Bank Tax"}
                name="bank_tax"
                value={formData.bank_tax}
                onChange={handleInputChange}
              />
            </Grid>
          </>
        )}

        {activeTab === "both" && (
          <>
            <Grid style={{ marginTop: "4rem" }} item xs={12} sm={4}>
              {loadingBanks ? (
                <Skeleton variant="rectangular" width="100%" height={56} />
              ) : (
                <DropDown
                  title="Select Banks"
                  options={bank}
                  onChange={handleDropdownChange}
                  value={dropdownValues.bank_id}
                  name="bank_id"
                />
              )}
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
              <InputWithTitle
                title={"Cheque Number"}
                placeholder={"Cheque Number"}
                name="cheque_no"
                value={formData.cheque_no}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
              <InputWithTitle
                title={"Cheque Amount"}
                placeholder={"Cheque Amount"}
                name="cheque_amount"
                value={formData.cheque_amount}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
              <InputWithTitle
                title={"Bank Tax"}
                placeholder={"Bank Tax"}
                name="bank_tax"
                value={formData.bank_tax}
                onChange={handleInputChange}
              />
            </Grid>
          </>
        )}

        {activeTab === "online" && (
          <>
            <Grid style={{ marginTop: "4rem" }} item xs={12} sm={4}>
              {loadingBanks ? (
                <Skeleton variant="rectangular" width="100%" height={56} />
              ) : (
                <DropDown
                  title="Select Banks"
                  options={bank}
                  onChange={handleDropdownChange}
                  value={dropdownValues.bank_id}
                  name="bank_id"
                />
              )}
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
              <InputWithTitle
                title={"Transaction Number"}
                placeholder={"Transaction Number"}
                name="transection_id"
                value={formData.transection_id}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
              <InputWithTitle
                title={"Bank Tax"}
                placeholder={"Bank Tax"}
                name="bank_tax"
                value={formData.bank_tax}
                onChange={handleInputChange}
              />
            </Grid>
          </>
        )}
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
