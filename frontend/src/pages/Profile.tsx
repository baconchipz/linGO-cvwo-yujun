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

export const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mock user ID - replace with actual auth later
  const currentUserId = 1;

  useEffect(() => {
    fetchUserPosts();
    fetchUserComments();
  }, []);

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

  const handleEditPost = (post: Post) => {
    // TODO: Open edit modal
    console.log('Edit post:', post);
  };

  const handleDeletePost = (postId: number) => {
    // TODO: Show confirmation and delete
    console.log('Delete post:', postId);
  };

  const handleEditComment = (comment: Comment) => {
    // TODO: Open edit modal or inline edit
    console.log('Edit comment:', comment);
  };

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
          onDelete={handleDeletePost} 
        />
      )}
      
      {activeTab === 1 && (
        <ProfileCommentsTab 
          comments={comments} 
          onEdit={handleEditComment} 
          onDelete={handleDeleteComment} 
        />
      )}
    </Container>
  );
};