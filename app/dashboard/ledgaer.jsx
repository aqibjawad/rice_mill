"use client";

import React, { useState } from "react";
import styles from "../../styles/dashboard.module.css";
import AddLedgerEntry from "../addCustomer/page";

import { Grid } from '@mui/material';

const Ledger = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Sample data for the table
    const tableData = [
        { id: 1, sr: 1, paymentType: 'Cash', person: 'John Doe', description: 'Office Supplies', amount: 500 },
        { id: 2, sr: 2, paymentType: 'Bank Transfer', person: 'Jane Smith', description: 'Utility Bill', amount: 750 },
        { id: 3, amount: "Total : 1250" },
    ];

    return (
        <div>
            <div className={styles.container}>
                <Grid container spacing={2}>
                    <Grid item lg={10} sm={12} xs={12} md={4}>
                        <div className={styles.leftSection}>
                            Sale
                        </div>
                    </Grid>
                    <Grid item lg={2} sm={12} xs={12} md={8}>
                        <div className={styles.rightSection}>

                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={6} md={3}>
                                    <div className={styles.rightItemExp}>
                                        Add
                                    </div>
                                </Grid>
                                <Grid item xs={6} sm={6} md={3}>
                                    <div className={styles.rightItem}>
                                        date
                                    </div>
                                </Grid>
                                <Grid item xs={6} sm={6} md={3}>
                                    <div className={styles.rightItem}>
                                        view all
                                    </div>
                                </Grid>
                                <Grid item xs={6} sm={6} md={3}>
                                    <div className={styles.rightItemExp}>
                                        export
                                    </div>
                                </Grid>
                            </Grid>
                        </div>

                    </Grid>
                </Grid>
            </div>

            <div className={styles.tableSection}>
                <div className={styles.tableHeader}>
                    <div>Sr.</div>
                    <div>Payment Type</div>
                    <div>Person</div>
                    <div>Description</div>
                    <div>Amount</div>
                </div>
                <div className={styles.tableBody}>
                    {tableData.map((row) => (
                        <div key={row.id} className={styles.tableRowData}>
                            <div>{row.sr}</div>
                            <div>{row.paymentType}</div>
                            <div>{row.person}</div>
                            <div>{row.description}</div>
                            <div>{row.amount}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Use the AddLedgerEntry component */}
            <AddLedgerEntry open={open} handleClose={handleClose} />
        </div>
    )
}

export default Ledger;