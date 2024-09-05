import React from "react";
import styles from "../styles/buttons.module.css";
import { Grid } from "@mui/material";
import Link from "next/link";
import DateFilter from "./generic/DateFilter";

const Buttons = ({ leftSectionText, addButtonLink, onDateChange }) => {
  return (
    <Grid container spacing={2}>
      <Grid item lg={8} sm={12} xs={12} md={4}>
        <div className={styles.leftSection}>{leftSectionText}</div>
      </Grid>
      <Grid item lg={4} sm={12} xs={12} md={8}>
        <div className={styles.rightSection}>
          <Grid container spacing={2}>
            <Grid lg={3} item xs={6} sm={6} md={6}>
              <Link href={addButtonLink}>
                <div className={styles.rightItem}>Add</div>
              </Link>
            </Grid>
            <Grid lg={3} item xs={6} sm={6} md={6}>
              <DateFilter onDateChange={onDateChange} /> {/* Use DateFilter */}
            </Grid>

          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};

export default Buttons;
