"use client";
import React, { useState, useEffect } from "react";
import BardanaReturnModal from "./returnModal";
import APICall from "@/networkApi/APICall";
import { purchaseBook } from "../../networkApi/Constants";
import DateFilters from "@/components/generic/DateFilter";

export default function BardanaList() {
  const api = new APICall();

  const [activeTab, setActiveTab] = useState("Jamaa");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);

  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
    selectedDate: null,
    filterType: null,
  });

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

  const isDateInRange = (itemDate, filterData) => {
    if (!itemDate) return false;

    const itemDateObj = new Date(itemDate);

    if (
      filterData.filterType === "lastMonth" ||
      filterData.type === "lastMonth"
    ) {
      const currentDate = new Date();
      const lastMonthStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      );
      const lastMonthEnd = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      );
      return itemDateObj >= lastMonthStart && itemDateObj <= lastMonthEnd;
    }

    if (
      filterData.filterType === "thisMonth" ||
      filterData.type === "thisMonth"
    ) {
      const currentDate = new Date();
      const thisMonthStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const thisMonthEnd = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      return itemDateObj >= thisMonthStart && itemDateObj <= thisMonthEnd;
    }

    const startDate = filterData.startDate || filterData.from;
    const endDate = filterData.endDate || filterData.to;
    const selectedDate = filterData.selectedDate || filterData.date;

    if (selectedDate) {
      const selectedDateObj = new Date(selectedDate);
      return itemDateObj.toDateString() === selectedDateObj.toDateString();
    }

    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      return itemDateObj >= startDateObj && itemDateObj <= endDateObj;
    }

    if (startDate) return itemDateObj >= new Date(startDate);
    if (endDate) return itemDateObj <= new Date(endDate);

    return true;
  };

  const getLastBardaanaDetail = (detailsArray) => {
    if (!Array.isArray(detailsArray) || detailsArray.length === 0) return null;
    return detailsArray[detailsArray.length - 1];
  };

  const getFilteredData = () => {
    let filtered = rowData;

    const hasDateFilter =
      dateFilter.startDate ||
      dateFilter.endDate ||
      dateFilter.selectedDate ||
      dateFilter.filterType ||
      dateFilter.type ||
      dateFilter.from ||
      dateFilter.to ||
      dateFilter.date;

    if (hasDateFilter) {
      filtered = filtered.filter((item) => {
        const detailDate = getLastBardaanaDetail(
          item.purchase_book_bardaana_details
        )?.date;
        const mainDate = item.date;
        const validDate = detailDate || mainDate;
        return isDateInRange(validDate, dateFilter);
      });
    }

    if (activeTab === "Jamaa") {
      filtered = filtered.filter((item) => {
        const lastDetail = getLastBardaanaDetail(
          item.purchase_book_bardaana_details
        );
        const remainingQty = lastDetail ? lastDetail.remaining_bardaana_qty : 0;
        return remainingQty > 0;
      });
    }

    return filtered;
  };

  const handleDateFilterChange = (filterData) => {
    setDateFilter(filterData);
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

      {/* Date Filter */}
      <div className="p-4 bg-gray-50 border-b">
        <DateFilters onFilterChange={handleDateFilterChange} />
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
                  {getLastBardaanaDetail(item.purchase_book_bardaana_details)
                    ?.date || item.date}
                </td>
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

      {/* No Data Message */}
      {filteredData.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          {dateFilter.startDate ||
          dateFilter.endDate ||
          dateFilter.selectedDate ||
          dateFilter.filterType ||
          dateFilter.type ||
          dateFilter.from ||
          dateFilter.to ||
          dateFilter.date
            ? `No data available for ${activeTab} in the selected date range`
            : `No data available for ${activeTab}`}
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
