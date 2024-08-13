import React from "react";
import { Grid } from "@mui/material";

import styles from "../styles/login.module.css";

import InputWithTitle from "@/components/generic/InputWithTitle";

const Home = () => {
  return (
    <div>
      <Grid container spacing={2} className={styles.Maincontainer}>
        <Grid item xs={12} sm={6} md={4} lg={6}>
          <div className={styles.loginImageContainer}>
            <img className={styles.loginImage} src="/loginImage.png" alt="Login Background" />
            <div>
              <img className={styles.logoCont} src="/logo.png" />
            </div>
            <div className={styles.overlayText}>
               Ghulam Bari Rice Mill
            </div>
            <div className={styles.text2}>
              Where quality meets tradition, delivering excellence in every grain
            </div>
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={6}>
          <div className={styles.formSec}>
            <div className={styles.signIn}>
              Sign in
            </div>

            <div>
              <InputWithTitle title={"User name or email address"} />
            </div>

            <div>
              <InputWithTitle title={"Your password"} />
            </div>

            <div className={styles.signinBtn}>
              Sign In
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Home