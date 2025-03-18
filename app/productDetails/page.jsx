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
  Grid,
  Card,
  CardContent,
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

  // Calculate summary values
  const getTotalStockIn = () => {
    return stockDetails.reduce(
      (total, stock) => total + (Number(stock.stock_in) || 0),
      0
    );
  };

  const getTotalStockOut = () => {
    return stockDetails.reduce(
      (total, stock) => total + (Number(stock.stock_out) || 0),
      0
    );
  };

  const getLatestRemainingWeight = () => {
    if (stockDetails.length === 0) return "N/A";
    return stockDetails[stockDetails.length - 1].remaining_weight;
  };

  const getTotalPurchasePrice = () => {
    return stockDetails
      .filter((stock) => stock.entry_type?.toLowerCase() === "purchase")
      .reduce((total, stock) => total + (Number(stock.total_amount) || 0), 0);
  };

  const getTotalSalePrice = () => {
    return stockDetails
      .filter((stock) => stock.entry_type?.toLowerCase() === "sale")
      .reduce((total, stock) => total + (Number(stock.total_amount) || 0), 0);
  };

  const getAveragePurchasePrice = () => {
    const totalPurchaseAmount = getTotalPurchasePrice();
    const totalStockIn = getTotalStockIn();

    if (totalStockIn === 0) return 0;
    return (totalPurchaseAmount / totalStockIn).toFixed(2);
  };

  const getAverageSalePrice = () => {
    const totalSaleAmount = getTotalSalePrice();
    const totalStockOut = getTotalStockOut();

    if (totalStockOut === 0) return 0;
    return (totalSaleAmount / totalStockOut).toFixed(2);
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

          <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
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
                    <b> Party </b>
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
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{stock.total_weight}</TableCell>
                    <TableCell>{stock.stock_in}</TableCell>
                    <TableCell>{stock.stock_out}</TableCell>
                    <TableCell>{stock.remaining_weight}</TableCell>
                    <TableCell>{stock.entry_type}</TableCell>
                    <TableCell>{stock?.party?.person_name}</TableCell>
                    <TableCell>{stock.price}</TableCell>
                    <TableCell>{stock.total_amount}</TableCell>
                    <TableCell>{stock.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Summary Cards */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%", bgcolor: "#e3f2fd" }}>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Stock In (Purchase)
                  </Typography>
                  <Typography variant="h4">{getTotalStockIn()}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%", bgcolor: "#fff8e1" }}>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Stock Out (Sale)
                  </Typography>
                  <Typography variant="h4">{getTotalStockOut()}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%", bgcolor: "#e8f5e9" }}>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Remaining Weight
                  </Typography>
                  <Typography variant="h4">
                    {getLatestRemainingWeight()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%", bgcolor: "#f3e5f5" }}>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Total Prices
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Purchase:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {getTotalPurchasePrice()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Sale:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {getTotalSalePrice()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%", bgcolor: "#ffebee" }}>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Avg. Purchase Price (KG)
                  </Typography>
                  <Typography variant="h4">
                    {getAveragePurchasePrice()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%", bgcolor: "#e0f7fa" }}>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Avg. Sale Price (KG)
                  </Typography>
                  <Typography variant="h4">{getAverageSalePrice()}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
};

export default Page;
