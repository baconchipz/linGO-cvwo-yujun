import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Divider,
  Button,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/ChatBubbleOutline';
import { Post } from '../types/api';

interface PostcardProps {
    post: Post;
    showModule?: boolean;
}

export const Postcard: React.FC<PostcardProps> = ({ post, showModule = true }) => {
    const navigate = useNavigate();

  return (
    <Card sx={{ bgcolor: '#1a1a1b', borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Vote Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 40,
            }}
          >
            <IconButton size="small" sx={{ color: '#818384' }}>
              <ThumbUpIcon fontSize="small" />
            </IconButton>
            <Typography sx={{ color: '#d7dadc', fontWeight: 600, fontSize: 14 }}>
              {post.like_count}
            </Typography>
          </Box>

          {/* Content Section */}
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              {showModule && (
                <Typography
                  variant="caption"
                  sx={{
                    color: '#d7dadc',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  m/{post.module_id}
                </Typography>
              )}
              <Typography variant="caption" sx={{ color: '#818384' }}>
                {showModule && '•'} Posted by User {post.user_id} • {new Date(post.created_at).toLocaleDateString()}
              </Typography>
            </Stack>

            <Typography
              variant="h6"
              sx={{
                color: '#ff5722',
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

            <Typography sx={{ color: '#d7dadc', mb: 2 }}>
              {post.body}
            </Typography>

            <Divider sx={{ bgcolor: '#343536', mb: 1 }} />

            {/* Action Buttons */}
            <Stack direction="row" spacing={1}>
              <Button
                startIcon={<CommentIcon />}
                size="small"
                sx={{
                  color: '#818384',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#272729' },
                }}
                onClick={() => navigate(`/post/${post.post_id}`)}
              >
                Comment
              </Button>
            </Stack>
          </Box>
        </Box>
      </CardContent>
      </Card>
    );
  };