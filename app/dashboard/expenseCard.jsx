import React from "react";

import styles from "../../styles/dashboard.module.css"

const ExpenseCard = () => {
    return (
        <>
            <div className={styles.expenseCard}>
                <div className="flex">
                    <div className="flex-grow">
                        <div className="mr-5"> <img src="/epxense.png" /> </div>
                    </div>
                    <div>
                        <div className="">
                            <img className={styles.vector} src="/Vector.png" />
                        </div>
                    </div>
                </div>

                <div className="flex">
                    <div className="flex-grow">
                        <div className={styles.expneseAmount}> $50,000 </div>
                    </div>
                    <div>
                        <div className={styles.expenseBar}>
                            78%
                        </div>
                    </div>
                </div>

                <div className={styles.openingBlnce}>
                    Opening balance
                </div>
            </div>

            <div className={styles.expenseCard}>
                <div className="flex">
                    <div className="flex-grow">
                        <div className="mr-5"> <img src="/epxense.png" /> </div>
                    </div>
                    <div>
                        <div className="">
                            <img className={styles.vector} src="/Vector.png" />
                        </div>
                    </div>
                </div>

                <div className="flex">
                    <div className="flex-grow">
                        <div className={styles.expneseAmount}> $50,000 </div>
                    </div>
                    <div>
                        <div className={styles.expenseBar}>
                            78%
                        </div>
                    </div>
                </div>

                <div className={styles.openingBlnce}>
                    Opening balance
                </div>
            </div>

            <div className={styles.expenseCard}>
                <div className="flex">
                    <div className="flex-grow">
                        <div className="mr-5"> <img src="/epxense.png" /> </div>
                    </div>
                    <div>
                        <div className="">
                            <img className={styles.vector} src="/Vector.png" />
                        </div>
                    </div>
                </div>

                <div className="flex">
                    <div className="flex-grow">
                        <div className={styles.expneseAmount}> $50,000 </div>
                    </div>
                    <div>
                        <div className={styles.expenseBar}>
                            78%
                        </div>
                    </div>
                </div>

                <div className={styles.openingBlnce}>
                    Opening balance
                </div>
            </div>
        </>
    )
}

export default ExpenseCard