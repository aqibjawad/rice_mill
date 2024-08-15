"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/packing.module.css";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { MdDelete, MdEdit } from "react-icons/md";
import AddPacking from "../../components/stock/addPacking";
import { packings } from "../../networkApi/Constants";
import APICall from "../../networkApi/APICall";

import Swal from 'sweetalert2';

import Link from "next/link";

const Page = () => {

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.leftSection}>Sale</div>
        <div className={styles.rightSection}>
          <div className={styles.rightItemExp}>
            <Link href="/addSale">
                + Add
            </Link>
          </div>
          <div className={styles.rightItem}>date</div>
          <div className={styles.rightItem}>view all</div>
          <div className={styles.rightItemExp}>export</div>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr.</TableCell>
                <TableCell>Packing Weight</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
    
          </Table>
        </TableContainer>
      </div>

    </div>
  );
};

export default Page;
