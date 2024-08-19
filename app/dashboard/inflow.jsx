import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Buttons from "../../components/buttons";
import styles from "../../styles/dashboard.module.css";

const Inflow = () => {
  return (
    <div>
      <Buttons leftSectionText="Amount Receives" addButtonLink="/" />

      <TableContainer component={Paper} className={styles.tableSection}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr.</TableCell>
              <TableCell>Payment Type</TableCell>
              <TableCell>Person</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell> Cash </TableCell>
              <TableCell> Aqib </TableCell>
              <TableCell> Test </TableCell>
              <TableCell> $20.00 </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div className={styles.tableTotalRow}>Total: $20</div>
    </div>
  );
};

export default Inflow;
