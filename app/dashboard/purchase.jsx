"use client";
import React, { useEffect, useState, useMemo } from "react";
import styles from "../../styles/purchase.module.css";
import {
  useGetpurchaseBookQuery,
  useLazyGetpurchaseBookQuery,
  useGetpurchaseBookSummaryQuery,
} from "../../src/store/purchaseApi"; // Make sure this path is correct
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
  Alert,
  Typography,
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

  // Local state for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(() => {
    // Default to current date
    return format(new Date(), "yyyy-MM-dd");
  });
  const [endDate, setEndDate] = useState(() => {
    // Default to current date
    return format(new Date(), "yyyy-MM-dd");
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(50);

  // Permission states
  const [permissions, setPermissions] = useState({
    canAddPurchase: false,
    canViewPurchase: false,
    hasAccess: false,
  });

  // Prepare query parameters
  const queryParams = useMemo(
    () => ({
      startDate,
      endDate,
      page: currentPage,
      limit: pageLimit,
      search: searchTerm,
    }),
    [startDate, endDate, currentPage, pageLimit, searchTerm]
  );

  // RTK Query hooks
  const {
    data: purchaseData,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetpurchaseBookQuery(queryParams, {
    skip: !permissions.canViewPurchase, // Skip query if no permission
    refetchOnMountOrArgChange: true,
  });

  // Lazy query for manual fetching if needed
  const [triggerFetch] = useLazyGetpurchaseBookQuery();

  // Summary query (optional) - handle if endpoint doesn't exist
  const { data: summaryData, error: summaryError } =
    useGetpurchaseBookSummaryQuery(
      { startDate, endDate },
      { skip: !permissions.canViewPurchase }
    );

  // Extract data from Redux response
  const tableData = purchaseData?.data || [];
  const totalRecords = purchaseData?.total || 0;
  const totalPages = purchaseData?.lastPage || 1;

  useEffect(() => {
    checkPermissions();
  }, []);

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

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setCurrentPage(1); // Reset to first page when date changes
  };

  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleViewDetails = (row) => {
    localStorage.setItem("purchaseBookId", row.id);
    router.push("/purchase_details");
  };

  const handleBardaanaDetails = (row) => {
    localStorage.setItem("purchaseBookId", row.id);
    router.push("/bardaanaGatepass");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // PDF Download Function
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add logo to the right side
    const logoUrl = "/logo.png";
    // Calculate position for right alignment
    const pageWidth = doc.internal.pageSize.width;
    const logoWidth = 40;
    const logoHeight = 50;
    const logoX = pageWidth - logoWidth - 14; // 14 is margin from right
    const logoY = 10; // Top margin

    try {
      doc.addImage(logoUrl, "PNG", logoX, logoY, logoWidth, logoHeight);
    } catch (error) {
      console.warn("Logo could not be added:", error);
    }

    // Add title (adjusted position to avoid logo overlap)
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("Purchase Report", 14, 22);

    // Add date range if available
    if (startDate && endDate) {
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text(`Date Range: ${startDate} to ${endDate}`, 14, 32);
    }

    // Add search term if available
    if (searchTerm) {
      doc.setFontSize(10);
      doc.text(`Search: ${searchTerm}`, 14, 38);
    }

    // Add generation date and total records
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 44);
    doc.text(`Total Records: ${totalRecords}`, 14, 50);

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

    const tableRows = tableData.map((row) => [
      row.id || "",
      row.user?.name || "",
      row.date || "",
      row.product?.product_name || "",
      row.party?.person_name || "",
      row.net_weight || "",
      row.total_amount || "",
    ]);

    // Add table (adjusted startY to accommodate logo if needed)
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: Math.max(56, logoY + logoHeight + 10), // Ensure table starts below logo
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
      margin: { top: 56, left: 14, right: 14 },
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
    const searchSuffix = searchTerm
      ? `_${searchTerm.replace(/\s+/g, "_")}`
      : "";
    const filename = `Purchase_Report${dateRange}${searchSuffix}.pdf`;

    // Save the PDF
    doc.save(filename);
  };

  // Handle error state
  if (error && !isLoading) {
    return (
      <div className={styles.container}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">Error Loading Purchase Data</Typography>
          <Typography variant="body2">
            {error?.message ||
              error?.data?.message ||
              "Failed to load purchase data. Please try again."}
          </Typography>
          <Button variant="outlined" onClick={() => refetch()} sx={{ mt: 1 }}>
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  // Handle no permission
  if (!permissions.hasAccess) {
    return (
      <div className={styles.container}>
        <Alert severity="warning">
          <Typography variant="h6">Access Denied</Typography>
          <Typography variant="body2">
            You dont have permission to view purchase data.
          </Typography>
        </Alert>
      </div>
    );
  }

  return (
    <div className={styles.container}>
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
          {/* Summary Section (if summary API exists and returns data) */}
          {summaryData && !summaryError && (
            <Box
              sx={{ mb: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}
            >
              <Typography variant="h6">Summary</Typography>
              {/* Add summary display here based on your summaryData structure */}
              <Typography variant="body2">
                Total Records: {totalRecords}
              </Typography>
            </Box>
          )}

          {/* Data Info and PDF Download */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="body2" color="textSecondary">
              {isLoading || isFetching
                ? "Loading..."
                : `Showing ${tableData.length} of ${totalRecords} records`}
            </Typography>

            <Button
              variant="contained"
              startIcon={<FaDownload />}
              onClick={downloadPDF}
              disabled={isLoading || isFetching || tableData.length === 0}
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
                position: "relative",
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
                  <TableCell>Print</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading || isFetching ? (
                  Array.from(new Array(5)).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from(new Array(9)).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : tableData.length > 0 ? (
                  tableData.map((row, index) => (
                    <TableRow key={row.id || index}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.user?.name || "N/A"}</TableCell>
                      <TableCell>{row.date || "N/A"}</TableCell>
                      <TableCell>
                        {row.product?.product_name || "N/A"}
                      </TableCell>
                      <TableCell>{row.party?.person_name || "N/A"}</TableCell>
                      <TableCell>{row.net_weight || "N/A"}</TableCell>
                      <TableCell>{row.total_amount || "N/A"}</TableCell>
                      <TableCell
                        onClick={() => handleViewDetails(row)}
                        style={{
                          cursor: "pointer",
                          color: "#1976d2",
                          textDecoration: "underline",
                        }}
                      >
                        View Details
                      </TableCell>
                      <TableCell>
                        {row.bardaana_type === "return" ||
                        row.bardaana_type === "add" ? (
                          <span
                            onClick={() => handleBardaanaDetails(row)}
                            style={{
                              cursor: "pointer",
                              color: "#1976d2",
                              textDecoration: "underline",
                            }}
                          >
                            Bardaana Gate Pass ({row.bardaana_type})
                          </span>
                        ) : (
                          <span style={{ color: "#ccc" }}>N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No purchase records found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default withAuth(Purchase);
