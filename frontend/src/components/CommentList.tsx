import React from 'react';
import { Box, Typography, IconButton, Stack, Divider } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Comment } from '../types/api';

interface CommentListProps {
  comments: Comment[];
}

export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (comments.length === 0) {
    return (
      <Typography sx={{ color: '#818384', fontStyle: 'italic', mt: 3 }}>
        No comments yet. Be the first to comment!
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography sx={{ color: '#d7dadc', mb: 2, fontWeight: 500 }}>
        Comments ({comments.length})
      </Typography>
      <Stack spacing={2}>
        {comments.map((comment) => (
          <Box key={comment.comment_id}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Vote Section */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: 32,
                }}
              >
                <IconButton size="small" sx={{ color: '#818384', p: 0.5 }}>
                  <ThumbUpIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ color: '#818384', fontSize: 12, fontWeight: 600 }}>
                  {comment.like_count}
                </Typography>
              </Box>

              {/* Comment Content */}
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#818384', fontWeight: 600 }}>
                    User {comment.user_id}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#818384' }}>
                    • {new Date(comment.created_at).toLocaleDateString()}
                  </Typography>
                </Stack>
                <Typography sx={{ color: '#d7dadc', fontSize: 14, lineHeight: 1.5 }}>
                  {comment.body}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ bgcolor: '#343536', mt: 2 }} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};