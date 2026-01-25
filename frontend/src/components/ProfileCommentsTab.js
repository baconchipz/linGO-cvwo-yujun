import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Typography, Stack, Card, CardContent, Button, } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
export const ProfileCommentsTab = ({ comments, onEdit, onDelete }) => {
    if (comments.length === 0) {
        return (_jsx(Typography, { sx: { color: '#818384', textAlign: 'center', py: 4 }, children: "You haven't made any comments yet" }));
    }
    return (_jsx(Stack, { spacing: 2, children: comments.map((comment) => (_jsx(Card, { sx: { bgcolor: '#1a1a1b', borderRadius: 2 }, children: _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "caption", sx: { color: '#818384', mb: 1 }, children: [new Date(comment.created_at).toLocaleDateString(), " \u2022 Post ID: ", comment.post_id] }), _jsx(Typography, { sx: {
                            color: comment.body === 'User has deleted this comment' ? '#ff4444' : '#d7dadc',
                            mb: 2
                        }, children: comment.body }), comment.body !== 'User has deleted this comment' && (_jsxs(Stack, { direction: "row", spacing: 1, children: [_jsx(Button, { startIcon: _jsx(EditIcon, {}), size: "small", onClick: () => onEdit(comment), sx: {
                                    color: '#818384',
                                    textTransform: 'none',
                                    '&:hover': { bgcolor: '#272729' },
                                }, children: "Edit" }), _jsx(Button, { startIcon: _jsx(DeleteIcon, {}), size: "small", onClick: () => onDelete(comment.comment_id), sx: {
                                    color: '#818384',
                                    textTransform: 'none',
                                    '&:hover': { bgcolor: '#272729', color: '#ff4444' },
                                }, children: "Delete" })] }))] }) }, comment.comment_id))) }));
};
