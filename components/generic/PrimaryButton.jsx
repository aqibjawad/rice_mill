import React from "react";
import styles from "../../styles/generic/primaryButtonStyles.module.css";

const PrimaryButton = ({ title, onClick }) => {
  return (
    <div onClick={onClick} className={styles.container}>
      {title}
    </div>
  );
};

export default PrimaryButton;
