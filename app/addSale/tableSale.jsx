import React from "react";
import styles from "../../styles/addSale.module.css";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';

const TableSale = () => {
    // Sample data for the table
    const items = [
        { id: 1, name: "Item 1", quantity: 2, price: 100 },
        { id: 2, name: "Item 2", quantity: 1, price: 150 },
        { id: 3, name: "Item 3", quantity: 3, price: 200 },
    ];

    // Function to handle deletion
    const handleDelete = (id) => {
        console.log(`Delete item with id: ${id}`);
        // Implement your logic to remove the item from the list here
    };

    return (
        <div>
            <div className={styles.itemBill}>
                Items in Bill
            </div>
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell> Product </TableCell>
                            <TableCell> Packing </TableCell>
                            <TableCell> Quantity </TableCell>
                            <TableCell> Price </TableCell>
                            <TableCell> Amount </TableCell>
                            <TableCell> Action </TableCell>
                        </TableRow>

                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.price}</TableCell>
                                <TableCell>{item.price}</TableCell>
                                <TableCell>{item.quantity * item.price}</TableCell>

                            </TableRow>
                        ))}

                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell style={{fontSize:"20px"}}>Total: 25000</TableCell>

                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default TableSale;
