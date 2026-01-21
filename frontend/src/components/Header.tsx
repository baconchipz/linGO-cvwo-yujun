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

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
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
          <Toolbar disableGutters sx={{ px: 2, minHeight: 72, gap: 2 }}>
            {/* Logo / brand */}
            <Stack direction="row" spacing={1.5} alignItems="center">
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
            </Stack>

            {/* Nav links */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 2 }}>
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

            {/* Spacer */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Search */}
            <Box component="form" onSubmit={handleSearch} sx={{ minWidth: 260 }}>
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
          </Toolbar>
        </Paper>
      </Box>
    </AppBar>
  );
};
