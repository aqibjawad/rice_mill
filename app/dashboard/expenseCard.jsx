"use client";

import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Skeleton } from "@mui/material";
import styles from "../../styles/dashboard.module.css";
import APICall from "../../networkApi/APICall";
import { dashboard } from "../../networkApi/Constants";

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
      const response = await api.getDataWithToken(dashboard);
      setTableData(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

const addition = (tableData?.opening_balance || 0) + (tableData?.inflow || 0) - (tableData?.outflow || 0);

  return (
    <Grid container spacing={2}>
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

      <Grid item xs={12} sm={6} md={3}>
        <Card className={styles.card} variant="outlined">
          <CardContent>
            <div className={styles.imageCont}>
              <img src="/amount.png" className={styles.cardImage} alt="Inflow" />
            </div>
            <div className={styles.cardAmount}>
              {loading ? (
                <Skeleton width={100} height={30} />
              ) : (
                tableData?.inflow
              )}
            </div>
            <div className={styles.cardTitle}>Inflow</div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card className={styles.card} variant="outlined">
          <CardContent>
            <div className={styles.imageCont}>
              <img src="/epxense.png" className={styles.cardImage} alt="Outflow" />
            </div>
            <div className={styles.cardAmount}>
              {loading ? (
                <Skeleton width={100} height={30} />
              ) : (
                tableData?.outflow
              )}
            </div>
            <div className={styles.cardTitle}>Outflow</div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card className={styles.card} variant="outlined">
          <CardContent>
            <div className={styles.imageCont}>
              <img src="/total.png" className={styles.cardImage} alt="Total" />
            </div>
            <div className={styles.cardAmount}>
              {loading ? <Skeleton width={100} height={30} /> : addition}
            </div>
            <div className={styles.cardTitle}>Total</div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
