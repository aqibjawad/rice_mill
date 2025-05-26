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
import { party } from "../../networkApi/Constants";
import APICall from "@/networkApi/APICall";
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
        item.person_name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.getDataWithToken(party);
      const data = response.data;

      if (Array.isArray(data)) {
        setTableData(data);
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
                      <StyledTableCell>{row.contact || "N/A"}</StyledTableCell>
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
