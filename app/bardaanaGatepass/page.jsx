"use client";

import React, { useState, useEffect } from "react";
import {
  purchaseBook,
  getLocalStorage,
  saleBook,
} from "../../networkApi/Constants";
import APICall from "@/networkApi/APICall";

export default function Page() {
  const api = new APICall();
  const purchaseBookId = getLocalStorage("purchaseBookId");
  const [saleBookData, setSaleBook] = useState(null);
  const [isReadyToPrint, setIsReadyToPrint] = useState(false);

  useEffect(() => {
    fetchPurchaseBook();
  }, []);

  const fetchPurchaseBook = async () => {
    try {
      const response = await api.getDataWithToken(
        `${purchaseBook}/${purchaseBookId}`
      );

      const data = response.data;

      setSaleBook(data);
      setIsReadyToPrint(true);
    } catch (error) {
      console.error(error.message);
    }
  };

  const BardaanaGatePass = ({ title = "Bardaana Gate Pass" }) => {
    // Get the latest bardaana entry (last one in the array)
    const latestBardaanaEntry = saleBookData?.purchase_book_bardaana_details?.length > 0 
      ? saleBookData.purchase_book_bardaana_details[saleBookData.purchase_book_bardaana_details.length - 1]
      : null;

    // Calculate quantity and get bardaana entry based on bardaana_type
    const getBardaanaQuantity = () => {
      if (saleBookData?.bardaana_type === "return") {
        return saleBookData?.bardaana_quantity || "0";
      } else {
        const mainBardaanaQty = parseInt(saleBookData?.bardaana_quantity || 0);
        const firstEntryBardaanaQty = saleBookData?.purchase_book_bardaana_details?.length > 0 
          ? parseInt(saleBookData.purchase_book_bardaana_details[0]?.bardaana_qty || 0)
          : 0;
        
        return mainBardaanaQty - firstEntryBardaanaQty;
      }
    };

    const getBardaanaEntry = () => {
      if (saleBookData?.bardaana_type === "return") {
        return saleBookData?.bardaana_entry || "N/A";
      } else {
        return latestBardaanaEntry?.bardaana_entry || "N/A";
      }
    };

    return (
      <div className="mx-auto mb-16">
        <div className="flex items-start justify-between mb-8">
          {/* Logo and Company Info */}
          <div className="flex items-start space-x-3">
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
            </div>
          </div>

          {/* Receipt Title */}
          <div className="text-right">
            <div>
              <div className="mt-3 text-xs text-gray-600 leading-relaxed">
                <p className="font-medium">
                  Hujra Road, Near Ghala Mandi Chunian
                </p>
                <p>0300-5061234 (Accounts)</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-black-800 text-center">{title}</h2>

        {/* Party Name and Receipt Info */}
        <div className="flex justify-between items-center mb-8 mt-10">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <span className="font-medium text-gray-700 flex-shrink-0">
                Party Name:
              </span>
              <div className="border-b-2 border-black min-w-32 h-6 flex items-end pb-1 flex-1">
                <span className="text-sm font-medium truncate">
                  {saleBookData?.party?.person_name || "N/A"}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-5">
              <span className="font-medium text-gray-700">Truck No:</span>
              <div className="border-b-2 border-black w-32 h-6 flex items-end pb-1">
                <span className="text-sm font-medium">
                  {saleBookData?.truck_no || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Receive Date:</span>
              <div className="border-b-2 border-black w-32 h-6 flex items-end pb-1">
                <span className="text-sm font-medium">
                  {saleBookData?.date || "N/A"}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Receipt No:</span>
              <div className="border-b-2 border-black w-32 h-6 flex items-end pb-1">
                <span className="text-sm font-medium">
                  {saleBookData?.serial_no || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cash Receipt Table */}
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-600">
              <th className="border border-gray-400 px-4 py-3 text-white text-center font-medium">
                S No.
              </th>
              <th className="border border-gray-400 px-4 py-3 text-white text-center font-medium">
                Quantity
              </th>
              <th className="border border-gray-400 px-4 py-3 text-white text-center font-medium">
                Type
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-50">
              <td className="border border-gray-400 px-4 py-2 text-center">1</td>
              <td className="border border-gray-400 px-4 py-2 text-center">
                {getBardaanaQuantity()}
              </td>
              <td className="border border-gray-400 px-4 py-2 text-center">
                {getBardaanaEntry()}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Signatures Row */}
        <div className="flex justify-end mt-10">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-700">Signature:</span>
            <div className="border-b-2 border-black w-48 h-6"></div>
          </div>
        </div>

        {/* Full width line under signature */}
        <div className="w-full border-b-2 border-black mt-8"></div>

        {/* Centered disclaimer text */}
        <div className="text-center mt-4">
          <p className="font-medium text-gray-800">
            Bardana claim will not be accepted without receipt
          </p>
        </div>
      </div>
    );
  };

  if (!isReadyToPrint || !saleBookData) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <BardaanaGatePass />
    </div>
  );
}