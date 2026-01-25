import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, } from '@mui/material';
export const EditCommentModal = ({ open, comment, onClose, onCommentUpdated }) => {
    const [body, setBody] = useState('');
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => {
        if (comment) {
            setBody(comment.body);
        }
    }, [comment]);
    const handleSubmit = async () => {
        if (!body.trim() || !comment)
            return;
        setSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8080/posts/${comment.post_id}/comments/${comment.comment_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    body: body.trim(),
                }),
            });
            if (response.ok) {
                onCommentUpdated();
                onClose();
            }
        }
        catch (error) {
            console.error('Failed to update comment:', error);
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs(Dialog, { open: open, onClose: onClose, maxWidth: "sm", fullWidth: true, PaperProps: {
            sx: { bgcolor: '#1a1a1b', color: '#d7dadc' }
        }, children: [_jsx(DialogTitle, { sx: { color: '#d7dadc', borderBottom: '1px solid #343536' }, children: "Edit Comment" }), _jsx(DialogContent, { sx: { pt: 3 }, children: _jsx(TextField, { value: body, onChange: (e) => setBody(e.target.value), placeholder: "What are your thoughts?", multiline: true, rows: 4, fullWidth: true, sx: {
                        '& .MuiOutlinedInput-root': {
                            color: '#d7dadc',
                            '& fieldset': { borderColor: '#343536' },
                            '&:hover fieldset': { borderColor: '#818384' },
                            '&.Mui-focused fieldset': { borderColor: '#0079d3' },
                        },
                    } }) }), _jsxs(DialogActions, { sx: { borderTop: '1px solid #343536', p: 2 }, children: [_jsx(Button, { onClick: onClose, sx: { color: '#818384', textTransform: 'none' }, children: "Cancel" }), _jsx(Button, { onClick: handleSubmit, disabled: submitting || !body.trim(), variant: "contained", sx: {
                            bgcolor: '#0079d3',
                            color: '#fff',
                            textTransform: 'none',
                            '&:hover': { bgcolor: '#0066b8' },
                            '&:disabled': { bgcolor: '#343536', color: '#818384' },
                        }, children: submitting ? 'Saving...' : 'Save' })] })] }));
};
