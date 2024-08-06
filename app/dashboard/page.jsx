import React from "react";

import Inflow from "./inflow"
import ExpenseCard from "./expenseCard"
import OutFlow from "./outFlow"
import Ledger from "./ledgaer"
import Expense from "./expense"
import Stock from "./stock"
import Product from "./product"

import styles from "../../styles/dashboard.module.css"

const Page = () => {
    return (
        <div>
            <div className={styles.flexContainer}>
                <div className={styles.expenseCardWrapper}>
                    <ExpenseCard />
                </div>
                <div className={styles.inflowWrapper}>
                    <Inflow />
                </div>
            </div>
            <OutFlow />
            <div className="flex">
                <div className="flex-grow">
                    <div className="mr-5"> <Ledger /> </div>
                </div>
                {/* <div>
                    <div className="">
                        <Expense />
                    </div>
                </div> */}
            </div>
            <Stock />
            <Product />
        </div>
    )
}

export default Page