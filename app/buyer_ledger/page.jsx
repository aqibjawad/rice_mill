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
  Modal,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import APICall from "@/networkApi/APICall";
import { buyerLedger, getLocalStorage } from "../../networkApi/Constants";
import { useRouter } from "next/navigation";

const Page = () => {
  const api = new APICall();
  const router = useRouter();
  const [tableData, setTableData] = useState([]);

  const [rowData, setRowData] = useState();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const buyerId = getLocalStorage("buyerId");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.getDataWithToken(
        `${buyerLedger}?buyer_id=${buyerId}`
      );

      const data = response.data;

      setRowData(data);

      if (Array.isArray(data.ledgers)) {
        setTableData(data.ledgers);
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (row) => {
    if (row.book_id) {
      localStorage.setItem("saleBookId", row.book_id);
      router.push("/invoice");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  const getDescriction = (row) => {
    if (row.description === "Opening Balance") {
      return "Opening Balance";
    } else if (row.entry_type === "dr") {
      return "Bill - " + row.book_id;
    } else if (row.entry_type === "cr") {
      if (row.payment_type === "cheque") {
        return (
          row.payment_type +
          " - " +
          row.bank.bank_name +
          " - " +
          row.cheque_date
        );
      } else if (row.payment_type === "online") {
        return (
          row.payment_type +
          " - " +
          row.bank.bank_name +
          " - " +
          row.transection_id
        );
      } else {
        return row.payment_type;
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats date as MM/DD/YYYY by default, adjust as needed
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.leftSection}>{rowData?.person_name}</div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> Sr No </TableCell>
              <TableCell> Dare </TableCell>
              <TableCell> Details </TableCell>
              <TableCell> Credit Amount </TableCell>
              <TableCell> Debit Amount </TableCell>
              <TableCell> Naam / Jama </TableCell>
              <TableCell> Balance </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <div>Error: {error}</div>
                </TableCell>
              </TableRow>
            ) : loading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {[...Array(4)].map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton animation="wave" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              tableData.map((row, index) => (
                <TableRow onClick={() => handleViewDetails(row)} key={index}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{formatDate(row.created_at)}</TableCell>
                  <TableCell>{getDescriction(row)}</TableCell>
                  <TableCell>{row.cr_amount}</TableCell>
                  <TableCell>{row.dr_amount}</TableCell>
                  <TableCell>{row.balance < 0 ? "Jama" : "Naam"}</TableCell>
                  <TableCell>{row.balance}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            outline: "none",
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Details
          </Typography>
          {modalData && (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  {/* <TableRow>
                    <TableCell>
                      <strong>Product:</strong>
                    </TableCell>
                    <TableCell>{modalData.payment_type}</TableCell>
                  </TableRow> */}

                  <TableRow>
                    <TableCell>
                      <strong>Field</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Value</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>Cash Amount:</strong>
                    </TableCell>
                    <TableCell>{modalData.cash_amount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Credit Amount:</strong>
                    </TableCell>
                    <TableCell>{modalData.cr_amount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Debit Amount:</strong>
                    </TableCell>
                    <TableCell>{modalData.dr_amount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Payment Type:</strong>
                    </TableCell>
                    <TableCell>{modalData.payment_type}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Page;
