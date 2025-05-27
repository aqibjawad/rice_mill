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

const Page = () => {
  const api = new APICall();
  const router = useRouter();

  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Permission states
  const [permissions, setPermissions] = useState({
    canAddSales: false,
    canViewSales: false,
    hasAccess: false
  });

  useEffect(() => {
    checkPermissions();
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
        
        if (parsedPermissions.modules && Array.isArray(parsedPermissions.modules)) {
          const salesModule = parsedPermissions.modules.find(
            module => module.parent === "Sales" || module.name === "Sales"
          );
          
          if (salesModule && salesModule.permissions) {
            canAddSales = salesModule.permissions.includes("Add Sales");
            canViewSales = salesModule.permissions.includes("View Sales");
          }
        }
        
        setPermissions({
          canAddSales,
          canViewSales,
          hasAccess: canAddSales || canViewSales
        });
        
        // If user has no sales permissions at all, redirect or show error
        if (!canAddSales && !canViewSales) {
          console.warn("No sales permissions found");
          // Optional: redirect to unauthorized page
          // router.push("/unauthorized");
        }
        
      } else {
        // No permissions found - default behavior
        setPermissions({
          canAddSales: true,
          canViewSales: true,
          hasAccess: true
        });
      }
    } catch (error) {
      console.error("Error parsing permissions:", error);
      // Default to showing all on error
      setPermissions({
        canAddSales: true,
        canViewSales: true,
        hasAccess: true
      });
    }
  };

  const fetchData = async () => {
    if (!permissions.canViewSales) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.getDataWithToken(saleBook);
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
    if (!permissions.canViewSales) {
      console.warn("No permission to view sales details");
      return;
    }
    
    localStorage.setItem("saleBookId", row.id);
    router.push("/invoice");
  };

  const filteredData = tableData.filter((row) => {
    const buyerName = row.party?.person_name || row.buyer?.person_name || "";
    return buyerName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // If user has no access to sales at all
  if (!permissions.hasAccess) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.contentContainer}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h3>Access Denied</h3>
            <p>You don't have permission to access Sales module.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Show Buttons component only if user can add sales */}
      {permissions.canAddSales && (
        <Buttons leftSectionText="Sale" addButtonLink="/addSale" />
      )}

      <div className={styles.contentContainer}>
        {/* Show search and table only if user can view sales */}
        {permissions.canViewSales && (
          <>
            {/* Uncomment if you want search functionality */}
            {/* <input
              type="text"
              placeholder="Search by buyer name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: "10px", width: "100%", padding: "5px" }}
            /> */}

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
                    <TableCell>Reference No</TableCell>
                    <TableCell>Buyer Name</TableCell>
                    <TableCell>Total Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        {[...Array(4)].map((_, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton animation="wave" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4}>
                        {error || "No data available"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((row, index) => (
                      <TableRow
                        onClick={() => handleViewDetails(row)}
                        key={row.id}
                        hover
                        style={{ 
                          cursor: permissions.canViewSales ? 'pointer' : 'default' 
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
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
          </>
        )}

        {/* Show message if user can only add but not view */}
        {permissions.canAddSales && !permissions.canViewSales && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>You have permission to add sales but cannot view the sales list.</p>
          </div>
        )}

        {/* Show message if user can only view but not add */}
        {!permissions.canAddSales && permissions.canViewSales && (
          <div style={{ textAlign: 'center', padding: '10px', fontSize: '14px', color: '#666' }}>
            <p>You can view sales but don't have permission to add new sales.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;