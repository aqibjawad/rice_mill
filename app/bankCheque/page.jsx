"use client";
import React, { useState, useEffect } from "react";
import styles from "../../styles/bankCheque.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Grid,
  Button,
  Box,
  styled,
  tableCellClasses,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useGetbanksQuery } from "@/src/store/banksApi";
import { AddBank } from "@/components/stock/addBank";

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

const Page = () => {
  const router = useRouter();

  const [openBank, setOpenBank] = useState(false);
  const handleOpenBank = () => setOpenBank(true);
  const handleCloseBank = () => setOpenBank(false);

  // Permission states
  const [permissions, setPermissions] = useState({
    canAddBanks: false,
    canViewBanks: false,
    hasAccess: false
  });

  // Redux Query Hook - only call if user has view permission
  const {
    data: banksResponse,
    error: banksError,
    isLoading: banksLoading,
    refetch: refetchBanks
  } = useGetbanksQuery(undefined, {
    skip: !permissions.canViewBanks, // Skip query if no view permission
  });

  // Extract data from the response
  const tableData = banksResponse?.data || [];
  const loading = banksLoading;
  const error = banksError?.data?.message || banksError?.error || (banksError ? "Failed to fetch banks data" : null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = () => {
    try {
      const storedPermissions = localStorage.getItem("permissions");
      
      if (storedPermissions) {
        const parsedPermissions = JSON.parse(storedPermissions);
        
        // Find Banks module permissions
        let canAddBanks = false;
        let canViewBanks = false;
        
        if (parsedPermissions.modules && Array.isArray(parsedPermissions.modules)) {
          const banksModule = parsedPermissions.modules.find(
            module => module.parent === "Banks" || module.name === "Banks"
          );
          
          if (banksModule && banksModule.permissions) {
            canAddBanks = banksModule.permissions.includes("Add Banks");
            canViewBanks = banksModule.permissions.includes("View Banks");
          }
        }
        
        setPermissions({
          canAddBanks,
          canViewBanks,
          hasAccess: canAddBanks || canViewBanks
        });
        
      } else {
        // No permissions found - default behavior
        setPermissions({
          canAddBanks: true,
          canViewBanks: true,
          hasAccess: true
        });
      }
    } catch (error) {
      console.error("Error parsing permissions:", error);
      // Default to showing all on error
      setPermissions({
        canAddBanks: true,
        canViewBanks: true,
        hasAccess: true
      });
    }
  };

  // Handle viewing bank details
  const handleViewDetails = (id) => {
    if (!permissions.canViewBanks) {
      console.warn("No permission to view bank details");
      return;
    }
    
    localStorage.setItem("selectedRowId", id);
    router.push("/bankDetails");
  };

  const handleViewLedger = (id) => {
    if (!permissions.canViewBanks) {
      console.warn("No permission to view bank ledger");
      return;
    }
    
    localStorage.setItem("selectedRowId", id);
    router.push("/bankLedger");
  };

  // Handle Add Bank with permission check
  const handleOpenBankWithPermission = () => {
    if (permissions.canAddBanks) {
      handleOpenBank();
    } else {
      console.warn("No permission to add banks");
    }
  };

  // Handle successful bank addition - refetch data
  const handleBankAdded = () => {
    refetchBanks();
    handleCloseBank();
  };

  // Show access denied message if user has no permissions
  if (!permissions.hasAccess) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          You dont have permission to access the this module.
        </Alert>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Left Section */}
          <Grid item xs={12} md={4} lg={6}>
            <Box sx={{ fontSize: "24px", fontWeight: 600 }}>Banks</Box>
          </Grid>

          {/* Right Section - Show Add button only if user has Add Banks permission */}
          {permissions.canAddBanks && (
            <Grid item xs={12} md={8} lg={6}>
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="flex-end"
              >
                {/* Add Button */}
                <Grid item xs={6} sm={6} md={4} lg={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: "20px",
                      fontWeight: "bold",
                      textTransform: "none",
                      height: "40px",
                    }}
                    onClick={handleOpenBankWithPermission}
                  >
                    + Add
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>

        {/* Show table only if user has View Banks permission */}
        {permissions.canViewBanks && (
          <>
            {/* Show error alert if there's an API error */}
            {error && (
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                Error loading banks data: {error}
                <Button 
                  size="small" 
                  onClick={() => refetchBanks()} 
                  sx={{ ml: 2 }}
                >
                  Retry
                </Button>
              </Alert>
            )}

            <TableContainer className="mt-5" component={Paper} elevation={3}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Sr No</StyledTableCell>
                    <StyledTableCell>Bank Name</StyledTableCell>
                    <StyledTableCell>Total Balance</StyledTableCell>
                    <StyledTableCell>View Ledger</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading
                    ? [...Array(5)].map((_, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>
                            <Skeleton variant="text" width={30} />
                          </StyledTableCell>
                          <StyledTableCell>
                            <Skeleton variant="text" width={120} />
                          </StyledTableCell>
                          <StyledTableCell>
                            <Skeleton variant="text" width={100} />
                          </StyledTableCell>
                          <StyledTableCell>
                            <Skeleton variant="text" width={150} />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    : error && !tableData.length
                    ? (
                        <StyledTableRow>
                          <StyledTableCell colSpan={4} style={{ textAlign: 'center' }}>
                            Unable to load banks data. Please try again.
                          </StyledTableCell>
                        </StyledTableRow>
                      )
                    : tableData.length === 0
                    ? (
                        <StyledTableRow>
                          <StyledTableCell colSpan={4} style={{ textAlign: 'center' }}>
                            No banks data available
                          </StyledTableCell>
                        </StyledTableRow>
                      )
                    : tableData.map((row, index) => (
                        <StyledTableRow key={row.id}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{row.bank_name}</StyledTableCell>
                          <StyledTableCell>{row.balance || "N/A"}</StyledTableCell>
                          <StyledTableCell>
                            <Button 
                              onClick={() => handleViewLedger(row.id)}
                              disabled={!permissions.canViewBanks}
                              variant="outlined"
                              size="small"
                            >
                              View Ledger
                            </Button>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>

      {/* Only render AddBank modal if user has add permission */}
      {permissions.canAddBanks && (
        <AddBank 
          openBank={openBank} 
          handleCloseBank={handleCloseBank}
          onBankAdded={handleBankAdded} // Pass callback to refresh data after adding
        />
      )}
    </>
  );
};

export default Page;