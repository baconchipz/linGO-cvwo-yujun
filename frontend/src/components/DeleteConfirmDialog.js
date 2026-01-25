import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, } from '@mui/material';
// Delete confirmation dialog component
export const DeleteConfirmDialog = ({ open, title, message, onConfirm, onCancel, isDeleting = false, }) => {
    return (_jsxs(Dialog, { open: open, onClose: onCancel, maxWidth: "xs", fullWidth: true, PaperProps: {
            sx: { bgcolor: '#1a1a1b', color: '#d7dadc' }
        }, children: [_jsx(DialogTitle, { sx: { color: '#d7dadc', borderBottom: '1px solid #343536' }, children: title }), _jsx(DialogContent, { sx: { pt: 3 }, children: _jsx(Typography, { sx: { color: '#818384' }, children: message }) }), _jsxs(DialogActions, { sx: { borderTop: '1px solid #343536', p: 2 }, children: [_jsx(Button, { onClick: onCancel, disabled: isDeleting, sx: { color: '#818384', textTransform: 'none' }, children: "Cancel" }), _jsx(Button, { onClick: onConfirm, disabled: isDeleting, variant: "contained", sx: {
                            bgcolor: '#ff4444',
                            color: '#fff',
                            textTransform: 'none',
                            '&:hover': { bgcolor: '#cc0000' },
                            '&:disabled': { bgcolor: '#343536', color: '#818384' },
                        }, children: isDeleting ? 'Deleting...' : 'Delete' })] })] }));
};
