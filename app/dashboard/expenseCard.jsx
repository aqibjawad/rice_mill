import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import styles from "../../styles/dashboard.module.css";

const ExpenseCard = ({ title, image, amount }) => {
    return (
        <Card className={styles.card} variant="outlined">
            <CardContent>
                <div className={styles.imageCont}>
                    <img src={image} alt={title} className={styles.cardImage} />
                </div>
                <div className={styles.cardAmount}>
                    {amount}
                </div>
                <div className={styles.cardTitle}>
                    {title}
                </div>
            </CardContent>
        </Card>
    );
}

const Dashboard = () => {
    // Sample data
    const expenses = [
        { amount: "$120.00", title: "opening Balance", image: "/opening.png"  },
        { amount: "$78", title: "Recieves", image: "/amount.png"  },
        { amount: "$78", title: "Payments", image: "/opening.png"  },
        { amount: "$78", title: "Total", image: "/total.png"  },
        // Add more expenses as needed
    ];

    return (
        <Grid container spacing={2}>
            {expenses.map((expense, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <ExpenseCard
                        image={expense.image}
                        amount={expense.amount}
                        title={expense.title}
                    />
                </Grid>
            ))}
        </Grid>
    );
}

export default Dashboard;
