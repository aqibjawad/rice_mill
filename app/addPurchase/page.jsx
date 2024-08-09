import React from "react";
import { Grid } from "@mui/material";

import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "../../components/generic//dropdown"
import PrimaryButton from "../../components/generic/PrimaryButton";


const Page = () => {

    const productsList = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
        { id: 3, name: 'Product 3' },
    ];

    const bardaanaList = [
        { id: 1, name: 'Toora' },
        { id: 2, name: 'Boori' },
    ];

    return (
        <Grid container spacing={2}>


            <Grid className="mt-7" item xs={12} sm={4}>
                <Dropdown title="Select Party" options={productsList} />
            </Grid>


            <Grid item xs={12} sm={5}>
                <InputWithTitle title={"Select Date"} type="date" placeholder={"Select Date"} />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
                <Dropdown title="Select Product" options={productsList} />
            </Grid>

            <Grid className="mt-5" item xs={12} sm={4}>
                <InputWithTitle title={"Enter Quantity"} placeholder={"Enter Quantity"} />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
                <Dropdown title="Select Bardaana" options={bardaanaList} />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
                <InputWithTitle title={"freight"} placeholder={"Enter Truck Number"} />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
                <InputWithTitle title={"freight"} placeholder={"freight"} />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
                <InputWithTitle title={"Total Amount"} placeholder={"Total Amount"} />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
                <InputWithTitle title={"Bank Tax"} placeholder={"Bank Tax"} />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
                <InputWithTitle title={"Net Amount"} placeholder={"Net Amount"} />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
                <InputWithTitle title={"Cheque Number"} placeholder={"Cheque Number"} />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
                <InputWithTitle title={"Remaining Amount"} placeholder={"Remaining Amount"} />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
                <InputWithTitle title={"First Weight"} placeholder={"First Weight"} />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
                <InputWithTitle title={"Second Weight"} placeholder={"Second Weight"} />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
                <InputWithTitle title={"Net Weight"} placeholder={"Net Weight"} />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
                <InputWithTitle title={"Bardaana Deduction"} placeholder={"Bardaana Deduction"} />
            </Grid>

            <Grid className="mt-10" item xs={12} sm={4}>
                <InputWithTitle title={"Saafi Weight"} placeholder={"Saafi Weight"} />
            </Grid>

            <div className="mt-10">
                <PrimaryButton
                    title={"Add Purchase"}
                />
            </div>
        </Grid>
    );
}

export default Page;
