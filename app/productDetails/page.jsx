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

  const getLastBalanceEntry = () => {
    if (stockDetails.length === 0) return "N/A";
    return stockDetails[stockDetails.length - 1].balance;
  };

  const getFinalAveragePrice = () => {
    if (stockDetails.length === 0) return "N/A";

    const remainingWeight = Number(getLatestRemainingWeight());
    let balance = Number(getLastBalanceEntry());

    // Take absolute value of balance to ignore negative sign
    balance = Math.abs(balance);

    // Check if remainingWeight is zero or very close to zero
    if (
      remainingWeight === 0 ||
      remainingWeight < 0.001 ||
      isNaN(remainingWeight) ||
      isNaN(balance)
    ) {
      return "N/A"; // Return "N/A" instead of performing division
    }

    // Calculate remaining weight divided by the absolute value of balance
    return (balance / remainingWeight).toFixed(2);
  };

  const getTotalPurchasePrice = () => {
    return stockDetails
      .filter(
        (stock) =>
          stock.entry_type?.toLowerCase() === "purchase" ||
          stock.entry_type?.toLowerCase() === "expense"
      )
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
                    <b>Date</b>
                  </TableCell>
                  <TableCell>
                    <b>Party</b>
                  </TableCell>
                  <TableCell>
                    <b>Weight</b>
                  </TableCell>
                  <TableCell>
                    <b>Credit</b>
                  </TableCell>
                  <TableCell>
                    <b>Debit</b>
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
                    <TableCell>
                      {new Date(stock?.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short", // use 'long' for full month name or '2-digit' for numbers
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {stock?.party?.person_name ||
                        stock?.linkable?.product_name}
                    </TableCell>
                    <TableCell>
                      {stock.entry_type === "sale"
                        ? stock.stock_out
                        : stock.stock_in}
                    </TableCell>

                    <TableCell>
                      {/* Credit if entry_type is 'purchase' or if it's 'expense' with expense_entry_type 'cr' */}
                      {stock.entry_type === "purchase" ||
                      (stock.entry_type === "expense" &&
                        stock.expense_entry_type === "cr")
                        ? stock.total_amount
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {/* Debit if entry_type is 'sale' or if it's 'expense' with expense_entry_type 'dr' */}
                      {stock.entry_type === "sale" ||
                      (stock.entry_type === "expense" &&
                        stock.expense_entry_type === "dr")
                        ? stock.total_amount
                        : "-"}
                    </TableCell>
                    <TableCell>{stock.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Summary Table */}
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Summary
          </Typography>
          <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>DESCRIPTION</b>
                  </TableCell>
                  <TableCell>
                    <b>TOTAL WEIGHT</b>
                  </TableCell>
                  <TableCell>
                    <b>AVERAGE PRICE</b>
                  </TableCell>
                  <TableCell>
                    <b>TOTAL AMOUNT</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>PURCHASE</TableCell>
                  <TableCell>{getTotalStockIn()}</TableCell>
                  <TableCell>{getAveragePurchasePrice()}</TableCell>
                  <TableCell>{getTotalPurchasePrice()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>SALE</TableCell>
                  <TableCell>{getTotalStockOut()}</TableCell>
                  <TableCell>{getAverageSalePrice()}</TableCell>
                  <TableCell>{getTotalSalePrice()}</TableCell>
                </TableRow>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>FINAL</TableCell>
                  <TableCell>{getLatestRemainingWeight()}</TableCell>
                  <TableCell>{getFinalAveragePrice()}</TableCell>
                  <TableCell>{getLastBalanceEntry()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default Page;
