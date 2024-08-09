import React from "react";
import styles from "../../styles/dashboard.module.css"
import { Grid} from '@mui/material';

const OutFlow = () => {
    // Sample data for the table
    const tableData = [
        { id: 1, sr: 1, paymentType: 'Cash', person: 'John Doe', description: 'Office Supplies', amount: 500 },
        { id: 2, sr: 2, paymentType: 'Bank Transfer', person: 'Jane Smith', description: 'Utility Bill', amount: 750 },
        { id: 3, amount: "Total : 750" },
        // Add more rows as needed
    ];

    return (
        <div>
             <div className={styles.container}>
                <Grid container spacing={2}>
                    <Grid item lg={10} sm={12} xs={12} md={4}>
                        <div className={styles.leftSection}>
                            Outflow
                        </div>
                    </Grid>
                    <Grid item lg={2} sm={12} xs={12} md={8}>
                        <Grid container spacing={2}>
                            <div className={styles.rightSection}>
                                <Grid item sm={5}>
                                    <div className={styles.rightItemExp} >
                                        Add
                                    </div>
                                </Grid>
                                <Grid item sm={6}>
                                    <div className={styles.rightItem}>
                                        date
                                    </div>
                                </Grid>
                                <Grid item sm={6}>
                                    <div className={styles.rightItem}>
                                        view all
                                    </div>
                                </Grid>
                                <Grid item>
                                    <div className={styles.rightItemExp}>
                                        export
                                    </div>
                                </Grid>
                            </div>

                        </Grid>
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
        </div>
    )
}

export default OutFlow