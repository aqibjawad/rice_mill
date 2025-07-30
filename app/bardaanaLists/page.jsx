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
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.getDataWithToken(
        `${purchaseBook}/bardaana_jama/list`
      );

      const data = response.data;
      setRowData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on active tab
  const getFilteredData = () => {
    if (activeTab === "Jamaa") {
      return rowData.filter((item) => item.bardaana_type === "add");
    } else if (activeTab === "Return") {
      return rowData.filter((item) => item.bardaana_type === "return");
    } else if (activeTab === "Purchase") {
      return rowData.filter((item) => item.bardaana_type === "purchase");
    }
    return rowData;
  };

  const tabs = [
    { id: "Jamaa", label: "Jamaa", active: true },
    { id: "Return", label: "Return", active: false },
    { id: "Purchase", label: "Purchase", active: false },
  ];

  const handleReturnClick = (item) => {
    console.log("Button clicked with item:", item); // Debug ke liye
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleModalSubmit = () => {
    // Handle modal submit logic here
    console.log("Modal submitted");
    // You can add API call or other logic here
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
                Quantity
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-medium text-gray-600"
                style={{ fontSize: "15px" }}
              >
                Type
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
                  {item.bardaana_quantity}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {item.bardaana_type}
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
