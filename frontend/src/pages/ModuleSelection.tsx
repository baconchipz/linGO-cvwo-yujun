import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import { useUser } from '../context/UserContext';
import * as api from '../api/client';
import { Module } from '../types/api';

export const ModuleSelection: React.FC = () => {
  const { user } = useUser();
  const [allModules, setAllModules] = useState<Module[]>([]);
  const [userModuleIds, setUserModuleIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch all modules and user's selected modules on load
  useEffect(() => {
    fetchModules();
    if (user) {
      fetchUserModules();
    }
  }, [user]);

  const fetchModules = async () => {
    try {
      console.log('Getting all modules');
      const res = await api.listModules();
      if (res.payload.data) {
        console.log('Got modules:', res.payload.data);
        setAllModules(res.payload.data);
      }
      setLoading(false);
    } catch (err) {
      console.log('Error loading modules', err);
      setLoading(false);
    }
  };

  const fetchUserModules = async () => {
    try {
      if (!user) return;
      console.log('Fetching user modules');
      const res = await api.getUserModules(user.user_id);
      const mods = res.payload.data || [];
      const ids = mods.map((m: any) => m.module_id);
      console.log('Got user module ids:', ids);
      setUserModuleIds(ids);
    } catch (err) {
      console.log('Error loading user modules', err);
    }
  };

  // subscribe to module and save to backend
  const handleAddModule = async (moduleId: string) => {
    try {
      if (!user) return;
      console.log('Adding module:', moduleId);
      await api.subscribeToModule(user.user_id, moduleId);
      setUserModuleIds([...userModuleIds, moduleId]);
    } catch (err) {
      console.log('Error subscribing to module', err);
    }
  };

  // unsubscribe from module and save to backend
  const handleRemoveModule = async (moduleId: string) => {
    try {
      if (!user) return;
      console.log('Removing module:', moduleId);
      await api.unsubscribeFromModule(user.user_id, moduleId);
      setUserModuleIds(userModuleIds.filter(id => id !== moduleId));
    } catch (err) {
      console.log('Error unsubscribing from module', err);
    }
  };

  // check if module is selected
  const isSelected = (moduleId: string) => {
    return userModuleIds.includes(moduleId);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography sx={{ color: '#d7dadc' }}>Loading modules...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* My Modules Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: '#d7dadc', mb: 2, fontWeight: 600 }}>
          My Modules
        </Typography>
        {userModuleIds.length === 0 ? (
          <Typography sx={{ color: '#818384', fontStyle: 'italic' }}>
            No modules selected yet. Click on modules below to add them.
          </Typography>
        ) : (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {userModuleIds.map((moduleId) => {
              const module = allModules.find(m => m.module_id === moduleId);
              return (
                <Chip
                  key={moduleId}
                  label={module?.module_code || moduleId}
                  onDelete={() => handleRemoveModule(moduleId)}
                  sx={{
                    bgcolor: '#0079d3',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 14,
                    mb: 1,
                    '&:hover': {
                      bgcolor: '#1484d6',
                    },
                    '& .MuiChip-deleteIcon': {
                      color: '#fff',
                      '&:hover': {
                        color: '#ff4444',
                      },
                    },
                  }}
                />
              );
            })}
          </Stack>
        )}
      </Box>

      {/* Available Modules Section */}
      <Box>
        <Typography variant="h5" sx={{ color: '#d7dadc', mb: 2, fontWeight: 600 }}>
          Available Modules
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 2,
          }}
        >
          {allModules.map((module) => {
            const selected = isSelected(module.module_id);
            return (
              <Button
                key={module.module_id}
                onClick={() => {
                  if (selected) {
                    handleRemoveModule(module.module_id);
                  } else {
                    handleAddModule(module.module_id);
                  }
                }}
                variant={selected ? 'contained' : 'outlined'}
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1,
                  px: 2,
                  border: selected ? 'none' : '2px solid #343536',
                  bgcolor: selected ? '#0079d3' : 'transparent',
                  color: selected ? '#fff' : '#d7dadc',
                  '&:hover': {
                    bgcolor: selected ? '#1484d6' : 'rgba(255, 255, 255, 0.08)',
                    borderColor: selected ? 'none' : '#818384',
                  },
                }}
              >
                {module.module_code}
              </Button>
            );
          })}
        </Box>
      </Box>

      {/* debug info */}
      {userModuleIds.length > 0 && (
        <Box sx={{ mt: 4, p: 2, bgcolor: '#1a1a1b', borderRadius: 2 }}>
          <Typography variant="caption" sx={{ color: '#818384' }}>
            Selected module IDs: {userModuleIds.join(', ')}
          </Typography>
        </Box>
      )}
    </Container>
  );
};
