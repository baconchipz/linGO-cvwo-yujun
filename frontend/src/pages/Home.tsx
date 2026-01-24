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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/ChatBubbleOutline';
import { Post, ApiResponse } from '../types/api';

interface HomeProps {
  openCreatePost: boolean;
  onCloseCreatePost: () => void;
}

export const Home: React.FC<HomeProps> = ({ openCreatePost, onCloseCreatePost }) => {
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
        onCloseCreatePost();
        fetchPosts();
      })
      .catch(err => setError(err.message));
  };

  if (loading) return <Box sx={{ p: 3 }}><Typography>Loading posts...</Typography></Box>;
  if (error) return <Box sx={{ p: 3 }}><Typography color="error">Error: {error}</Typography></Box>;

  return (
    <>
      {/* Create Post Modal */}
      <Dialog 
        open={openCreatePost} 
        onClose={onCloseCreatePost}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1b',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ color: '#d7dadc', borderBottom: '1px solid #343536' }}>
          Create Post
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box component="form" onSubmit={handleSubmit} id="create-post-form">
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
              rows={6}
              placeholder="What's on your mind?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              sx={{
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #343536' }}>
          <Button 
            onClick={onCloseCreatePost}
            sx={{ color: '#818384', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-post-form"
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
        </DialogActions>
      </Dialog>

      {/* Posts Feed */}
      <Container maxWidth="md" sx={{ py: 3 }}>
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
                </Box>

                {/* Content Section */}
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography
                      variant="caption"
                      sx={{ 
                        color: '#d7dadc',
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      m/{post.module_id}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: '#818384' }}
                    >
                      • Posted by User {post.user_id} • {new Date(post.created_at).toLocaleDateString()}
                    </Typography>
                  </Stack>
                  
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#ff5722',
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
                  </Stack>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
    </>
  );
};