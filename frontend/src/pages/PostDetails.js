import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, IconButton, Stack, Divider, Container, Button, } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { CommentList } from '../components/CommentList';
import { CommentForm } from '../components/CommentForm';
import * as api from '../api/client';
export const PostDetail = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const fetchComments = async () => {
        if (!postId)
            return;
        try {
            const response = await api.listComments(parseInt(postId));
            setComments(response.payload.data || []);
        }
        catch (err) {
            console.error('Failed to fetch comments:', err);
        }
    };
    useEffect(() => {
        loadPostAndComments();
    }, [postId]);
    const loadPostAndComments = async () => {
        try {
            const response = await api.listPosts();
            const foundPost = response.payload.data.find(p => p.post_id === Number(postId));
            if (foundPost) {
                setPost(foundPost);
                if (postId) {
                    await fetchComments();
                }
            }
            else {
                setError('Post not found');
            }
            setLoading(false);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load post');
            setLoading(false);
        }
    };
    if (loading)
        return _jsx(Box, { sx: { p: 3 }, children: _jsx(Typography, { children: "Loading post..." }) });
    if (error || !post)
        return _jsx(Box, { sx: { p: 3 }, children: _jsx(Typography, { color: "error", children: error || 'Post not found' }) });
    return (_jsxs(Container, { maxWidth: "md", sx: { py: 3 }, children: [_jsx(Button, { startIcon: _jsx(ArrowBackIcon, {}), onClick: () => navigate(-1), sx: {
                    color: '#818384',
                    textTransform: 'none',
                    mb: 2,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                }, children: "Back" }), _jsx(Card, { sx: { bgcolor: '#1a1a1b', borderRadius: 2 }, children: _jsx(CardContent, { children: _jsxs(Box, { sx: { display: 'flex', gap: 2 }, children: [_jsxs(Box, { sx: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    minWidth: 40,
                                }, children: [_jsx(IconButton, { size: "small", sx: { color: '#818384' }, children: _jsx(ThumbUpIcon, { fontSize: "small" }) }), _jsx(Typography, { sx: { color: '#d7dadc', fontWeight: 600, fontSize: 14 }, children: post.like_count })] }), _jsxs(Box, { sx: { flex: 1 }, children: [_jsxs(Stack, { direction: "row", spacing: 1, alignItems: "center", sx: { mb: 1 }, children: [_jsxs(Typography, { variant: "caption", sx: {
                                                    color: '#ffffff',
                                                    fontWeight: 600,
                                                    fontSize: 13,
                                                    cursor: 'pointer',
                                                    '&:hover': { textDecoration: 'underline' },
                                                }, onClick: () => navigate(`/module/${post.module_id}`), children: ["m/", post.module_id] }), _jsxs(Typography, { variant: "caption", sx: { color: '#818384' }, children: ["\u2022 Posted by User ", post.user_id, " \u2022 ", new Date(post.created_at).toLocaleDateString()] })] }), _jsx(Typography, { variant: "h5", sx: {
                                            color: '#ff5722',
                                            fontWeight: 500,
                                            mb: 2,
                                        }, children: post.title }), _jsx(Typography, { sx: {
                                            color: '#d7dadc',
                                            mb: 3,
                                            fontSize: 16,
                                            lineHeight: 1.6,
                                            whiteSpace: 'pre-wrap',
                                        }, children: post.body }), _jsx(Divider, { sx: { bgcolor: '#343536', my: 2 } }), _jsx(CommentForm, { postId: post.post_id, onCommentAdded: fetchComments }), _jsx(CommentList, { comments: comments })] })] }) }) })] }));
};
