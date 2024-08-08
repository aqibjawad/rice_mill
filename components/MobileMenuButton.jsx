import React from 'react';
import styles from '../styles/sidebar.module.css';

const MobileMenuButton = ({ isOpen, onClick }) => {
  return (
    <button className={`${styles.mobileMenuButton} ${isOpen ? styles.open : ''}`} onClick={onClick}>
      <span className={styles.bar}></span>
      <span className={styles.bar}></span>
      <span className={styles.bar}></span>
    </button>
  );
};

export default MobileMenuButton;