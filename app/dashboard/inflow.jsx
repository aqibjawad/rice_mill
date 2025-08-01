import React, { useState, useEffect } from "react";
import { format, startOfDay, endOfDay } from "date-fns";
import { useRouter } from "next/navigation"; // Add this import
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Chip,
  tableCellClasses,
  styled,
  Skeleton,
  Button,
} from "@mui/material";
import { FaMoneyBillWave, FaUniversity } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  useGetReceivedPartyAmountQuery,
  useGetCompanyProductStockQuery,
} from "../../src/store/receivesApi"; // RTK Query hooks
import Buttons from "../../components/buttons";

// Styled components (same as before)
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    cursor: "pointer", // Add cursor pointer to indicate clickable rows
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const TotalCard = styled(Card)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.background.default,
  "&:hover": {
    boxShadow: theme.shadows[4],
    transform: "translateY(-2px)",
    transition: "all 0.3s",
  },
}));

const Page = () => {
  const router = useRouter(); // Add navigation hook
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [permissions, setPermissions] = useState({
    canAddReceives: false,
    canViewReceives: false,
    hasAccess: false,
  });

  // Date parameters for API calls
  const dateParams = {
    startDate: startDate
      ? format(startOfDay(startDate), "yyyy-MM-dd")
      : format(startOfDay(new Date()), "yyyy-MM-dd"),
    endDate: endDate
      ? format(endOfDay(endDate), "yyyy-MM-dd")
      : format(endOfDay(new Date()), "yyyy-MM-dd"),
  };

  // RTK Query - Individual API calls
  const {
    data: receivedPartyData,
    error: receivedPartyError,
    isLoading: receivedPartyLoading,
    refetch: refetchReceivedParty,
  } = useGetReceivedPartyAmountQuery(dateParams);

  const {
    data: companyProductData,
    error: companyProductError,
    isLoading: companyProductLoading,
    refetch: refetchCompanyProduct,
  } = useGetCompanyProductStockQuery(dateParams);

  // Extract data from responses
  const receivesData = receivedPartyData?.data || [];
  const receivesProData = companyProductData?.data || [];

  // Combined loading state
  const isLoading = receivedPartyLoading || companyProductLoading;
  const hasError = receivedPartyError || companyProductError;

  useEffect(() => {
    checkPermissions();
  }, []);

  // Refetch data when date changes
  useEffect(() => {
    refetchReceivedParty();
    refetchCompanyProduct();
  }, [startDate, endDate, refetchReceivedParty, refetchCompanyProduct]);

  const checkPermissions = () => {
    try {
      const storedPermissions = localStorage.getItem("permissions");

      if (storedPermissions) {
        const parsedPermissions = JSON.parse(storedPermissions);

        let canAddReceives = false;
        let canViewReceives = false;

        if (
          parsedPermissions.modules &&
          Array.isArray(parsedPermissions.modules)
        ) {
          const ReceivesModule = parsedPermissions.modules.find(
            (module) =>
              module.parent === "Receives" || module.name === "Receives"
          );

          if (ReceivesModule && ReceivesModule.permissions) {
            canAddReceives =
              ReceivesModule.permissions.includes("Add Receives");
            canViewReceives =
              ReceivesModule.permissions.includes("View Receives");
          }
        }

        setPermissions({
          canAddReceives,
          canViewReceives,
          hasAccess: canAddReceives || canViewReceives,
        });
      } else {
        setPermissions({
          canAddReceives: true,
          canViewReceives: true,
          hasAccess: true,
        });
      }
    } catch (error) {
      console.error("Error parsing permissions:", error);
      setPermissions({
        canAddReceives: true,
        canViewReceives: true,
        hasAccess: true,
      });
    }
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Add row click handler
  const handleRowClick = (rowData, rowType) => {
    try {
      // Prepare the data to save
      const receiptData = {
        id: rowData.id,
        type: rowType, // 'payment' or 'product'
        receiverName:
          rowType === "payment"
            ? rowData.user?.name || "Admin"
            : rowData?.user?.name || "",
        paymentType:
          rowType === "payment"
            ? rowData.payment_type
            : getProductPaymentTypeDisplay(rowData),
        date: rowData?.created_at || new Date().toISOString(),
        personOrProduct:
          rowType === "payment"
            ? rowData.customer?.person_name || "N/A"
            : rowData?.product?.product_name || "N/A",
        description: rowData.description || "N/A",
        bank:
          rowType === "payment"
            ? rowData.bank?.bank_name || "N/A"
            : rowData.linkable_type === "App\\Models\\BankLedger"
            ? "Bank Entry"
            : "N/A",
        chequeNo:
          rowType === "payment"
            ? rowData.cheque_no || "N/A"
            : rowData.linkable?.cheque_no || "N/A",
        amount:
          rowType === "payment"
            ? getAmountByPaymentType(rowData)
            : parseFloat(rowData.total_amount || 0),
        balance: parseFloat(rowData.balance || 0),
        rawData: rowData, // Save complete row data for reference
        timestamp: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem("selectedReceiptData", JSON.stringify(receiptData));

      // router to receipt page
      router.push("/recieveReciept");
    } catch (error) {
      console.error("Error saving receipt data:", error);
      // Still router even if localStorage fails
      router.push("/recieveReciept");
    }
  };

  // Helper function to get the correct amount based on payment type
  const getAmountByPaymentType = (row) => {
    switch (row.payment_type) {
      case "cash":
        return parseFloat(row.cash_amount || 0);
      case "cheque":
        return parseFloat(row.cheque_amount || 0);
      case "online":
        return parseFloat(row.cash_amount || 0); // Online payments use cash_amount field
      default:
        return parseFloat(row.dr_amount || 0); // Fallback to dr_amount
    }
  };

  const calculateCashTotal = () => {
    const cashTotal = receivesData
      .filter((row) => row.payment_type === "cash")
      .reduce((sum, row) => sum + getAmountByPaymentType(row), 0);

    const productCashTotal = receivesProData
      .filter((row) => {
        if (
          row.Receives_entry_type === "cr" &&
          row.linkable_type === "App\\Models\\Product"
        ) {
          return true;
        }
        if (
          row.linkable_type === "App\\Models\\BankLedger" &&
          row.linkable?.payment_type === "cash"
        ) {
          return true;
        }
        return false;
      })
      .reduce((sum, row) => sum + parseFloat(row.total_amount || 0), 0);

    return (cashTotal + productCashTotal).toFixed(2);
  };

  const calculateOnlineTotal = () => {
    const onlineTotal = receivesData
      .filter((row) => row.payment_type === "online")
      .reduce((sum, row) => sum + getAmountByPaymentType(row), 0);

    const productOnlineTotal = receivesProData
      .filter((row) => {
        return (
          row.linkable_type === "App\\Models\\BankLedger" &&
          row.linkable?.payment_type === "online"
        );
      })
      .reduce((sum, row) => sum + parseFloat(row.total_amount || 0), 0);

    return (onlineTotal + productOnlineTotal).toFixed(2);
  };

  const calculateChequeTotal = () => {
    const chequeTotal = receivesData
      .filter((row) => row.payment_type === "cheque")
      .reduce((sum, row) => sum + getAmountByPaymentType(row), 0);

    return chequeTotal.toFixed(2);
  };

  const getPaymentTypeChip = (type) => {
    const chipProps = {
      cash: { color: "success", label: "Cash" },
      online: { color: "primary", label: "Online" },
      cheque: { color: "warning", label: "Cheque" },
    };

    const props = chipProps[type] || { color: "default", label: type };

    return (
      <Chip
        label={props.label}
        color={props.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const getProductPaymentTypeDisplay = (row) => {
    if (row.linkable_type === "App\\Models\\BankLedger") {
      return row.linkable?.payment_type || "cash";
    }
    return row.Receives_entry_type;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add logo first
    try {
      // Load and add logo - positioned at right end
      const logoImg = new Image();
      logoImg.onload = function () {
        // Calculate right position for logo
        const pageWidth = doc.internal.pageSize.width;
        const logoWidth = 40;
        const logoHeight = 50;
        const rightMargin = 14;

        // Add logo at right end (x position calculated from right edge)
        doc.addImage(
          logoImg,
          "PNG",
          pageWidth - logoWidth - rightMargin,
          10,
          logoWidth,
          logoHeight
        );

        // Continue with rest of the PDF generation after logo is loaded
        generateRestOfPDF(doc);
      };
      logoImg.src = "/logo.png";
    } catch (error) {
      console.error("Error loading logo:", error);
      // Continue without logo if there's an error
      generateRestOfPDF(doc);
    }
  };

  const generateRestOfPDF = (doc) => {
    // Title positioned back to left since logo is now on right
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("Amount Receives Report", 14, 22);

    if (startDate && endDate) {
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text(
        `Date Range: ${format(startDate, "dd/MM/yyyy")} to ${format(
          endDate,
          "dd/MM/yyyy"
        )}`,
        14,
        32
      );
    }

    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 40);

    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Summary:", 14, 55);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Cash Total: ${calculateCashTotal()}`, 14, 65);
    doc.text(`Online Total: ${calculateOnlineTotal()}`, 14, 72);
    doc.text(`Cheque Total: ${calculateChequeTotal()}`, 14, 79);
    doc.text(
      `Grand Total: ${(
        parseFloat(calculateCashTotal()) +
        parseFloat(calculateOnlineTotal()) +
        parseFloat(calculateChequeTotal())
      ).toFixed(2)}`,
      14,
      86
    );

    const tableColumns = [
      "Sr No",
      "Receiver Name",
      "Payment Type",
      "Date",
      "Person/Product",
      "Description",
      "Bank",
      "Cheque No",
      "Amount",
      "Balance",
    ];

    const tableRows = [];

    receivesData.forEach((row, index) => {
      tableRows.push([
        (index + 1).toString(),
        row.user?.name || "Admin",
        row.payment_type || "",
        new Date(row?.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        row.customer?.person_name || "N/A",
        row.description || "N/A",
        row.bank?.bank_name || "N/A",
        row.cheque_no || "N/A",
        getAmountByPaymentType(row).toFixed(2),
        parseFloat(row.balance || 0).toFixed(2),
      ]);
    });

    // Add product data
    receivesProData.forEach((row, index) => {
      tableRows.push([
        (receivesData.length + index + 1).toString(),
        row?.user?.name || "",
        getProductPaymentTypeDisplay(row),
        row?.created_at
          ? new Date(row.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "N/A",
        row?.product?.product_name || "N/A",
        row.description || "N/A",
        row.linkable_type === "App\\Models\\BankLedger" ? "Bank Entry" : "N/A",
        row.linkable?.cheque_no || "N/A",
        parseFloat(row.total_amount || 0).toFixed(2),
        parseFloat(row.balance || 0).toFixed(2),
      ]);
    });

    // Add table - back to original startY position
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 95,
      styles: {
        fontSize: 7,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 15 }, // Sr No
        8: { halign: "right" }, // Amount
        9: { halign: "right" }, // Balance
      },
      margin: { top: 95, left: 14, right: 14 },
      didParseCell: function (data) {
        // Color negative balances red
        if (data.column.index === 9 && parseFloat(data.cell.text[0]) < 0) {
          data.cell.styles.textColor = [220, 53, 69]; // Bootstrap danger red
        }
      },
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
    }

    // Generate filename
    const dateRange =
      startDate && endDate
        ? `_${format(startDate, "yyyy-MM-dd")}_to_${format(
            endDate,
            "yyyy-MM-dd"
          )}`
        : `_${format(new Date(), "yyyy-MM-dd")}`;
    const filename = `Amount_Receives_Report${dateRange}.pdf`;

    // Save the PDF
    doc.save(filename);
  };

  return (
    <Box sx={{ p: 3 }}>
      {permissions.canAddReceives && (
        <Box sx={{ mb: 4 }}>
          <Buttons
            leftSectionText="Amount Receives"
            addButtonLink="/paymentRecieves"
            onDateChange={handleDateChange}
          />
        </Box>
      )}

      {permissions.canViewReceives && (
        <>
          {/* PDF Download Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<FaDownload />}
              onClick={downloadPDF}
              // disabled={
              //   loading ||
              //   (receivesData.length === 0 && receivesProData.length === 0)
              // }
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              Download PDF
            </Button>
          </Box>

          {/* Summary Cards with Skeletons */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              {
                title: "Cash Total",
                icon: FaMoneyBillWave,
                color: "success.main",
                value: calculateCashTotal(),
              },
              {
                title: "Online Total",
                icon: FaUniversity,
                color: "primary.main",
                value: calculateOnlineTotal(),
              },
              {
                title: "Cheque Total",
                icon: FaUniversity,
                color: "warning.main",
                value: calculateChequeTotal(),
              },
            ].map((card, index) => (
              <Grid item xs={12} md={4} key={index}>
                <TotalCard>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      <card.icon color={card.color} size={24} />
                      <Typography variant="h6" component="div">
                        {card.title}
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ mt: 2, color: card.color }}>
                      {card.value}
                    </Typography>
                  </CardContent>
                </TotalCard>
              </Grid>
            ))}
          </Grid>

          {/* Main Table with both payment and product data */}
          <TableContainer component={Paper} elevation={3}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Sr No</StyledTableCell>
                  <StyledTableCell align="left">Reciever Name</StyledTableCell>
                  <StyledTableCell align="center">Payment Type</StyledTableCell>
                  <StyledTableCell align="center">
                    Recieves Date
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Person / Product
                  </StyledTableCell>
                  <StyledTableCell align="left">Description</StyledTableCell>
                  <StyledTableCell align="left">Bank</StyledTableCell>
                  <StyledTableCell align="center">Cheque No</StyledTableCell>
                  <StyledTableCell align="right">Amount</StyledTableCell>
                  <StyledTableCell align="right">Balance</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <>
                  {/* Regular payment data */}
                  {receivesData.map((row, index) => (
                    <StyledTableRow
                      key={`payment-${row.id}`}
                      onClick={() => handleRowClick(row, "payment")}
                    >
                      <StyledTableCell align="center">
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.user?.name || "Admin"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {getPaymentTypeChip(row.payment_type)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {new Date(row?.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.customer?.person_name || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.description || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.bank?.bank_name || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.cheque_no || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {getAmountByPaymentType(row).toFixed(2)}
                      </StyledTableCell>
                      <StyledTableCell
                        align="right"
                        sx={{
                          color:
                            parseFloat(row.balance) < 0
                              ? "error.main"
                              : "success.main",
                          fontWeight: "bold",
                        }}
                      >
                        {parseFloat(row.balance).toFixed(2)}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}

                  {/* Product data */}
                  {receivesProData.map((row, index) => (
                    <StyledTableRow
                      key={`product-${row.id}`}
                      onClick={() => handleRowClick(row, "product")}
                    >
                      <StyledTableCell align="center">
                        {receivesData.length + index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row?.user?.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {getProductPaymentTypeDisplay(row)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row?.created_at
                          ? new Date(row.created_at).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row?.product?.product_name || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.description || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.linkable_type === "App\\Models\\BankLedger"
                          ? "Bank Entry"
                          : "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.linkable?.cheque_no || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {parseFloat(row.total_amount).toFixed(2)}
                      </StyledTableCell>
                      <StyledTableCell
                        align="right"
                        sx={{
                          color:
                            parseFloat(row.balance) < 0
                              ? "error.main"
                              : "success.main",
                          fontWeight: "bold",
                        }}
                      >
                        {parseFloat(row.balance).toFixed(2)}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default Page;
