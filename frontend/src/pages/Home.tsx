import React, { useEffect, useState } from 'react';
import { Postcard } from '../components/Postcard';
import {
  Box,
  TextField,
  Typography,
  Stack,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#1a1a1b',
              borderRadius: 2,
            }
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
  <Stack spacing={2}>
    {posts.map(post => (
      <Postcard key={post.post_id} post={post} />
    ))}
  </Stack>
</Container>
    </>
  );
};