import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Stack,
  Divider,
  Container,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import { Post, ApiResponse } from '../types/api';

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPost = {
      user_id: 1,
      title,
      body,
      module_id: 1
    };

    fetch('http://localhost:8080/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
      .then(response => response.json())
      .then(() => {
        setTitle('');
        setBody('');
        fetchPosts();
      })
      .catch(err => setError(err.message));
  };

  if (loading) return <Box sx={{ p: 3 }}><Typography>Loading posts...</Typography></Box>;
  if (error) return <Box sx={{ p: 3 }}><Typography color="error">Error: {error}</Typography></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Create Post Card */}
      <Card sx={{ mb: 2, bgcolor: '#1a1a1b', borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#d7dadc' }}>
            Create Post
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              sx={{
                mb: 2,
                '& .MuiInputBase-root': {
                  bgcolor: '#272729',
                  color: '#d7dadc',
                  borderRadius: 1,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#343536',
                },
              }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="What's on your mind?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              sx={{
                mb: 2,
                '& .MuiInputBase-root': {
                  bgcolor: '#272729',
                  color: '#d7dadc',
                  borderRadius: 1,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#343536',
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: '#0079d3',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:hover': { bgcolor: '#1484d6' },
              }}
            >
              Post
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <Stack spacing={2}>
        {posts.map(post => (
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
                  <IconButton size="small" sx={{ color: '#818384' }}>
                    <ThumbDownIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Content Section */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: '#818384', display: 'block', mb: 0.5 }}
                  >
                    Posted {new Date(post.created_at).toLocaleDateString()}
                  </Typography>
                  
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#d7dadc',
                      fontWeight: 500,
                      mb: 1,
                      fontSize: 18,
                    }}
                  >
                    {post.title}
                  </Typography>
                  
                  <Typography sx={{ color: '#d7dadc', mb: 2 }}>
                    {post.body}
                  </Typography>

                  <Divider sx={{ bgcolor: '#343536', mb: 1 }} />

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={1}>
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
                    <Button
                      startIcon={<ShareIcon />}
                      size="small"
                      sx={{
                        color: '#818384',
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#272729' },
                      }}
                    >
                      Share
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};