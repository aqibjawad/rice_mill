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
} from "@mui/material";
import APICall from "@/networkApi/APICall";
import { useSearchParams } from "next/navigation";
import { supplierLedger } from "../../networkApi/Constants";

const Page = () => {
  // const api = new APICall();
  // const [tableData, setTableData] = useState([]);

  // const [rowData, setRowData] = useState();

  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const [modalOpen, setModalOpen] = useState(false);
  // const [modalData, setModalData] = useState(null);

  // const searchParams = useSearchParams();
  // const id = searchParams.get("sup_id");

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await api.getDataWithToken(
  //       `${supplierLedger}?sup_id=${id}`
  //     );

  //     const data = response.data;

  //     setRowData(data);

  //     if (Array.isArray(data.ledgers)) {
  //       setTableData(data.ledgers);
  //     } else {
  //       throw new Error("Fetched data is not an array");
  //     }
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleViewDetails = (row) => {
  //   setModalData(row);
  //   setModalOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setModalOpen(false);
  //   setModalData(null);
  // };

  return (
    <div>
      test
      {/* <div className={styles.container}>
        <div className={styles.leftSection}>{rowData?.person_name}</div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell> Description </TableCell>
              <TableCell> Credit Amount </TableCell>
              <TableCell> Debit Amount </TableCell>
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
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.cr_amount}</TableCell>
                  <TableCell>{row.dr_amount}</TableCell>
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
            <div>
              <Typography id="modal-description" sx={{ mt: 2 }}>
                <strong>Name:</strong> {modalData.balance}
                <br />
                <strong>Cash Amount:</strong> {modalData.cash_amount}
                <br />
                <strong>Credit Amount:</strong> {modalData.cr_amount}
                <br />
                <strong>Debit Amount:</strong> {modalData.dr_amount}
                <br />
                <strong>Payment Type:</strong> {modalData.payment_type}
                <br />
              </Typography>
            </div>
          )}
        </Box>
      </Modal> */}
    </div>
  );
};

export default Page;
