import React from "react";

import styles from "../styles/buttons.module.css";

import { Grid } from "@mui/material";

import Link from "next/link";

const Buttons = ({ leftSectionText, addButtonLink }) => {
  return (
    <Grid container spacing={2}>
      <Grid item lg={8} sm={12} xs={12} md={4}> 
        <div className={styles.leftSection}>{leftSectionText}</div>
      </Grid>
      <Grid item lg={4} sm={12} xs={12} md={8}>
        <div className={styles.rightSection}>
          <Grid container spacing={2}>

            <Grid lg={3} item xs={6} sm={6} md={3}>
              <Link href={addButtonLink}>
                <div className={styles.rightItem}>Add</div>
              </Link>
            </Grid>

            <Grid lg={3} item xs={6} sm={6} md={3}>
              <div className={styles.rightItem}>date</div>
            </Grid>

            <Grid item lg={3} xs={6} sm={6} md={3}>
              <div className={styles.rightItem}>view</div>
            </Grid>

            <Grid item lg={3} xs={6} sm={6} md={3}>
              <div className={styles.rightItemExp}>export</div>
            </Grid>

          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};

export default Buttons;
