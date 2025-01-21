"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/ledger.module.css";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
} from "@mui/material";
import { MdDelete, MdEdit } from "react-icons/md";
import AddSupplier from "../../components/stock/addSupplier";
import { suppliers } from "../../networkApi/Constants";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import APICall from "@/networkApi/APICall";
import SearchInput from "@/components/generic/searchInput";

const Page = () => {
  const api = new APICall();
  const router = useRouter();

  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingData(null);
    fetchData();
  };

  const handleEdit = (row) => {
    setEditingData(row);
    setOpen(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // New effect to handle search filtering
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(tableData);
    } else {
      const filtered = tableData.filter((item) =>
        item.person_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, tableData]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.getDataWithToken(suppliers);
      const data = response.data;

      if (Array.isArray(data)) {
        setTableData(data);
        setFilteredData(data);
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.deleteDataWithToken(`${suppliers}/${id}`, {
        method: "DELETE",
      });

      if (response.status === "success") {
        setTableData((prevData) => {
          const newData = prevData.filter((item) => item.id !== id);
          setFilteredData(newData);
          return newData;
        });

        Swal.fire({
          title: "Deleted!",
          text: "The stock item has been deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the stock item.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error deleting Stock:", error);
    }
  };

  const handleViewDetails = (id) => {
    localStorage.setItem("supplerId", id);
    router.push("/supplier_ledger");
  };

  // New handler for search input
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  return (
    <div className={styles.pageContainer}>
      <Grid container spacing={2}>
        <Grid item lg={6} sm={12} xs={12} md={4} className={styles.leftSection}>
          Supplier
        </Grid>

        <Grid item lg={6} sm={12} xs={12} md={8}>
          <div className="flex">
            <div className="flex-grow"></div>
            <div>
              <Grid container spacing={2}>
                <Grid lg={8} item xs={6} sm={6} md={6}>
                  <SearchInput
                    placeholder="Search by person name"
                    value={searchQuery}
                    onSearch={handleSearch}
                  />
                </Grid>
                <Grid
                  lg={4}
                  item
                  xs={6}
                  sm={6}
                  md={6}
                  className={styles.rightSection}
                >
                  <div className={styles.rightItemExp} onClick={handleOpen}>
                    + Add
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </Grid>
      </Grid>

      <div className={styles.contentContainer}>
        <TableContainer className="mt-5" component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr.</TableCell>
                <TableCell>Person Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Firm Name</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Skeleton variant="rectangular" width="100%" height={40} />
                    {[...Array(5)].map((_, index) => (
                      <Skeleton
                        key={index}
                        variant="rectangular"
                        width="100%"
                        height={30}
                        style={{ marginTop: "10px" }}
                      />
                    ))}
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8}>Error: {error}</TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.person_name}</TableCell>
                    <TableCell>{row.contact}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.firm_name}</TableCell>
                    <TableCell>{row.current_balance}</TableCell>
                    <TableCell>
                      <div className={styles.iconContainer}>
                        <div
                          style={{
                            color: "#316AFF",
                            fontSize: "15px",
                            marginTop: "1rem",
                          }}
                        >
                          <Button onClick={() => handleViewDetails(row.id)}>
                            View Details
                          </Button>
                        </div>
                        <MdDelete
                          onClick={() => handleDelete(row.id)}
                          className={styles.deleteButton}
                        />
                        <MdEdit
                          onClick={() => handleEdit(row)}
                          className={styles.editButton}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <AddSupplier
        open={open}
        handleClose={handleClose}
        editData={editingData}
      />
    </div>
  );
};

export default Page;
