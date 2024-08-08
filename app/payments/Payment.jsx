"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/paymentss.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import MultilineInput from "../../components/generic/MultilineInput";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios';

import { customers } from "../../networkApi/Constants"

import { banks } from "../../networkApi/Constants"

import { payment_In } from "../../networkApi/Constants"

const Payment = () => {
    const [tableData, setTableData] = useState([]);
    const [tableBankData, setTableBankData] = useState([]);

    const [activeTab, setActiveTab] = useState("tab1");
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [selectedBankId, setSelectedBankId] = useState(null);
    const [chequeNumber, setChequeNumber] = useState('');
    const [chequeDate, setChequeDate] = useState('');

    useEffect(() => {
        fetchData();
        fetchBankData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(customers);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            const data = result.data;
            if (Array.isArray(data)) {
                const formattedData = data.map(customer => ({ label: customer.person_name, id: customer.id }));
                setTableData(formattedData);
            } else {
                throw new Error('Fetched data is not an array');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const fetchBankData = async () => {
        try {
            const response = await fetch(banks);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            const data = result.data;
            if (Array.isArray(data)) {
                const formattedData = data.map(bank => ({ label: bank.bank_name, id: bank.id }));
                setTableBankData(formattedData);
            } else {
                throw new Error('Fetched data is not an array');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleCustomerSelect = (_, value) => {
        setSelectedCustomerId(value?.id || null);
    };

    const handleBankSelect = (_, value) => {
        setSelectedBankId(value?.id || null);
    };

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleChequeNumberChange = (event) => {
        setChequeNumber(event.target.value);
    };

    const handleChequeDateChange = (event) => {
        setChequeDate(event.target.value);
    };

    const handleSubmit = async () => {
        const paymentData = {
            customer_id: selectedCustomerId,
            payment_type: activeTab === 'tab1' ? 'cash' : 'cheque',
            amount: amount,
            description: description,
            bank_id: selectedBankId,
            cheque_no: activeTab === 'tab2' ? chequeNumber : null,
            cheque_date: activeTab === 'tab2' ? chequeDate : null,
        };

        try {
            await axios.post(payment_In, paymentData);
            console.log('Payment data sent to the backend successfully!');
        } catch (error) {
            console.error('Error sending payment data to the backend:', error);
        }
    };

    return (
        <div>
            <div className='mt-10' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, marginRight: '10px', marginTop: "1rem" }}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={tableData}
                        sx={{ width: 750 }}
                        renderInput={(params) => <TextField {...params} label="Select Party" />}
                        onChange={handleCustomerSelect}
                    />
                </div>
                <div style={{ flex: 1, marginLeft: '10px' }}>
                    <InputWithTitle
                        title="Amount"
                        type="text"
                        placeholder="Amount"
                        name="amount"
                        value={amount}
                        onChange={handleAmountChange}
                    />
                </div>
            </div>

            <div className='mt-10'>
                <div className={styles.tabPaymentContainer}>
                    <button className={`${styles.tabPaymentButton} ${activeTab === "tab1" ? styles.active : ""}`} onClick={() => handleTabClick("tab1")}>
                        Cash
                    </button>
                    <button className={`${styles.tabPaymentButton} ${activeTab === "tab2" ? styles.active : ""}`} onClick={() => handleTabClick("tab2")}>
                        Cheque
                    </button>
                </div>
                <div className={styles.tabPaymentContent}>
                    {activeTab === "tab1" && (
                        ""
                    )}
                    {activeTab === "tab2" && (
                        <div>
                            <div>
                                <div className='mt-10' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ flex: 1, marginRight: '10px', marginTop: '1rem' }}>
                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            options={tableBankData}
                                            sx={{ width: 500 }}
                                            renderInput={(params) => <TextField {...params} label="Select Bank" />}
                                            onChange={handleBankSelect}
                                        />
                                    </div>
                                    <div style={{ flex: 1, marginRight: '10px' }}>
                                        <InputWithTitle
                                            title="Cheque Number"
                                            type="text"
                                            placeholder="Cheque Number"
                                            name="cheque_number"
                                            value={chequeNumber}
                                            onChange={handleChequeNumberChange}
                                        />
                                    </div>
                                    <div style={{ flex: 1, marginLeft: '10px' }}>
                                        <InputWithTitle
                                            title="Cheque Date"
                                            type="text"
                                            placeholder="Cheque Date"
                                            name="cheque_date"
                                            value={chequeDate}
                                            onChange={handleChequeDateChange}
                                        />
                                    </div>
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
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                </div>
            </div>

            <button className={styles.paymentInBtn} onClick={handleSubmit}>Submit Payment</button>
        </div>
    )
}

export default Payment