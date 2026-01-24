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
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Post, ApiResponse } from '../types/api';


export const PostDetails: React.FC = () => {
    const { postId} = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // fetch post details by postId using a dedicated endpoint
        fetch(`http://localhost:8080/posts/${postId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data: any) => {
                const foundPost: Post | null =
                    (data && data.payload && data.payload.data) ? data.payload.data as Post : data as Post;

                if (foundPost) {
                    setPost(foundPost);
                } else {
                    setError('Post not found');
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [postId]);

    if (loading) return <Box sx={{ p: 3 }}><Typography>Loading...</Typography></Box>;
    if (error || !post) return <Box sx={{ p: 3 }}><Typography color="error">{error || 'Post not found'}</Typography></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          color: '#818384',
          textTransform: 'none',
          mb: 2,
          '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
        }}
      >
        Back
      </Button>

      {/* Post Card */}
      <Card sx={{ bgcolor: '#1a1a1b', borderRadius: 2 }}>
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
              {/* Module and Meta Info */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#d7dadc',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                  onClick={() => navigate(`/module/${post.module_id}`)}
                >
                  m/{post.module_id}
                </Typography>
                <Typography variant="caption" sx={{ color: '#818384' }}>
                  • Posted by User {post.user_id} • {new Date(post.created_at).toLocaleDateString()}
                </Typography>
              </Stack>

              {/* Title */}
              <Typography
                variant="h5"
                sx={{
                  color: '#ff5722',
                  fontWeight: 500,
                  mb: 2,
                }}
              >
                {post.title}
              </Typography>

              {/* Body */}
              <Typography
                sx={{
                  color: '#d7dadc',
                  mb: 3,
                  fontSize: 16,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {post.body}
              </Typography>

              <Divider sx={{ bgcolor: '#343536', my: 2 }} />

              {/* Comments Section Placeholder */}
              <Box sx={{ mt: 3 }}>
                <Typography sx={{ color: '#818384', fontStyle: 'italic' }}>
                  Comments coming soon...
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}