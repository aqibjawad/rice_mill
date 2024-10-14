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
  Grid
} from "@mui/material";

import Buttons from "../../components/buttons";

import Link from "next/link";


import withAuth from "@/utils/withAuth";

import { useRouter } from "next/navigation";

import { format } from "date-fns";

import DateFilter from "@/components/generic/DateFilter";

const Purchase = () => {
  const router = useRouter();
  const api = new APICall();

  const [tableData, setTableData] = useState([]);
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

      // Check if response.data is an array
      if (Array.isArray(response.data)) {
        setTableData(response.data);
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };



  const handleViewDetails = (row) => {
    localStorage.setItem("purchaseBookId", row.id);
    router.push("/purchase_details");
  };

  return (
    <div className={styles.container}>
      <Buttons leftSectionText="Purchase" addButtonLink="/addPurchase"  onDateChange={handleDateChange} />

      {/* <Grid container spacing={2}>
        <Grid item lg={8} sm={12} xs={12} md={4}>
          <div className={styles.leftSection}> Purchase </div>
        </Grid>

        <Grid item lg={4} sm={12} xs={12} md={8}>
          <div className="flex">
            <div className="flex-grow"></div>

            <div>
              <Grid container spacing={2}>
                <Grid lg={6} item xs={6} sm={6} md={6}>
                  <Link href="/addPurchase">
                    <div className={styles.rightItem}>Add</div>
                  </Link>
                </Grid>
                <Grid lg={6} item xs={6} sm={6} md={6}>
                  <DateFilter onDateChange={handleDateChange} />
                </Grid>
              </Grid>
            </div>
          </div>
        </Grid>
      </Grid> */}

      <TableContainer component={Paper} className={styles.tableSection}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Product</TableCell>
              <TableCell> Party </TableCell>
              <TableCell> Weight </TableCell>
              <TableCell> Amount </TableCell>
              <TableCell> Action </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? // Show skeletons while loading
                Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from(new Array(22)).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : // Display data
                tableData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.product?.product_name}</TableCell>
                    <TableCell>{row.supplier?.person_name}</TableCell>
                    <TableCell>{row.net_weight}</TableCell>
                    <TableCell>{row.total_amount}</TableCell>
                    <TableCell onClick={() => handleViewDetails(row)}>
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
