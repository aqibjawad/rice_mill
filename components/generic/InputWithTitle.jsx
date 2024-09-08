import React from "react";
import styles from "../../styles/generic/inputStyles.module.css";

const InputWithTitle = ({ title, onEnterPress, ...rest }) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      alert("Hello");
      // onEnterPress();
    }
  };
  return (
    <div className="w-full ">
      <div className={styles.title}>{title}</div>
      <div className={styles.inputContainer}>
        <input
          onKeyDown={handleKeyDown}
          className={`w-full ${styles.inputField}`}
          {...rest}
        />
      </div>
    </div>
  );
};

export default InputWithTitle;
