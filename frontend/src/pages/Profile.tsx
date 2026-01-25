import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { Post, Comment } from '../types/api';
import { ProfilePostsTab } from '../components/ProfilePostsTab';
import { ProfileCommentsTab } from '../components/ProfileCommentsTab';
import { EditPostModal } from '../components/EditPostModal';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import { EditCommentModal } from '../components/EditCommentModal';
import * as api from '../api/client';
import { useUser } from '../context/UserContext';

export const Profile: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const currentUserId = user?.user_id;

  useEffect(() => {
    if (currentUserId) {
      fetchUserPosts(currentUserId);
      fetchUserComments(currentUserId);
    }
  }, [currentUserId]);

  // get user's posts
  const fetchUserPosts = async (uid: number) => {
    try {
      console.log('Getting posts for user:', uid);
      const response = await api.listPosts();
      // filter posts by user id
      const myPosts = response.payload.data.filter(post => post.user_id === uid);
      console.log('Found', myPosts.length, 'posts');
      setPosts(myPosts);
    } catch (err) {
      console.log('Error fetching posts:', err);
    }
  };

  // Fetch comments made by the current user - optimized with parallel requests
  const fetchUserComments = async (uid: number) => {
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
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
    setLoading(false);
  };

  // Handle edit post action
  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    console.log('Edit post:', post);
  };

  // Handle delete post action
  const handleDeletePost = async (postId: number) => {
    setIsDeleting(true);
    try {
      await api.deletePost(postId);
      if (currentUserId) fetchUserPosts(currentUserId);
      setDeletingPostId(null);
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error('Failed to delete post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit comment action
  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
    console.log('Edit comment:', comment);
  };

  // Handle delete comment action
  const handleDeleteComment = async (commentId: number) => {
    setIsDeletingComment(true);
    const comment = comments.find(c => c.comment_id === commentId);
    if (!comment) return;

    try {
      await api.deleteComment(comment.post_id, commentId);
      if (currentUserId) fetchUserComments(currentUserId);
      setDeletingCommentId(null);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setIsDeletingComment(false);
    }
  };

  if (!currentUserId) return <Box sx={{ p: 3 }}><Typography>Please sign in.</Typography></Box>;
  if (loading) return <Box sx={{ p: 3 }}><Typography>Loading...</Typography></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Profile Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#d7dadc', fontWeight: 700, mb: 1 }}>
          My Profile
        </Typography>
        <Typography sx={{ color: '#818384' }}>
          {user?.username}
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{
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
        }}
      >
        <Tab label={`Posts (${posts.length})`} />
        <Tab label={`Comments (${comments.length})`} />
      </Tabs>

      {/* Tabs Content */}
      {activeTab === 0 && (
        <ProfilePostsTab 
          posts={posts} 
          onEdit={handleEditPost} 
          onDelete={(postId) => setDeletingPostId(postId)} 
        />
      )}
      
      {activeTab === 1 && (
        <ProfileCommentsTab 
        comments={comments} 
        onEdit={handleEditComment} 
        onDelete={(commentId) => setDeletingCommentId(commentId)} 
        />
      )}
      <EditPostModal
        open={editingPost !== null}
        post={editingPost}
        onClose={() => setEditingPost(null)}
        onPostUpdated={() => {
            fetchUserPosts();
            setEditingPost(null);
        }}
        />
        <DeleteConfirmDialog
        open={deletingPostId !== null}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={() => deletingPostId && handleDeletePost(deletingPostId)}
        onCancel={() => setDeletingPostId(null)}
        isDeleting={isDeleting}
        />

        <EditCommentModal
        open={editingComment !== null}
        comment={editingComment}
        onClose={() => setEditingComment(null)}
        onCommentUpdated={() => {
        fetchUserComments();
        setEditingComment(null);
        }}
        />  

        <DeleteConfirmDialog
        open={deletingCommentId !== null}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        onConfirm={() => deletingCommentId && handleDeleteComment(deletingCommentId)}
        onCancel={() => setDeletingCommentId(null)}
        isDeleting={isDeletingComment}
        />
    </Container>
  );
};