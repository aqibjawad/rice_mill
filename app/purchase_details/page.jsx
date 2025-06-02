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
import {
  purchaseBook,
  getLocalStorage,
  saleBook,
} from "../../networkApi/Constants";

import "jspdf-autotable";

import moment from "moment";

import withAuth from "@/utils/withAuth";

const MUND_TO_KG = 40;

const Page = () => {
  const api = new APICall();

  const [salesBook, setSaleBook] = useState([]);
  const [rowData, setRowData] = useState();

  const [isReadyToPrint, setIsReadyToPrint] = useState(false);

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

      setSaleBook(data);
      setIsReadyToPrint(true);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (isReadyToPrint) {
      setTimeout(() => {
        window.print();
        setIsReadyToPrint(false);
      }, 1000);
    }
  }, [isReadyToPrint]);

  const calculateMundsAndKgs = (weight) => {
    const weightInKg = parseFloat(weight);
    if (isNaN(weightInKg)) {
      return { munds: "", kgs: "" };
    }

    const fullMunds = Math.floor(weightInKg / MUND_TO_KG);
    const remainderKg = weightInKg % MUND_TO_KG;

    return {
      munds: fullMunds.toFixed(0),
      kgs: remainderKg.toFixed(2),
    };
  };

  const { munds, kgs } = calculateMundsAndKgs(salesBook?.final_weight || 0);

  const formattedDate = (dateString) => {
    return moment(dateString).format("MMMM D, YYYY");
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
            <div className={styles.issueDate}>Party Name</div>
            <div className={styles.buyerName}>
              {" "}
              {salesBook?.party?.person_name}{" "}
            </div>
          </Grid>

          {/* <Grid item xs={12} lg={4} sm={6}>
            <div>
              <div className={styles.issueDate}> Phone No Party </div>
              <div className={styles.buyerName}> {} </div>
            </div>
          </Grid> */}

          <Grid item xs={12} lg={4} sm={6}>
            <div className="flex">
              <div className="flex-grow"></div>
              <div>
                <div className={styles.issueDate}> Date </div>
                <div className={styles.buyerName}>
                  {" "}
                  {formattedDate(salesBook.created_at)}{" "}
                </div>
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
                    <strong> Serial Number:</strong>
                  </TableCell>
                  <TableCell> {salesBook?.serial_no} </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> Bardaana Quantity:</strong>
                  </TableCell>
                  <TableCell> {salesBook?.bardaana_quantity} </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> Bardaana Deduction:</strong>
                  </TableCell>
                  <TableCell> {salesBook?.bardaana_deduction} </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> Transport No:</strong>
                  </TableCell>
                  <TableCell> {saleBook?.truck_no || 0} </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> Total Amount :</strong>
                  </TableCell>
                  <TableCell> {salesBook?.total_amount} </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> Bank Tax: </strong>
                  </TableCell>
                  <TableCell> {salesBook?.bank_tax || 0} </TableCell>
                </TableRow>

                {salesBook?.payment_type && (
                  <TableRow>
                    <TableCell>
                      <strong>
                        {salesBook.payment_type === "cash" ? "Cash" : "Cheque"}:
                      </strong>
                    </TableCell>
                    <TableCell>
                      {salesBook.payment_type === "cash"
                        ? salesBook.cash_amount
                        : salesBook.cheque_amount}
                    </TableCell>
                  </TableRow>
                )}
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
                  <TableCell> {salesBook.final_weight} </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> Maan:</strong>
                  </TableCell>
                  <TableCell> {munds} </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> KG:</strong>
                  </TableCell>
                  <TableCell> {kgs} </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> Price Per Munds:</strong>
                  </TableCell>
                  <TableCell> {salesBook?.price_mann} </TableCell>
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
                    <strong> Net Weight:</strong>
                  </TableCell>
                  <TableCell> {salesBook?.net_weight} </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong> Final Weight:</strong>
                  </TableCell>
                  <TableCell> {salesBook?.final_weight} </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={4} sm={6}>
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong> Pending Amount:</strong>
                  </TableCell>
                  <TableCell> {salesBook.rem_amount} </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} lg={4} sm={6}>
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong> Signature:</strong>
                  </TableCell>
                  <TableCell> </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} lg={4} sm={6}>
          <div className={styles.issueDate}> Cashier</div>
          <div className={styles.buyerName}> {salesBook?.user?.name} </div>
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
