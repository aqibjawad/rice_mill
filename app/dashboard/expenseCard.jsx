"use client";

import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Skeleton } from "@mui/material";
import styles from "../../styles/dashboard.module.css";
import APICall from "../../networkApi/APICall";
import { dashboard } from "../../networkApi/Constants";

import { format } from "date-fns";

const Dashboard = () => {
  const api = new APICall();

  const [tableData, setTableData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = [];

      const currentDate = format(new Date(), "yyyy-MM-dd");
      queryParams.push(`date=${currentDate}`);

      const apiUrl = `${dashboard}?${queryParams.join("&")}`;

      const response = await api.getDataWithToken(apiUrl);
      console.log(response.data);
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const openingBalance = Number(tableData?.opening_balance) || 0;
  const inflow = Number(tableData?.inflow) || 0;
  const outflow = Number(tableData?.outflow) || 0;

  // Step 1: Perform addition
  const sum = inflow;

  // Step 2: Perform subtraction
  const result = sum - outflow;

  return (
    <Grid container spacing={2}>
      {/* Opening Balance */}
      <Grid item xs={12} sm={6} md={3}>
        <Card className={styles.card} variant="outlined">
          <CardContent>
            <div className={styles.imageCont}>
              <img
                src="/opening.png"
                className={styles.cardImage}
                alt="Opening Balance"
              />
            </div>
            <div className={styles.cardAmount}>
              {loading ? (
                <Skeleton width={100} height={30} />
              ) : (
                tableData?.opening_balance
              )}
            </div>
            <div className={styles.cardTitle}>Opening Balance</div>
          </CardContent>
        </Card>
      </Grid>

      {/* Inflow */}
      <Grid item xs={12} sm={6} md={3}>
        <Card className={styles.card} variant="outlined">
          <CardContent>
            <div className={styles.imageCont}>
              <img
                src="/amount.png"
                className={styles.cardImage}
                alt="Inflow"
              />
            </div>
            <div className={styles.cardAmount}>
              {loading ? (
                <Skeleton width={100} height={30} />
              ) : (
                tableData?.cash_inflow
              )}
            </div>
            <div className={styles.cardTitle}> Cash Receives</div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card className={styles.card} variant="outlined">
          <CardContent>
            <div className={styles.imageCont}>
              <img src="/bank.png" className={styles.cardImage} alt="Inflow" />
            </div>
            <div className={styles.cardAmount}>
              {loading ? (
                <Skeleton width={100} height={30} />
              ) : (
                tableData?.bank_inflow
              )}
            </div>
            <div className={styles.cardTitle}> Bank Receives</div>
          </CardContent>
        </Card>
      </Grid>

      {/* outflow */}
      <Grid item xs={12} sm={6} md={3}>
        <Card className={styles.card} variant="outlined">
          <CardContent>
            <div className={styles.imageCont}>
              <img
                src="/epxense.png"
                className={styles.cardImage}
                alt="Outflow"
              />
            </div>
            <div className={styles.cardAmount}>
              {loading ? (
                <Skeleton width={100} height={30} />
              ) : (
                tableData?.cash_outflow
              )}
            </div>
            <div className={styles.cardTitle}>Payments</div>
          </CardContent>
        </Card>
      </Grid>

      {/* Balance */}
      <Grid item xs={12} sm={6} md={3}>
        <Card className={styles.card} variant="outlined">
          <CardContent>
            <div className={styles.imageCont}>
              <img src="/total.png" className={styles.cardImage} alt="Total" />
            </div>
            <div className={styles.cardAmount}>
              {loading ? (
                <Skeleton width={100} height={30} />
              ) : // Calculate the result
              tableData ? (
                (
                  (tableData.opening_balance || 0) -
                  (tableData.cash_inflow || 0) -
                  (tableData.cash_outflow || 0)
                ).toFixed(2)
              ) : (
                0
              )}
            </div>
            <div className={styles.cardTitle}> Cash in Hands </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
