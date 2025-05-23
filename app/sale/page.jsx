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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
    localStorage.setItem("saleBookId", row.id);
    router.push("/invoice");
  };

  const filteredData = tableData.filter((row) => {
    const buyerName = row.party?.person_name || row.buyer?.person_name || "";
    return buyerName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className={styles.pageContainer}>
      <Buttons leftSectionText="Sale" addButtonLink="/addSale" />

      <div className={styles.contentContainer}>
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
                  <TableCell colSpan={4}>No data available</TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, index) => (
                  <TableRow
                    onClick={() => handleViewDetails(row)}
                    key={row.id}
                    hover
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
      </div>
    </div>
  );
};

export default Page;
