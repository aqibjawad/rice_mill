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

const CombinedTable = () => {
  const api = new APICall();
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [debitResponse, investorsResponse, productsResponse] =
          await Promise.all([
            api.getDataWithToken(`${debitTrial}`),
            api.getDataWithToken(`${investors}`),
            api.getDataWithToken(`${products}`),
          ]);

        const mergedData = [
          ...debitResponse.data.expense_categories.map((category) => ({
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
          ...productsResponse.data.map((product) => ({
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
  }, []);

  const renderAmount = (item) => {
    if (item.is_cash) {
      const amount = parseFloat(item.cash_amount || 0);
      return {
        credit: amount > 0 ? amount.toFixed(2) : "-",
        debit: "-",
      };
    }

    if (item.expense_category) {
      const amount = parseFloat(item.expenses_sum_total_amount || 0);
      return {
        credit: "-",
        debit: amount > 0 ? amount.toFixed(2) : "-",
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
      const amount = renderAmount(item);
      return sum + parseFloat(amount[dataType] !== "-" ? amount[dataType] : 0);
    }, 0);
  };

  const totalCredit = calculateTotals("credit");
  const totalDebit = calculateTotals("debit");

  // PDF Generation Function
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Financial Report", 14, 15);
    doc.setFontSize(12);

    const tableColumn = ["Name", "Credit", "Debit"];
    const tableRows = [];

    combinedData.forEach((item) => {
      const amounts = renderAmount(item);
      const name = item.type === "cash" 
      ? `Cash: ${item.cash_amount || 0}`
      : (item.person_name ||
         item.expense_category ||
         item.bank_name ||
         item.product_name ||
         "Unknown");

      tableRows.push([name, amounts.credit, amounts.debit]);
    });

    // Add totals
    tableRows.push(["Total", totalCredit.toFixed(2), totalDebit.toFixed(2)]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
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
              : combinedData.map((item, index) => {
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
