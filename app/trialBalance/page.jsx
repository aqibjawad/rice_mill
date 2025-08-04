"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Button,
  tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/system";
import { AiFillFilePdf } from "react-icons/ai";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { debitTrial, investors, products } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";

// Custom Styled Table Components
const StyledTableContainer = styled(Paper)({
  minHeight: "300px",
  overflow: "auto",
  "& .MuiTable-root": {
    borderCollapse: "separate",
    borderSpacing: 0,
  },
  "& .MuiTableHead-root": {
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
});

// Modified StyledTableCell without theme dependency
const StyledTableCell = styled(TableCell)({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1976d2", // Using direct color value instead of theme
    color: "#ffffff",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
});

const getParamFromUrl = (url, param) => {
  const searchParams = new URLSearchParams(url.split("?")[1]);
  return searchParams.get(param);
};

const CombinedTable = () => {
  const api = new APICall();
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seasonId, setSeasonId] = useState(null);

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getParamFromUrl(currentUrl, "season_id");
    setSeasonId(urlId);
  }, []);

  useEffect(() => {
    if (!seasonId) return; // Wait until seasonId is available

    const fetchAllData = async () => {
      try {
        // Construct the debitTrial URL with season_id parameter
        const debitTrialUrl = `${debitTrial}?season_id=${seasonId}`;

        const [debitResponse, investorsResponse, productsResponse] =
          await Promise.all([
            api.getDataWithToken(debitTrialUrl),
            api.getDataWithToken(`${investors}`),
            api.getDataWithToken(`${products}`),
          ]);

        const mergedData = [
          // Filter out "Product Expense" from expense_categories here
          ...debitResponse.data.expense_categories
            .filter(
              (category) => category.expense_category !== "Product Expense"
            )
            .map((category) => ({
              ...category,
              type: "expense_category",
            })),
          ...debitResponse.data.parties.map((party) => ({
            ...party,
            type: "party",
          })),
          ...debitResponse.data.banks.map((bank) => ({
            ...bank,
            type: "bank",
          })),
          {
            is_cash: true,
            cash_amount: parseFloat(debitResponse.data.cash),
            type: "cash",
          },
          ...investorsResponse.data.map((investor) => ({
            ...investor,
            type: "investor",
          })),
          ...productsResponse.data
            .filter((product) => product.product_name !== "Product Expense")
            .map((product) => ({
              ...product,
              balance: product.company_product_stocks[0]?.balance || "0",
              type: "product",
            })),
        ];

        setCombinedData(mergedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [seasonId]); // Add seasonId as dependency

  const renderAmount = (item) => {
    if (item.is_cash) {
      const amount = parseFloat(item.cash_amount || 0);
      return {
        credit: amount > 0 ? amount.toFixed(2) : "-",
        debit: "-",
      };
    }

    // Updated: Expenses now go to credit side instead of debit
    if (item.expense_category) {
      const amount = parseFloat(item.expenses_sum_total_amount || 0);
      return {
        credit: amount > 0 ? amount.toFixed(2) : "-", // Changed from debit to credit
        debit: "-", // Changed from credit to debit
      };
    }

    if (item.bank_name) {
      const amount = parseFloat(item.balance || 0);
      return {
        credit: amount > 0 ? amount.toFixed(2) : "-",
        debit: amount < 0 ? Math.abs(amount).toFixed(2) : "-",
      };
    }

    if (item.type === "investor") {
      const amount = parseFloat(item.current_balance || 0);
      return {
        credit: amount < 0 ? Math.abs(amount).toFixed(2) : "-", // Now negative goes to credit
        debit: amount > 0 ? amount.toFixed(2) : "-", // Now positive goes to debit
      };
    }

    if (item.type === "party" || item.type === "product") {
      const balance = parseFloat(item.current_balance || item.balance || 0);
      return {
        credit: balance > 0 ? balance.toFixed(2) : "-",
        debit: balance < 0 ? Math.abs(balance).toFixed(2) : "-",
      };
    }

    return {
      credit: "-",
      debit: "-",
    };
  };

  const calculateTotals = (dataType) => {
    return combinedData.reduce((sum, item) => {
      // Skip "Product Expense" in calculation
      if (item.type === "product" && item.product_name === "Product Expense") {
        return sum;
      }
      const amount = renderAmount(item);
      return sum + parseFloat(amount[dataType] !== "-" ? amount[dataType] : 0);
    }, 0);
  };

  const totalCredit = calculateTotals("credit");
  const totalDebit = calculateTotals("debit");

  // PDF Generation Function
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add title on the left
    doc.text("Financial Report", 14, 15);

    // Add logo on the right side
    const img = new Image();
    img.onload = function () {
      // Calculate position for right alignment
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoWidth = 40; // Adjust logo width as needed
      const logoHeight = 50; // Adjust logo height as needed
      const logoX = pageWidth - logoWidth - 14; // 14 is margin from right edge
      const logoY = 5; // Y position from top

      // Add the logo
      doc.addImage(this, "PNG", logoX, logoY, logoWidth, logoHeight);

      // Continue with the rest of the PDF generation
      doc.setFontSize(12);

      const tableColumn = ["Name", "Credit", "Debit"];
      const tableRows = [];

      // Filter out "Product Expense" when generating PDF
      combinedData
        .filter(
          (item) =>
            !(
              item.type === "product" && item.product_name === "Product Expense"
            )
        )
        .forEach((item) => {
          const amounts = renderAmount(item);
          const name =
            item.type === "cash"
              ? `Cash: ${item.cash_amount || 0}`
              : item.person_name ||
                item.expense_category ||
                item.bank_name ||
                item.product_name ||
                "Unknown";

          tableRows.push([name, amounts.credit, amounts.debit]);
        });

      // Add totals
      tableRows.push(["Total", totalCredit.toFixed(2), totalDebit.toFixed(2)]);

      // Calculate startY based on logo position and height + some margin
      const tableStartY = logoY + logoHeight + 10; // 10 is margin below logo

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: tableStartY, // Dynamic positioning based on logo
      });

      doc.save("financial_report.pdf");
    };

    // Handle image load error
    img.onerror = function () {
      console.log("Logo could not be loaded, generating PDF without logo");
      // Generate PDF without logo if image fails to load
      generatePDFWithoutLogo();
    };

    // Set the image source
    img.src = "/logo.png";
  };

  // Function to generate PDF without logo (fallback)
  const generatePDFWithoutLogo = () => {
    const doc = new jsPDF();

    // Add title
    doc.text("Financial Report", 14, 15);
    doc.setFontSize(12);

    const tableColumn = ["Name", "Credit", "Debit"];
    const tableRows = [];

    // Filter out "Product Expense" when generating PDF
    combinedData
      .filter(
        (item) =>
          !(item.type === "product" && item.product_name === "Product Expense")
      )
      .forEach((item) => {
        const amounts = renderAmount(item);
        const name =
          item.type === "cash"
            ? `Cash: ${item.cash_amount || 0}`
            : item.person_name ||
              item.expense_category ||
              item.bank_name ||
              item.product_name ||
              "Unknown";

        tableRows.push([name, amounts.credit, amounts.debit]);
      });

    // Add totals
    tableRows.push(["Total", totalCredit.toFixed(2), totalDebit.toFixed(2)]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25, // Safe position without logo
    });

    doc.save("financial_report.pdf");
  };

  const getRowColor = (type) => {
    switch (type) {
      case "expense_category":
        return "#f5f5f5"; // Light gray
      case "party":
        return "#e3f2fd"; // Light blue
      case "bank":
        return "#fce4ec"; // Light pink
      case "cash":
        return "#e8f5e9"; // Light green
      case "investor":
        return "#fff3e0"; // Light orange
      case "product":
        return "#ede7f6"; // Light purple
      default:
        return "white";
    }
  };

  return (
    <Container>
      {/* PDF Download Button */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AiFillFilePdf />}
        sx={{ marginBottom: 2 }}
        onClick={downloadPDF}
      >
        Download PDF
      </Button>

      {/* Table Display */}
      <StyledTableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Credit</StyledTableCell>
              <StyledTableCell align="center">Debit</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="text" width="60%" />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="text" width="60%" />
                    </TableCell>
                  </TableRow>
                ))
              : combinedData
                  // Filter out "Product Expense" from table display
                  .filter(
                    (item) =>
                      !(
                        item.type === "product" &&
                        item.product_name === "Product Expense"
                      )
                  )
                  .map((item, index) => {
                    const amounts = renderAmount(item);
                    const name = item.is_cash
                      ? "Cash in hand"
                      : item.person_name ||
                        item.expense_category ||
                        item.bank_name ||
                        item.product_name ||
                        "Unknown";

                    return (
                      <TableRow
                        key={index}
                        sx={{ backgroundColor: getRowColor(item.type) }}
                      >
                        <TableCell align="center">{name}</TableCell>
                        <TableCell align="center">{amounts.credit}</TableCell>
                        <TableCell align="center">{amounts.debit}</TableCell>
                      </TableRow>
                    );
                  })}
            {!loading && (
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  Total
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  {totalCredit.toFixed(2)}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  {totalDebit.toFixed(2)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Container>
  );
};

export default CombinedTable;
