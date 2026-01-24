import React from 'react';
import { Box, Typography, Container, Avatar } from '@mui/material';

interface ModuleBannerProps {
  moduleId: string;
  postCount: number;
}

export const ModuleBanner: React.FC<ModuleBannerProps> = ({ moduleId, postCount }) => {
  return (
    <Box
      sx={{
        bgcolor: '#1a1a1b',
        borderBottom: '1px solid #343536',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ py: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: '#ff5722',
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            {moduleId?.replace(/\d+/g, '') || 'M'}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ color: '#d7dadc', fontWeight: 700, mb: 0.5 }}>
              m/{moduleId}
            </Typography>
            <Typography sx={{ color: '#818384' }}>
              Module • {postCount} posts
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
