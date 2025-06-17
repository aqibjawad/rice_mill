"use client";

import React, { useState, useEffect } from "react";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Card,
  Box,
  Button,
  tableCellClasses,
  styled,
} from "@mui/material";
import AddBuyer from "../../components/stock/addBuyer";
import { useGetpartiesQuery } from "@/src/store/partyApi"; // Import the Redux hook
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";

import SearchInput from "@/components/generic/searchInput";

import { useRouter } from "next/navigation";

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

const Page = () => {
  const router = useRouter();

  // Redux RTK Query hook
  const {
    data: apiResponse,
    error: apiError,
    isLoading,
    refetch,
  } = useGetpartiesQuery();

  const [open, setOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Permission states
  const [permissions, setPermissions] = useState({
    canAddParty: false,
    canViewParty: false,
    hasAccess: false,
  });

  // Extract table data from Redux response
  const tableData = apiResponse?.data || [];
  const error = apiError?.message || null;

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(tableData);
    } else {
      const filtered = tableData.filter((item) =>
        item.person_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, tableData]);

  const checkPermissions = () => {
    try {
      const storedPermissions = localStorage.getItem("permissions");

      if (storedPermissions) {
        const parsedPermissions = JSON.parse(storedPermissions);

        // Find Party module permissions
        let canAddParty = false;
        let canViewParty = false;

        if (
          parsedPermissions.modules &&
          Array.isArray(parsedPermissions.modules)
        ) {
          const PartyModule = parsedPermissions.modules.find(
            (module) => module.parent === "Party" || module.name === "Party"
          );

          if (PartyModule && PartyModule.permissions) {
            canAddParty = PartyModule.permissions.includes("Add Party");
            canViewParty = PartyModule.permissions.includes("View Party");
          }
        }

        setPermissions({
          canAddParty,
          canViewParty,
          hasAccess: canAddParty || canViewParty,
        });
      } else {
        // No permissions found - default behavior
        setPermissions({
          canAddParty: true,
          canViewParty: true,
          hasAccess: true,
        });
      }
    } catch (error) {
      console.error("Error parsing permissions:", error);
      // Default to showing all on error
      setPermissions({
        canAddParty: true,
        canViewParty: true,
        hasAccess: true,
      });
    }
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setEditingData(null);
    // Use refetch instead of fetchData
    refetch();
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleViewDetails = (id) => {
    localStorage.setItem("partyId", id);
    router.push("/partyLedger");
  };

  // Show error message if API call fails
  if (apiError) {
    console.error("Party API Error:", apiError);
  }

  return (
    <div>
      <Box sx={{ p: 3 }}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Left Section */}
          <Grid item xs={12} md={4} lg={6}>
            <Box sx={{ fontSize: "24px", fontWeight: 600 }}>Party</Box>
          </Grid>

          {/* Right Section */}
          <Grid item xs={12} md={8} lg={6}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="flex-end"
            >
              {/* Search Input */}
              <Grid item xs={6} sm={6} md={8} lg={8}>
                <SearchInput
                  placeholder="Search by person name"
                  value={searchQuery}
                  onSearch={handleSearch}
                />
              </Grid>

              {permissions.canAddParty && (
                <Grid item xs={6} sm={6} md={4} lg={4}>
                  <AddButton
                    onClick={handleOpen}
                    variant="contained"
                    startIcon={<FaPlus />}
                  >
                    Add New
                  </AddButton>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>

        {permissions.canViewParty && (
          <TableContainer className="mt-5" component={Paper} elevation={3}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Sr No</StyledTableCell>
                  <StyledTableCell>Person Name</StyledTableCell>
                  <StyledTableCell>Contact</StyledTableCell>
                  <StyledTableCell>Address</StyledTableCell>
                  <StyledTableCell>Balance</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading
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
                        <StyledTableCell>
                          <Skeleton variant="text" width={120} />
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <Skeleton variant="text" width={80} />
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <Skeleton
                            variant="rectangular"
                            width={50}
                            height={25}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  : filteredData.map((row, index) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{row.person_name}</StyledTableCell>
                        <StyledTableCell>
                          {row.contact || "N/A"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.address || "N/A"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            color:
                              parseFloat(row.balance) < 0
                                ? "error.main"
                                : "success.main",
                            fontWeight: "bold",
                          }}
                        >
                          {row.current_balance}
                        </StyledTableCell>
                        <StyledTableCell>
                          <div
                            style={{
                              color: "#316AFF",
                              fontSize: "15px",
                              marginTop: "1rem",
                            }}
                          >
                            <Button onClick={() => handleViewDetails(row.id)}>
                              View Details
                            </Button>
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Show error message if needed */}
        {error && !isLoading && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "error.light", borderRadius: 1 }}>
            <Box sx={{ color: "error.contrastText" }}>
              Error loading parties: {error}
            </Box>
          </Box>
        )}
      </Box>

      {permissions.canAddParty && (
        <AddBuyer
          open={open}
          handleClose={handleClose}
          editData={editingData}
        />
      )}
    </div>
  );
};

export default Page;
