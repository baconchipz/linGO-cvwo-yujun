import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, TextField, Button, Typography, } from '@mui/material';
import * as api from '../api/client';
import { useUser } from '../context/UserContext';
// Component for submitting a new comment
export const CommentForm = ({ postId, onCommentAdded }) => {
    const { user } = useUser();
    const [body, setBody] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = async () => {
        if (!body.trim())
            return;
        // check user logged in
        if (!user) {
            setError('Please sign in first.');
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            console.log('Posting comment:', body);
            await api.createComment(postId, user.user_id, body.trim());
            setBody('');
            onCommentAdded();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit comment');
            console.log('Error submitting comment:', err);
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs(Box, { sx: { mt: 3 }, children: [_jsx(Typography, { sx: { color: '#d7dadc', mb: 2, fontWeight: 500 }, children: "Add a comment" }), _jsx(TextField, { multiline: true, rows: 3, fullWidth: true, value: body, onChange: (e) => setBody(e.target.value), placeholder: "What are your thoughts?", sx: {
                    bgcolor: '#272729',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                        color: '#d7dadc',
                        '& fieldset': { borderColor: '#343536' },
                        '&:hover fieldset': { borderColor: '#818384' },
                        '&.Mui-focused fieldset': { borderColor: '#0079d3' },
                    },
                    '& .MuiInputBase-input::placeholder': {
                        color: '#818384',
                        opacity: 1,
                    },
                } }), error && (_jsx(Box, { sx: { color: '#ea4033', mt: 1, fontSize: '0.875rem' }, children: error })), _jsx(Box, { sx: { display: 'flex', justifyContent: 'flex-end', mt: 1 }, children: _jsx(Button, { variant: "contained", onClick: handleSubmit, disabled: submitting || !body.trim() || !user, sx: {
                        bgcolor: '#0079d3',
                        color: '#fff',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': { bgcolor: '#0066b8' },
                        '&:disabled': { bgcolor: '#343536', color: '#818384' },
                    }, children: submitting ? 'Posting...' : 'Comment' }) })] }));
};
