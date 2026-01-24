import React, { useEffect, useState } from 'react';
import { Postcard } from '../components/Postcard';
import { CreatePostModal } from '../components/CreatePostModal';
import {
  Box,
  Typography,
  Stack,
  Container,
} from '@mui/material';
import { Post, ApiResponse } from '../types/api';

interface HomeProps {
  openCreatePost: boolean;
  onCloseCreatePost: () => void;
}

export const Home: React.FC<HomeProps> = ({ openCreatePost, onCloseCreatePost }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch('http://localhost:8080/posts')
      .then(response => response.json())
      .then((data: ApiResponse<Post[]>) => {
        setPosts(data.payload.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  if (loading) return <Box sx={{ p: 3 }}><Typography>Loading posts...</Typography></Box>;
  if (error) return <Box sx={{ p: 3 }}><Typography color="error">Error: {error}</Typography></Box>;

  return (
    <>
      {/* Create Post Modal */}
      <CreatePostModal
        open={openCreatePost}
        onClose={onCloseCreatePost}
        onPostCreated={fetchPosts}
      />

      {/* Posts Feed */}
      <Container maxWidth="md" sx={{ py: 3 }}>
  <Stack spacing={2}>
    {posts.map(post => (
      <Postcard key={post.post_id} post={post} />
    ))}
  </Stack>
</Container>
    </>
  );
};