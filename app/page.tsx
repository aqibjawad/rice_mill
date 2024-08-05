import React from "react";
import styles from "../styles/login.module.css";
import InputWithTitle from "../components/generic/InputWithTitle"

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.logoSection}>
          <img className={styles.logo} src="/logo.png" alt="Company Logo" />
          <div className={styles.companyName}>
            Ghulam Bari Rice Mill
          </div>
          <div className={styles.companyHeadLine}>
            Where quality meets tradition, <br /> delivering excellence in every <br /> grain
          </div>
        </div>
        <div className={styles.imageSection}>
          <img className={styles.image2} src="/Rectangle 3.png" alt="Company Image" />
        </div>
      </div>
      <div className={styles.rightSecLogin}>
        <div className={styles.overlay}>
          <img className={styles.logo} src="/logo.png" alt="Company Logo" />
          <div className={styles.welcome}>
            Welcome !
          </div>
          <div className={styles.welcomeLine}>
            Please enter your credentials to login.
          </div>
          <div className={styles.inputField}>
            <InputWithTitle
              title="Email"
              type="text"
              placeholder="Email"
              name="email"
            />
          </div>
          <div className={styles.inputField}>
            <InputWithTitle
              title="Password"
              type="password"
              placeholder="Password"
              name="password"
            />
          </div>
        </div>
      </div>
    </div>
  );
}