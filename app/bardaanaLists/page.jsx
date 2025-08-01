"use client";
import React, { useState, useEffect } from "react";
import BardanaReturnModal from "./returnModal";
import APICall from "@/networkApi/APICall";
import { purchaseBook } from "../../networkApi/Constants";

export default function BardanaList() {
  const api = new APICall();

  const [activeTab, setActiveTab] = useState("Jamaa");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);
  
  // Date filter states
  const [dateFilter, setDateFilter] = useState("today");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = "";
      if (activeTab === "Jamaa")
        endpoint = `${purchaseBook}/bardaana_jama/list`;
      else if (activeTab === "Return")
        endpoint = `${purchaseBook}/bardaana_return/list`;
      else if (activeTab === "Purchase")
        endpoint = `${purchaseBook}/bardaana_paid_as/cash_or_ledger`;

      const response = await api.getDataWithToken(endpoint);
      const data = response.data;
      setRowData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getLastBardaanaDetail = (detailsArray) => {
    if (!Array.isArray(detailsArray) || detailsArray.length === 0) return null;
    return detailsArray[detailsArray.length - 1];
  };

  // Helper function to get date ranges
  const getDateRange = (filter) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let startDate, endDate;

    switch (filter) {
      case "today":
        startDate = new Date(today);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        break;
      
      case "this_month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      
      case "last_month":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      
      case "date_range":
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(customEndDate);
          endDate.setHours(23, 59, 59, 999);
        } else {
          return null;
        }
        break;
      
      default:
        return null;
    }

    return { startDate, endDate };
  };

  // Function to check if a date falls within the selected range
  const isDateInRange = (dateString, startDate, endDate) => {
    if (!dateString || !startDate || !endDate) return false;
    
    const itemDate = new Date(dateString);
    itemDate.setHours(0, 0, 0, 0);
    
    return itemDate >= startDate && itemDate <= endDate;
  };

  // Get filtered data based on active tab and date filter
  const getFilteredData = () => {
    let filtered = rowData;

    // Apply tab-specific filtering for Jamaa
    if (activeTab === "Jamaa") {
      filtered = filtered.filter((item) => {
        const lastDetail = getLastBardaanaDetail(item.purchase_book_bardaana_details);
        const remainingQty = lastDetail ? lastDetail.remaining_bardaana_qty : 0;
        return remainingQty > 0;
      });
    }

    // Apply date filtering
    const dateRange = getDateRange(dateFilter);
    if (dateRange) {
      const { startDate, endDate } = dateRange;
      
      filtered = filtered.filter((item) => {
        // Get the date from the item
        const itemDate = getLastBardaanaDetail(item.purchase_book_bardaana_details)?.date || item.date;
        return isDateInRange(itemDate, startDate, endDate);
      });
    }

    return filtered;
  };

  // Helper function to format dates for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getLastBardaanaQty = (details) => {
    if (!details || details.length === 0) return "-";
    const lastEntry = details[details.length - 1];
    return (
      lastEntry?.total_bardaana_qty - lastEntry?.remaining_bardaana_qty || "-"
    );
  };

  const getLastBardaanaEntry = (details) => {
    if (!details || details.length === 0) return "-";
    const lastEntry = details[details.length - 1];
    return lastEntry?.bardaana_entry || "-";
  };

  const getBardaanaQuantity = (item) => {
    const lastDetail = getLastBardaanaDetail(
      item.purchase_book_bardaana_details
    );

    if (activeTab === "Jamaa") {
      return lastDetail ? lastDetail.remaining_bardaana_qty : "-";
    } else if (activeTab === "Return") {
      return getLastBardaanaQty(item.purchase_book_bardaana_details);
    } else if (activeTab === "Purchase") {
      // For Purchase tab, use direct property from item
      return item.bardaana_quantity || "-";
    }
    return "-";
  };

  const getBardaanaEntry = (item) => {
    if (activeTab === "Purchase") {
      // For Purchase tab, use direct property from item
      return item.bardaana_entry || "-";
    }
    // For other tabs, use the existing logic
    return getLastBardaanaEntry(item.purchase_book_bardaana_details);
  };
  
  const handleReturnClick = (item) => {
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
    fetchData();
  };

  const filteredData = getFilteredData();

  const tabs = [
    { id: "Jamaa", label: "Jamaa", active: true },
    { id: "Return", label: "Return", active: false },
    { id: "Purchase", label: "Purchase", active: false },
  ];

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

      {/* Date Filter Section */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Filter by Date:</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="date_range">Date Range</option>
            </select>
          </div>

          {/* Custom Date Range Inputs */}
          {dateFilter === "date_range" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Start Date"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="End Date"
              />
            </div>
          )}
        </div>
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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={fetchData}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div
          className="overflow-x-auto"
          style={{ borderRadius: "0 0 15px 15px" }}
        >
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Serial No.",
                  "Date",
                  "Party Name",
                  "Bardaana Quantity",
                  "Bardaana Entry",
                  "",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-4 text-left text-sm font-medium text-gray-600"
                    style={{ fontSize: "15px" }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDateForDisplay(
                      getLastBardaanaDetail(item.purchase_book_bardaana_details)?.date || item.date
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.party?.person_name || '-'}
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
                        className="hover:opacity-90 text-white text-sm px-6 py-3"
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
      )}

      {/* No Data Message */}
      {!loading && !error && filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No data available for {activeTab} with selected date filter
        </div>
      )}

      {/* Modal */}
      <BardanaReturnModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedItem={selectedItem}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}