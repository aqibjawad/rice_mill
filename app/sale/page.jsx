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
import { saleBook } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";
import { useRouter } from "next/navigation";
import Buttons from "@/components/buttons";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";

const Page = () => {
  const api = new APICall();
  const router = useRouter();

  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Permission states
  const [permissions, setPermissions] = useState({
    canAddSales: false,
    canViewSales: false,
    hasAccess: false,
  });

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    if (permissions.canViewSales) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [permissions.canViewSales]);

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

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);

    const queryParams = [];

    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      const now = new Date();
      const monthStartDate = startOfDay(now);
      const monthEndDate = endOfDay(now);

      const formattedStartDate = format(monthStartDate, "yyyy-MM-dd");
      const formattedEndDate = format(monthEndDate, "yyyy-MM-dd");

      queryParams.push(`start_date=${formattedStartDate}`);
      queryParams.push(`end_date=${formattedEndDate}`);
    }
    const queryString = queryParams.join("&");

    try {
      const response = await api.getDataWithToken(`${saleBook}?${queryString}`);
      const data = response.data || [];

      if (Array.isArray(data)) {
        // Add additional validation to ensure buyer info exists
        const validData = data.filter((row) => row.party || row.buyer);
        setTableData(validData);

        if (validData.length === 0) {
          setError("No valid sale records found");
        }
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message || "Failed to fetch sale data");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (row) => {
    localStorage.setItem("saleBookId", row.id);
    router.push("/invoice");
  };

  const filteredData = tableData.filter((row) => {
    const buyerName = row.party?.person_name || row.buyer?.person_name || "";
    return buyerName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDateChange = (start, end) => {
    if (start === "this-month") {
      const now = new Date();
      const monthStartDate = startOfMonth(now);
      const monthEndDate = endOfMonth(now);

      const formattedStartDate = format(monthStartDate, "yyyy-MM-dd");
      const formattedEndDate = format(monthEndDate, "yyyy-MM-dd");

      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);
    } else {
      setStartDate(start);
      setEndDate(end);
    }
  };

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
                {loading ? (
                  [...Array(8)].map((_, index) => (
                    <TableRow key={index}>
                      {[...Array(5)].map((_, cellIndex) => (
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
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      style={{ textAlign: "center", color: "red" }}
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} style={{ textAlign: "center" }}>
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row, index) => (
                    <TableRow
                      onClick={() => handleViewDetails(row)}
                      key={row.id}
                      hover
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row?.user?.name || ""}</TableCell>
                      <TableCell>{row?.date || ""}</TableCell>
                      <TableCell>{row.ref_no}</TableCell>
                      <TableCell>
                        {row.party?.person_name ||
                          row.buyer?.person_name ||
                          "N/A"}
                      </TableCell>
                      <TableCell>{row.total_amount}</TableCell>
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
