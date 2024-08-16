"use client";

import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import styles from "../../styles/addSale.module.css";
import DropDown from "@/components/generic/dropdown";
import InputWithTitle from "@/components/generic/InputWithTitle";
import TableSale from "./tableSale";
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
import User from "@/networkApi/user";

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

  const [productList, setProducts] = useState([]);
  const [supplierList, setSuppliers] = useState([]);
  const [packingList, setPacking] = useState([]);
  const [refList, setRef] = useState({ id: "", next_ref_no: "" });

  const [error, setError] = useState("");

  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingPackings, setLoadingPackings] = useState(true);

  const [loadingSubmit, setLoadingSubmit] = useState(false);

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


  const sendTempData = () =>{


    const myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer 17|HzKGD0b6uqi47lXMd9SAc4zoK1M6eg6XDP77vIgPcbc2b36d");

const formdata = new FormData();
formdata.append("id", "1");
formdata.append("pro_id", "18");
formdata.append("packing_id", "7");
formdata.append("price", "2100");
formdata.append("quantity", "13");
formdata.append("product_description", "");
formdata.append("buyer_id", "1");
formdata.append("truck_no", "");

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: formdata,
  redirect: "follow"
};

fetch("https://backend-ghulambari.worldcitizenconsultants.com/api/sale_book/add_item", requestOptions)
  .then((response) => {
      console.log("oiwqufe;oi",response);
      

  })
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  }

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

    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.id : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      response = await api.postFormDataWithToken(`${saleBook}/add_item`, formData);
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
            <div className={styles.itemBill}>Add Items in bill</div>

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
