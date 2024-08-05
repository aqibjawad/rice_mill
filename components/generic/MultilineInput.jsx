import React from "react";
import styles from "../../styles/generic/inputStyles.module.css";
const MultilineInput = ({ title, ...rest }) => {
  return (
    <div className="w-full ">
      <div className={styles.title}>{title}</div>
      <div className={styles.multilineContainer}>
        <textarea className={`w-full ${styles.inputField}`} {...rest} />
      </div>
    </div>
  );
};

export default MultilineInput;
