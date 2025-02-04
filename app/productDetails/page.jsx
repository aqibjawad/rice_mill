"use client";

import React, { useState, useEffect } from "react";
import APICall from "../../networkApi/APICall";
import { products } from "../../networkApi/Constants";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
} from "@mui/material";

const getParamFromUrl = (url, param) => {
  const searchParams = new URLSearchParams(url.split("?")[1]);
  return searchParams.get(param);
};

const Page = () => {
  const api = new APICall();
  const [productName, setProductName] = useState("");
  const [stockDetails, setStockDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getParamFromUrl(currentUrl, "id");

    if (urlId) {
      fetchData(urlId);
    }
  }, []);

  const fetchData = async (id) => {
    try {
      const response = await api.getDataWithToken(`${products}/${id}`);
      const data = response.data;

      if (data) {
        setProductName(data.product_name || "N/A");
        setStockDetails(data.company_product_stock_details || []);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Product: {productName}
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Sr No</b>
                  </TableCell>
                  <TableCell>
                    <b>Total Weight</b>
                  </TableCell>
                  <TableCell>
                    <b>Stock In</b>
                  </TableCell>
                  <TableCell>
                    <b>Stock Out</b>
                  </TableCell>
                  <TableCell>
                    <b>Remaining Weight</b>
                  </TableCell>
                  <TableCell>
                    <b>Entry Type</b>
                  </TableCell>
                  <TableCell>
                    <b>Price</b>
                  </TableCell>
                  <TableCell>
                    <b>Total Amount</b>
                  </TableCell>
                  <TableCell>
                    <b>Balance</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stockDetails.map((stock, index) => (
                  <TableRow key={index}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{stock.total_weight}</TableCell>
                    <TableCell>{stock.stock_in}</TableCell>
                    <TableCell>{stock.stock_out}</TableCell>
                    <TableCell>{stock.remaining_weight}</TableCell>
                    <TableCell>{stock.entry_type}</TableCell>
                    <TableCell>{stock.price}</TableCell>
                    <TableCell>{stock.total_amount}</TableCell>
                    <TableCell>{stock.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default Page;
