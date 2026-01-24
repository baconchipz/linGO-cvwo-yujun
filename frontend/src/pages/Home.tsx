import React, { useEffect, useState } from 'react';
import { Postcard } from '../components/Postcard';
import { CreatePostModal } from '../components/CreatePostModal';
import {
  Box,
  Typography,
  Stack,
  Container,
} from '@mui/material';
import { Post } from '../types/api';
import * as api from '../api/client';

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

  const fetchPosts = async () => {
    try {
      const response = await api.listPosts();
      setPosts(response.payload.data || []);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
      setLoading(false);
    }
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