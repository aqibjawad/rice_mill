"use client";
import React, { useState, useEffect } from "react";
import BardanaReturnModal from "./returnModal";
import APICall from "@/networkApi/APICall";
import { purchaseBook } from "../../networkApi/Constants";

// Updated Main Component with Modal Integration
export default function BardanaList() {
  const api = new APICall();

  const [activeTab, setActiveTab] = useState("Jamaa");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Missing state variables
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]); // activeTab ko dependency mein add kiya

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint;

      // Tab ke basis par different API endpoints
      if (activeTab === "Jamaa") {
        endpoint = `${purchaseBook}/bardaana_jama/list`;
      } else if (activeTab === "Return") {
        endpoint = `${purchaseBook}/bardaana_return/list`;
      } else if (activeTab === "Purchase") {
        endpoint = `${purchaseBook}/bardaana_purchase/list`; // Assuming purchase ka endpoint
      }

      const response = await api.getDataWithToken(endpoint);
      const data = response.data;
      setRowData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on active tab - ab ye function kam nahi karega kyunki data already filtered hai
  const getFilteredData = () => {
    // Agar aap chahte hain to additional filtering kar sakte hain
    return rowData;
  };

  const tabs = [
    { id: "Jamaa", label: "Jamaa", active: true },
    { id: "Return", label: "Return", active: false },
    { id: "Purchase", label: "Purchase", active: false },
  ];

  const getLastBardaanaDetail = (detailsArray) => {
    if (!Array.isArray(detailsArray) || detailsArray.length === 0) return null;
    const last = detailsArray[detailsArray.length - 1];
    return last;
  };

  const handleReturnClick = (item) => {
    console.log("Button clicked with item:", item); // Debug ke liye

    // remaining_bardaana_qty ko calculate kar ke item mein add kar dete hain
    const lastDetail = getLastBardaanaDetail(
      item.purchase_book_bardaana_details
    );
    const itemWithRemainingQty = {
      ...item,
      remaining_bardaana_qty: lastDetail
        ? lastDetail.remaining_bardaana_qty
        : 0,
    };

    setSelectedItem(itemWithRemainingQty);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleModalSubmit = () => {
    // Handle modal submit logic here
    console.log("Modal submitted");
    // Modal submit ke baad data refresh kar sakte hain
    fetchData();
  };

  const getLastBardaanaQty = (details) => {
    if (!details || details.length === 0) return "-";

    const lastEntry = details[details.length - 1]; // Last item
    return lastEntry?.total_bardaana_qty - lastEntry?.remaining_bardaana_qty || "-";
  };

  // New function to get bardaana_entry from last entry
  const getLastBardaanaEntry = (details) => {
    if (!details || details.length === 0) return "-";

    const lastEntry = details[details.length - 1]; // Last item
    return lastEntry?.bardaana_entry || "-";
  };

  const getBardaanaQuantity = (item) => {
    if (activeTab === "Jamaa") {
      const lastDetail = getLastBardaanaDetail(
        item.purchase_book_bardaana_details
      );
      return lastDetail ? lastDetail.remaining_bardaana_qty : "-";
    } else if (activeTab === "Return" || activeTab === "Purchase") {
      const lastQty = getLastBardaanaQty(item.purchase_book_bardaana_details);
      return lastQty;
    }
    return "-";
  };

  // Function to get bardaana entry based on active tab
  const getBardaanaEntry = (item) => {
    return getLastBardaanaEntry(item.purchase_book_bardaana_details);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto bg-white p-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto bg-white p-8 text-center">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredData = getFilteredData();

  return (
    <div className="max-w-6xl mx-auto bg-white">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-2 p-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={{
              borderRadius: "8px",
              backgroundColor: activeTab === tab.id ? "#0075E2" : undefined,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div
        className="text-white py-4 px-6"
        style={{ borderRadius: "15px 15px 0 0", backgroundColor: "#0075E2" }}
      >
        <h1 style={{ fontWeight: "bold", fontSize: "24px" }}>
          Bardana List - {activeTab}
        </h1>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto"
        style={{ borderRadius: "0 0 15px 15px" }}
      >
        <table className="w-full" style={{ borderRadius: "15px" }}>
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-4 text-left text-sm font-medium text-gray-600"
                style={{ fontSize: "15px" }}
              >
                Serial No.
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-medium text-gray-600"
                style={{ fontSize: "15px" }}
              >
                Date
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-medium text-gray-600"
                style={{ fontSize: "15px" }}
              >
                Party Name
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-medium text-gray-600"
                style={{ fontSize: "15px" }}
              >
                Bardaana Quantity
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-medium text-gray-600"
                style={{ fontSize: "15px" }}
              >
                Bardaana Entry
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-medium text-gray-600"
                style={{ fontSize: "15px" }}
              ></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr
                key={item.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {item.party?.person_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {getBardaanaQuantity(item)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {getBardaanaEntry(item)}
                </td>
                <td className="px-6 py-4">
                  {activeTab === "Jamaa" && (
                    <button
                      onClick={() => handleReturnClick(item)}
                      className="hover:opacity-90 text-white text-sm px-6 py-3 transition-colors"
                      style={{
                        borderRadius: "4px",
                        backgroundColor: "#0075E2",
                      }}
                    >
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show message when no data is available */}
      {filteredData.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No data available for {activeTab}</p>
        </div>
      )}

      {/* Modal Component */}
      <BardanaReturnModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedItem={selectedItem}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}