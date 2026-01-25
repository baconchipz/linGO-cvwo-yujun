import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, } from '@mui/material';
export const EditPostModal = ({ open, post, onClose, onPostUpdated }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [moduleId, setModuleId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setBody(post.body);
            setModuleId(post.module_id);
        }
    }, [post]);
    // Handle post update submission
    const handleSubmit = async () => {
        if (!title.trim() || !body.trim() || !moduleId.trim() || !post)
            return;
        setSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8080/posts/${post.post_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    body: body.trim(),
                    module_id: moduleId.trim().toUpperCase(),
                }),
            });
            if (response.ok) {
                onPostUpdated();
                onClose();
            }
        }
        catch (error) {
            console.error('Failed to update post:', error);
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs(Dialog, { open: open, onClose: onClose, maxWidth: "sm", fullWidth: true, PaperProps: {
            sx: { bgcolor: '#1a1a1b', color: '#d7dadc' }
        }, children: [_jsx(DialogTitle, { sx: { color: '#d7dadc', borderBottom: '1px solid #343536' }, children: "Edit Post" }), _jsx(DialogContent, { sx: { pt: 3 }, children: _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2 }, children: [_jsx(TextField, { label: "Module ID", value: moduleId, onChange: (e) => setModuleId(e.target.value), placeholder: "e.g. CS2030", fullWidth: true, sx: {
                                '& .MuiOutlinedInput-root': {
                                    color: '#d7dadc',
                                    '& fieldset': { borderColor: '#343536' },
                                    '&:hover fieldset': { borderColor: '#818384' },
                                    '&.Mui-focused fieldset': { borderColor: '#0079d3' },
                                },
                                '& .MuiInputLabel-root': { color: '#818384' },
                            } }), _jsx(TextField, { label: "Title", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Title", fullWidth: true, sx: {
                                '& .MuiOutlinedInput-root': {
                                    color: '#d7dadc',
                                    '& fieldset': { borderColor: '#343536' },
                                    '&:hover fieldset': { borderColor: '#818384' },
                                    '&.Mui-focused fieldset': { borderColor: '#0079d3' },
                                },
                                '& .MuiInputLabel-root': { color: '#818384' },
                            } }), _jsx(TextField, { label: "Body", value: body, onChange: (e) => setBody(e.target.value), placeholder: "Text (optional)", multiline: true, rows: 4, fullWidth: true, sx: {
                                '& .MuiOutlinedInput-root': {
                                    color: '#d7dadc',
                                    '& fieldset': { borderColor: '#343536' },
                                    '&:hover fieldset': { borderColor: '#818384' },
                                    '&.Mui-focused fieldset': { borderColor: '#0079d3' },
                                },
                                '& .MuiInputLabel-root': { color: '#818384' },
                            } })] }) }), _jsxs(DialogActions, { sx: { borderTop: '1px solid #343536', p: 2 }, children: [_jsx(Button, { onClick: onClose, sx: { color: '#818384', textTransform: 'none' }, children: "Cancel" }), _jsx(Button, { onClick: handleSubmit, disabled: submitting || !title.trim() || !body.trim() || !moduleId.trim(), variant: "contained", sx: {
                            bgcolor: '#0079d3',
                            color: '#fff',
                            textTransform: 'none',
                            '&:hover': { bgcolor: '#0066b8' },
                            '&:disabled': { bgcolor: '#343536', color: '#818384' },
                        }, children: submitting ? 'Saving...' : 'Save' })] })] }));
};
