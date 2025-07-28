"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/invoice.module.css";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import { getLocalStorage, saleBook } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";

const Gateway = () => {
  const api = new APICall();
  const [salesBook, setSaleBook] = useState([]);
  const [rowData, setRowData] = useState();
  const [isPrinting, setIsPrinting] = useState(false);

  const saleBookId = getLocalStorage("saleBookId");

  useEffect(() => {
    fetchSaleBook();
  }, []);

  useEffect(() => {
    if (salesBook.length > 0 && !isPrinting) {
      setIsPrinting(true);
      setTimeout(() => {
        window.print();
        setIsPrinting(false);
      }, 1000);
    }
  }, [salesBook]);

  const fetchSaleBook = async () => {
    try {
      const response = await api.getDataWithToken(`${saleBook}/${saleBookId}`);
      const data = response.data;
      setRowData(data);
      if (Array.isArray(data.details)) {
        setSaleBook(data.details);
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <div className={styles.invoiceContainer}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6} sm={6}>
            <div className={styles.invoiceCompName}>Ghulam Bari Rice Mills</div>
            <div className={styles.compAddress}>
              Hujra Road, Near Ghala Mandi Chunian. 0336 4046155, 0301 4046155,
              0300-7971654, 0300 5061234
            </div>
          </Grid>
          <Grid item xs={12} lg={6} sm={6}>
            <div className="flex">
              <div className="flex-grow"></div>
              <div>
                <img
                  className={styles.img}
                  src="/logo.png"
                  alt="Company Logo"
                />
              </div>
            </div>
          </Grid>
        </Grid>
        <div style={{textAlign:"center", fontSize:"20px", fontWeight:"bold", color:"#5E6470"}}> Gate Pass </div>

        <div className="mt-10">
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6} sm={6}>
              <div className={styles.issueDate}>Issued</div>
              <div className={styles.buyerName}> {rowData?.date} </div>

              <div style={{ marginTop: "1rem" }} className={styles.issueDate}>
                {" "}
                Bill Reference Number{" "}
              </div>
              <div className={styles.buyerName}> {rowData?.ref_no} </div>
              <div style={{ marginTop: "1rem" }} className={styles.issueDate}>
                {" "}
                Sales By: {rowData?.user?.name || "N/A"}
              </div>
            </Grid>

            <Grid item xs={12} lg={6} sm={6}>
              <div className="flex">
                <div className="flex-grow"></div>
                <div>
                  <div className={styles.issueDate}>
                    {rowData?.party?.person_name}
                  </div>
                  <div className={styles.buyerName}>
                    {rowData?.party?.address}
                  </div>
                  <div className={styles.buyerName}>
                    {rowData?.party?.contact}{" "}
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>

        <div>
          <TableContainer
            component={Paper}
            style={{
              width: "98%",
              margin: "20px auto",
              backgroundColor: "transparent",
              overflowX: "hidden",
            }}
          >
            <Table
              style={{
                tableLayout: "fixed",
                minWidth: "auto",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "15%", padding: "8px 4px" }}>
                    Sr No
                  </TableCell>
                  <TableCell style={{ width: "15%", padding: "8px 4px" }}>
                    Product Name
                  </TableCell>
                  <TableCell style={{ width: "15%", padding: "8px 4px" }}>
                    Bardaana Quantity
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesBook?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ padding: "8px 4px" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell style={{ padding: "8px 4px" }}>
                      {item.product_name}
                    </TableCell>
                    <TableCell
                      style={{ padding: "8px 4px" }}
                    >{`${item.bardaana_deduction}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default Gateway;
