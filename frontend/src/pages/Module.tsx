import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Divider,
  Container,
  Avatar,
  Button,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/ChatBubbleOutline';
import { Post, ApiResponse } from '../types/api';

export const Module: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
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
            posts.map(post => (
              <Card key={post.post_id} sx={{ bgcolor: '#1a1a1b', borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Vote Section */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: 40,
                      }}
                    >
                      <IconButton size="small" sx={{ color: '#818384' }}>
                        <ThumbUpIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ color: '#d7dadc', fontWeight: 600, fontSize: 14 }}>
                        {post.like_count}
                      </Typography>
                    </Box>

                    {/* Content Section */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: '#818384', display: 'block', mb: 0.5 }}
                      >
                        Posted by User {post.user_id} • {new Date(post.created_at).toLocaleDateString()}
                      </Typography>
                      
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#ff5722',
                          fontWeight: 500,
                          mb: 1,
                          fontSize: 18,
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                        onClick={() => navigate(`/post/${post.post_id}`)}
                      >
                        {post.title}
                      </Typography>
                      
                      <Typography sx={{ color: '#d7dadc', mb: 2 }}>
                        {post.body}
                      </Typography>

                      <Divider sx={{ bgcolor: '#343536', mb: 1 }} />

                      <Button
                        startIcon={<CommentIcon />}
                        size="small"
                        sx={{
                          color: '#818384',
                          textTransform: 'none',
                          '&:hover': { bgcolor: '#272729' },
                        }}
                      >
                        Comment
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      </Container>
    </>
  );
};