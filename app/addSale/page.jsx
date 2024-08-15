import React from "react";
import Grid from '@mui/material/Grid';

import styles from "../../styles/addSale.module.css"

import DropDown from "@/components/generic/dropdown";
import InputWithTitle from "@/components/generic/InputWithTitle";

import TableSale from "./tableSale"

const Page = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <div className={styles.saleHead}>
                    Add Sale
                </div>
                <Grid className="mt-10" container spacing={2}>
                    <Grid item xs={12}>
                        <DropDown
                            title="Select Party"
                            // options={supplierList}
                            // onChange={handleDropdownChange}
                            // value={dropdownValues.sup_id}
                            name="sup_id"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputWithTitle title={"Enter Truck Number"} />
                    </Grid>

                    <div className={styles.saleSec}>
                        <div className={styles.itemBill}>
                            Add Items in bill
                        </div>

                        <Grid className="mt-10" container spacing={2}>
                            <Grid item xs={12}>
                                <DropDown
                                    title="Select Product"
                                    // options={supplierList}
                                    // onChange={handleDropdownChange}
                                    // value={dropdownValues.sup_id}
                                    name="sup_id"
                                />
                            </Grid>

                            <Grid className="mt-5" item xs={12}>
                                <DropDown
                                    title="Select Packing"
                                    // options={supplierList}
                                    // onChange={handleDropdownChange}
                                    // value={dropdownValues.sup_id}
                                    name="sup_id"
                                />
                            </Grid>

                            <Grid className="mt-5" item xs={12}>
                                <InputWithTitle title={"Enter Unit Price"} />
                            </Grid>


                            <Grid className="mt-5" item xs={12}>
                                <InputWithTitle title={"Enter Quantity"} />
                            </Grid>


                            <Grid className="mt-5" item xs={12}>
                                <InputWithTitle title={"Enter Description"} />
                            </Grid>
                            
                            <div className={styles.addItemBtn}>
                                Add Item
                            </div>
                        </Grid>
                    </div>

                </Grid>

            </Grid>
            <Grid item xs={6}>
                <TableSale />
            </Grid>

        </Grid>
    );
}

export default Page;
