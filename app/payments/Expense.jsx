"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/paymentss.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import MultilineInput from "../../components/generic/MultilineInput";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


import AddExpense from "../../components/stock/addExpense";

import { banks as banksApi } from "../../networkApi/Constants"; // Adjust import based on actual path

import { expense as expenseApi } from "../../networkApi/Constants"; // Adjust import based on actual path
import AddBank from "../../components/stock/addBank";

const Expense = () => {

    const [tableData, setTableData] = useState([]);

    const [tableExpenseData, setTableExpenseData] = useState([]);

    const [open, setOpen] = useState(false);
    const [openExpense, setOpenExpense] = useState(false);
    const [activeTab, setActiveTab] = useState("tab1");

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleOpenExpense = () => setOpenExpense(true);
    const handleCloseExpense = () => setOpenExpense(false);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Sample data for top100Films, you might want to replace it with actual data


    useEffect(() => {
        fetchData();
        fetchExpenseData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(banksApi);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            const data = result.data;
            if (Array.isArray(data)) {
                // Assuming each bank object has a 'name' property
                const formattedData = data.map(bank => ({ label: bank.bank_name }));
                setTableData(formattedData);
            } else {
                throw new Error('Fetched data is not an array');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const fetchExpenseData = async () => {
        try {
            const response = await fetch(expenseApi);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            const data = result.data;
            if (Array.isArray(data)) {
                // Assuming each bank object has a 'name' property
                const formattedData = data.map(expensees => ({ label: expensees.expense_category }));
                setTableExpenseData(formattedData);
            } else {
                throw new Error('Fetched data is not an array');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div>
            <div className='mt-10' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, marginRight: '10px' }}>
                    <div className={styles.bankHead} onClick={handleOpenExpense} style={{ cursor: "pointer", marginBottom: "1rem" }}>
                        Add Expense
                    </div>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={tableExpenseData}
                        sx={{ width: 750 }}
                        renderInput={(params) => <TextField {...params} label="Select Expense Type" />}
                    />
                </div>
                <div style={{ flex: 1, marginLeft: '10px', marginTop: "1rem" }}>
                    <InputWithTitle
                        title="Amount"
                        type="text"
                        placeholder="Amount"
                        name="opening_balance"
                    />
                </div>
            </div>

            <div className='mt-10'>
                <div className={styles.tabPaymentContainer}>
                    <button className={`${styles.tabPaymentButton} ${activeTab === "tab1" ? styles.active : ""}`} onClick={() =>
                        handleTabClick("tab1")}
                    >
                        Cash
                    </button>
                    <button className={`${styles.tabPaymentButton} ${activeTab === "tab2" ? styles.active : ""}`} onClick={() =>
                        handleTabClick("tab2")}
                    >
                        Cheque
                    </button>
                </div>
                <div className={styles.tabPaymentContent}>
                    {activeTab === "tab1" && (
                        ""
                    )}
                    {activeTab === "tab2" && (
                        <div>
                            <div className='mt-10' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ flex: 1, marginRight: '10px' }}>
                                    <div className={styles.bankHead} onClick={handleOpen} style={{ cursor: "pointer", marginBottom: "1rem" }}>
                                        Add Bank
                                    </div>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={tableData}
                                        sx={{ width: 500 }}
                                        renderInput={(params) => <TextField {...params} label="Select Bank" />}
                                        getOptionLabel={(option) => option.label || ''}
                                    />
                                </div>

                                <div style={{ flex: 1, marginRight: '10px', marginTop: "1rem" }}>
                                    <InputWithTitle
                                        title="Cheque Number"
                                        type="text"
                                        placeholder="Cheque Number"
                                        name="cheque_number"
                                    />
                                </div>
                                <div style={{ flex: 1, marginLeft: '10px', marginTop: "1rem" }}>
                                    <InputWithTitle
                                        title="Cheque Date"
                                        type="text"
                                        placeholder="Cheque Date"
                                        name="cheque_date"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <div className='mt-10'>
                    <MultilineInput
                        title="Description"
                        placeholder="Description"
                        name="description"
                    />
                </div>
            </div>

            <AddBank open={open} handleClose={handleClose} />

            <AddExpense
                openExpense={openExpense}
                handleCloseExpense={handleCloseExpense}
            />
        </div>
    );
};

export default Expense;
