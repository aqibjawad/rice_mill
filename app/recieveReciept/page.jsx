"use client";

import React, { useState, useEffect } from "react";

export default function Page() {
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    // Get data from localStorage
    try {
      const savedData = localStorage.getItem("selectedReceiptData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setReceiptData(parsedData);
      }
    } catch (error) {
      console.error("Error loading receipt data:", error);
    }
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  // Get payment type display
  const getPaymentTypeDisplay = () => {
    if (!receiptData) return "Cash";

    const paymentType = receiptData.paymentType;
    if (typeof paymentType === "string") {
      return paymentType.charAt(0).toUpperCase() + paymentType.slice(1);
    }
    return "Cash";
  };

  // Get bank name
  const getBankName = () => {
    if (!receiptData) return "-";

    if (receiptData.bank && receiptData.bank !== "-") {
      return receiptData.bank;
    }

    // Check in raw data for bank information
    if (receiptData.rawData) {
      if (receiptData.rawData.bank?.bank_name) {
        return receiptData.rawData.bank.bank_name;
      }
      if (receiptData.rawData.linkable_type === "App\\Models\\BankLedger") {
        return "Bank Entry";
      }
    }

    return "-";
  };

  // Get transaction ID (for online payments)
  const getTransactionId = () => {
    if (!receiptData) return "";

    // Check for transaction ID in raw data
    if (receiptData.rawData) {
      if (receiptData.rawData.transection_id) {
        return receiptData.rawData.transection_id;
      }
      if (receiptData.rawData.linkable?.transection_id) {
        return receiptData.rawData.linkable.transection_id;
      }
    }

    return "";
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "Segoe UI, sans-serif",
    tableLayout: "fixed", // ensures equal and aligned columns
  };

  const headerStyle = {
    backgroundColor: "#666666",
    color: "white",
    padding: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    border: "1px solid #ccc",
  };

  const cellStyle = {
    border: "1px solid #ccc",
    padding: "12px",
    fontSize: "16px",
  };

  // Receipt Component
  const ReceiptComponent = ({ title = "Receive Receipt" }) => (
    <div className="mx-auto mb-16">
      <div className="flex items-start justify-between mb-8">
        {/* Logo and Company Info */}
        <div className="flex items-start space-x-3">
          {/* Logo placeholder - wheat/grain icon */}
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/logo.png" alt="Logo" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Ghulam Bari Rice Mills
            </h1>
            <p className="text-sm text-green-600 font-medium">
              Crafted With Precision
            </p>

            <div className="mt-3 text-xs text-gray-600 leading-relaxed">
              <p className="font-medium">
                Hujra Road, Near Ghala Mandi Chunian
              </p>
              <p>0300-5061234 (Accounts)</p>
            </div>
          </div>
        </div>

        {/* Receipt Title */}
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
      </div>

      {/* Party Name and Receipt Info */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-700">Party Name:</span>
          <div className="border-b-2 border-black w-48 h-6 flex items-end pb-1">
            <span className="text-sm font-medium">
              {receiptData?.personOrProduct || "N/A"}
            </span>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-700">Receive Date:</span>
            <div className="border-b-2 border-black w-32 h-6 flex items-end pb-1">
              <span className="text-sm font-medium">
                {formatDate(receiptData?.date)}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-700">Receipt No:</span>
            <div className="border-b-2 border-black w-32 h-6 flex items-end pb-1">
              <span className="text-sm font-medium">
                {receiptData?.id || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Receipt Table */}
      <div style={{ border: "2px solid #ccc", width: "100%" }}>
        <div style={headerStyle}>Cash Receipt</div>
        <table style={tableStyle}>
          <colgroup>
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
          </colgroup>
          <tbody>
            <tr>
              <td style={cellStyle}>Payment Type</td>
              <td style={cellStyle}>{getPaymentTypeDisplay()}</td>
              <td style={cellStyle}>Amount</td>
              <td style={cellStyle}>
                {" "}
                {receiptData?.amount
                  ? `Rs. ${parseFloat(receiptData.amount).toFixed(2)}`
                  : "Rs. 0.00"}
              </td>
            </tr>
            <tr>
              <td style={cellStyle}>Bank Name</td>
              <td style={cellStyle}>{getBankName()}</td>
              <td style={cellStyle}>Cheque No.</td>
              <td style={cellStyle}>
                {" "}
                {receiptData?.chequeNo && receiptData.chequeNo !== "N/A"
                  ? receiptData.chequeNo
                  : "N/A"}
              </td>
            </tr>
            <tr>
              <td style={cellStyle}>Transection ID</td>
              <td style={cellStyle}>{getTransactionId() || "-"}</td>
              <td style={cellStyle}></td>
              <td style={cellStyle}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signatures Row */}
      <div className="flex justify-between mt-10">
        {/* Receiver Name */}
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-700">Receivers Name:</span>
          <div className="border-b-2 border-black w-48 h-6"> {receiptData?.receiverName} </div>
        </div>

        {/* Signature */}
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-700">Signature:</span>
          <div className="border-b-2 border-black w-48 h-6"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      {/* First Receipt */}
      <ReceiptComponent title="Receive Receipt" />
    </div>
  );
}
