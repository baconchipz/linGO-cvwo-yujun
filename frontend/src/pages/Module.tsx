import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Postcard } from '../components/Postcard';
import { ModuleBanner } from '../components/ModuleBanner';
import {
  Box,
  Typography,
  Stack,
  Container,
} from '@mui/material';
import { Post } from '../types/api';
import * as api from '../api/client';

export const Module: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (moduleId) {
      fetchModulePosts();
    }
  }, [moduleId]);

  const fetchModulePosts = async () => {
    try {
      const response = await api.listPosts();
      const moduleIdNum = parseInt(moduleId || '0');
      const modulePosts = response.payload.data.filter(
        post => post.module_id === moduleIdNum
      );
      setPosts(modulePosts);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
      setLoading(false);
    }
  };

  if (loading) return <Box sx={{ p: 3 }}><Typography>Loading...</Typography></Box>;
  if (error) return <Box sx={{ p: 3 }}><Typography color="error">Error: {error}</Typography></Box>;

  return (
    <>
      <ModuleBanner moduleId={moduleId || ''} postCount={posts.length} />

      {/* Posts Feed */}
      <Container maxWidth="md" sx={{ py: 3 }}>
<Stack spacing={2}>
  {posts.length === 0 ? (
    <Typography sx={{ color: '#818384', textAlign: 'center', py: 4 }}>
      No posts in this module yet
    </Typography>
  ) : (
    posts.map((post: Post) => (
      <Postcard key={post.post_id} post={post} showModule={false} />
    ))
  )}
</Stack>
      </Container>
    </>
  );
};