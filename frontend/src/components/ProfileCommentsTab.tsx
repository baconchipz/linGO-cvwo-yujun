import React from 'react';
import {
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Comment } from '../types/api';

interface ProfileCommentsTabProps {
  comments: Comment[];
  onEdit: (comment: Comment) => void;
  onDelete: (commentId: number) => void;
}

export const ProfileCommentsTab: React.FC<ProfileCommentsTabProps> = ({ comments, onEdit, onDelete }) => {
  if (comments.length === 0) {
    return (
      <Typography sx={{ color: '#818384', textAlign: 'center', py: 4 }}>
        You haven't made any comments yet
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {comments.map((comment) => (
        <Card key={comment.comment_id} sx={{ bgcolor: '#1a1a1b', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="caption" sx={{ color: '#818384', mb: 1 }}>
              {new Date(comment.created_at).toLocaleDateString()} • Post ID: {comment.post_id}
            </Typography>
            <Typography sx={{ 
              color: comment.body === 'User has deleted this comment' ? '#ff4444' : '#d7dadc',
              mb: 2 
            }}>
              {comment.body}
            </Typography>
            
            {comment.body !== 'User has deleted this comment' && (
              <Stack direction="row" spacing={1}>
                <Button
                  startIcon={<EditIcon />}
                  size="small"
                  onClick={() => onEdit(comment)}
                  sx={{
                    color: '#818384',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#272729' },
                  }}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  size="small"
                  onClick={() => onDelete(comment.comment_id)}
                  sx={{
                    color: '#818384',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#272729', color: '#ff4444' },
                  }}
                >
                  Delete
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};