import React, { useState } from 'react';
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
import * as api from '../api/client';
import { useUser } from '../context/UserContext';

interface PostcardProps {
    post: Post;
    showModule?: boolean;
}

export const Postcard: React.FC<PostcardProps> = ({ post, showModule = true }) => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [likeCount, setLikeCount] = useState(post.like_count);
    const [isLiking, setIsLiking] = useState(false);
    const [hasLiked, setHasLiked] = useState(false);

    const handleLike = async () => {
      if (!user || hasLiked) {
        console.log('Cannot like: user not logged in or already liked');
        return;
      }
      try {
        setIsLiking(true);
        console.log('Liking post:', post.post_id);
        await api.likePost(post.post_id, user.user_id);
        setLikeCount(likeCount + 1);
        setHasLiked(true);
      } catch (err) {
        console.log('Error liking post', err);
      } finally {
        setIsLiking(false);
      }
    };

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
            <IconButton 
              size="small" 
              onClick={handleLike}
              disabled={isLiking || hasLiked}
              sx={{ 
                color: hasLiked ? '#ff6b35' : '#818384', 
                '&:hover': { color: '#ff6b35' },
                '&.Mui-disabled': {
                  color: hasLiked ? '#ff6b35' : '#818384',
                }
              }}
            >
              <ThumbUpIcon fontSize="small" />
            </IconButton>
            <Typography sx={{ color: '#d7dadc', fontWeight: 600, fontSize: 14 }}>
              {likeCount}
            </Typography>
          </Box>

          {/* Content Section */}
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              {showModule && (
                <Typography
                  variant="caption"
                  sx={{
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  m/{post.module_code}
                </Typography>
              )}
              <Typography variant="caption" sx={{ color: '#818384' }}>
                {showModule && '•'} Posted by {post.username || `User ${post.user_id}`} • {new Date(post.created_at).toLocaleDateString()}
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
                {post.comment_count} {post.comment_count === 1 ? 'Comment' : 'Comments'}
              </Button>
            </Stack>
          </Box>
        </Box>
      </CardContent>
      </Card>
    );
  };