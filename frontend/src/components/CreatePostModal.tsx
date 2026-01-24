import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import * as api from '../api/client';

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  open,
  onClose,
  onPostCreated,
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [moduleId, setModuleId] = useState('1');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.createPost(1, title, body, parseInt(moduleId) || 1);
      setTitle('');
      setBody('');
      setModuleId('1');
      onClose();
      onPostCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
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
      slotProps={{
        paper: {
          sx: {
            bgcolor: '#1a1a1b',
            borderRadius: 2,
          },
        },
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
            select
            label="Module"
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            SelectProps={{
              native: true,
            }}
            sx={{
              mb: 2,
              '& .MuiInputBase-root': {
                bgcolor: '#272729',
                color: '#d7dadc',
                borderRadius: 1,
              },
            }}
          >
            <option value="1">CS2030</option>
            <option value="2">CS2040</option>
            <option value="3">CS3230</option>
          </TextField>
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
          {error && (
            <Box sx={{ color: '#ea4033', mt: 1, fontSize: '0.875rem' }}>
              {error}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #343536' }}>
        <Button onClick={onClose} sx={{ color: '#818384', textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="create-post-form"
          variant="contained"
          disabled={submitting || !title || !body}
          sx={{
            bgcolor: '#0079d3',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            '&:hover': { bgcolor: '#1484d6' },
            '&:disabled': { bgcolor: '#818384', color: '#666' },
          }}
        >
          {submitting ? 'Posting...' : 'Post'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};