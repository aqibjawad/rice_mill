import React from "react";
import styles from "../../styles/generic/inputStyles.module.css";

const InputWithTitle = ({
  title,
  children,
  ...rest
}) => {
  return (
    <div className="w-full ">
      <div className={styles.title}>{title}</div>
      <div className={styles.inputContainer}>
        {children ? (
          children
        ) : (
          <input
            className={`w-full ${styles.inputField}`}
            {...rest}
          />
        )}
      </div>
    </div>
  );
};

export default InputWithTitle;
