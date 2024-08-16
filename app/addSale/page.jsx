"use client";

import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import styles from "../../styles/addSale.module.css";
import DropDown from "@/components/generic/dropdown";
import InputWithTitle from "@/components/generic/InputWithTitle";
import TableSale from "./tableSale";
import { Skeleton, CircularProgress } from "@mui/material";
import { buyer, products, packings, saleBook } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import withAuth from '@/utils/withAuth'; // Adjust the path as necessary
import Swal from 'sweetalert2'; // Make sure to import Swal if you're using it
import { useRouter } from 'next/navigation'; // Import useRouter

const Page = () => {
  const api = new APICall();
  
 const router = useRouter();

  const [formData, setFormData] = useState({
    buyer_id: "",
    quantity: "",
    price: "",
    truck_no: "",
    date: "",
    payment_type: "",
  });

  const [productList, setProducts] = useState([]);
  const [supplierList, setSuppliers] = useState([]);
  const [packingList, setPacking] = useState([]);
  const [error, setError] = useState("");

  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingPackings, setLoadingPackings] = useState(true);

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [dropdownValues, setDropdownValues] = useState({
    buyer_id: null,
    pro_id: null,
    packing_type: null,
  });

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
    fetchPackings();
  }, []);

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

    if (selectedOption) {
      if (name === "buyer_id" || name === "pro_id") {
        setFormData((prev) => ({
          ...prev,
          [name]: selectedOption.id.toString(),
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    try {
      let response;
      if (formData.id) {
        response = await api.putDataWithToken(
          `${saleBook}/${formData.id}`,
          formData
        );
      } else {
        response = await api.postDataWithToken(saleBook, formData);
      }
      Swal.fire({
        title: "Success!",
        text: "Data Added.",
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          router.back();
        }
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item lg={6} xs={12} md={6} sm={12}>
        <div className={styles.saleHead}>Add Sale</div>
        <Grid className="mt-10" container spacing={2}>
          <Grid item xs={12} sm={12}>
            {loadingSuppliers ? (
              <Skeleton variant="rectangular" width="100%" height={56} />
            ) : (
              <DropDown
                title="Select Party"
                options={supplierList}
                onChange={(selectedOption) => handleDropdownChange("sup_id", selectedOption)}
                value={dropdownValues.sup_id}
                name="sup_id"
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
              name="bill_ref"
              value={formData.bill_ref}
              onChange={handleInputChange}
            />
          </Grid>

          <div className={styles.saleSec}>
            <div className={styles.itemBill}>Add Items in bill</div>

            <Grid className="mt-10" container spacing={2}>
              <Grid item xs={12}>
                {loadingProducts ? (
                  <Skeleton variant="rectangular" width="100%" height={56} />
                ) : (
                  <DropDown
                    title="Select Product"
                    options={productList}
                    onChange={(selectedOption) => handleDropdownChange("pro_id", selectedOption)}
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
                    onChange={(selectedOption) => handleDropdownChange("packing_type", selectedOption)}
                    value={dropdownValues.packing_type}
                    name="packing_type"
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
                  title={"Enter Quantity"} 
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid className="mt-5" item xs={12}>
                <InputWithTitle 
                  title={"Enter Description"} 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
              <button type="submit" className={styles.addItemBtn} onClick={handleSubmit}>
                {loadingSubmit ? (
                  <CircularProgress color="inherit" size={24} />
                ) : formData.id ? (
                  "Update"
                ) : (
                  "Save"
                )}
              </button>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Grid item lg={6} xs={12}>
        <TableSale />
      </Grid>
    </Grid>
  );
};

export default withAuth(Page);