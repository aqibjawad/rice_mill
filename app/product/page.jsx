"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/product.module.css";
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
  IconButton,
  Box,
  Button,
  tableCellClasses,
  styled,
} from "@mui/material";
import { products } from "../../networkApi/Constants";
import { MdDelete, MdEdit } from "react-icons/md";
import AddProduct from "../../components/stock/addProduct";
import APICall from "../../networkApi/APICall";
import Swal from "sweetalert2";
import Link from "next/link";

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
  const api = new APICall();
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingData, setEditingData] = useState(null);

  // Permission states
  const [permissions, setPermissions] = useState({
    canAddProducts: false,
    canViewProducts: false,
    hasAccess: false,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingData(null);
    if (permissions.canViewProducts) {
      fetchData(); // Refresh the data after closing the modal
    }
  };

  const handleEdit = (row) => {
    if (!permissions.canAddProducts) {
      console.warn("No permission to edit products");
      return;
    }
    setEditingData(row);
    setOpen(true);
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    if (permissions.canViewProducts) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [permissions.canViewProducts]);

  const checkPermissions = () => {
    try {
      const storedPermissions = localStorage.getItem("permissions");

      if (storedPermissions) {
        const parsedPermissions = JSON.parse(storedPermissions);

        // Find Products module permissions
        let canAddProducts = false;
        let canViewProducts = false;

        if (
          parsedPermissions.modules &&
          Array.isArray(parsedPermissions.modules)
        ) {
          const productsModule = parsedPermissions.modules.find(
            (module) =>
              module.parent === "Products" || module.name === "Products"
          );

          if (productsModule && productsModule.permissions) {
            canAddProducts =
              productsModule.permissions.includes("Add Products");
            canViewProducts =
              productsModule.permissions.includes("View Products");
          }
        }

        setPermissions({
          canAddProducts,
          canViewProducts,
          hasAccess: canAddProducts || canViewProducts,
        });

        // If user has no products permissions at all, redirect or show error
        if (!canAddProducts && !canViewProducts) {
          console.warn("No products permissions found");
          // Optional: redirect to unauthorized page
          // router.push("/unauthorized");
        }
      } else {
        // No permissions found - default behavior
        setPermissions({
          canAddProducts: true,
          canViewProducts: true,
          hasAccess: true,
        });
      }
    } catch (error) {
      console.error("Error parsing permissions:", error);
      // Default to showing all on error
      setPermissions({
        canAddProducts: true,
        canViewProducts: true,
        hasAccess: true,
      });
    }
  };

  const fetchData = async () => {
    if (!permissions.canViewProducts) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.getDataWithToken(products);
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

  const handleDelete = async (id) => {
    if (!permissions.canAddProducts) {
      Swal.fire({
        title: "Permission Denied!",
        text: "You don't have permission to delete products.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      await api.deleteDataWithToken(`${products}/${id}`, {
        method: "DELETE",
      });

      setTableData((prevData) => prevData.filter((item) => item.id !== id));

      Swal.fire({
        title: "Deleted!",
        text: "The Product item has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error deleting product:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to delete the product item.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Handle Add Product with permission check
  const handleOpenWithPermission = () => {
    if (permissions.canAddProducts) {
      handleOpen();
    } else {
      console.warn("No permission to add products");
    }
  };

  // If user has no access to products at all
  if (!permissions.hasAccess) {
    return (
      <div>
        <Box sx={{ p: 3 }}>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h3>Access Denied</h3>
            <p>You don't have permission to access Products module.</p>
          </div>
        </Box>
      </div>
    );
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
            <Box sx={{ fontSize: "24px", fontWeight: 600 }}>Products</Box>
          </Grid>

          {/* Right Section - Show Add button only if user has Add Products permission */}
          {permissions.canAddProducts && (
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
                    onClick={handleOpenWithPermission}
                  >
                    + Add
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>

        {/* Show table only if user has View Products permission */}
        {permissions.canViewProducts && (
          <TableContainer className="mt-5" component={Paper} elevation={3}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Sr No</StyledTableCell>
                  <StyledTableCell>Product Name</StyledTableCell>
                  <StyledTableCell>Weight in Stock</StyledTableCell>
                  <StyledTableCell>Balance</StyledTableCell>
                  {permissions.canAddProducts && (
                    <StyledTableCell>Action</StyledTableCell>
                  )}
                  <StyledTableCell>View</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, index) => (
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
                      {permissions.canAddProducts && (
                        <StyledTableCell>
                          <Skeleton variant="text" width={150} />
                        </StyledTableCell>
                      )}
                      <StyledTableCell>
                        <Skeleton variant="text" width={150} />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : error ? (
                  <StyledTableRow>
                    <StyledTableCell
                      colSpan={permissions.canAddProducts ? 6 : 5}
                      style={{ textAlign: "center" }}
                    >
                      Error: {error}
                    </StyledTableCell>
                  </StyledTableRow>
                ) : tableData.length === 0 ? (
                  <StyledTableRow>
                    <StyledTableCell
                      colSpan={permissions.canAddProducts ? 6 : 5}
                      style={{ textAlign: "center" }}
                    >
                      No products data available
                    </StyledTableCell>
                  </StyledTableRow>
                ) : (
                  tableData.map((row, index) => {
                    const stock = row.company_product_stocks?.[0] || {}; // Stock ka pehla element ya empty object
                    return (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{row.product_name}</StyledTableCell>
                        <StyledTableCell>
                          {stock.remaining_weight || "N/A"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {stock.balance || "N/A"}
                        </StyledTableCell>
                        {permissions.canAddProducts && (
                          <StyledTableCell>
                            <IconButton
                              onClick={() => handleDelete(row.id)}
                              color="error"
                              disabled={!permissions.canAddProducts}
                            >
                              <MdDelete />
                            </IconButton>
                          </StyledTableCell>
                        )}
                        <StyledTableCell>
                          {permissions.canViewProducts ? (
                            <Link href={`/productDetails/?id=${row.id}`}>
                              View Details
                            </Link>
                          ) : (
                            <span style={{ color: "#ccc" }}>View Details</span>
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Only render AddProduct modal if user has add permission */}
      {permissions.canAddProducts && (
        <AddProduct
          open={open}
          handleClose={handleClose}
          editData={editingData}
        />
      )}
    </div>
  );
};

export default Page;
