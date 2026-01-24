import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Postcard } from '../components/Postcard';
import {
  Box,
  Typography,
  Stack,
  Container,
  Avatar,
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
      {/* Module Header Banner */}
      <Box
        sx={{
          bgcolor: '#1a1a1b',
          borderBottom: '1px solid #343536',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ py: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#ff5722',
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              {moduleId?.replace(/\d+/g, '') || 'M'}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ color: '#d7dadc', fontWeight: 700, mb: 0.5 }}>
                m/{moduleId}
              </Typography>
              <Typography sx={{ color: '#818384' }}>
                Module • {posts.length} posts
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

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