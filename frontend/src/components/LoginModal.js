import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, Typography } from '@mui/material';
import * as api from '../api/client';
import { useUser } from '../context/UserContext';
export const LoginModal = ({ open }) => {
    const { setUser } = useUser();
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = username.trim();
        if (!name) {
            setError('Please enter a username.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            console.log('Logging in as:', name);
            // get all users
            const all = await api.listUsers();
            const users = all.payload.data || [];
            // check if user exists
            const existingUser = users.find((u) => u.username.toLowerCase() === name.toLowerCase());
            let user;
            if (existingUser) {
                console.log('User found');
                user = existingUser;
            }
            else {
                // create new user
                console.log('Creating new user');
                const created = await api.createUser(name, '');
                user = created.payload.data;
            }
            setUser(user);
        }
        catch (err) {
            console.log('Login error:', err);
            setError(err instanceof Error ? err.message : 'Something went wrong');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(Dialog, { open: open, fullWidth: true, maxWidth: "xs", children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(DialogTitle, { children: "Sign in" }), _jsx(DialogContent, { children: _jsxs(Stack, { spacing: 2, sx: { mt: 1 }, children: [_jsx(Typography, { children: "Pick a username. If it is new we will create it." }), _jsx(TextField, { label: "Username", value: username, onChange: (e) => setUsername(e.target.value), autoFocus: true, fullWidth: true, disabled: loading }), error && _jsx(Typography, { color: "error", fontSize: 14, children: error })] }) }), _jsx(DialogActions, { sx: { pr: 3, pb: 3 }, children: _jsx(Button, { type: "submit", variant: "contained", disabled: loading, children: loading ? 'Signing in...' : 'Continue' }) })] }) }));
};
