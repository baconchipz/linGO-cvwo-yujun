import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,           
} from '@mui/material';
import * as api from '../api/client';

interface CommentFormProps {
    postId: number;
    onCommentAdded: () => void;
}

// Component for submitting a new comment
export const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentAdded }) => {
    const [body, setBody] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!body.trim()) return;

        setSubmitting(true);
        setError(null);
        try {
            await api.createComment(postId, 1, body.trim());
            setBody('');
            onCommentAdded();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit comment');
            console.error('Error submitting comment:', err);
        } finally {
            setSubmitting(false);
        }
    };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography sx={{ color: '#d7dadc', mb: 2, fontWeight: 500 }}>
        Add a comment
      </Typography>
      <TextField
        multiline
        rows={3}
        fullWidth
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What are your thoughts?"
        sx={{
          bgcolor: '#272729',
          borderRadius: 1,
          '& .MuiOutlinedInput-root': {
            color: '#d7dadc',
            '& fieldset': { borderColor: '#343536' },
            '&:hover fieldset': { borderColor: '#818384' },
            '&.Mui-focused fieldset': { borderColor: '#0079d3' },
          },
          '& .MuiInputBase-input::placeholder': {
            color: '#818384',
            opacity: 1,
          },
        }}
      />
      {error && (
        <Box sx={{ color: '#ea4033', mt: 1, fontSize: '0.875rem' }}>
          {error}
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || !body.trim()}
          sx={{
            bgcolor: '#0079d3',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { bgcolor: '#0066b8' },
            '&:disabled': { bgcolor: '#343536', color: '#818384' },
          }}
        >
          {submitting ? 'Posting...' : 'Comment'}
        </Button>
      </Box>
    </Box>
  );
}