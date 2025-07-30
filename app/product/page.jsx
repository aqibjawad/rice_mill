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
import { MdDelete, MdEdit } from "react-icons/md";
import AddProduct from "../../components/stock/addProduct";
import Swal from "sweetalert2";
import Link from "next/link";
// Import Redux hooks and API
import { useGetproductsQuery } from "../../src/store/productsApi";

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
  const [open, setOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  // Permission states
  const [permissions, setPermissions] = useState({
    canAddProducts: false,
    canViewProducts: false,
    hasAccess: false,
  });

  // Redux Query Hook - only call if user has view permission
  const {
    data: productsData,
    error,
    isLoading,
    refetch,
  } = useGetproductsQuery(undefined, {
    skip: !permissions.canViewProducts, // Skip query if no view permission
  });

  // Extract table data from Redux response
  const tableData = productsData?.data || [];

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingData(null);
    if (permissions.canViewProducts) {
      refetch(); // Refresh data using Redux refetch
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

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

  const handleDelete = async (id) => {
    if (!permissions.canAddProducts) {
      Swal.fire({
        title: "Permission Denied!",
        text: "You dont have permission to delete products.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      // You'll need to create a delete mutation in your productsApi
      // For now, using the original API call method
      const api = new (await import("../../networkApi/APICall")).default();
      await api.deleteDataWithToken(`/product/${id}`, {
        method: "DELETE",
      });

      // Refetch data after successful delete
      refetch();

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
                  <StyledTableCell>View</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
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
                      Error: {error.message || "Failed to load products"}
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
