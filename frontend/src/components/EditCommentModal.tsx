import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { Comment } from '../types/api';

interface EditCommentModalProps {
  open: boolean;
  comment: Comment | null;
  onClose: () => void;
  onCommentUpdated: () => void;
}

export const EditCommentModal: React.FC<EditCommentModalProps> = ({ open, comment, onClose, onCommentUpdated }) => {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (comment) {
      setBody(comment.body);
    }
  }, [comment]);

  const handleSubmit = async () => {
    if (!body.trim() || !comment) return;

    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8080/posts/${comment.post_id}/comments/${comment.comment_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: body.trim(),
        }),
      });

      if (response.ok) {
        onCommentUpdated();
        onClose();
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
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
        Edit Comment
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <TextField
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What are your thoughts?"
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
          }}
        />
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
          disabled={submitting || !body.trim()}
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