import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography, Container, Avatar } from '@mui/material';
export const ModuleBanner = ({ moduleCode, postCount }) => {
    return (_jsx(Box, { sx: {
            bgcolor: '#1a1a1b',
            borderBottom: '1px solid #343536',
        }, children: _jsx(Container, { maxWidth: "lg", children: _jsxs(Box, { sx: { py: 4, display: 'flex', alignItems: 'center', gap: 3 }, children: [_jsx(Avatar, { sx: {
                            width: 80,
                            height: 80,
                            bgcolor: '#ff5722',
                            fontSize: 32,
                            fontWeight: 700,
                        }, children: moduleCode?.replace(/\d+/g, '') || 'M' }), _jsxs(Box, { children: [_jsxs(Typography, { variant: "h4", sx: { color: '#d7dadc', fontWeight: 700, mb: 0.5 }, children: ["m/", moduleCode] }), _jsxs(Typography, { sx: { color: '#818384' }, children: ["Module \u2022 ", postCount, " posts"] })] })] }) }) }));
};
