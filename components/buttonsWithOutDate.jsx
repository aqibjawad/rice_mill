import React from "react";
import { Grid, Typography, Button, Box, styled, Paper } from "@mui/material";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import DateFilter from "./generic/DateFilter";

// Styled components
const HeaderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  fontSize: "1.5rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.25rem",
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

const ButtonsWithOutDate = ({ leftSectionText, addButtonLink }) => {
  return (
    <HeaderPaper elevation={1}>
      <Grid container spacing={2} alignItems="center">
        {/* Left section with title */}
        <Grid item xs={12} md={4}>
          <PageTitle variant="h5">{leftSectionText}</PageTitle>
        </Grid>

        {/* Right section with buttonsWithOutDate */}
        <Grid item xs={12} md={8}>
          <Box
            display="flex"
            justifyContent={{ xs: "flex-start", md: "flex-end" }}
            alignItems="center"
            gap={2}
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              width: "100%",
            }}
          >
            <Link href={addButtonLink} style={{ textDecoration: "none" }}>
              <AddButton variant="contained" startIcon={<FaPlus />}>
                Add New
              </AddButton>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </HeaderPaper>
  );
};

export default ButtonsWithOutDate;
