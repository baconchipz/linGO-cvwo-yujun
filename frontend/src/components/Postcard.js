import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, IconButton, Stack, Divider, Button, } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/ChatBubbleOutline';
import * as api from '../api/client';
import { useUser } from '../context/UserContext';
export const Postcard = ({ post, showModule = true }) => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [likeCount, setLikeCount] = useState(post.like_count);
    const [isLiking, setIsLiking] = useState(false);
    const [hasLiked, setHasLiked] = useState(false);
    const handleLike = async () => {
        if (!user || hasLiked) {
            console.log('Cannot like: user not logged in or already liked');
            return;
        }
        try {
            setIsLiking(true);
            console.log('Liking post:', post.post_id);
            await api.likePost(post.post_id, user.user_id);
            setLikeCount(likeCount + 1);
            setHasLiked(true);
        }
        catch (err) {
            console.log('Error liking post', err);
        }
        finally {
            setIsLiking(false);
        }
    };
    return (_jsx(Card, { sx: { bgcolor: '#1a1a1b', borderRadius: 2 }, children: _jsx(CardContent, { children: _jsxs(Box, { sx: { display: 'flex', gap: 2 }, children: [_jsxs(Box, { sx: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: 40,
                        }, children: [_jsx(IconButton, { size: "small", onClick: handleLike, disabled: isLiking || hasLiked, sx: {
                                    color: hasLiked ? '#ff6b35' : '#818384',
                                    '&:hover': { color: '#ff6b35' },
                                    '&.Mui-disabled': {
                                        color: hasLiked ? '#ff6b35' : '#818384',
                                    }
                                }, children: _jsx(ThumbUpIcon, { fontSize: "small" }) }), _jsx(Typography, { sx: { color: '#d7dadc', fontWeight: 600, fontSize: 14 }, children: likeCount })] }), _jsxs(Box, { sx: { flex: 1 }, children: [_jsxs(Stack, { direction: "row", spacing: 1, alignItems: "center", sx: { mb: 0.5 }, children: [showModule && (_jsxs(Typography, { variant: "caption", sx: {
                                            color: '#ffffff',
                                            fontWeight: 600,
                                            fontSize: 13,
                                        }, children: ["m/", post.module_code] })), _jsxs(Typography, { variant: "caption", sx: { color: '#818384' }, children: [showModule && '•', " Posted by ", post.username || `User ${post.user_id}`, " \u2022 ", new Date(post.created_at).toLocaleDateString()] })] }), _jsx(Typography, { variant: "h6", sx: {
                                    color: '#ff5722',
                                    fontWeight: 500,
                                    mb: 1,
                                    fontSize: 18,
                                    cursor: 'pointer',
                                    '&:hover': { textDecoration: 'underline' },
                                }, onClick: () => navigate(`/post/${post.post_id}`), children: post.title }), _jsx(Typography, { sx: { color: '#d7dadc', mb: 2 }, children: post.body }), _jsx(Divider, { sx: { bgcolor: '#343536', mb: 1 } }), _jsx(Stack, { direction: "row", spacing: 1, children: _jsxs(Button, { startIcon: _jsx(CommentIcon, {}), size: "small", sx: {
                                        color: '#818384',
                                        textTransform: 'none',
                                        '&:hover': { bgcolor: '#272729' },
                                    }, onClick: () => navigate(`/post/${post.post_id}`), children: [post.comment_count, " ", post.comment_count === 1 ? 'Comment' : 'Comments'] }) })] })] }) }) }));
};
