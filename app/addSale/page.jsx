"use client";

import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import styles from "../../styles/addSale.module.css";
import DropDown from "@/components/generic/dropdown";
import InputWithTitle from "@/components/generic/InputWithTitle";
import { Skeleton, CircularProgress } from "@mui/material";
import { buyer, products, saleBook } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import withAuth from "@/utils/withAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

// Define the conversion constants
const MUND_TO_KG = 40; // 1 mund equals 40 kg

const Page = () => {
  const router = useRouter();
  const api = new APICall();

  const [formData, setFormData] = useState({
    id: "",
    buyer_id: "",
    pro_id: "",
    weight: "",
    truck_no: "",
    product_description: "",
    reference_no: "",
    price_mann: 0, // Added price_mann here for demonstration

    bardaana_deduction: 0,
    khoot: 0,

    bardaana_quantity: 0,
    salai_amt_per_bag: 0,
  });

  const [productList, setProducts] = useState([]);
  const [supplierList, setSuppliers] = useState([]);
  const [refList, setRef] = useState({ id: "", next_ref_no: "" });

  const [cartData, setCartData] = useState([]);
  const [currentRefId, setCurrentRefId] = useState("");  

  const [error, setError] = useState("");

  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [saleData, setSaleDetails] = useState([]);
  const [billTotal, setBilTotal] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingCompleteBill, setLoadingCompleteBill] = useState(false); // New loading state

  const [total, setTotal] = useState(0);
  const [silaiTotal, setSilaiTotal] = useState(0);

  const [netWeight, setNetWeight] = useState(0);
  const [combinedTotal, setCombinedTotal] = useState(0);
  const [totalsAmounts, setTotalAmount] = useState(0);

  const [dropdownValues, setDropdownValues] = useState({
    buyer_id: null,
    pro_id: null,
  });

  const [weight, setWeight] = useState("");
  const [munds, setMunds] = useState(""); // State to store calculated Munds
  const [kgs, setKgs] = useState(""); // State to store calculated Kilograms

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
    fetchRef();
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

      setFormData((prevState) => ({
        ...prevState,
        id: response.next_id,
      }));
    } catch (error) {
      console.error("Error fetching reference number:", error);
      setError("Failed to fetch reference number. Please try again.");
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await api.getDataWithToken(buyer);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update formData state
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "weight") {
      const numericValue = parseFloat(value) || 0;
      setWeight(numericValue);
      // calculateMunds(numericValue);
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
  };

  // Use effect for cauclate bardaana and khoot

  useEffect(() => {
    const calculateTotal = () => {
      const { bardaana_deduction, khoot } = formData;
      const total = parseFloat(bardaana_deduction) + parseFloat(khoot);

      setTotal(total);
    };

    calculateTotal();
  }, [formData.bardaana_deduction, formData.khoot]);

  // Use effect for calculte net weight
  useEffect(() => {
    // Calculate net weight
    const calculateNetWeight = () => {
      const netWeight = weight - total;

      setNetWeight(netWeight);
    };

    calculateNetWeight();
  }, [weight, total]);

  useEffect(() => {
    // Calculate munds and kgs from net weight
    const calculateMundsAndKgsFromNetWeight = () => {
      const weightInKg = parseFloat(netWeight);
      if (isNaN(weightInKg)) {
        setMunds("");
        setKgs("");
        return;
      }

      const fullMunds = Math.floor(weightInKg / MUND_TO_KG);
      const remainderKg = weightInKg % MUND_TO_KG;

      setMunds(`${fullMunds}`);
      setKgs(`${remainderKg}`);
    };

    calculateMundsAndKgsFromNetWeight();
  }, [netWeight]);

  const calculateAmount = () => {
    // Calculate the amount based on netWeight
    const price_per_munds = formData.price_mann / MUND_TO_KG;
    const totalAmount = price_per_munds * netWeight;
    const roundedAmount = totalAmount.toFixed(2);

    setTotalAmount(roundedAmount);
  };

  useEffect(() => {
    calculateAmount();
  }, [netWeight, formData.price_mann]);

  useEffect(() => {
    const calculateTotal = () => {
      const { bardaana_quantity, salai_amt_per_bag } = formData;
      const total =
        parseFloat(bardaana_quantity) * parseFloat(salai_amt_per_bag);

      setSilaiTotal(total);
    };

    calculateTotal();
  }, [formData.bardaana_quantity, formData.salai_amt_per_bag]);

  useEffect(() => {
    const numericSilaiTotal = Number(silaiTotal);
    const numericTotalAmount = Number(totalsAmounts);

    const combinedTotal = numericSilaiTotal + numericTotalAmount;
    setCombinedTotal(combinedTotal);
  }, [silaiTotal, totalsAmounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const response = await api.postFormDataWithToken(`${saleBook}/add_item`, {
        ...formData,
        weight: weight,
      });

      setSaleDetails(response.data.details);
      setBilTotal(response.data.total_amount);
      localStorage.setItem("saleBookId", response.data.id);

      // Update cart data
      setCartData((prevData) => [
        ...prevData,
        {
          product_name: response.data.product_name,
          weight: response.data.weight,
          total_amount: response.data.total_amount,
        },
      ]);
      setCurrentRefId(response.data.id);

      Swal.fire({
        title: "Success!",
        text: "Data Added.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Clear form fields
        updateFormData("weight", "");
        updateFormData("product_description", "");
        updateFormData("price_mann", 0);
        setWeight("");
        setMunds("");
        setKgs("");
      });
    } catch (error) {
      console.error("Error:", error.message);
      Swal.fire({
        title: "Error!",
        text: `${error.message}`,
        icon: "error",
        confirmButtonText: "Okay",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoadingCompleteBill(true); // Set loading state to true when starting

    const bilObj = { sale_book_id: currentRefId };

    try {
      const response = await api.postFormDataWithToken(`${saleBook}`, bilObj);

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

      // Clear specific fields after successful submission
      setFormData((prevData) => ({
        ...prevData,
        buyer_id: "",
        pro_id: "",
        truck_no: "",
        product_description: "",
        weight: "",
      }));

      // Clear cart data after bill completion
      setCartData([]);
      setCurrentRefId("");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    } finally {
      setLoadingCompleteBill(false); // Set loading state to false when done
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <Grid container spacing={2} style={{ marginTop: "2rem" }}>
      <Grid item lg={6} xs={12} md={6} sm={12}>
        <div className={styles.saleHead} style={{ marginBottom: "2rem" }}>
          Add Sale
        </div>
        <Grid className="mt-10" container spacing={2}>
          <Grid item xs={12} sm={12}>
            {loadingSuppliers ? (
              <Skeleton variant="rectangular" width="100%" height={56} />
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

          <Grid item lg={4} xs={6}>
            <InputWithTitle
              title={"Enter Truck Number"}
              name="truck_no"
              value={formData.truck_no}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item lg={4} xs={12}>
            <InputWithTitle
              title={"Bill Reference Number"}
              name="reference_no"
              value={formData.reference_no}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item lg={4} xs={6}>
            <InputWithTitle
              title={"Bill Reference No"}
              defaultValue={`${refList.next_ref_no}`}
              value={formData.next_ref_no}
              name="id"
              readOnly
            />
          </Grid>

          <div className={styles.saleSec}>
            <div className={styles.itemBill} style={{ marginBottom: "1rem" }}>
              Add Items in bill
            </div>

            <Grid className="mt-10" container spacing={2}>
              <Grid item xs={12}>
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

              <Grid item xs={12} sm={6} lg={6}>
                <InputWithTitle
                  title="Weight (kg)"
                  name="weight"
                  value={weight}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={6}>
                <InputWithTitle
                  title="Bardaana Deduction"
                  name="bardaana_deduction"
                  value={formData.bardaana_deduction}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={6}>
                <InputWithTitle
                  title="Khoot"
                  name="khoot"
                  value={formData.khoot}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={6}>
                <InputWithTitle
                  title="Net Weight"
                  name="netWeight"
                  value={netWeight}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputWithTitle
                  title="Weight in Munds"
                  name="pounds"
                  value={munds}
                  type="text"
                  readOnly
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputWithTitle
                  title="Weight in Kilograms"
                  name="kilograms"
                  value={kgs}
                  type="number"
                  readOnly
                />
              </Grid>

              <Grid item lg={6} xs={12}>
                <InputWithTitle
                  title={"Price Per Munds"}
                  name="price_mann"
                  value={formData.price_mann}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item lg={6} xs={6}>
                <InputWithTitle
                  title={"Sub Total Amount"}
                  value={totalsAmounts}
                  readOnly
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <InputWithTitle
                  title={"Bardaana Quantity"}
                  name="bardaana_quantity"
                  value={formData.bardaana_quantity}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <InputWithTitle
                  title={"Silai"}
                  name="salai_amt_per_bag"
                  value={formData.salai_amt_per_bag}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <InputWithTitle
                  title="Total Amount"
                  name="total_amount"
                  value={combinedTotal}
                  readOnly
                />
              </Grid>
              <Grid className="mt-5" item xs={12}>
                <InputWithTitle
                  title={"Enter Description"}
                  name="product_description"
                  value={formData.product_description}
                  onChange={handleInputChange}
                />
              </Grid>

              <button
                type="submit"
                className={styles.addItemBtn}
                onClick={handleSubmit}
              >
                {loadingSubmit ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  "Add Item in Bill"
                )}
              </button>
            </Grid>
          </div>
        </Grid>
      </Grid>

      <Grid item lg={6} xs={12} md={6} sm={12}>
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Weight</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell>{`${item.weight}`}</TableCell>
                  <TableCell>{item.total_amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div className={styles.tableTotalRow}>Total: {billTotal}</div>

        <button
          type="submit"
          className={styles.addItemBtn}
          onClick={handleUpdate}
          disabled={loadingCompleteBill}
        >
          {loadingCompleteBill ? (
            <CircularProgress color="inherit" size={24} />
          ) : (
            "Complete Your Bill"
          )}
        </button>
      </Grid>
    </Grid>
  );
};

export default withAuth(Page);
