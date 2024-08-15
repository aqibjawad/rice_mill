"use client";
import React, { useState } from "react";
import { CircularProgress, Grid } from "@mui/material";
import styles from "../styles/login.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import { login } from "@/networkApi/Constants";
import APICall from "@/networkApi/APICall";
import Swal from "sweetalert2";
import { showErrorAlert } from "../networkApi/Helper";
import User from "@/networkApi/user";
import { useRouter } from "next/navigation";
const Home = () => {
  const router = useRouter();
  const [sendingData, setSendingData] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const api = new APICall();

  const makeLoginCall = async () => {
    if (!sendingData) {
      if (userEmail === "") {
        showErrorAlert("Please enter your email");
      } else if (userPassword === "") {
        showErrorAlert("Please enter your password");
      } else {
        setSendingData(true);
        const obj = {
          email: userEmail,
          password: userPassword,
        };

        try {
          const response = await api.postFormData(login, obj);
          console.log(response); 

          setSendingData(false);
          if (response.status === "success") {
            const userData = {
              user: response.admin,
              access_token: response.token,
            };
            const user = new User(userData);
            router.replace("/dashboard");
          } else {
            showErrorAlert("Could not login, Please contact Support");
          }
        } catch (error) {
          console.error("Login error:", error);
          setSendingData(false);
          showErrorAlert("An error occurred, please try again.");
        }
      }
    }
  };


  return (
    <div>
      <Grid container spacing={2} className={styles.Maincontainer}>
        <Grid item xs={12} sm={6} md={4} lg={6}>
          <div className={styles.loginImageContainer}>
            <img
              className={styles.loginImage}
              src="/loginImage.png"
              alt="Login Background"
            />
            <div>
              <img className={styles.logoCont} src="/logo.png" />
            </div>
            <div className={styles.overlayText}>Ghulam Bari Rice Mill</div>
            <div className={styles.text2}>
              Where quality meets tradition, delivering excellence in every
              grain
            </div>
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={6}>
          <div className={styles.formSec}>
            <div className={styles.signIn}>Sign in</div>

            <div>
              <InputWithTitle
                type={"text"}
                onChange={setUserEmail}
                placeholder="Enter your Email"
                title={"User name or email address"}
                value={userEmail}
              />
            </div>

            <div>
              <InputWithTitle
                onChange={setUserPassword}
                placeholder="Please enter Password"
                type={"text"}
                title={"Your password"}
                value={userPassword}
              />
            </div>

            <div
              onClick={() => {
                makeLoginCall();
              }}
              className={styles.signinBtn}
            >
              {sendingData ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Sign In"
              )}
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
