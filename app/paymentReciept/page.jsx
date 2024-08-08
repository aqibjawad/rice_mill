"use client";

import React, { useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import styles from "../../styles/payment.module.css";

const PaymentReceipt = () => {
    const receiptRef = useRef(null);

    const generatePDF = async () => {
        if (receiptRef.current) {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const canvas = await html2canvas(receiptRef.current, {
                scale: 2, // Increase scale for better quality
            });
            const imgData = canvas.toDataURL('image/png');

            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = -4; // Add some top margin

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save("payment_receipt.pdf");
        }
    };

    return (
        <div>
            <div ref={receiptRef} style={{ width: '210mm', padding: '10mm', boxSizing: 'border-box' }}>

                <div className={styles.paymentCard}>

                    <div className='' style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img className={styles.paymentLogo} src="/logo.png" alt="Payment Logo" />
                        </div>

                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className={styles.paymentHeadingName}>
                                Ghulam Bari Rice Mills
                            </div>
                        </div>
                    </div>

                    <div className={styles.addressComp} >
                        Hujra Road, Near Ghala Mandi Chunian. 0336 4046155, 0301 4046155, 0300 - 7971654, 0300 5061234
                    </div>

                    <div className={styles.paymentRecipet}>
                        Payment Receipt
                    </div>

                    <div className="flex mt-2">
                        <div className="flex-grow" >
                            <div className={styles.paymentHeading}>
                                Reference No.______________________________
                            </div>
                        </div>

                        < div className="flex-grow" >
                            <div className={styles.paymentHeading}>
                                Party Name: ______________________________
                            </div>
                        </div>

                        < div className="flex-grow" >
                            <div className={styles.paymentHeading}>
                                Date : ______________________________
                            </div>
                        </div>
                    </div>

                    < div className="flex mt-3">
                        <div className="flex-grow" >
                            <div className={styles.paymentHeading}>
                                Amount._______________________________
                            </div>
                        </div>

                        < div className="flex-grow" >
                            <div className={styles.paymentHeading}>
                                Bank and Cheque: _______________________________________________________________
                            </div>
                        </div>
                    </div>

                    < div className={styles.trans} >
                        Last Transactions:
                    </div>

                    < div className="flex" >
                        <div className="flex-grow" >
                            <div className={styles.tableSection}>
                                <div className={styles.tableHeader}>
                                    <div>Sr.</div>
                                    < div > Desc </div>
                                    < div > Cr </div>
                                    < div > Dr </div>
                                    < div > Balance </div>
                                </div>

                                < div className={styles.tableBody} >
                                    <div className={styles.tableRow}>
                                        <div>1 </div>
                                        < div > 202 </div>
                                        < div > 1000 </div>
                                        < div > 1000 </div>
                                        < div > $100 </div>
                                    </div>

                                    < div className={styles.tableRow} >
                                        <div>1 </div>
                                        < div > 202 </div>
                                        < div > 1000 </div>
                                        < div > 1000 </div>
                                        < div > $100 </div>
                                    </div>

                                    < div className={styles.tableRow} >
                                        <div>1 </div>
                                        < div > 202 </div>
                                        < div > 1000 </div>
                                        < div > 1000 </div>
                                        < div > $100 </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        < div className="flex-grow ml-10 mt-8" >
                            <div className="flex" >
                                <div className="flex-grow" >
                                    <div className={styles.paymentHeading}>
                                        Recieved By: _____________________
                                    </div>
                                </div>

                                < div className="flex-grow" >
                                    <div className={styles.paymentHeading}>
                                        Signature: ______________________
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button className={styles.generateBtn} onClick={generatePDF}>Generate A4 PDF</button>
        </div>
    );
};

export default PaymentReceipt;