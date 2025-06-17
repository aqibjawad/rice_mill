"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/packing.module.css";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Buttons from "@/components/buttons";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";
import { useGetsalesBookQuery } from "@/src/store/salesApi";

const Page = () => {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Permission states
  const [permissions, setPermissions] = useState({
    canAddSales: false,
    canViewSales: false,
    hasAccess: false,
  });

  // Set default date range (current day) when component mounts
  useEffect(() => {
    const now = new Date();
    const dayStartDate = startOfDay(now);
    const dayEndDate = endOfDay(now);

    const formattedStartDate = format(dayStartDate, "yyyy-MM-dd");
    const formattedEndDate = format(dayEndDate, "yyyy-MM-dd");

    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
  }, []);

  // Redux query hook - only runs when dates are set and user has permissions
  const {
    data: salesData = [],
    error: apiError,
    isLoading,
    refetch,
  } = useGetsalesBookQuery(
    {
      startDate,
      endDate,
    },
    {
      skip: !startDate || !endDate || !permissions.canViewSales, // Skip query if no dates or no permissions
    }
  );

  useEffect(() => {
    checkPermissions();
  }, []);

  // Debug: Log the API response
  useEffect(() => {
    console.log("API Response - salesData:", salesData);
    console.log("API Response - isLoading:", isLoading);
    console.log("API Response - error:", apiError);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Permissions:", permissions);
  }, [salesData, isLoading, apiError, startDate, endDate, permissions]);

  const checkPermissions = () => {
    try {
      const storedPermissions = localStorage.getItem("permissions");

      if (storedPermissions) {
        const parsedPermissions = JSON.parse(storedPermissions);

        // Find Sales module permissions
        let canAddSales = false;
        let canViewSales = false;

        if (
          parsedPermissions.modules &&
          Array.isArray(parsedPermissions.modules)
        ) {
          const SalesModule = parsedPermissions.modules.find(
            (module) => module.parent === "Sales" || module.name === "Sales"
          );

          if (SalesModule && SalesModule.permissions) {
            canAddSales = SalesModule.permissions.includes("Add Sales");
            canViewSales = SalesModule.permissions.includes("View Sales");
          }
        }

        setPermissions({
          canAddSales,
          canViewSales,
          hasAccess: canAddSales || canViewSales,
        });

        // If user has no Sales permissions at all, redirect or show error
        if (!canAddSales && !canViewSales) {
          console.warn("No Sales permissions found");
          // Optional: redirect to unauthorized page
          // router.push("/unauthorized");
        }
      } else {
        // No permissions found - default behavior
        setPermissions({
          canAddSales: true,
          canViewSales: true,
          hasAccess: true,
        });
      }
    } catch (error) {
      console.error("Error parsing permissions:", error);
      // Default to showing all on error
      setPermissions({
        canAddSales: true,
        canViewSales: true,
        hasAccess: true,
      });
    }
  };

  const handleViewDetails = (row) => {
    localStorage.setItem("saleBookId", row.id);
    router.push("/invoice");
  };

  // Fixed: Process and filter data - handle different API response structures
  const processedData = React.useMemo(() => {
    console.log("Processing salesData:", salesData);

    // Handle different possible API response structures
    let dataArray = [];

    if (Array.isArray(salesData)) {
      dataArray = salesData;
    } else if (salesData && Array.isArray(salesData.data)) {
      dataArray = salesData.data;
    } else if (salesData && typeof salesData === "object") {
      // If salesData is an object, try to find an array property
      const possibleArrayKeys = ["results", "items", "records", "sales"];
      for (const key of possibleArrayKeys) {
        if (Array.isArray(salesData[key])) {
          dataArray = salesData[key];
          break;
        }
      }
    }

    console.log("Extracted dataArray:", dataArray);

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      console.log("No valid data array found");
      return [];
    }

    // Filter out invalid entries and apply search
    const validData = dataArray.filter((row) => {
      // More flexible validation - accept rows with either party, buyer, or any meaningful data
      return row && (row.party || row.buyer || row.id || row.ref_no);
    });

    console.log("Valid data after filtering:", validData);

    const filteredData = validData.filter((row) => {
      if (!searchTerm) return true; // If no search term, return all

      const buyerName = row.party?.person_name || row.buyer?.person_name || "";
      const refNo = row.ref_no || "";
      const salesBy = row.user?.name || "";

      // Search in multiple fields
      const searchText = searchTerm.toLowerCase();
      return (
        buyerName.toLowerCase().includes(searchText) ||
        refNo.toLowerCase().includes(searchText) ||
        salesBy.toLowerCase().includes(searchText)
      );
    });

    console.log("Final filtered data:", filteredData);
    return filteredData;
  }, [salesData, searchTerm]);

  const handleDateChange = (start, end) => {
    console.log("Date change triggered:", start, end);

    if (start === "this-month") {
      const now = new Date();
      const monthStartDate = startOfMonth(now);
      const monthEndDate = endOfMonth(now);

      const formattedStartDate = format(monthStartDate, "yyyy-MM-dd");
      const formattedEndDate = format(monthEndDate, "yyyy-MM-dd");

      console.log("Setting month dates:", formattedStartDate, formattedEndDate);
      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);
    } else {
      console.log("Setting custom dates:", start, end);
      setStartDate(start);
      setEndDate(end);
    }
  };

  // Handle error display
  const getErrorMessage = () => {
    if (apiError) {
      if (apiError.status) {
        return `API Error ${apiError.status}: ${
          apiError.data?.message || "Failed to fetch data"
        }`;
      }
      return apiError.message || "Failed to fetch sale data";
    }
    return null;
  };

  // Debug render info
  console.log("Render info:", {
    isLoading,
    hasError: !!apiError,
    dataLength: processedData.length,
    canViewSales: permissions.canViewSales,
    startDate,
    endDate,
  });

  return (
    <div className={styles.pageContainer}>
      {permissions.canAddSales && (
        <Buttons
          leftSectionText="Sale"
          addButtonLink="/addSale"
          onDateChange={handleDateChange}
        />
      )}

      <div className={styles.contentContainer}>
        {permissions.canViewSales && (
          <TableContainer
            sx={{
              maxHeight: "400px",
              overflow: "auto",
            }}
            component={Paper}
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
                  <TableCell>Sr.</TableCell>
                  <TableCell>Sales By</TableCell>
                  <TableCell>Sales Date</TableCell>
                  <TableCell>Reference No</TableCell>
                  <TableCell>Buyer Name</TableCell>
                  <TableCell>Total Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  [...Array(8)].map((_, index) => (
                    <TableRow key={index}>
                      {[...Array(6)].map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton
                            animation="wave"
                            height={40}
                            sx={{
                              borderRadius: 1,
                              backgroundColor: "rgba(0, 0, 0, 0.06)",
                            }}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : getErrorMessage() ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      style={{ textAlign: "center", color: "red" }}
                    >
                      {getErrorMessage()}
                      <br />
                      <button
                        onClick={() => refetch()}
                        style={{
                          marginTop: "8px",
                          padding: "4px 8px",
                          cursor: "pointer",
                        }}
                      >
                        Retry
                      </button>
                    </TableCell>
                  </TableRow>
                ) : processedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSnop={6} style={{ textAlign: "center" }}>
                      {salesData && Object.keys(salesData).length > 0
                        ? "No matching data found"
                        : "No data available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  processedData.map((row, index) => (
                    <TableRow
                      onClick={() => handleViewDetails(row)}
                      key={row.id || index}
                      hover
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row?.user?.name || "N/A"}</TableCell>
                      <TableCell>
                        {row?.date
                          ? format(new Date(row.date), "dd-MM-yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell>{row?.ref_no || "N/A"}</TableCell>
                      <TableCell>
                        {row?.party?.person_name ||
                          row?.buyer?.person_name ||
                          "N/A"}
                      </TableCell>
                      <TableCell>
                        {row?.total_amount ? `Rs. ${row.total_amount}` : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default Page;
