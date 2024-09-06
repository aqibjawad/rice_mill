"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles/purchaseDetails.module.css";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import APICall from "@/networkApi/APICall";
import { purchaseBook, getLocalStorage } from "../../networkApi/Constants";

import "jspdf-autotable";

import withAuth from "@/utils/withAuth";

const Page = () => {
  const api = new APICall();

  const [salesBook, setSaleBook] = useState([]);
  const [rowData, setRowData] = useState();

  const purchaseBookId = getLocalStorage("purchaseBookId");
  useEffect(() => {
    fetchPurchaseBook();
  }, []);

  const fetchPurchaseBook = async () => {
    try {
      const response = await api.getDataWithToken(
        `${purchaseBook}/${purchaseBookId}`
      );

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

  const calculateTotalAmount = () => {
    const total = salesBook.reduce(
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
              <img className={styles.img} src="/logo.png" alt="Company Logo" />
            </div>
          </div>
        </Grid>
      </Grid>

      <div className="mt-10">
        <Grid container spacing={2}>
          <Grid item xs={12} lg={4} sm={6}>
            <div className={styles.issueDate}>Serial Number</div>
            <div className={styles.buyerName}> 25250 </div>
          </Grid>

          <Grid item xs={12} lg={4} sm={6}>
            <div>
              <div className={styles.issueDate}> Phone No Party </div>
              <div className={styles.buyerName}> 25250 </div>
            </div>
          </Grid>

          <Grid item xs={12} lg={4} sm={6}>
            <div className="flex">
              <div className="flex-grow"></div>
              <div>
                <div className={styles.issueDate}> Phone No Party </div>
                <div className={styles.buyerName}> 25250 </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={6} sm={6}>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong> Party Type:</strong>
                  </TableCell>
                  <TableCell> test </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> Party Type:</strong>
                  </TableCell>
                  <TableCell> test </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> Party Type:</strong>
                  </TableCell>
                  <TableCell> test </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> Party Type:</strong>
                  </TableCell>
                  <TableCell> test </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> Party Type:</strong>
                  </TableCell>
                  <TableCell> test </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> Party Type:</strong>
                  </TableCell>
                  <TableCell> test </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> Party Type:</strong>
                  </TableCell>
                  <TableCell> test </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> Party Type:</strong>
                  </TableCell>
                  <TableCell> test </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> Party Type:</strong>
                  </TableCell>
                  <TableCell> test </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> Party Type:</strong>
                  </TableCell>
                  <TableCell> test </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} lg={6} sm={6}>
          <TableContainer
            style={{ background: "#F4F3F3" }}
            component={Paper}
            sx={{ mt: 2 }}
          >
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong> Total Weight:</strong>
                  </TableCell>
                  <TableCell> test </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> KG:</strong>
                  </TableCell>
                  <TableCell> test </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> Maan:</strong>
                  </TableCell>
                  <TableCell> test </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer
            style={{ background: "#F4F3F3" }}
            component={Paper}
            sx={{ mt: 2 }}
          >
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong> Total Weight:</strong>
                  </TableCell>
                  <TableCell> test </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> KG:</strong>
                  </TableCell>
                  <TableCell> test </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> Maan:</strong>
                  </TableCell>
                  <TableCell> test </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* <div>
        <TableContainer
          component={Paper}
          style={{
            width: "100%",
            marginTop: 20,
            backgroundColor: "transparent",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Weight</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Total Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesBook?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell>{`${item.product_description}`}</TableCell>
                  <TableCell>{`${item.weight}`}</TableCell>
                  <TableCell>{item.price_mann}</TableCell>
                  <TableCell>{item.total_amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div
          style={{
            width: "100%",
          }}
        >
          <div className={styles.tableTotalRow}>
            Total:{" "}
            <span className={styles.amountDue}> {calculateTotalAmount()} </span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default withAuth(Page);
