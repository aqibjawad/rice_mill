"use client";

import React from "react";
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

const Invoice = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <button onClick={handlePrint} className={styles.printButton}>
        Print Invoice
      </button>

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
            <img className={styles.img} src="/logo.png" alt="Company Logo" />
          </Grid>
        </Grid>

        <div className="mt-10">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <div className={styles.issueDate}>Issued</div>
              <div className={styles.compAddress}>01 Aug, 2023</div>

              <div className={` mt-5 ${styles.issueDate}`}>Due</div>
              <div className={styles.compAddress}>01 Aug, 2023</div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <div className={styles.invoiceCompName}>Billed to</div>
              <div className={styles.compAddress}>Farooq Cosmetic Store</div>
              <div className={styles.compAddress}>Galamindi chunain</div>
              <div className={styles.compAddress}>0300 5061234</div>
            </Grid>
          </Grid>
        </div>

        <div>
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
                  <TableCell>Quantity</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Rate</TableCell>
                  <TableCell>Total Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell> item </TableCell>
                  <TableCell> test </TableCell>
                  <TableCell> quantity </TableCell>
                  <TableCell> 100 </TableCell>
                  <TableCell> 100 </TableCell>
                  <TableCell> 100 </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell> item </TableCell>
                  <TableCell> test </TableCell>
                  <TableCell> quantity </TableCell>
                  <TableCell> 100 </TableCell>
                  <TableCell> 100 </TableCell>
                  <TableCell> 100 </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <div
            style={{
              width: "100%",
            }}
          >
            <div className={styles.tableTotalRow}>
              Subtotal: <span className={styles.amount}> $400.00 </span>{" "}
            </div>

            <div className={styles.tableTotalRow}>
              Tax: <span className={styles.amount}> $400.00 </span>{" "}
            </div>

            <div className={styles.tableTotalRow}>
              Total: <span className={styles.amount}> $400.00 </span>{" "}
            </div>

            <div className={styles.amountBorder}>
              <div className={styles.amountDue}>Subtotal: $400.00</div>
            </div>
          </div>

          <div className="mt-10">
            <div className={styles.invoiceCompName}>
              Thank you for the business!
            </div>
            <div className={styles.compAddress}>
              Please pay within 15 days of receiving this invoice.
            </div>
          </div>

          <div className={styles.border}></div>

          <div className="mt-5 w-85">
            <Grid container spacing={2}>
              <Grid item xs={12} lg={6} sm={6}>
                <div className={styles.compAddress}>
                  Digital Product Designer, IN
                </div>
              </Grid>
              <Grid item xs={12} lg={6} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={6} sm={6}>
                    <div className={styles.compAddress}>+91 00000 00000 </div>
                  </Grid>
                  <Grid item xs={12} lg={6} sm={6}>
                    {" "}
                    <div className={styles.compAddress}>
                      {" "}
                      hello@email.com{" "}
                    </div>{" "}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;
