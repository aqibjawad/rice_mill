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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";

import logo from "../../public/logo.png";

import withAuth from '@/utils/withAuth'; 

const Page = () => {
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

  const convertImageToBase64 = (url) => {
    return new Promise((resolve, reject) => {
      console.log(`Attempting to load image from URL: ${url}`);
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Allow cross-origin image loading
      img.src = url;
      img.onload = () => {
        console.log("Image loaded successfully");
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = (error) => {
        console.error("Error loading image:", error);
        reject(new Error("Failed to convert image to base64"));
      };
    });
  };

  const generatePDF = async () => {
    if (!tableRef.current) return;

    const pdf = new jsPDF("p", "mm", "a4");

    // Set margins
    const margin = 10; // in mm
    const pageWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pageWidth - 2 * margin;

    // Add logo and name at the top
    const name = rowData?.person_name || "Supplier Name";

    // Add name
    pdf.setFontSize(16);
    pdf.text(name, margin + 40, margin + 15); // Adjust position

    // Add a line below the header
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(margin, margin + 35, pageWidth - margin, margin + 35);

    // Capture the table content as an image
    const canvas = await html2canvas(tableRef.current, {
      backgroundColor: null, // This will ensure the background is transparent
    });
    const imgData = canvas.toDataURL("image/png");

    // Calculate image size to fit within the PDF page
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add the image to the PDF
    pdf.addImage(imgData, "PNG", margin, margin + 40, imgWidth, imgHeight);

    return pdf;
  };

  // Helper function to load image from URL
  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
    });
  };

  const handleWhatsAppShare = async () => {
    try {
      console.log("Starting PDF generation...");
      const pdf = await generatePDF();

      console.log("PDF generated. Creating blob...");
      const pdfBlob = pdf.output("blob");

      console.log("Creating File object...");
      const file = new File([pdfBlob], `${rowData?.person_name} ledger.pdf`, {
        type: "application/pdf",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        console.log("Using Web Share API...");
        await navigator.share({
          files: [file],
          title: `${rowData?.person_name} ledger.pdf`,
          text: "Check out this supplier ledger data",
        });
      } else {
        console.log("Web Share API not supported. Using fallback...");
        const pdfUrl = URL.createObjectURL(file);
        const whatsappMessage = encodeURIComponent(
          "Check out this supplier ledger data: " + pdfUrl
        );
        const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

        window.open(whatsappUrl, "_blank");

        setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);
      }

      console.log("Share process completed successfully");
    } catch (error) {
      console.error("Detailed error in handleWhatsAppShare:", error);
      alert(
        "Error generating or sharing PDF. Please check the console for more details and try again."
      );
    }
  };

  const testPDFGeneration = async () => {
    try {
      const pdf = await generatePDF();
      pdf.save(`${rowData?.person_name}.pdf`);
      console.log("PDF generated and saved successfully");
    } catch (error) {
      console.error("Error in PDF generation test:", error);
    }
  };
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.leftSection}>{rowData?.person_name}</div>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleWhatsAppShare}
        >
          Share on WhatsApp
        </Button>
        <Button variant="contained" color="primary" onClick={testPDFGeneration}>
          PDF Generate
        </Button>
      </div>
      <div className={styles.leftContact}>{rowData?.contact}</div>

      <TableContainer component={Paper} ref={tableRef}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Description</TableCell>
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

export default withAuth(Page);
