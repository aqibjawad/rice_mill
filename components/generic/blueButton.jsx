import React from "react";

import styles from "../../styles/generic/inputStyles.module.css";

const BlueButton = ({ children, ...rest }) => {
  return (
    <>
      <div {...rest} className={styles.buttonContainer}>
          {children}
      </div>
    </> 
  );
};

export default BlueButton;
