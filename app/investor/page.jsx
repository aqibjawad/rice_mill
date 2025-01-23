"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/ledger.module.css";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TableContainer,
  Paper,
  Button,
} from "@mui/material";
import { MdDelete } from "react-icons/md";
import AddInvestor from "../../components/stock/addInvestor";
import { investors } from "../../networkApi/Constants";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

import APICall from "@/networkApi/APICall";

const Page = () => {
  const api = new APICall();
  const router = useRouter();

  const [tableData, setTableData] = useState([]);
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.getDataWithToken(investors);
      const data = response.data;

      if (Array.isArray(data)) {
        setTableData(data);
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
      const response = await api.deleteDataWithToken(`${investors}/${id}`, {
        method: "DELETE",
      });

      if ((response.status = "success")) {
        setTableData((prevData) => prevData.filter((item) => item.id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "The investor has been deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the investor.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error deleting Investor:", error);
    }
  };

  const handleViewDetails = (id) => {
    localStorage.setItem("investorId", id);
    router.push("/investor_ledger");
  };

  // Calculate total balance
  const totalBalance = tableData.reduce(
    (total, row) => total + parseFloat(row.current_balance || 0),
    0
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.leftSection}>Investors</div>
        <div className={styles.rightSection}>
          <div className={styles.rightItemExp} onClick={handleOpen}>
            + Add
          </div>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <TableContainer component={Paper}>
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
                tableData.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.person_name}</TableCell>
                    <TableCell>{row.contact}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.firm_name}</TableCell>
                    <TableCell>{row.current_balance}</TableCell>
                    <TableCell>
                      <div className={styles.iconContainer}>
                        <Button onClick={() => handleViewDetails(row.id)}>
                          View Details
                        </Button>
                        <MdDelete
                          onClick={() => handleDelete(row.id)}
                          className={styles.deleteButton}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {!loading && !error && (
              <TableFooter>
                <TableRow>
                  <TableCell
                    colSpan={5}
                    style={{ fontWeight: "bold", fontSize: "18px" }}
                  >
                    Total Balance
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>
                    {totalBalance.toFixed(2)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </TableContainer>
      </div>

      <AddInvestor
        open={open}
        handleClose={handleClose}
        editData={editingData}
      />
    </div>
  );
};

export default Page;
