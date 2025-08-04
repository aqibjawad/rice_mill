"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/ledger.module.css";
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
  tableCellClasses,
  styled,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import AddInvestor from "../../components/stock/addInvestor";
import { useRouter } from "next/navigation";
import { FaMoneyBillWave, FaUniversity } from "react-icons/fa";
import Link from "next/link";

// Import Redux RTK Query hook
import { useGetinvestorsQuery } from "../../src/store/investorsApi";

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
  // hide last border
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
  const router = useRouter();

  // Redux RTK Query hooks
  const {
    data: investorsData,
    error: apiError,
    isLoading,
    refetch,
  } = useGetinvestorsQuery();

  const [editingData, setEditingData] = useState(null);
  const [open, setOpen] = useState(false);

  // Permission states
  const [permissions, setPermissions] = useState({
    canAddInvestor: false,
    canViewInvestor: false,
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

        // Find Investor module permissions
        let canAddInvestor = false;
        let canViewInvestor = false;

        if (
          parsedPermissions.modules &&
          Array.isArray(parsedPermissions.modules)
        ) {
          const InvestorModule = parsedPermissions.modules.find(
            (module) =>
              module.parent === "Investor" || module.name === "Investor"
          );

          if (InvestorModule && InvestorModule.permissions) {
            canAddInvestor =
              InvestorModule.permissions.includes("Add Investor");
            canViewInvestor =
              InvestorModule.permissions.includes("View Investor");
          }
        }

        setPermissions({
          canAddInvestor,
          canViewInvestor,
          hasAccess: canAddInvestor || canViewInvestor,
        });
      } else {
        // No permissions found - default behavior
        setPermissions({
          canAddInvestor: true,
          canViewInvestor: true,
          hasAccess: true,
        });
      }
    } catch (error) {
      console.error("Error parsing permissions:", error);
      // Default to showing all on error
      setPermissions({
        canAddInvestor: true,
        canViewInvestor: true,
        hasAccess: true,
      });
    }
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setEditingData(null);
    // Refetch data after closing modal (in case data was added/updated)
    refetch();
  };

  // Extract table data from Redux response and sort alphabetically by person_name
  const tableData = Array.from(investorsData?.data || []).sort((a, b) => {
    const nameA = (a.person_name || "").toLowerCase();
    const nameB = (b.person_name || "").toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // Calculate total balance
  const totalBalance = tableData.reduce(
    (total, row) => total + parseFloat(row.current_balance || 0),
    0
  );

  const AddButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    textTransform: "none",
    minWidth: "120px",
    height: "40px",
    marginRight: theme.spacing(2),
  }));

  // Show loading state
  if (isLoading && permissions.canViewInvestor) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Show error state
  if (apiError && permissions.canViewInvestor) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading investors:{" "}
          {apiError?.data?.message || apiError?.message || "Unknown error"}
        </Alert>
        <Button variant="contained" onClick={refetch}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <div>
      <Box sx={{ p: 3 }}>
        <div className={styles.container}>
          <div className={styles.leftSection}>Investors</div>

          {permissions.canAddInvestor && (
            <AddButton
              onClick={handleOpen}
              variant="contained"
              startIcon={<FaPlus />}
            >
              Add New
            </AddButton>
          )}
        </div>

        {permissions.canViewInvestor && (
          <>
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <TotalCard>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      <FaMoneyBillWave color="#2e7d32" size={24} />
                      <Typography variant="h6" component="div">
                        Total Balance
                      </Typography>
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{ mt: 2, color: "success.main" }}
                    >
                      {totalBalance.toLocaleString()}
                    </Typography>
                  </CardContent>
                </TotalCard>
              </Grid>
            </Grid>

            {/* Main Table */}
            <TableContainer component={Paper} elevation={3}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Sr No</StyledTableCell>
                    <StyledTableCell>Person Name</StyledTableCell>
                    <StyledTableCell>Contact</StyledTableCell>
                    <StyledTableCell>Firm Name</StyledTableCell>
                    <StyledTableCell>Balance</StyledTableCell>
                    <StyledTableCell>View Details</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.length === 0 ? (
                    <StyledTableRow>
                      <StyledTableCell colSpan={6} align="center">
                        <Typography variant="body1" sx={{ py: 4 }}>
                          No investors found
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    tableData.map((row, index) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{row.person_name}</StyledTableCell>
                        <StyledTableCell>
                          {row.customer?.contact || "N/A"}
                        </StyledTableCell>
                        <StyledTableCell>{row.firm_name}</StyledTableCell>
                        <StyledTableCell
                          sx={{
                            color:
                              parseFloat(row.current_balance || 0) < 0
                                ? "error.main"
                                : "success.main",
                            fontWeight: "bold",
                          }}
                        >
                          {parseFloat(
                            row.current_balance || 0
                          ).toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Link href={`/investor_ledger/?id=${row.id}`}>
                            View Details
                          </Link>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {!permissions.hasAccess && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Alert severity="warning">
              You dont have permission to view investors data.
            </Alert>
          </Box>
        )}
      </Box>

      {permissions.canAddInvestor && (
        <AddInvestor
          open={open}
          handleClose={handleClose}
          editData={editingData}
        />
      )}
    </div>
  );
};

export default Page;
