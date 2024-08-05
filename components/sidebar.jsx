import React, { useState } from "react";
import styles from "../styles/sidebar.module.css";
import Link from "next/link";

const SideBar = () => {
    const [activeItem, setActiveItem] = useState('Dashboard');

    const menuItems = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'In Flow', href: '/inflow' },
        { name: 'Out Flow', href: '/outflow' },
        { name: 'Ledger', href: '/ledger' },
        { name: 'Stock', href: '/stock' },
    ];

    return (
        <div className={styles.sideBarComp}>
            {menuItems.map((item, index) => (
                <Link href={item.href}>

                    <div
                        key={index}
                        className={`${styles.sideBarText} ${activeItem === item.name ? styles.active : ''}`}
                        onClick={() => setActiveItem(item.name)}
                        style={index === 0 ? { marginTop: "5rem" } : {}}
                    >
                        {item.name}
                    </div>
                </Link>

            ))}
        </div>
    );
}

export default SideBar;
