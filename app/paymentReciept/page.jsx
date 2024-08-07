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
            const imgY = 30; // Add some top margin

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save("payment_receipt.pdf");
        }
    };

    return (
        <div>
            <div ref={receiptRef} style={{ width: '210mm', padding: '10mm', boxSizing: 'border-box' }}>
                <div className={styles.paymentCard}>
                    <div className={styles.paymentHeading}>
                        Ghulam Bari Rice Mills
                    </div>

                    < div className={styles.addressComp} >
                        Hujra Road, Near Ghala Mandi Chunian. 0336 4046155, 0301 4046155, 0300 - 7971654, 0300 5061234
                    </div>

                    < div className="flex" >
                        <div className="flex-grow" >
                            <div className={styles.paymentHeading}>
                                Reference No.__________
                            </div>
                        </div>

                        < div className="flex-grow" >
                            <div className={styles.paymentHeading}>
                                Party Name: __________
                            </div>
                        </div>

                        < div className="flex-grow mt-5" >
                            <div className={styles.paymentHeading}>
                                Date : __________
                            </div>
                        </div>
                    </div>

                    < div className="flex" >
                        <div className="flex-grow" >
                            <div className={styles.paymentHeading}>
                                Amount.______________________________
                            </div>
                        </div>

                        < div className="flex-grow" >
                            <div className={styles.paymentHeading}>
                                Bank and Cheque: _____________________________________
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
                                        Recieved By: ________
                                    </div>
                                </div>

                                < div className="flex-grow" >
                                    <div className={styles.paymentHeading}>
                                        Signature: _________
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={generatePDF}>Generate A4 PDF</button>
        </div>
    );
};

export default PaymentReceipt;