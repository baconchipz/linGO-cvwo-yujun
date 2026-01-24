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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPost = {
      user_id: 1,
      title,
      body,
      module_id: 'CS2030', // TODO: Make this selectable
    };

    fetch('http://localhost:8080/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    })
      .then((response) => response.json())
      .then(() => {
        setTitle('');
        setBody('');
        onClose();
        onPostCreated();
      })
      .catch((err) => setError(err.message));
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
        <Button onClick={onClose} sx={{ color: '#818384', textTransform: 'none' }}>
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
  );
};