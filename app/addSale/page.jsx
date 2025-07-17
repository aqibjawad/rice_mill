"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/addSale.module.css";
import DropDown from "@/components/generic/dropdown";
import DropDown3 from "@/components/generic/dropdown3";
import InputWithTitle from "@/components/generic/InputWithTitle";
import { party, products, saleBook, seasons } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import withAuth from "@/utils/withAuth";
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Skeleton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const MUND_TO_KG = 40;

const Page = () => {
  const router = useRouter();
  const api = new APICall();

  // Initial state values
  const initialFormData = {
    id: "",
    buyer_id: "",
    season_id: "",
    pro_id: "",
    weight: "",
    truck_no: "",
    product_description: "Sale",
    reference_no: "",
    price_mann: "0",
    bardaana_deduction: "0",
    khoot: "0",
    bardaana_quantity: "0",
    salai_amt_per_bag: "0",
  };

  const initialDropdownValues = {
    buyer_id: null,
    season_id: null,
    pro_id: null,
  };

  // States
  const [formData, setFormData] = useState(initialFormData);
  const [productList, setProducts] = useState([]);
  const [seasonsList, setSeasons] = useState([]);
  const [supplierList, setSuppliers] = useState([]);
  const [refList, setRef] = useState({ id: "", next_ref_no: "" });
  const [cartData, setCartData] = useState([]);
  const [currentRefId, setCurrentRefId] = useState("");
  const [error, setError] = useState("");
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingSeasons, setLoadingSeasons] = useState(true);
  const [saleData, setSaleDetails] = useState([]);
  const [billTotal, setBilTotal] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingCompleteBill, setLoadingCompleteBill] = useState(false);
  const [total, setTotal] = useState(0);
  const [silaiTotal, setSilaiTotal] = useState(0);
  const [netWeight, setNetWeight] = useState(0);
  const [combinedTotal, setCombinedTotal] = useState(0);
  const [totalsAmounts, setTotalAmount] = useState(0);
  const [dropdownValues, setDropdownValues] = useState(initialDropdownValues);
  const [weight, setWeight] = useState("");
  const [munds, setMunds] = useState("");
  const [kgs, setKgs] = useState("");
  // Add state for selected season name
  const [selectedSeasonName, setSelectedSeasonName] = useState("");

  // Reset function
  const resetAllStates = () => {
    setFormData((prevFormData) => ({
      ...initialFormData,
      truck_no: prevFormData.truck_no,
      reference_no: prevFormData.reference_no,
      // Keep season_id when resetting
      season_id: prevFormData.season_id,
    }));
    setWeight("");
    setMunds("");
    setKgs("");
    setTotal(0);
    setSilaiTotal(0);
    setNetWeight(0);
    setCombinedTotal(0);
    setTotalAmount(0);
    // Reset product dropdown only
    setDropdownValues((prev) => ({
      ...prev,
      pro_id: null,
    }));
  };

  // Initial data fetching
  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
    fetchRef();
    fetchSeasons();
  }, []);

  const fetchRef = async () => {
    try {
      const response = await api.getDataWithToken(
        `${saleBook}/get_next_ref_no`
      );
      setRef({
        id: response.next_id,
        next_ref_no: response.next_ref_no || "",
      });
      setFormData((prev) => ({ ...prev, id: response.next_id }));
    } catch (error) {
      console.error("Error fetching reference number:", error);
      setError("Failed to fetch reference number. Please try again.");
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

  const fetchSuppliers = async () => {
    try {
      const response = await api.getDataWithToken(party);
      const list = response.data.map((item, index) => ({
        label: item.person_name,
        index: index,
        id: item.id,
      }));
      setSuppliers(list);
    } catch (error) {
      console.error("Error fetching parties:", error);
      setError("Failed to fetch parties. Please try again.");
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await api.getDataWithToken(products);
      const filteredProducts = response.data.map((item, index) => ({
        label: item.product_name,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : value,
    }));

    if (name === "weight") {
      const numericValue = parseFloat(value) || 0;
      setWeight(numericValue);
    }
  };

  const handleDropdownChange = (name, selectedOption) => {
    setDropdownValues((prev) => ({
      ...prev,
      [name]: selectedOption,
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.id : "",
    }));

    // Store selected season name for display in bill
    if (name === "season_id" && selectedOption) {
      setSelectedSeasonName(selectedOption.label);
    }
  };

  // Calculations
  useEffect(() => {
    const calculateTotal = () => {
      const { bardaana_deduction, khoot } = formData;
      const total = parseFloat(bardaana_deduction) + parseFloat(khoot);
      setTotal(total);
    };
    calculateTotal();
  }, [formData.bardaana_deduction, formData.khoot]);

  useEffect(() => {
    const netWeight = weight - total;
    setNetWeight(netWeight);
  }, [weight, total]);

  useEffect(() => {
    const weightInKg = parseFloat(netWeight);
    if (!isNaN(weightInKg)) {
      const fullMunds = Math.floor(weightInKg / MUND_TO_KG);
      const remainderKg = weightInKg % MUND_TO_KG;
      setMunds(`${fullMunds}`);
      setKgs(`${remainderKg.toFixed(2)}`);
    } else {
      setMunds("");
      setKgs("");
    }
  }, [netWeight]);

  useEffect(() => {
    const price_per_munds = formData.price_mann / MUND_TO_KG;
    const totalAmount = price_per_munds * netWeight;
    setTotalAmount(totalAmount.toFixed(2));
  }, [netWeight, formData.price_mann]);

  useEffect(() => {
    const { bardaana_quantity, salai_amt_per_bag } = formData;
    const total = parseFloat(bardaana_quantity) * parseFloat(salai_amt_per_bag);
    setSilaiTotal(total);
  }, [formData.bardaana_quantity, formData.salai_amt_per_bag]);

  useEffect(() => {
    const total = Number(silaiTotal) + Number(totalsAmounts);
    setCombinedTotal(total);
  }, [silaiTotal, totalsAmounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const response = await api.postFormDataWithToken(`${saleBook}/add_item`, {
        ...formData,
        weight: weight,
        season_id: formData.season_id, // Season ID will be included in API call
      });

      setSaleDetails(response.data.details);
      setBilTotal(response.data.total_amount);
      localStorage.setItem("saleBookId", response.data.id);
      setCartData((prev) => [
        ...prev,
        {
          product_name: response.data.product_name,
          weight: response.data.weight,
          total_amount: response.data.total_amount,
          season_name: selectedSeasonName, // Add season name to cart data
        },
      ]);
      setCurrentRefId(response.data.id);

      // Reset all states
      resetAllStates();
      // Refetch reference number for next entry
      fetchRef();

      Swal.fire({
        title: "Success!",
        text: "Data Added.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error:", error.message);
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonText: "Okay",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoadingCompleteBill(true);

    try {
      const response = await api.postFormDataWithToken(`${saleBook}`, {
        sale_book_id: currentRefId,
        season_id: formData.season_id, // Add season_id to the sale_book API call
      });

      Swal.fire({
        title: "Success!",
        text: "Your Bill is Updated.",
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/invoice");
        }
      });

      // Reset states after completing bill
      resetAllStates();
      setCartData([]);
      setCurrentRefId("");
      setSaleDetails([]);
      setBilTotal("");
      setSelectedSeasonName("");
      setDropdownValues(initialDropdownValues);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    } finally {
      setLoadingCompleteBill(false);
    }
  };

  return (
    <Grid container spacing={3} sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Left Section */}
      <Grid item xs={12} md={6}>
        <Card elevation={3}>
          <CardHeader
            title="Add Sale"
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              p: 2,
            }}
          />
          <CardContent>
            <Grid container spacing={2}>
              {/* Party Selection */}
              <Grid item xs={6}>
                {loadingSuppliers ? (
                  <Skeleton variant="rectangular" height={56} />
                ) : (
                  <DropDown
                    title="Select Party"
                    options={supplierList}
                    onChange={handleDropdownChange}
                    value={dropdownValues.buyer_id}
                    name="buyer_id"
                  />
                )}
              </Grid>

              <Grid item xs={6}>
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

              {/* Season Display */}
              {selectedSeasonName && (
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{ p: 1, bgcolor: "grey.100", borderRadius: 1 }}
                  >
                    Selected Season: <strong>{selectedSeasonName}</strong>
                  </Typography>
                </Grid>
              )}

              {/* Truck and Reference Numbers */}
              <Grid item xs={12} sm={6} md={4}>
                <InputWithTitle
                  title="Enter Truck Number"
                  name="truck_no"
                  value={formData.truck_no}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InputWithTitle
                  title="Bill Reference Number"
                  name="reference_no"
                  value={formData.reference_no}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <InputWithTitle
                  title="Bill Reference No"
                  defaultValue={refList.next_ref_no}
                  value={formData.next_ref_no}
                  name="id"
                  readOnly
                />
              </Grid>

              {/* Items Section */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardHeader
                    title="Add Items in Bill"
                    sx={{ p: 2, bgcolor: "grey.100" }}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      {/* Product Selection */}
                      <Grid item xs={12}>
                        {loadingProducts ? (
                          <Skeleton variant="rectangular" height={56} />
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

                      {/* Weight and Deductions */}
                      <Grid item xs={12} sm={6}>
                        <InputWithTitle
                          title="Weight (kg)"
                          name="weight"
                          value={weight}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputWithTitle
                          title="Bardaana Deduction"
                          name="bardaana_deduction"
                          value={formData.bardaana_deduction}
                          onChange={handleInputChange}
                        />
                      </Grid>

                      {/* Additional Fields */}
                      <Grid item xs={12} sm={6}>
                        <InputWithTitle
                          title="Khoot"
                          name="khoot"
                          value={formData.khoot}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputWithTitle
                          title="Net Weight"
                          name="netWeight"
                          value={netWeight}
                          readOnly
                        />
                      </Grid>

                      {/* Weight Conversions */}
                      <Grid item xs={12} sm={6}>
                        <InputWithTitle
                          title="Weight in Munds"
                          name="pounds"
                          value={munds}
                          readOnly
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputWithTitle
                          title="Weight in Kilograms"
                          name="kilograms"
                          value={kgs}
                          readOnly
                        />
                      </Grid>

                      {/* Price and Totals */}
                      <Grid item xs={12} sm={6}>
                        <InputWithTitle
                          title="Price Per Munds"
                          name="price_mann"
                          value={formData.price_mann}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputWithTitle
                          title="Sub Total Amount"
                          value={totalsAmounts}
                          readOnly
                        />
                      </Grid>

                      {/* Bardaana and Silai */}
                      <Grid item xs={12} sm={6} md={4}>
                        <InputWithTitle
                          title="Bardaana Quantity"
                          name="bardaana_quantity"
                          value={formData.bardaana_quantity}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <InputWithTitle
                          title="Silai"
                          name="salai_amt_per_bag"
                          value={formData.salai_amt_per_bag}
                          onChange={handleInputChange}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <InputWithTitle
                          title="Silai Total Amount"
                          name="salai_amt_per_bag"
                          value={
                            formData.bardaana_quantity *
                            formData.salai_amt_per_bag
                          }
                          disabled
                        />
                      </Grid>

                      <Grid item xs={12} sm={12} md={4}>
                        <InputWithTitle
                          title="Total Amount"
                          name="total_amount"
                          value={combinedTotal}
                          readOnly
                        />
                      </Grid>

                      {/* Submit Button */}
                      <Grid item xs={12}>
                        <button
                          type="submit"
                          onClick={handleSubmit}
                          style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "#1976d2",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginTop: "16px",
                          }}
                          disabled={loadingSubmit}
                        >
                          {loadingSubmit ? (
                            <CircularProgress color="inherit" size={24} />
                          ) : (
                            "Add Item in Bill"
                          )}
                        </button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Right Section - Bill Summary */}
      <Grid item xs={12} md={6}>
        <Card elevation={3}>
          <CardHeader
            title="Bill Summary"
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              p: 2,
            }}
          />
          <CardContent>
            {/* Season Display in Bill Summary */}
            {selectedSeasonName && (
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  p: 1,
                  bgcolor: "primary.light",
                  color: "white",
                  borderRadius: 1,
                }}
              >
                Season: {selectedSeasonName}
              </Typography>
            )}

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Weight</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {saleData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item?.product_name}</TableCell>
                      <TableCell>{item.net_weight}</TableCell>
                      <TableCell>{item.total_amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" sx={{ mt: 2, p: 2, bgcolor: "grey.100" }}>
              Total: {billTotal}
            </Typography>

            <button
              onClick={handleUpdate}
              disabled={loadingCompleteBill}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "16px",
              }}
            >
              {loadingCompleteBill ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                "Complete Your Bill"
              )}
            </button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default withAuth(Page);
