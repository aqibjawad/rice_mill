import React from "react";
import styles from "../../styles/generic/inputStyles.module.css";

const InputWithTitle = ({ title, onChange, ...rest }) => {
  const handleChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
  };

  return (
    <div className="w-full">
      <div className={styles.title}>{title}</div>
      <div className={styles.inputContainer}>
        <input
          className={`w-full ${styles.inputField}`}
          onChange={handleChange}
          {...rest}
        />
      </div>
    </div>
  );
};

export default InputWithTitle;
