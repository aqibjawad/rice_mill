"use client";

import React from "react";
import Grid from "@mui/material/Grid";
import Inflow from "./inflow";
import ExpenseCard from "./expenseCard";
import OutFlow from "./outFlow";
import Stock from "./stock";
import Purchase from "./purchase";
import Sale from "../sale/page"

import withAuth from "@/utils/withAuth";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <Grid container spacing={3}>
      <Grid item lg={12} xs={12} sm={12} md={12}>
        <ExpenseCard />
      </Grid>

      <Grid item lg={12} xs={12} sm={12} md={12}>
        <Inflow />
      </Grid>

      <Grid item xs={12}>
        <OutFlow />
      </Grid>

      <Grid item xs={12}>
        <Purchase />
      </Grid>

      <Grid item xs={12}>
        <Sale />
      </Grid>


      <Grid item lg={12} xs={12} sm={6} md={4}>
        <Stock />
      </Grid>
    </Grid>
  );
};

export default withAuth(Page);
