import React from "react";

import styles from "../styles/header.module.css"

const Header = () => {
    return (
        <div className={styles.header}>
            <div className='' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, marginRight: '10px' }}>
                    <div className={styles.userName}>
                        Ghulam Bari
                    </div>

                    <div className={styles.userEmail}>
                        Ghulam Bari@gmail.com
                    </div>
                </div>

                <div style={{ flex: 1, marginRight: '30rem' }}>
                    <div className={styles.companyName}>
                        Ghulam Bari Rice Mill
                    </div>
                </div>

                <div>
                    <div className={styles.logoutBtn}>
                        Logout
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Header