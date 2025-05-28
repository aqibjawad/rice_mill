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
  Switch,
  FormControlLabel,
  tableCellClasses,
  styled,
  IconButton,
} from "@mui/material";
import { user } from "../../networkApi/Constants";
import APICall from "@/networkApi/APICall";
import { FaPlus, FaEdit } from "react-icons/fa";

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

const StyledSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: theme.palette.success.main,
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: theme.palette.success.main,
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

const EditButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.light + "20",
  },
  "&:disabled": {
    color: theme.palette.grey[400],
    cursor: "not-allowed",
  },
}));

const Page = () => {
  const api = new APICall();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(tableData);
    } else {
      const filtered = tableData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, tableData]);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  // Add button redirect function
  const handleAddNew = () => {
    router.push("/permissions"); // Change this path to your desired route
  };

  // Handle Edit User - only allow if status is active
  const handleEditUser = (userData) => {
    if (userData.status !== "active") {
      alert("Only active users can be edited");
      return;
    }

    // Store user data in localStorage for the edit page
    localStorage.setItem(
      "editUserData",
      JSON.stringify({
        mode: "edit",
        userId: userData.id,
        userData: userData,
      })
    );

    // Navigate to permissions page in edit mode
    router.push(`/permissions?mode=edit&userId=${userData.id}`);
  };

  // Switch change handler
  const handleSwitchChange = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "deactivate" : "active";

      // Update local state immediately for better UX
      setTableData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );

      const response = await api.postFormDataWithToken(`${user}/${id}/status`, {
        newStatus,
      });
    } catch (error) {
      console.error("Error updating user status:", error);

      // Revert the change if API call fails
      setTableData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, status: currentStatus } : item
        )
      );
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.getDataWithToken(user);
      const data = response.data;

      if (Array.isArray(data)) {
        // Filter out user with ID 1 and set table data
        const filteredData = data.filter((item) => item.id !== 1);
        setTableData(filteredData);
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
            <Box sx={{ fontSize: "24px", fontWeight: 600 }}>User</Box>
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

              {/* Add Button */}
              <Grid item xs={6} sm={6} md={4} lg={4}>
                <AddButton
                  onClick={handleAddNew}
                  variant="contained"
                  startIcon={<FaPlus />}
                >
                  Add New
                </AddButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Main Table */}
        <TableContainer className="mt-5" component={Paper} elevation={3}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Sr No</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Update</StyledTableCell>
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
                        <Skeleton variant="text" width={150} />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Skeleton
                          variant="rectangular"
                          width={50}
                          height={25}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Skeleton variant="circular" width={40} height={40} />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                : filteredData.map((row, index) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{row.name}</StyledTableCell>
                      <StyledTableCell>{row.email || "N/A"}</StyledTableCell>
                      <StyledTableCell>
                        <FormControlLabel
                          control={
                            <StyledSwitch
                              checked={row.status === "active"}
                              onChange={() =>
                                handleSwitchChange(row.id, row.status)
                              }
                              name={`status-${row.id}`}
                            />
                          }
                          label={
                            row.status === "active" ? "Active" : "Inactive"
                          }
                          labelPlacement="start"
                          sx={{
                            margin: 0,
                            "& .MuiFormControlLabel-label": {
                              fontSize: "14px",
                              fontWeight: row.status === "active" ? 600 : 400,
                              color:
                                row.status === "active"
                                  ? "success.main"
                                  : "text.secondary",
                            },
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <EditButton
                          onClick={() => handleEditUser(row)}
                          disabled={row.status !== "active"}
                          title={
                            row.status === "active"
                              ? "Edit User"
                              : "Only active users can be edited"
                          }
                        >
                          <FaEdit />
                        </EditButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default Page;
