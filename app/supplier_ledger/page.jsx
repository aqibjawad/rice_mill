"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Button,
} from "@mui/material";
import APICall from "@/networkApi/APICall";
import { supplierLedger, getLocalStorage } from "../../networkApi/Constants";
import "jspdf-autotable";

import logo from "../../public/logo.png";

import withAuth from "@/utils/withAuth";

import { useRouter } from "next/navigation";

const Page = () => {

  const router = useRouter();

  const supplierId = getLocalStorage("supplerId");

  const api = new APICall();
  const [tableData, setTableData] = useState([]);
  const [rowData, setRowData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const tableRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.getDataWithToken(
        `${supplierLedger}?sup_id=${supplierId}`
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
    setModalData(row);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData(null);
  };


  const handlePrint = () => {
    // window.print();
    router.push("/supplier_invoice")
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats date as MM/DD/YYYY by default, adjust as needed
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.leftSection}>{rowData?.person_name}</div>
        {/* <Button
          className={styles.hideOnPrint}
          variant="contained"
          color="secondary"
          onClick={handleWhatsAppShare}
        >
          Share on WhatsApp
        </Button> */}
        <Button
          className={styles.hideOnPrint}
          variant="contained"
          color="primary"
          onClick={handlePrint}
        >
          PDF Generate
        </Button>
      </div>
      <div className={styles.leftContact}>{rowData?.contact}</div>

      <TableContainer component={Paper} ref={tableRef}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Credit Amount</TableCell>
              <TableCell>Debit Amount</TableCell>
              <TableCell> Naam / Jama </TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div>Error: {error}</div>
                </TableCell>
              </TableRow>
            ) : loading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {[...Array(5)].map((_, cellIndex) => (
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
                  <TableCell>{row.description || "Purchase"}</TableCell>
                  <TableCell>{row.cr_amount}</TableCell>
                  <TableCell>{row.dr_amount}</TableCell>
                  <TableCell>{row.balance < 0 ? "Naam" : "Jama"}</TableCell>
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

export default withAuth(Page);
