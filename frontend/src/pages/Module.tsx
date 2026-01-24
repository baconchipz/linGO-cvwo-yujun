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
import { Post, ApiResponse } from '../types/api';

export const Module: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/posts')
      .then(response => response.json())
      .then((data: ApiResponse<Post[]>) => {
        // Filter posts by module code (case-insensitive)
        const modulePosts = data.payload.data.filter(
          post => post.module_id.toUpperCase() === moduleId?.toUpperCase()
        );
        setPosts(modulePosts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [moduleId]);

  if (loading) return <Box sx={{ p: 3 }}><Typography>Loading...</Typography></Box>;

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