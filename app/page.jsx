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
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const api = new APICall();

  const makeLoginCall = async () => {
    if (!sendingData) {
      if (formData.email === "") {
        showErrorAlert("Please enter your email");
      } else if (formData.password === "") {
        showErrorAlert("Please enter your password");
      } else {
        setSendingData(true);

        const response = await api.postFormData(login, formData);
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
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      makeLoginCall();
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
                name="email"
                onChange={handleInputChange}
                placeholder="Enter your Email"
                title={"User name or email address"}
                value={formData.email}
              />
            </div>

            <div>
              <InputWithTitle
                name="password"
                onChange={handleInputChange}
                placeholder="Please enter Password"
                type={"password"}
                title={"Your password"}
                onKeyDown={handleKeyDown}
                value={formData.password}
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
