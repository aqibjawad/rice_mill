"use client";

import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import styles from "../../styles/addSale.module.css";
import DropDown from "@/components/generic/dropdown";
import InputWithTitle from "@/components/generic/InputWithTitle";
import { Skeleton, CircularProgress } from "@mui/material";
import {
  buyer,
  products,
  packings,
  saleBook,
} from "../../networkApi/Constants";
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

const Page = () => {
  const api = new APICall();
  const router = useRouter();

  const [formData, setFormData] = useState({
    id: "",
    buyer_id: "",
    pro_id: "",
    packing_id: "",
    quantity: "",
    price: "",
    truck_no: "",
    product_description: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [productList, setProducts] = useState([]);
  const [supplierList, setSuppliers] = useState([]);
  const [packingList, setPacking] = useState([]);
  const [refList, setRef] = useState({ id: "", next_ref_no: "" });

  const [items, setItems] = useState([]);

  const [error, setError] = useState("");

  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingPackings, setLoadingPackings] = useState(true);

  const [saleData, setSaleDetails] = useState([]);

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingCompleteBill, setLoadingCompleteBill] = useState(false); // New loading state

  const [dropdownValues, setDropdownValues] = useState({
    buyer_id: null,
    pro_id: null,
    packing_id: null,
  });

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
    fetchPackings();
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
      const filteredProducts = response.data
        .filter((item) => item.product_type === "other")
        .map((item, index) => ({
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

  const fetchPackings = async () => {
    try {
      const response = await api.getDataWithToken(packings);
      const list = response.data.map((item, index) => ({
        label: `${item.packing_size} ${item.packing_unit}`,
        index: index,
        id: item.id,
      }));
      setPacking(list);
    } catch (error) {
      console.error("Error fetching packings:", error);
      setError("Failed to fetch packings. Please try again.");
    } finally {
      setLoadingPackings(false);
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

    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.id : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const response = await api.postFormDataWithToken(
        `${saleBook}/add_item`,
        formData
      );

      setSaleDetails(response.data.details);

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
        text: `${error.message}`, // Use template literals correctly here
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

    const bilObj = { sale_book_id: refList.id };

    try {
      const response = await api.postFormDataWithToken(`${saleBook}`, bilObj);

      Swal.fire({
        title: "Success!",
        text: "Your Bill is Updated.",
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          router.back();
        }
      });

      // Clear specific fields after successful submission
      setFormData((prevData) => ({
        ...prevData,
        buyer_id: "",
        pro_id: "",
        packing_id: "",
        quantity: "",
        price: "",
        truck_no: "",
        product_description: "",
      }));
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

  const calculateTotalAmount = () => {
    const total = saleData.reduce(
      (total, row) => total + parseFloat(row.total_amount),
      0
    );
    return total.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "PKR",
    });
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

          <Grid item lg={6} xs={6}>
            <InputWithTitle
              title={"Enter Truck Number"}
              name="truck_no"
              value={formData.truck_no}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item lg={6} xs={6}>
            <InputWithTitle
              title={"Bill Reference No"}
              defaultValue={`${refList.next_ref_no}`}
              value={formData.id}
              name="id"
              readOnly={true}
            />
          </Grid>

          <div className={styles.saleSec}>
            <div className={styles.itemBill} style={{ marginBottom: "2rem" }}>
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

              <Grid className="mt-5" item xs={12}>
                {loadingPackings ? (
                  <Skeleton variant="rectangular" width="100%" height={56} />
                ) : (
                  <DropDown
                    title="Select Packings"
                    options={packingList}
                    onChange={handleDropdownChange}
                    value={dropdownValues.packing_id}
                    name="packing_id"
                  />
                )}
              </Grid>

              <Grid className="mt-5" item xs={12}>
                <InputWithTitle
                  title={"Enter Unit Price"}
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid className="mt-5" item xs={12}>
                <InputWithTitle
                  title={"Enter quantity"}
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
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
                  "Save"
                )}
              </button>
            </Grid>
          </div>
        </Grid>
      </Grid>

      <Grid item lg={6} xs={12}>
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Packing</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {saleData?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell>{`${item.packing_size} ${item.packing_unit}`}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.total_amount}</TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell colSpan={4}></TableCell>
                <TableCell style={{ fontSize: "20px" }}>
                  Total: {calculateTotalAmount()}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

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
