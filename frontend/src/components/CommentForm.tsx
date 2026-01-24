import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,           
} from '@mui/material';

interface CommentFormProps {
    postId: number;
    onCommentAdded: () => void;
}

// Component for submitting a new comment
export const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentAdded }) => {
    const [body, setBody] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!body.trim()) return;

        setSubmitting(true);
        try{
            const response = await fetch(`http://localhost:8080/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    user_id: 1, // TODO: Replace with actual user ID
                    body: body.trim(),
                }),
            });

            if (response.ok) {
                setBody('');
                onCommentAdded();
            } else {
                console.error('Failed to submit comment');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
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