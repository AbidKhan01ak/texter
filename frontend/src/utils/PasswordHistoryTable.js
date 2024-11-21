import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const PasswordHistoryTable = ({ passwordHistory }) => {
    return (
        <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650, width: '100%' }} aria-label="password history table">
                <TableHead>
                    <TableRow>
                        <TableCell>Date & Time</TableCell>
                        <TableCell align="center">Password</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {passwordHistory.map((record, index) => (
                        <TableRow key={index}>
                            <TableCell component="th" scope="row">
                                {record.generated_at}
                            </TableCell>
                            <TableCell align="center">{record.password}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PasswordHistoryTable;
