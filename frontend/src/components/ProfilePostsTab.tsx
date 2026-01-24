import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  IconButton,
  Button,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Post } from '../types/api';

interface ProfilePostsTabProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (postId: number) => void;
}

export const ProfilePostsTab: React.FC<ProfilePostsTabProps> = ({ posts, onEdit, onDelete }) => {
  const navigate = useNavigate();

  if (posts.length === 0) {
    return (
      <Typography sx={{ color: '#818384', textAlign: 'center', py: 4 }}>
        You haven't created any posts yet
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {posts.map((post) => (
        <Card key={post.post_id} sx={{ bgcolor: '#1a1a1b', borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Vote Section */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 40 }}>
                <IconButton size="small" sx={{ color: '#818384' }}>
                  <ThumbUpIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ color: '#d7dadc', fontWeight: 600, fontSize: 14 }}>
                  {post.like_count}
                </Typography>
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#818384', mb: 0.5 }}>
                  m/{post.module_id} • {new Date(post.created_at).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: post.body === 'User has deleted this post' ? '#ff4444' : '#ff5722',
                    fontWeight: 500,
                    mb: 1,
                    fontSize: 18,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                  onClick={() => navigate(`/post/${post.post_id}`)}
                >
                  {post.title}
                </Typography>
                <Typography sx={{ 
                  color: post.body === 'User has deleted this post' ? '#ff4444' : '#d7dadc',
                  mb: 2 
                }}>
                  {post.body}
                </Typography>

                {/* Action Buttons */}
                {post.body !== 'User has deleted this post' && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      startIcon={<EditIcon />}
                      size="small"
                      onClick={() => onEdit(post)}
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
                      onClick={() => onDelete(post.post_id)}
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
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};