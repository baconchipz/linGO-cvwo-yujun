import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Box, Container, Typography, Tabs, Tab, } from '@mui/material';
import { ProfilePostsTab } from '../components/ProfilePostsTab';
import { ProfileCommentsTab } from '../components/ProfileCommentsTab';
import { EditPostModal } from '../components/EditPostModal';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import { EditCommentModal } from '../components/EditCommentModal';
import * as api from '../api/client';
import { useUser } from '../context/UserContext';
export const Profile = () => {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState(0);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState(null);
    const [, setDeleteConfirmOpen] = useState(false);
    const [deletingPostId, setDeletingPostId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [deletingCommentId, setDeletingCommentId] = useState(null);
    const [isDeletingComment, setIsDeletingComment] = useState(false);
    const currentUserId = user?.user_id;
    useEffect(() => {
        if (currentUserId) {
            fetchUserPosts(currentUserId);
            fetchUserComments(currentUserId);
        }
    }, [currentUserId]);
    // get user's posts
    const fetchUserPosts = async (uid) => {
        try {
            console.log('Getting posts for user:', uid);
            const response = await api.listPosts();
            // filter posts by user id
            const myPosts = response.payload.data.filter(post => post.user_id === uid);
            console.log('Found', myPosts.length, 'posts');
            setPosts(myPosts);
        }
        catch (err) {
            console.log('Error fetching posts:', err);
        }
    };
    // Fetch comments made by the current user - optimized with parallel requests
    const fetchUserComments = async (uid) => {
        try {
            const response = await api.listPosts();
            const allPosts = response.payload.data;
            // Only fetch comments for posts that the current user created
            const userPostIds = allPosts
                .filter(post => post.user_id === uid)
                .map(post => post.post_id);
            if (userPostIds.length === 0) {
                setComments([]);
                setLoading(false);
                return;
            }
            // Fetch comments in parallel only for user's posts
            const commentPromises = userPostIds.map(postId => api.listComments(postId));
            const commentsData = await Promise.all(commentPromises);
            const allComments = commentsData
                .flatMap(data => data.payload.data || [])
                .filter(comment => comment !== null && comment !== undefined);
            // Filter comments by current user
            const userComments = allComments.filter(comment => comment.user_id === uid);
            setComments(userComments);
        }
        catch (err) {
            console.error('Failed to fetch comments:', err);
        }
        setLoading(false);
    };
    // Handle edit post action
    const handleEditPost = (post) => {
        setEditingPost(post);
        console.log('Edit post:', post);
    };
    // Handle delete post action
    const handleDeletePost = async (postId) => {
        setIsDeleting(true);
        try {
            await api.deletePost(postId);
            if (currentUserId)
                fetchUserPosts(currentUserId);
            setDeletingPostId(null);
            setDeleteConfirmOpen(false);
        }
        catch (error) {
            console.error('Failed to delete post:', error);
        }
        finally {
            setIsDeleting(false);
        }
    };
    // Handle edit comment action
    const handleEditComment = (comment) => {
        setEditingComment(comment);
        console.log('Edit comment:', comment);
    };
    // Handle delete comment action
    const handleDeleteComment = async (commentId) => {
        setIsDeletingComment(true);
        const comment = comments.find(c => c.comment_id === commentId);
        if (!comment)
            return;
        try {
            await api.deleteComment(comment.post_id, commentId);
            if (currentUserId)
                fetchUserComments(currentUserId);
            setDeletingCommentId(null);
        }
        catch (error) {
            console.error('Failed to delete comment:', error);
        }
        finally {
            setIsDeletingComment(false);
        }
    };
    if (!currentUserId)
        return _jsx(Box, { sx: { p: 3 }, children: _jsx(Typography, { children: "Please sign in." }) });
    if (loading)
        return _jsx(Box, { sx: { p: 3 }, children: _jsx(Typography, { children: "Loading..." }) });
    return (_jsxs(Container, { maxWidth: "md", sx: { py: 3 }, children: [_jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "h4", sx: { color: '#d7dadc', fontWeight: 700, mb: 1 }, children: "My Profile" }), _jsx(Typography, { sx: { color: '#818384' }, children: user?.username })] }), _jsxs(Tabs, { value: activeTab, onChange: (_, newValue) => setActiveTab(newValue), sx: {
                    borderBottom: 1,
                    borderColor: '#343536',
                    mb: 3,
                    '& .MuiTab-root': {
                        color: '#818384',
                        textTransform: 'none',
                        fontSize: 16,
                        fontWeight: 600,
                    },
                    '& .Mui-selected': {
                        color: '#0079d3 !important',
                    },
                    '& .MuiTabs-indicator': {
                        backgroundColor: '#0079d3',
                    },
                }, children: [_jsx(Tab, { label: `Posts (${posts.length})` }), _jsx(Tab, { label: `Comments (${comments.length})` })] }), activeTab === 0 && (_jsx(ProfilePostsTab, { posts: posts, onEdit: handleEditPost, onDelete: (postId) => setDeletingPostId(postId) })), activeTab === 1 && (_jsx(ProfileCommentsTab, { comments: comments, onEdit: handleEditComment, onDelete: (commentId) => setDeletingCommentId(commentId) })), _jsx(EditPostModal, { open: editingPost !== null, post: editingPost, onClose: () => setEditingPost(null), onPostUpdated: () => {
                    if (currentUserId)
                        fetchUserPosts(currentUserId);
                    setDeleteConfirmOpen(false);
                } }), _jsx(DeleteConfirmDialog, { open: deletingPostId !== null, title: "Delete Post", message: "Are you sure you want to delete this post? This action cannot be undone.", onConfirm: () => deletingPostId && handleDeletePost(deletingPostId), onCancel: () => setDeletingPostId(null), isDeleting: isDeleting }), _jsx(EditCommentModal, { open: editingComment !== null, comment: editingComment, onClose: () => setEditingComment(null), onCommentUpdated: () => {
                    if (currentUserId)
                        fetchUserComments(currentUserId);
                    setDeleteConfirmOpen(false);
                } }), _jsx(DeleteConfirmDialog, { open: deletingCommentId !== null, title: "Delete Comment", message: "Are you sure you want to delete this comment? This action cannot be undone.", onConfirm: () => deletingCommentId && handleDeleteComment(deletingCommentId), onCancel: () => setDeletingCommentId(null), isDeleting: isDeletingComment })] }));
};
