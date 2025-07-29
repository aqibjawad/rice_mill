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
  party,
  products,
  banks,
  seasons,
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
import DropDown3 from "@/components/generic/dropdown3";

const MUND_TO_KG = 40;

const AddPurchaseContent = () => {
  const router = useRouter();
  const api = new APICall();

  const [formData, setFormData] = useState({
    sup_id: "",
    season_id: "",
    date: "",
    pro_id: "",
    quantity: "",
    bardaana_type: "",
    bardaana_quantity: "",
    bardaana_given: "", // New field - Bardaana dia kitna
    bardaana_kept: "", // New field - Hmny rakha kitna
    truck_no: "",
    freight: "",
    price_mann: "",
    bank_tax: 0,
    cash_amount: "0",
    cheque_amount: "",
    cheque_no: "",
    cheque_date: " ",
    khoot: "",
    chungi: "",
    net_weight: "",
    packing_weight: 1,
    bardaana_deduction: "",
    final_weight: "",
    payment_type: "cash",
    transection_id: "",
    bank_id: "",
    bardaana_amount: "0",
    description: "Purchase",
  });

  const [dropdownValues, setDropdownValues] = useState({
    sup_id: null,
    pro_id: null,
    bardaana_type: null,
    bank_id: null,
  });

  const [productList, setProducts] = useState([]);
  const [seasonsList, setSeasons] = useState([]);
  const [supplierList, setSuppliers] = useState([]);
  const [bank, setBank] = useState([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("cash");
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [loadingSeasons, setLoadingSeasons] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [munds, setMunds] = useState("");
  const [kgs, setKgs] = useState("");
  const [totalAmount, setTotalAmounts] = useState(0);
  const [selectedBardaanaId, setSelectedBardaanaId] = useState(null);

  const bardaanaList = [
    { id: 1, label: "add" },
    { id: 2, label: "return" },
    { id: 3, label: "paid in cash" },
    { id: 4, label: "paid in ledger" },
  ];

  const bardaanaType = [
    { id: 1, label: "Bori" },
    { id: 2, label: "Tora" },
  ];

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
    fetchBanks();
    fetchSeasons();
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
      final_weight: finalWeight.toFixed(2),
    }));

    const weightPerBag = finalWeight
      ? (finalWeight / bardaana_quantity).toFixed(2)
      : 0;
    setFormData((prevData) => ({
      ...prevData,
      weightPerBag,
    }));

    calculateMunds(finalWeight);
  }, [
    formData.net_weight,
    formData.khoot,
    formData.chungi,
    formData.bardaana_deduction,
    formData.bardaana_quantity,
  ]);

  const calculateAmount = () => {
    const price_per_munds = formData.price_mann / 40;
    const totalAmount = price_per_munds * formData.final_weight;
    setTotalAmounts(totalAmount);
  };

  useEffect(() => {
    calculateAmount();
  }, [formData]);

  const fetchSuppliers = async () => {
    try {
      const response = await api.getDataWithToken(party);
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

  const fetchSeasons = async () => {
    try {
      setLoadingSeasons(true);
      const response = await api.getDataWithToken(seasons);
      const filteredProducts = response.data.map((item, index) => ({
        label: item.name,
        index: index,
        id: item.id,
      }));
      setSeasons(filteredProducts);

      // Auto-select the last season
      if (filteredProducts.length > 0) {
        const lastSeason = filteredProducts[filteredProducts.length - 1];
        setDropdownValues((prev) => ({
          ...prev,
          season_id: lastSeason,
        }));
        setFormData((prev) => ({
          ...prev,
          season_id: lastSeason.id,
        }));
        setSelectedSeasonName(lastSeason.label);
      }
    } catch (error) {
      console.error("Error fetching seasons:", error);
      setError("Failed to fetch seasons. Please try again.");
    } finally {
      setLoadingSeasons(false);
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
      setLoadingProducts(true);
      const response = await api.getDataWithToken(products);
      const filteredProducts = response.data.map((item, index) => ({
        label: `${item.product_name}`,
        index: index,
        id: item.id,
      }));
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setFormData((prevData) => ({
      ...prevData,
      date: currentDate,
    }));
  }, []);

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
        // Set the selected bardaana ID to show/hide conditional fields
        setSelectedBardaanaId(selectedOption.id);
      } else if (["sup_id", "pro_id", "bank_id"].includes(name)) {
        setFormData((prev) => ({
          ...prev,
          [name]: selectedOption.id.toString(),
        }));
      }
    }
  };

  const validateForm = () => {
    const errors = [];

    // Required field validations
    if (!formData.sup_id || formData.sup_id === "") {
      errors.push("Supplier is required");
    }

    if (!formData.season_id || formData.season_id === "") {
      errors.push("Season is required");
    }

    if (!formData.date || formData.date === "") {
      errors.push("Date is required");
    }

    if (!formData.pro_id || formData.pro_id === "") {
      errors.push("Product is required");
    }

    if (!formData.price_mann || parseFloat(formData.price_mann) <= 0) {
      errors.push("Price per mann is required and must be greater than 0");
    }

    if (!formData.net_weight || parseFloat(formData.net_weight) <= 0) {
      errors.push("Net weight is required and must be greater than 0");
    }

    if (!formData.final_weight || parseFloat(formData.final_weight) <= 0) {
      errors.push("Final weight is required and must be greater than 0");
    }

    if (!formData.khoot) {
      errors.push("Khoot is required");
    }

    if (!formData.chungi) {
      errors.push("chungi is required");
    }

    if (!formData.bardaana_deduction) {
      errors.push("bardaana_deduction is required");
    }

    if (!formData.truck_no || parseFloat(formData.truck_no)) {
      errors.push("truck_no is required");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        html: validationErrors.map((error) => `• ${error}`).join("<br>"),
      });
      return;
    }

    setLoadingSubmit(true);
    try {
      const payload = { ...formData, bardaana_amount: 0 };
      const response = await api.postDataWithToken(purchaseBook, payload);

      if (response.status === "success") {
        // Extract ID from response and save to localStorage
        const purchaseId = response.data.id;
        localStorage.setItem("purchase_id", purchaseId);

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data has been added successfully!",
        }).then(() => {
          // Redirect to purchase_details page
          router.push("/purchase_details/");
        });
      } else if (response.error?.status === "error") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.error?.message || "Something went wrong!",
        });
      }
    } catch (error) {
      console.error("Catch Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "An unexpected error occurred!",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <form>
      <div className={styles.payment}>Add Purchase</div>

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

        <Grid className="mt-10" item xs={12} lg={4} sm={4}>
          {loadingSeasons ? (
            <Skeleton variant="rectangular" height={56} />
          ) : (
            <DropDown3
              title="Select Season"
              options={seasonsList}
              onChange={handleDropdownChange}
              value={dropdownValues.season_id}
              name="season_id"
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

        <Grid style={{ marginTop: "2.5rem" }} item xs={12} sm={4}>
          <DropDown
            title="Select Bardaana"
            options={bardaanaList}
            onChange={handleDropdownChange}
            value={dropdownValues.bardaana_type}
            name="bardaana_type"
          />
        </Grid>

        <Grid style={{ marginTop: "2.5rem" }} item xs={12} sm={4}>
          <DropDown
            title="Select Bardaana Type"
            options={bardaanaType}
            // onChange={handleDropdownChange}
            // value={dropdownValues.bardaana_type}
            name="bardaana_type"
          />
        </Grid>

        {/* Show these fields when "add" is selected in bardaana dropdown */}
        {selectedBardaanaId === 1 && (
          <>
            <Grid className="mt-5" item xs={12} sm={4}>
              <InputWithTitle
                title={"Bardaana Quantity"}
                placeholder={"Enter Bardaana Quantity"}
                name="bardaana_quantity"
                value={formData.bardaana_quantity}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid className="mt-5" item xs={12} sm={4}>
              <InputWithTitle
                title={"Bardaana Jama"}
                placeholder={"Enter Bardaana Jama"}
                name="bardaana_kept"
                value={formData.bardaana_kept}
                onChange={handleInputChange}
              />
            </Grid>
          </>
        )}

        {selectedBardaanaId === 2 && (
          <>
            <Grid className="mt-5" item xs={12} sm={4}>
              <InputWithTitle
                title={"Bardaana Quantity"}
                placeholder={"Enter Bardaana Quantity"}
                name="bardaana_quantity"
                value={formData.bardaana_quantity}
                onChange={handleInputChange}
              />
            </Grid>
          </>
        )}

        {selectedBardaanaId === 3 && (
          <>
            <Grid className="mt-5" item xs={12} sm={4}>
              <InputWithTitle
                title={"Bardaana Quantity"}
                placeholder={"Enter Bardaana Quantity"}
                name="bardaana_quantity"
                value={formData.bardaana_quantity}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid className="mt-5" item xs={12} sm={4}>
              <InputWithTitle
                title={"Bardaana Amount"}
                placeholder={"Enter Bardaana Amount"}
                name="bardaana_quantity"
                value={formData.bardaana_quantity}
                onChange={handleInputChange}
              />
            </Grid>
          </>
        )}

        {selectedBardaanaId === 4 && (
          <>
            <Grid className="mt-5" item xs={12} sm={4}>
              <InputWithTitle
                title={"Bardaana Quantity"}
                placeholder={"Enter Bardaana Quantity"}
                name="bardaana_quantity"
                value={formData.bardaana_quantity}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid className="mt-5" item xs={12} sm={4}>
              <InputWithTitle
                title={"Bardaana Amount"}
                placeholder={"Enter Bardaana Amount"}
                name="bardaana_quantity"
                value={formData.bardaana_quantity}
                onChange={handleInputChange}
              />
            </Grid>
          </>
        )}

        <Grid className="mt-8" item xs={12} sm={4}>
          <InputWithTitle
            title={"Truck Number"}
            placeholder={"Enter Truck Number"}
            name="truck_no"
            value={formData.truck_no}
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

        <Grid className="mt-5" item xs={12} sm={4}>
          <InputWithTitle
            title={"Weight Per Bag"}
            placeholder={"Enter Weight Per Bag"}
            name="weightPerBag"
            value={formData.weightPerBag}
            readOnly
          />
        </Grid>

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
