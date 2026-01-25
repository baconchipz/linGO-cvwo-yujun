import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography, IconButton, Stack, Divider } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
export const CommentList = ({ comments }) => {
    if (!comments || comments.length === 0) {
        return (_jsx(Typography, { sx: { color: '#818384', fontStyle: 'italic', mt: 3 }, children: "No comments yet. Be the first to comment!" }));
    }
    return (_jsxs(Box, { sx: { mt: 3 }, children: [_jsxs(Typography, { sx: { color: '#d7dadc', mb: 2, fontWeight: 500 }, children: ["Comments (", comments.length, ")"] }), _jsx(Stack, { spacing: 2, children: comments.map((comment) => (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', gap: 2 }, children: [_jsxs(Box, { sx: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        minWidth: 32,
                                    }, children: [_jsx(IconButton, { size: "small", sx: { color: '#818384', p: 0.5 }, children: _jsx(ThumbUpIcon, { fontSize: "small" }) }), _jsx(Typography, { sx: { color: '#818384', fontSize: 12, fontWeight: 600 }, children: comment.like_count })] }), _jsxs(Box, { sx: { flex: 1 }, children: [_jsxs(Stack, { direction: "row", spacing: 1, alignItems: "center", sx: { mb: 0.5 }, children: [_jsx(Typography, { variant: "caption", sx: { color: '#818384', fontWeight: 600 }, children: comment.username || `User ${comment.user_id}` }), _jsxs(Typography, { variant: "caption", sx: { color: '#818384' }, children: ["\u2022 ", new Date(comment.created_at).toLocaleDateString()] })] }), _jsx(Typography, { sx: { color: '#d7dadc', fontSize: 14, lineHeight: 1.5 }, children: comment.body })] })] }), _jsx(Divider, { sx: { bgcolor: '#343536', mt: 2 } })] }, comment.comment_id))) })] }));
};
