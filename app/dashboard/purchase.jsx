"use client";
import React, { useEffect, useState } from "react";
import styles from "../../styles/purchase.module.css";
import APICall from "../../networkApi/APICall";
import { purchaseBook } from "@/networkApi/Constants";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
} from "@mui/material";

import Buttons from "../../components/buttons";
import SearchInput from "../../components/generic/searchInput";
import withAuth from "@/utils/withAuth";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const Purchase = () => {
  const router = useRouter();
  const api = new APICall();

  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = [];

      if (startDate && endDate) {
        queryParams.push(`start_date=${startDate}`);
        queryParams.push(`end_date=${endDate}`);
      } else {
        const currentDate = format(new Date(), "yyyy-MM-dd");
        queryParams.push(`start_date=${currentDate}`);
        queryParams.push(`end_date=${currentDate}`);
      }
      const queryString = queryParams.join("&");

      const response = await api.getDataWithToken(
        `${purchaseBook}?${queryString}`
      );

      if (Array.isArray(response.data)) {
        setTableData(response.data);
        setFilteredData(response.data);
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredData(tableData);
      return;
    }

    const filtered = tableData.filter((item) => {
      const productName = item.product?.product_name?.toLowerCase() || "";
      return productName.includes(searchTerm.toLowerCase());
    });

    setFilteredData(filtered);
  };

  const handleViewDetails = (row) => {
    localStorage.setItem("purchaseBookId", row.id);
    router.push("/purchase_details");
  };

  return (
    <div className={styles.container}>
      {/* <SearchInput  /> */}
      <Buttons
        leftSectionText="Purchase"
        addButtonLink="/addPurchase"
        onDateChange={handleDateChange}
        onSearch={handleSearch}
      />

      <TableContainer
        sx={{
          maxHeight: "400px",
          overflow: "auto",
        }}
        component={Paper}
        className={styles.tableSection}
      >
        <Table
          sx={{
            minWidth: 650,
            position: "relative", // Important for proper alignment
            borderCollapse: "separate",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Party</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from(new Array(6)).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : filteredData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.product?.product_name}</TableCell>
                    <TableCell>{row.supplier?.person_name}</TableCell>
                    <TableCell>{row.net_weight}</TableCell>
                    <TableCell>{row.total_amount}</TableCell>
                    <TableCell
                      onClick={() => handleViewDetails(row)}
                      style={{ cursor: "pointer" }}
                    >
                      View Details
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default withAuth(Purchase);
