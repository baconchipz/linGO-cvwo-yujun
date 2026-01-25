import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
  InputAdornment,
} from '@mui/material';
import { useUser } from '../context/UserContext';

interface HeaderProps {
  onPostClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPostClick }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useUser();

  // handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const moduleMatch = searchQuery.match(/[a-zA-Z]*\d+/);
      if (moduleMatch) {
        const moduleCode = moduleMatch[0].toUpperCase();
        let asciiSum = 0;
        for (let i = 0; i < moduleCode.length; i++) {
          asciiSum += moduleCode.charCodeAt(i);
        }
        navigate(`/module/${asciiSum}`);
      } else {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
      setSearchQuery('');
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'transparent', pt: 1.5 }}>
      <Box
        sx={{
          px: 2,
          pb: 1.5,
          background: 'linear-gradient(90deg, #071021 0%, #081a34 50%, #081224 100%)',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Toolbar disableGutters sx={{ px: 2, minHeight: 72, gap: 2, display: 'flex', position: 'relative' }}>
            {/* Left: Logo + Nav links */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
              <Box
                onClick={() => handleNavigation('/')}
                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '10px',
                    background:
                      'radial-gradient(circle at 30% 30%, #44c3ff, #1e88ff 40%, #0d3b8a 80%)',
                    boxShadow: '0 8px 20px rgba(68,195,255,0.35)',
                  }}
                />
                <Typography variant="h6" fontWeight={700} color="#dce8ff">
                  linGO
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                <Button color="inherit" sx={{ color: '#dce8ff', textTransform: 'none', fontWeight: 600 }}
                  onClick={() => handleNavigation('/')}
                >
                  Home
                </Button>
                <Button color="inherit" sx={{ color: '#dce8ff', textTransform: 'none', fontWeight: 600 }}
                  onClick={() => handleNavigation('/modules')}
                >
                  My Modules
                </Button>
                <Button color="inherit" sx={{ color: '#dce8ff', textTransform: 'none', fontWeight: 600 }}
                  onClick={() => handleNavigation('/profile')}
                >
                  Profile
                </Button>
              </Stack>
            </Stack>

            {/* Center: Search - Absolutely positioned */}
            <Box 
              component="form" 
              onSubmit={handleSearch} 
              sx={{ 
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 350,
              }}
            >
              <TextField
                fullWidth
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search module codes"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ color: '#9fb6d6' }}>
                      🔍
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    color: '#e9f1ff',
                    '& .MuiInputBase-input::placeholder': { color: '#9fb6d6' },
                  },
                }}
              />
            </Box>

            {/* Right: Post button */}
            <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }}>
              {user && (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 1 }}>
                  <Typography sx={{ color: '#dce8ff', fontWeight: 600 }}>
                    {user.username}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleLogout}
                    sx={{
                      color: '#dce8ff',
                      borderColor: 'rgba(255,255,255,0.2)',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': { borderColor: '#dce8ff' },
                    }}
                  >
                    Logout
                  </Button>
                </Stack>
              )}
              <Button
                variant="contained"
                onClick={onPostClick}
                sx={{
                  bgcolor: '#0079d3',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  borderRadius: '20px',
                  '&:hover': { bgcolor: '#1484d6' },
                }}
              >
                Post
              </Button>
            </Stack>
          </Toolbar>
        </Paper>
      </Box>
    </AppBar>
  );
};
