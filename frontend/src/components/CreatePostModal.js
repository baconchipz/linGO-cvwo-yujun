import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import * as api from '../api/client';
import { useUser } from '../context/UserContext';
export const CreatePostModal = ({ open, onClose, onPostCreated, }) => {
    const { user } = useUser();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [modules, setModules] = useState([]);
    const [moduleId, setModuleId] = useState('');
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    // get modules when modal opens
    useEffect(() => {
        const getModules = async () => {
            try {
                const res = await api.listModules();
                if (res.payload.data) {
                    console.log('Got modules:', res.payload.data);
                    setModules(res.payload.data);
                    // set first module as default
                    if (res.payload.data.length > 0) {
                        setModuleId(res.payload.data[0].module_id);
                    }
                }
            }
            catch (err) {
                console.log('Error getting modules', err);
            }
        };
        if (open) {
            getModules();
        }
    }, [open]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        // check if user is logged in
        if (!user) {
            setError('Please sign in first.');
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            console.log('Creating post:', { title, body, moduleId });
            await api.createPost(user.user_id, title, body, moduleId);
            console.log('Post created!');
            // clear form
            setTitle('');
            setBody('');
            onClose();
            onPostCreated();
        }
        catch (err) {
            console.log('Error creating post:', err);
            setError(err instanceof Error ? err.message : 'Failed to create post');
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs(Dialog, { open: open, onClose: onClose, maxWidth: "sm", fullWidth: true, slotProps: {
            paper: {
                sx: {
                    bgcolor: '#1a1a1b',
                    borderRadius: 2,
                },
            },
        }, children: [_jsx(DialogTitle, { sx: { color: '#d7dadc', borderBottom: '1px solid #343536' }, children: "Create Post" }), _jsx(DialogContent, { sx: { pt: 3 }, children: _jsxs(Box, { component: "form", onSubmit: handleSubmit, id: "create-post-form", children: [_jsx(TextField, { fullWidth: true, placeholder: "Title", value: title, onChange: (e) => setTitle(e.target.value), required: true, sx: {
                                mb: 2,
                                '& .MuiInputBase-root': {
                                    bgcolor: '#272729',
                                    color: '#d7dadc',
                                    borderRadius: 1,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#343536',
                                },
                            } }), _jsx(TextField, { fullWidth: true, select: true, label: "Module", value: moduleId, onChange: (e) => setModuleId(e.target.value), SelectProps: {
                                native: true,
                            }, sx: {
                                mb: 2,
                                '& .MuiInputBase-root': {
                                    bgcolor: '#272729',
                                    color: '#d7dadc',
                                    borderRadius: 1,
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#ffffff',
                                },
                            }, children: modules.map((module) => (_jsx("option", { value: module.module_id, children: module.module_code }, module.module_id))) }), _jsx(TextField, { fullWidth: true, multiline: true, rows: 6, placeholder: "What's on your mind?", value: body, onChange: (e) => setBody(e.target.value), required: true, sx: {
                                '& .MuiInputBase-root': {
                                    bgcolor: '#272729',
                                    color: '#d7dadc',
                                    borderRadius: 1,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#343536',
                                },
                            } }), error && (_jsx(Box, { sx: { color: '#ea4033', mt: 1, fontSize: '0.875rem' }, children: error }))] }) }), _jsxs(DialogActions, { sx: { p: 2, borderTop: '1px solid #343536' }, children: [_jsx(Button, { onClick: onClose, sx: { color: '#818384', textTransform: 'none' }, children: "Cancel" }), _jsx(Button, { type: "submit", form: "create-post-form", variant: "contained", disabled: submitting || !title || !body || !user, sx: {
                            bgcolor: '#0079d3',
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            '&:hover': { bgcolor: '#1484d6' },
                            '&:disabled': { bgcolor: '#818384', color: '#666' },
                        }, children: submitting ? 'Posting...' : 'Post' })] })] }));
};
