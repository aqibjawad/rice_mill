import React, { useState, useEffect } from "react";
import { format, startOfDay, endOfDay } from "date-fns";
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
} from "@mui/material";
import { FaMoneyBillWave, FaUniversity } from "react-icons/fa";
import APICall from "../../networkApi/APICall";
import { getAmountReceives, companyProduct } from "../../networkApi/Constants";
import Buttons from "../../components/buttons";

// Styled components
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
  const api = new APICall();
  const [receivesData, setReceivesData] = useState([]);
  const [receivesProData, setReceivesProData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Permission states
  const [permissions, setPermissions] = useState({
    canAddReceives: false,
    canViewReceives: false,
    hasAccess: false,
  });

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = () => {
    try {
      const storedPermissions = localStorage.getItem("permissions");

      if (storedPermissions) {
        const parsedPermissions = JSON.parse(storedPermissions);

        // Find Receives module permissions
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
        // No permissions found - default behavior
        setPermissions({
          canAddReceives: true,
          canViewReceives: true,
          hasAccess: true,
        });
      }
    } catch (error) {
      console.error("Error parsing permissions:", error);
      // Default to showing all on error
      setPermissions({
        canAddReceives: true,
        canViewReceives: true,
        hasAccess: true,
      });
    }
  };

  useEffect(() => {
    fetchData();
    fetchProdcutsData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const queryParams =
        startDate && endDate
          ? [
              `start_date=${format(startOfDay(startDate), "yyyy-MM-dd")}`,
              `end_date=${format(endOfDay(endDate), "yyyy-MM-dd")}`,
            ]
          : [
              `start_date=${format(startOfDay(new Date()), "yyyy-MM-dd")}`,
              `end_date=${format(endOfDay(new Date()), "yyyy-MM-dd")}`,
            ];

      const response = await api.getDataWithToken(
        `${getAmountReceives}?${queryParams.join("&")}`
      );

      setReceivesData(response.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProdcutsData = async () => {
    setLoading(true);

    try {
      const queryParams =
        startDate && endDate
          ? [
              `start_date=${format(startOfDay(startDate), "yyyy-MM-dd")}`,
              `end_date=${format(endOfDay(endDate), "yyyy-MM-dd")}`,
            ]
          : [
              `start_date=${format(startOfDay(new Date()), "yyyy-MM-dd")}`,
              `end_date=${format(endOfDay(new Date()), "yyyy-MM-dd")}`,
            ];

      const response = await api.getDataWithToken(
        `${companyProduct}?${queryParams.join("&")}`
      );

      setReceivesProData(response.data || []);
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const calculateCashTotal = () => {
    // Calculate total from regular cash payment transactions
    const cashTotal = receivesData
      .filter((row) => row.payment_type === "cash")
      .reduce((sum, row) => sum + parseFloat(row.cash_amount || 0), 0);

    // Calculate total from product transactions
    const productCashTotal = receivesProData
      .filter((row) => {
        // Credit transactions from Product entries directly
        if (
          row.Receives_entry_type === "cr" &&
          row.linkable_type === "App\\Models\\Product"
        ) {
          return true;
        }

        // Check if linkable is a BankLedger with cash payment_type
        if (
          row.linkable_type === "App\\Models\\BankLedger" &&
          row.linkable?.payment_type === "cash"
        ) {
          return true;
        }

        return false;
      })
      .reduce((sum, row) => sum + parseFloat(row.total_amount || 0), 0);

    // Return the combined total
    return (cashTotal + productCashTotal).toFixed(2);
  };

  const calculateOnlineTotal = () => {
    // Calculate total from regular online payment transactions
    const onlineTotal = receivesData
      .filter((row) => row.payment_type === "online")
      .reduce((sum, row) => sum + parseFloat(row.cash_amount || 0), 0);

    // Calculate total from product transactions where linkable contains online payments
    const productOnlineTotal = receivesProData
      .filter((row) => {
        // Check if linkable is a BankLedger with online payment_type
        return (
          row.linkable_type === "App\\Models\\BankLedger" &&
          row.linkable?.payment_type === "online"
        );
      })
      .reduce((sum, row) => sum + parseFloat(row.total_amount || 0), 0);

    // Return the combined total
    return (onlineTotal + productOnlineTotal).toFixed(2);
  };

  const getPaymentTypeChip = (type) => {
    return (
      <Chip
        label={type}
        color={type === "cash" ? "success" : "primary"}
        size="small"
        variant="outlined"
      />
    );
  };

  const getEntryTypeChip = (type) => {
    return (
      <Chip
        label={type}
        color={type === "cr" ? "success" : "error"}
        size="small"
        variant="outlined"
      />
    );
  };

  // Helper function to determine payment type display for product entries
  const getProductPaymentTypeDisplay = (row) => {
    if (row.linkable_type === "App\\Models\\BankLedger") {
      return getPaymentTypeChip(row.linkable?.payment_type || "cash");
    }
    return getEntryTypeChip(row.Receives_entry_type);
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
          {/* Summary Cards with Skeletons */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              {
                title: "Cash Total",
                icon: FaMoneyBillWave,
                color: "success.main",
              },
              {
                title: "Online Total",
                icon: FaUniversity,
                color: "primary.main",
              },
            ].map((card, index) => (
              <Grid item xs={12} md={6} key={index}>
                <TotalCard>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      <card.icon color={card.color} size={24} />
                      <Typography variant="h6" component="div">
                        {card.title}
                      </Typography>
                    </Box>
                    {loading ? (
                      <Skeleton
                        variant="rectangular"
                        width={100}
                        height={40}
                        sx={{ mt: 2 }}
                      />
                    ) : (
                      <Typography
                        variant="h4"
                        sx={{ mt: 2, color: card.color }}
                      >
                        {card.title === "Cash Total"
                          ? calculateCashTotal()
                          : calculateOnlineTotal()}
                      </Typography>
                    )}
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
                  {[
                    "Sr No",
                    "Reciever Name",
                    "Payment Type",
                    "Person / Product",
                    "Description",
                    "Bank",
                    "Cheque No",
                    "Amount",
                    "Balance",
                  ].map((head, index) => (
                    <StyledTableCell
                      key={index}
                      align={index >= 6 ? "right" : "left"}
                    >
                      {head}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <StyledTableRow key={index}>
                      {Array.from({ length: 8 }).map((_, colIndex) => (
                        <StyledTableCell key={colIndex}>
                          <Skeleton variant="text" width="80%" />
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  ))
                ) : (
                  <>
                    {/* Regular payment data */}
                    {receivesData.map((row, index) => (
                      <StyledTableRow key={`payment-${row.id}`}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>
                          {row.user?.name || "Admin"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {getPaymentTypeChip(row.payment_type)}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.customer?.person_name || "N/A"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.description || "N/A"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.bank?.bank_name || "N/A"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.cheque_no || "N/A"}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {parseFloat(row.cash_amount).toFixed(2)}
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
                      <StyledTableRow key={`product-${row.id}`}>
                        <StyledTableCell>
                          {receivesData.length + index + 1}
                        </StyledTableCell>
                        <StyledTableCell>
                          {getProductPaymentTypeDisplay(row)}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row?.product?.product_name || "N/A"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.description || "N/A"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.linkable_type === "App\\Models\\BankLedger"
                            ? "Bank Entry"
                            : "N/A"}
                        </StyledTableCell>
                        <StyledTableCell>
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
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default Page;
