import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Stack, Card, CardContent, IconButton, Button, } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
export const ProfilePostsTab = ({ posts, onEdit, onDelete }) => {
    const navigate = useNavigate();
    if (posts.length === 0) {
        return (_jsx(Typography, { sx: { color: '#818384', textAlign: 'center', py: 4 }, children: "You haven't created any posts yet" }));
    }
    return (_jsx(Stack, { spacing: 2, children: posts.map((post) => (_jsx(Card, { sx: { bgcolor: '#1a1a1b', borderRadius: 2 }, children: _jsx(CardContent, { children: _jsxs(Box, { sx: { display: 'flex', gap: 2 }, children: [_jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 40 }, children: [_jsx(IconButton, { size: "small", sx: { color: '#818384' }, children: _jsx(ThumbUpIcon, { fontSize: "small" }) }), _jsx(Typography, { sx: { color: '#d7dadc', fontWeight: 600, fontSize: 14 }, children: post.like_count })] }), _jsxs(Box, { sx: { flex: 1 }, children: [_jsxs(Typography, { variant: "caption", sx: { color: '#818384', mb: 0.5 }, children: ["m/", post.module_code, " \u2022 Posted by ", post.username || `User ${post.user_id}`, " \u2022 ", new Date(post.created_at).toLocaleDateString()] }), _jsx(Typography, { variant: "h6", sx: {
                                        color: post.body === 'User has deleted this post' ? '#ff4444' : '#ff5722',
                                        fontWeight: 500,
                                        mb: 1,
                                        fontSize: 18,
                                        cursor: 'pointer',
                                        '&:hover': { textDecoration: 'underline' },
                                    }, onClick: () => navigate(`/post/${post.post_id}`), children: post.title }), _jsx(Typography, { sx: {
                                        color: post.body === 'User has deleted this post' ? '#ff4444' : '#d7dadc',
                                        mb: 2
                                    }, children: post.body }), post.body !== 'User has deleted this post' && (_jsxs(Stack, { direction: "row", spacing: 1, children: [_jsx(Button, { startIcon: _jsx(EditIcon, {}), size: "small", onClick: () => onEdit(post), sx: {
                                                color: '#818384',
                                                textTransform: 'none',
                                                '&:hover': { bgcolor: '#272729' },
                                            }, children: "Edit" }), _jsx(Button, { startIcon: _jsx(DeleteIcon, {}), size: "small", onClick: () => onDelete(post.post_id), sx: {
                                                color: '#818384',
                                                textTransform: 'none',
                                                '&:hover': { bgcolor: '#272729', color: '#ff4444' },
                                            }, children: "Delete" })] }))] })] }) }) }, post.post_id))) }));
};
