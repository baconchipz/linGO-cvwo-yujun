import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import * as api from '../api/client';
import { Module } from '../types/api';

export const ModuleSelection: React.FC = () => {
  const [allModules, setAllModules] = useState<Module[]>([]);
  const [userModules, setUserModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // get all modules when component loads
  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      console.log('Getting all modules...');
      const res = await api.listModules();
      if (res.payload.data) {
        console.log('Got modules:', res.payload.data);
        setAllModules(res.payload.data);
      }
      setLoading(false);
    } catch (err) {
      console.log('Error loading modules:', err);
      setLoading(false);
    }
  };

  // add module to my modules
  const handleAddModule = (moduleId: string) => {
    console.log('Adding module:', moduleId);
    setUserModules([...userModules, moduleId]);
  };

  // remove module from my modules
  const handleRemoveModule = (moduleId: string) => {
    console.log('Removing module:', moduleId);
    setUserModules(userModules.filter(id => id !== moduleId));
  };

  // check if module is selected
  const isSelected = (moduleId: string) => {
    return userModules.includes(moduleId);
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
        {userModules.length === 0 ? (
          <Typography sx={{ color: '#818384', fontStyle: 'italic' }}>
            No modules selected yet. Click on modules below to add them.
          </Typography>
        ) : (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {userModules.map((moduleId) => {
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

      {/* Debug info */}
      {userModules.length > 0 && (
        <Box sx={{ mt: 4, p: 2, bgcolor: '#1a1a1b', borderRadius: 2 }}>
          <Typography variant="caption" sx={{ color: '#818384' }}>
            Selected module IDs: {userModules.join(', ')}
          </Typography>
        </Box>
      )}
    </Container>
  );
};
