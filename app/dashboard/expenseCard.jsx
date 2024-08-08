import React from "react";

import styles from "../../styles/dashboard.module.css"

const ExpenseCard = () => {
    return (
        <>
            <div className={styles.expenseCard}>
                <div className={styles.openingBlnce}>
                    Opening balance
                </div>

                <div className={styles.expneseAmount}> $50,000 </div>
            </div>

            <div className={styles.expenseCard}>
                <div className={styles.openingBlnce}>
                    Recieved Amount
                </div>

                <div className={styles.expneseAmount}> $50,000 </div>
            </div>

            <div className={styles.expenseCard}>
                <div className={styles.openingBlnce}>
                    Payed Amount
                </div>

                <div className={styles.expneseAmount}> $50,000 </div>
            </div>

            <div className={styles.expenseCard}>
                <div className={styles.openingBlnce}>
                    Total balance
                </div>

                <div className={styles.expneseAmount}> $50,000 </div>
            </div>

        </>
    )
}

export default ExpenseCard