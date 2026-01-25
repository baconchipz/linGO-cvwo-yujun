import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, Typography } from '@mui/material';
import * as api from '../api/client';
import { useUser } from '../context/UserContext';
import { User } from '../types/api';

type Props = { open: boolean };

export const LoginModal: React.FC<Props> = ({ open }) => {
  const { setUser } = useUser();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = username.trim();
    if (!name) {
      setError('Please enter a username.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const all = await api.listUsers();
      const match = (all.payload.data || []).find((u: User) => u.username.toLowerCase() === name.toLowerCase());
      let result: User;
      if (match) {
        result = match;
      } else {
        const created = await api.createUser(name, '');
        result = created.payload.data as User;
      }
      setUser(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Sign in</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography>Pick a username. If it is new we will create it.</Typography>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              fullWidth
              disabled={loading}
            />
            {error && <Typography color="error" fontSize={14}>{error}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 3 }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Signing in...' : 'Continue'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};