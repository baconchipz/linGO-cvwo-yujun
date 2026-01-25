import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Stack, Chip, } from '@mui/material';
import { useUser } from '../context/UserContext';
import * as api from '../api/client';
export const ModuleSelection = () => {
    const { user } = useUser();
    const [allModules, setAllModules] = useState([]);
    const [userModuleIds, setUserModuleIds] = useState([]);
    const [loading, setLoading] = useState(true);
    // fetch all modules and user's selected modules on load
    useEffect(() => {
        fetchModules();
        if (user) {
            fetchUserModules();
        }
    }, [user]);
    const fetchModules = async () => {
        try {
            console.log('Getting all modules');
            const res = await api.listModules();
            if (res.payload.data) {
                console.log('Got modules:', res.payload.data);
                setAllModules(res.payload.data);
            }
            setLoading(false);
        }
        catch (err) {
            console.log('Error loading modules', err);
            setLoading(false);
        }
    };
    const fetchUserModules = async () => {
        try {
            if (!user)
                return;
            console.log('Fetching user modules');
            const res = await api.getUserModules(user.user_id);
            const mods = res.payload.data || [];
            const ids = mods.map((m) => m.module_id);
            console.log('Got user module ids:', ids);
            setUserModuleIds(ids);
        }
        catch (err) {
            console.log('Error loading user modules', err);
        }
    };
    // subscribe to module and save to backend
    const handleAddModule = async (moduleId) => {
        try {
            if (!user)
                return;
            console.log('Adding module:', moduleId);
            await api.subscribeToModule(user.user_id, moduleId);
            setUserModuleIds([...userModuleIds, moduleId]);
        }
        catch (err) {
            console.log('Error subscribing to module', err);
        }
    };
    // unsubscribe from module and save to backend
    const handleRemoveModule = async (moduleId) => {
        try {
            if (!user)
                return;
            console.log('Removing module:', moduleId);
            await api.unsubscribeFromModule(user.user_id, moduleId);
            setUserModuleIds(userModuleIds.filter(id => id !== moduleId));
        }
        catch (err) {
            console.log('Error unsubscribing from module', err);
        }
    };
    // check if module is selected
    const isSelected = (moduleId) => {
        return userModuleIds.includes(moduleId);
    };
    if (loading) {
        return (_jsx(Container, { maxWidth: "md", sx: { py: 4 }, children: _jsx(Typography, { sx: { color: '#d7dadc' }, children: "Loading modules..." }) }));
    }
    return (_jsxs(Container, { maxWidth: "md", sx: { py: 4 }, children: [_jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "h5", sx: { color: '#d7dadc', mb: 2, fontWeight: 600 }, children: "My Modules" }), userModuleIds.length === 0 ? (_jsx(Typography, { sx: { color: '#818384', fontStyle: 'italic' }, children: "No modules selected yet. Click on modules below to add them." })) : (_jsx(Stack, { direction: "row", spacing: 1, flexWrap: "wrap", useFlexGap: true, children: userModuleIds.map((moduleId) => {
                            const module = allModules.find(m => m.module_id === moduleId);
                            return (_jsx(Chip, { label: module?.module_code || moduleId, onDelete: () => handleRemoveModule(moduleId), sx: {
                                    bgcolor: '#0079d3',
                                    color: '#fff',
                                    fontWeight: 600,
                                    fontSize: 14,
                                    mb: 1,
                                    '&:hover': {
                                        bgcolor: '#1484d6',
                                    },
                                    '& .MuiChip-deleteIcon': {
                                        color: '#fff',
                                        '&:hover': {
                                            color: '#ff4444',
                                        },
                                    },
                                } }, moduleId));
                        }) }))] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "h5", sx: { color: '#d7dadc', mb: 2, fontWeight: 600 }, children: "Available Modules" }), _jsx(Box, { sx: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                            gap: 2,
                        }, children: allModules.map((module) => {
                            const selected = isSelected(module.module_id);
                            return (_jsx(Button, { onClick: () => {
                                    if (selected) {
                                        handleRemoveModule(module.module_id);
                                    }
                                    else {
                                        handleAddModule(module.module_id);
                                    }
                                }, variant: selected ? 'contained' : 'outlined', sx: {
                                    borderRadius: '20px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    py: 1,
                                    px: 2,
                                    border: selected ? 'none' : '2px solid #343536',
                                    bgcolor: selected ? '#0079d3' : 'transparent',
                                    color: selected ? '#fff' : '#d7dadc',
                                    '&:hover': {
                                        bgcolor: selected ? '#1484d6' : 'rgba(255, 255, 255, 0.08)',
                                        borderColor: selected ? 'none' : '#818384',
                                    },
                                }, children: module.module_code }, module.module_id));
                        }) })] }), userModuleIds.length > 0 && (_jsx(Box, { sx: { mt: 4, p: 2, bgcolor: '#1a1a1b', borderRadius: 2 }, children: _jsxs(Typography, { variant: "caption", sx: { color: '#818384' }, children: ["Selected module IDs: ", userModuleIds.join(', ')] }) }))] }));
};
