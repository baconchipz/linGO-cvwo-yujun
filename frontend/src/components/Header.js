import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Paper, Stack, TextField, Toolbar, Typography, InputAdornment, } from '@mui/material';
import { useUser } from '../context/UserContext';
import * as api from '../api/client';
export const Header = ({ onPostClick }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout } = useUser();
    // handle search
    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const match = searchQuery.match(/[a-zA-Z]*\d+/);
            if (match) {
                const code = match[0].toUpperCase();
                console.log('Searching for module:', code);
                try {
                    const res = await api.getModuleByCode(code);
                    if (res.payload.data) {
                        console.log('Found module:', res.payload.data);
                        navigate(`/module/${res.payload.data.module_id}`);
                    }
                }
                catch (err) {
                    console.log('Module not found', err);
                }
            }
            else {
                navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            }
            setSearchQuery('');
        }
    };
    const handleNavigation = (path) => {
        navigate(path);
    };
    const handleLogout = () => {
        logout();
        navigate('/');
    };
    return (_jsx(AppBar, { position: "sticky", elevation: 0, sx: { bgcolor: 'transparent', top: 0, zIndex: 100 }, children: _jsx(Box, { sx: {
                px: 2,
                py: 1.5,
                background: 'linear-gradient(90deg, #071021 0%, #081a34 50%, #081224 100%)',
            }, children: _jsx(Paper, { elevation: 0, sx: {
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    backdropFilter: 'blur(8px)',
                }, children: _jsxs(Toolbar, { disableGutters: true, sx: { px: 2, minHeight: 72, gap: 2, display: 'flex', position: 'relative' }, children: [_jsxs(Stack, { direction: "row", spacing: 2, alignItems: "center", sx: { flex: 1 }, children: [_jsxs(Box, { onClick: () => handleNavigation('/'), sx: { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Box, { sx: {
                                                width: 32,
                                                height: 32,
                                                borderRadius: '10px',
                                                background: 'radial-gradient(circle at 30% 30%, #44c3ff, #1e88ff 40%, #0d3b8a 80%)',
                                                boxShadow: '0 8px 20px rgba(68,195,255,0.35)',
                                            } }), _jsx(Typography, { variant: "h6", fontWeight: 700, color: "#dce8ff", children: "modGO" })] }), _jsxs(Stack, { direction: "row", spacing: 1, alignItems: "center", children: [_jsx(Button, { color: "inherit", sx: { color: '#dce8ff', textTransform: 'none', fontWeight: 600 }, onClick: () => handleNavigation('/'), children: "Home" }), _jsx(Button, { color: "inherit", sx: { color: '#dce8ff', textTransform: 'none', fontWeight: 600 }, onClick: () => handleNavigation('/modules'), children: "My Modules" }), _jsx(Button, { color: "inherit", sx: { color: '#dce8ff', textTransform: 'none', fontWeight: 600 }, onClick: () => handleNavigation('/profile'), children: "Profile" })] })] }), _jsx(Box, { component: "form", onSubmit: handleSearch, sx: {
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 350,
                            }, children: _jsx(TextField, { fullWidth: true, size: "small", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search module codes", InputProps: {
                                    startAdornment: (_jsx(InputAdornment, { position: "start", sx: { color: '#9fb6d6' }, children: "\uD83D\uDD0D" })),
                                    sx: {
                                        borderRadius: '12px',
                                        backgroundColor: 'rgba(255,255,255,0.06)',
                                        color: '#e9f1ff',
                                        '& .MuiInputBase-input::placeholder': { color: '#9fb6d6' },
                                    },
                                } }) }), _jsxs(Stack, { direction: "row", justifyContent: "flex-end", sx: { flex: 1 }, children: [user && (_jsxs(Stack, { direction: "row", spacing: 1, alignItems: "center", sx: { mr: 1 }, children: [_jsx(Typography, { sx: { color: '#dce8ff', fontWeight: 600 }, children: user.username }), _jsx(Button, { variant: "outlined", onClick: handleLogout, sx: {
                                                color: '#dce8ff',
                                                borderColor: 'rgba(255,255,255,0.2)',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': { borderColor: '#dce8ff' },
                                            }, children: "Logout" })] })), _jsx(Button, { variant: "contained", onClick: onPostClick, sx: {
                                        bgcolor: '#0079d3',
                                        color: '#fff',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: 3,
                                        borderRadius: '20px',
                                        '&:hover': { bgcolor: '#1484d6' },
                                    }, children: "Post" })] })] }) }) }) }));
};
