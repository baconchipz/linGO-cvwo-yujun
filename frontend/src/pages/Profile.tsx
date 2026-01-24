import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { Post, Comment, ApiResponse } from '../types/api';
import { ProfilePostsTab } from '../components/ProfilePostsTab';
import { ProfileCommentsTab } from '../components/ProfileCommentsTab';
import { EditPostModal } from '../components/EditPostModal';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';

export const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Mock user ID - replace with actual auth later
  const currentUserId = 1;

  useEffect(() => {
    fetchUserPosts();
    fetchUserComments();
  }, []);

  // Fetch posts created by the current user
  const fetchUserPosts = () => {
    fetch('http://localhost:8080/posts')
      .then(response => response.json())
      .then((data: ApiResponse<Post[]>) => {
        const userPosts = data.payload.data.filter(post => post.user_id === currentUserId);
        setPosts(userPosts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Fetch comments made by the current user
  const fetchUserComments = () => {
    fetch('http://localhost:8080/posts')
      .then(response => response.json())
      .then((data: ApiResponse<Post[]>) => {
        const allPosts = data.payload.data;
        const commentPromises = allPosts.map(post =>
          fetch(`http://localhost:8080/posts/${post.post_id}/comments`)
            .then(res => res.json())
        );
        return Promise.all(commentPromises);
      })
      .then((commentsData: ApiResponse<Comment[]>[]) => {
        const allComments = commentsData.flatMap(data => data.payload.data);
        const userComments = allComments.filter(comment => comment.user_id === currentUserId);
        setComments(userComments);
      })
      .catch(err => console.error('Failed to fetch comments:', err));
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
            const response = await fetch(`http://localhost:8080/posts/${postId}`, {
            method: 'DELETE',
            });

            if (response.ok) {
            fetchUserPosts();
            setDeletingPostId(null);
            setDeleteConfirmOpen(false);
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
        } finally {
            setIsDeleting(false);
        }
    };
// Handle edit comment action
  const handleEditComment = (comment: Comment) => {
    // TODO: Open edit modal or inline edit
    console.log('Edit comment:', comment);
  };

  // Handle delete comment action
  const handleDeleteComment = (commentId: number) => {
    // TODO: Show confirmation and delete
    console.log('Delete comment:', commentId);
  };

  if (loading) return <Box sx={{ p: 3 }}><Typography>Loading...</Typography></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Profile Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#d7dadc', fontWeight: 700, mb: 1 }}>
          My Profile
        </Typography>
        <Typography sx={{ color: '#818384' }}>
          User {currentUserId}
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
          onDelete={handleDeleteComment} 
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
    </Container>
  );
};