"use client";

import React from "react";
import styles from "../../styles/payment.module.css";

const PaymentReceipt = () => {

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <button onClick={handlePrint} className={styles.printButton}>
        Print Invoice
      </button>

      {/* <div>
        <div className={styles.paymentCard}>
          <div className="" style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                className={styles.paymentLogo}
                src="/logo.png"
                alt="Payment Logo"
              />
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className={styles.paymentHeadingName}>
                Ghulam Bari Rice Mills
              </div>
            </div>
          </div>

          <div className={styles.addressComp}>
            Hujra Road, Near Ghala Mandi Chunian. 0336 4046155, 0301 4046155,
            0300 - 7971654, 0300 5061234
          </div>

          <div className={styles.paymentRecipet}>Payment Receipt</div>

          <div className="flex mt-2">
            <div className="flex-grow">
              <div className={styles.paymentHeading}>
                Reference No.{" "}
                {paymentData.referenceNumber ||
                  "______________________________"}
              </div>
            </div>

            <div className="flex-grow">
              <div className={styles.paymentHeading}>
                Party Name:{" "}
                {paymentData.partyName || "____________________________"}
              </div>
            </div>

            <div className="flex-grow">
              <div className={styles.paymentHeading}>
                Date : {paymentData.date || "____________________________"}
              </div>
            </div>
          </div>

          <div className="flex mt-3">
            <div className="flex-grow">
              <div className={styles.paymentHeading}>
                Amount:{" "}
                {paymentData.amount || "_______________________________"}
              </div>
            </div>

            <div className="flex-grow">
              <div className={styles.paymentHeading}>
                Bank and Cheque:
                {paymentData.bankAndCheque ||
                  "_______________________________________________________________"}
              </div>
            </div>
          </div>

          <div className={styles.trans}>Last Transactions:</div>

          <div className="flex">
            <div className="flex-grow">
              <div className={styles.tableSection}>
                <div className={styles.tableHeader}>
                  <div>Sr.</div>
                  <div> Desc </div>
                  <div> Cr </div>
                  <div> Dr </div>
                  <div> Balance </div>
                </div>

                <div className={styles.tableBody}>
                  {paymentData.transactions &&
                    paymentData.transactions.map((transaction, index) => (
                      <div key={index} className={styles.tableRow}>
                        <div>{index + 1}</div>
                        <div>{transaction.desc}</div>
                        <div>{transaction.cr}</div>
                        <div>{transaction.dr}</div>
                        <div>{transaction.balance}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex-grow ml-10 mt-8">
              <div className="flex">
                <div className="flex-grow">
                  <div className={styles.paymentHeading}>
                    Received By:{" "}
                    {paymentData.receivedBy || "___________________"}
                  </div>
                </div>

                <div className="flex-grow">
                  <div className={styles.paymentHeading}>
                    Signature: {paymentData.signature || "____________________"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default PaymentReceipt;
