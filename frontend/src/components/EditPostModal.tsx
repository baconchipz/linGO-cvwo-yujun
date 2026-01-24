import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { Post } from '../types/api';

interface EditPostModalProps {
  open: boolean;
  post: Post | null;
  onClose: () => void;
  onPostUpdated: () => void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({ open, post, onClose, onPostUpdated }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
      setModuleId(post.module_id);
    }
  }, [post]);

 // Handle post update submission
  const handleSubmit = async () => {
    if (!title.trim() || !body.trim() || !moduleId.trim() || !post) return;

    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8080/posts/${post.post_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          module_id: moduleId.trim().toUpperCase(),
        }),
      });

      if (response.ok) {
        onPostUpdated();
        onClose();
      }
    } catch (error) {
      console.error('Failed to update post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { bgcolor: '#1a1a1b', color: '#d7dadc' }
      }}
    >
      <DialogTitle sx={{ color: '#d7dadc', borderBottom: '1px solid #343536' }}>
        Edit Post
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Module ID"
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            placeholder="e.g. CS2030"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#d7dadc',
                '& fieldset': { borderColor: '#343536' },
                '&:hover fieldset': { borderColor: '#818384' },
                '&.Mui-focused fieldset': { borderColor: '#0079d3' },
              },
              '& .MuiInputLabel-root': { color: '#818384' },
            }}
          />
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#d7dadc',
                '& fieldset': { borderColor: '#343536' },
                '&:hover fieldset': { borderColor: '#818384' },
                '&.Mui-focused fieldset': { borderColor: '#0079d3' },
              },
              '& .MuiInputLabel-root': { color: '#818384' },
            }}
          />
          <TextField
            label="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Text (optional)"
            multiline
            rows={4}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#d7dadc',
                '& fieldset': { borderColor: '#343536' },
                '&:hover fieldset': { borderColor: '#818384' },
                '&.Mui-focused fieldset': { borderColor: '#0079d3' },
              },
              '& .MuiInputLabel-root': { color: '#818384' },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid #343536', p: 2 }}>
        <Button 
          onClick={onClose}
          sx={{ color: '#818384', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting || !title.trim() || !body.trim() || !moduleId.trim()}
          variant="contained"
          sx={{
            bgcolor: '#0079d3',
            color: '#fff',
            textTransform: 'none',
            '&:hover': { bgcolor: '#0066b8' },
            '&:disabled': { bgcolor: '#343536', color: '#818384' },
          }}
        >
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};