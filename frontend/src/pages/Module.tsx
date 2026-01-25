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
import { Post, Module as ModuleType } from '../types/api';
import * as api from '../api/client';

export const Module: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [module, setModule] = useState<ModuleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (moduleId) {
      fetchModulePosts();
    }
  }, [moduleId]);

  const fetchModulePosts = async () => {
    try {
      console.log('Loading module posts for:', moduleId);
      // get posts and module info
      const postsRes = await api.listPosts();
      const moduleRes = await api.getModule(moduleId!);
      
      // filter posts for this module
      const filtered = postsRes.payload.data.filter(
        post => post.module_id === moduleId
      );
      console.log('Found posts:', filtered.length);
      setPosts(filtered);
      setModule(moduleRes.payload.data);
      setLoading(false);
    } catch (err) {
      console.log('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load posts');
      setLoading(false);
    }
  };

  if (loading) return <Box sx={{ p: 3 }}><Typography>Loading...</Typography></Box>;
  if (error) return <Box sx={{ p: 3 }}><Typography color="error">Error: {error}</Typography></Box>;

  return (
    <>
      <ModuleBanner moduleCode={module?.module_code || moduleId || ''} postCount={posts.length} />

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