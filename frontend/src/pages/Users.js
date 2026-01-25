import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import * as api from "../api/client";
import { Box, Typography, Container, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
export const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetchUsers();
    }, []);
    const fetchUsers = async () => {
        try {
            const response = await api.listUsers();
            setUsers(response.payload.data || []);
            setLoading(false);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load users');
            setLoading(false);
        }
    };
    if (loading) {
        return _jsx(Box, { sx: { p: 3, display: 'flex', justifyContent: 'center' }, children: _jsx(CircularProgress, {}) });
    }
    if (error) {
        return _jsx(Box, { sx: { p: 3 }, children: _jsxs(Typography, { color: "error", children: ["Error: ", error] }) });
    }
    return (_jsxs(Container, { maxWidth: "md", sx: { py: 3 }, children: [_jsxs(Typography, { variant: "h4", sx: { mb: 3 }, children: ["Users (", users.length, ")"] }), _jsx(List, { children: users.map(user => (_jsx(ListItem, { children: _jsx(ListItemText, { primary: user.username, secondary: `ID: ${user.user_id} | Joined: ${new Date(user.created_at).toLocaleDateString()}` }) }, user.user_id))) })] }));
};
