import React from "react";
import Grid from "@mui/material/Grid";
import Inflow from "./inflow";
import ExpenseCard from "./expenseCard";
import OutFlow from "./outFlow";
import Ledger from "./ledgaer";
import Expense from "./expense";
import Stock from "./stock";
import Product from "./product";

const Page = () => {
    return (
        <Grid container spacing={3}>
            <Grid item lg={2} xs={12} sm={6} md={4}>
                <ExpenseCard />
            </Grid>

            <Grid item lg={10} xs={12} sm={6} md={8}>
                <Inflow />
            </Grid>

            <Grid item xs={12}>
                <OutFlow />
            </Grid>

            <Grid item lg={12} xs={12} md={6}>
                <Ledger />
            </Grid>

            <Grid item lg={12} xs={12} sm={6} md={4}>
                <Stock />
            </Grid>

            <Grid lg={12} item xs={12} sm={6} md={12}>
                <Product />
            </Grid>
        </Grid>
    );
}

export default Page;
