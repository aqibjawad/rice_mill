import React, { useState } from "react";
import styles from "../../styles/paymentss.module.css";
import InputWithTitle from "../../components/generic/InputWithTitle";
import MultilineInput from "../../components/generic/MultilineInput";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const Payment = () => {
    const [activeTab, setActiveTab] = useState("tab1");
    const top100Films = [
        { label: 'Self' },
    ];

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div>
            <div className='mt-10' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, marginRight: '10px', marginTop:"1rem" }}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={top100Films}
                        sx={{ width: 750 }}
                        renderInput={(params) => <TextField {...params} label="Select Party" />}
                    />
                </div>
                <div style={{ flex: 1, marginLeft: '10px' }}>
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
                            <div>
                                <div className='mt-10' style={{ display: 'flex', justifyContent: 'space-between' }}>

                                    <div style={{ flex: 1, marginRight: '10px', marginTop:'1rem' }}>
                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            options={top100Films}
                                            sx={{ width: 400 }}
                                            renderInput={(params) => <TextField {...params} label="Select Bank" />}
                                        />
                                    </div>

                                    <div style={{ flex: 1, marginRight: '10px' }}>
                                        <InputWithTitle
                                            title="Cheque Number"
                                            type="text"
                                            placeholder="Cheque Number"
                                            name="cheque_number"
                                        />
                                    </div>
                                    <div style={{ flex: 1, marginLeft: '10px' }}>
                                        <InputWithTitle
                                            title="Cheque Date"
                                            type="text"
                                            placeholder="Cheque Date"
                                            name="cheque_date"
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
                    />
                </div>
            </div>
        </div>
    )
}

export default Payment