"use client";
import React, { useEffect, useState } from "react";
import styles from "../../styles/purchase.module.css";
import APICall from "../../networkApi/APICall";
import { purchaseBook } from "@/networkApi/Constants";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Button,
  Box,
} from "@mui/material";
import { FaDownload } from "react-icons/fa6";
import jsPDF from "jspdf";
import "jspdf-autotable";

import Buttons from "../../components/buttons";
import SearchInput from "../../components/generic/searchInput";
import withAuth from "@/utils/withAuth";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const Purchase = () => {
  const router = useRouter();
  const api = new APICall();

  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Permission states
  const [permissions, setPermissions] = useState({
    canAddPurchase: false,
    canViewPurchase: false,
    hasAccess: false,
  });

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    if (permissions.canViewPurchase) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [permissions.canViewPurchase]);

  const checkPermissions = () => {
    try {
      const storedPermissions = localStorage.getItem("permissions");

      if (storedPermissions) {
        const parsedPermissions = JSON.parse(storedPermissions);

        // Find Purchase module permissions
        let canAddPurchase = false;
        let canViewPurchase = false;

        if (
          parsedPermissions.modules &&
          Array.isArray(parsedPermissions.modules)
        ) {
          const PurchaseModule = parsedPermissions.modules.find(
            (module) =>
              module.parent === "Purchase" || module.name === "Purchase"
          );

          if (PurchaseModule && PurchaseModule.permissions) {
            canAddPurchase =
              PurchaseModule.permissions.includes("Add Purchase");
            canViewPurchase =
              PurchaseModule.permissions.includes("View Purchase");
          }
        }

        setPermissions({
          canAddPurchase,
          canViewPurchase,
          hasAccess: canAddPurchase || canViewPurchase,
        });
      } else {
        // No permissions found - default behavior
        setPermissions({
          canAddPurchase: true,
          canViewPurchase: true,
          hasAccess: true,
        });
      }
    } catch (error) {
      console.error("Error parsing permissions:", error);
      // Default to showing all on error
      setPermissions({
        canAddPurchase: true,
        canViewPurchase: true,
        hasAccess: true,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const fetchData = async () => {
    try {
      // setLoading(true);
      if (!permissions.canViewPurchase) {
        setLoading(false);
        return;
      }

      const queryParams = [];

      if (startDate && endDate) {
        queryParams.push(`start_date=${startDate}`);
        queryParams.push(`end_date=${endDate}`);
      } else {
        const currentDate = format(new Date(), "yyyy-MM-dd");
        queryParams.push(`start_date=${currentDate}`);
        queryParams.push(`end_date=${currentDate}`);
      }
      const queryString = queryParams.join("&");

      const response = await api.getDataWithToken(
        `${purchaseBook}?${queryString}`
      );

      if (Array.isArray(response.data)) {
        setTableData(response.data);
        setFilteredData(response.data);
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredData(tableData);
      return;
    }

    const filtered = tableData.filter((item) => {
      const productName = item.product?.product_name?.toLowerCase() || "";
      return productName.includes(searchTerm.toLowerCase());
    });

    setFilteredData(filtered);
  };

  const handleViewDetails = (row) => {
    localStorage.setItem("purchaseBookId", row.id);
    router.push("/purchase_details");
  };

  // PDF Download Function
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("Purchase Report", 14, 22);

    // Add date range if available
    if (startDate && endDate) {
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text(`Date Range: ${startDate} to ${endDate}`, 14, 32);
    }

    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 40);

    // Prepare table data
    const tableColumns = [
      "Sr No",
      "Purchase By",
      "Purchase Date",
      "Product",
      "Party",
      "Weight",
      "Amount",
    ];

    const tableRows = filteredData.map((row) => [
      row.id || "",
      row.user?.name || "",
      row.date || "",
      row.product?.product_name || "",
      row.party?.person_name || "",
      row.net_weight || "",
      row.total_amount || "",
    ]);

    // Add table
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 50,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 50, left: 14, right: 14 },
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
    }

    // Generate filename
    const dateRange =
      startDate && endDate
        ? `_${startDate}_to_${endDate}`
        : `_${format(new Date(), "yyyy-MM-dd")}`;
    const filename = `Purchase_Report${dateRange}.pdf`;

    // Save the PDF
    doc.save(filename);
  };

  return (
    <div className={styles.container}>
      {/* <SearchInput  /> */}
      {permissions.canAddPurchase && (
        <Buttons
          leftSectionText="Purchase"
          addButtonLink="/addPurchase"
          onDateChange={handleDateChange}
          onSearch={handleSearch}
        />
      )}

      {permissions.canViewPurchase && (
        <>
          {/* PDF Download Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<FaDownload  />}
              onClick={downloadPDF}
              disabled={loading || filteredData.length === 0}
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              Download PDF
            </Button>
          </Box>

          <TableContainer
            sx={{
              maxHeight: "400px",
              overflow: "auto",
            }}
            component={Paper}
            className={styles.tableSection}
          >
            <Table
              sx={{
                minWidth: 650,
                position: "relative", // Important for proper alignment
                borderCollapse: "separate",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Sr No</TableCell>
                  <TableCell>Purchase By</TableCell>
                  <TableCell>Purchase Date</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Party</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from(new Array(5)).map((_, index) => (
                      <TableRow key={index}>
                        {Array.from(new Array(8)).map((_, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : filteredData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.user?.name}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.product?.product_name}</TableCell>
                        <TableCell>{row.party?.person_name}</TableCell>
                        <TableCell>{row.net_weight}</TableCell>
                        <TableCell>{row.total_amount}</TableCell>
                        <TableCell
                          onClick={() => handleViewDetails(row)}
                          style={{ cursor: "pointer" }}
                        >
                          View Details
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default withAuth(Purchase);
