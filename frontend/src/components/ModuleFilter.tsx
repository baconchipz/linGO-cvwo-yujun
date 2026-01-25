import React from 'react';
import { Box, Typography, List, ListItemButton, Button, Stack } from '@mui/material';

interface ModuleFilterProps {
  userModules: string[];
  selectedModule: string | null;
  sortBy: 'recent' | 'popular';
  onModuleSelect: (moduleCode: string | null) => void;
  onSortChange: (sort: 'recent' | 'popular') => void;
}

export const ModuleFilter: React.FC<ModuleFilterProps> = ({
  userModules,
  selectedModule,
  sortBy,
  onModuleSelect,
  onSortChange,
}) => {
  return (
    <Box
      sx={{
        width: '250px',
        position: 'sticky',
        top: 90,
        backgroundColor: '#0f1419',
        borderRight: '1px solid #1a1a1b',
        height: 'calc(100vh - 90px)',
        overflowY: 'auto',
        p: 2,
      }}
    >
      {/* home button */}
      <ListItemButton
        onClick={() => onModuleSelect(null)}
        sx={{
          borderRadius: '8px',
          mb: 2,
          backgroundColor: selectedModule === null ? '#1a1a1b' : 'transparent',
          color: selectedModule === null ? '#ff6b35' : '#818384',
          fontWeight: selectedModule === null ? 600 : 500,
          '&:hover': {
            backgroundColor: '#1a1a1b',
            color: selectedModule === null ? '#ff6b35' : '#ffffff',
          },
          fontSize: '14px',
          p: '10px 12px',
        }}
      >
        Home
      </ListItemButton>

      {/* my modules section */}
      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#818384',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          mb: 1.5,
          px: 1,
          mt: 2,
        }}
      >
        My Modules
      </Typography>

      {/* list of modules */}
      <List sx={{ p: 0 }}>
        {userModules.length > 0 ? (
          userModules.map((moduleCode) => (
            <ListItemButton
              key={moduleCode}
              onClick={() => onModuleSelect(moduleCode)}
              sx={{
                borderRadius: '8px',
                mb: 1,
                backgroundColor: selectedModule === moduleCode ? '#1a1a1b' : 'transparent',
                color: selectedModule === moduleCode ? '#ff6b35' : '#818384',
                fontWeight: selectedModule === moduleCode ? 600 : 500,
                '&:hover': {
                  backgroundColor: '#1a1a1b',
                  color: selectedModule === moduleCode ? '#ff6b35' : '#ffffff',
                },
                fontSize: '14px',
                p: '10px 12px',
              }}
            >
              {moduleCode}
            </ListItemButton>
          ))
        ) : (
          <Typography
            sx={{
              fontSize: '12px',
              color: '#565657',
              fontStyle: 'italic',
              px: 1,
            }}
          >
            No modules selected
          </Typography>
        )}
      </List>

      {/* sort section */}
      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#818384',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          mb: 1.5,
          px: 1,
          mt: 3,
        }}
      >
        Sort By
      </Typography>

      {/* sort buttons */}
      <Stack spacing={1}>
        <Button
          onClick={() => onSortChange('recent')}
          sx={{
            backgroundColor: sortBy === 'recent' ? '#1a1a1b' : 'transparent',
            color: sortBy === 'recent' ? '#ff6b35' : '#818384',
            fontWeight: sortBy === 'recent' ? 600 : 500,
            '&:hover': {
              backgroundColor: '#1a1a1b',
              color: sortBy === 'recent' ? '#ff6b35' : '#ffffff',
            },
            fontSize: '14px',
            p: '10px 12px',
            textTransform: 'none',
            justifyContent: 'flex-start',
          }}
        >
          Day Posted
        </Button>
        <Button
          onClick={() => onSortChange('popular')}
          sx={{
            backgroundColor: sortBy === 'popular' ? '#1a1a1b' : 'transparent',
            color: sortBy === 'popular' ? '#ff6b35' : '#818384',
            fontWeight: sortBy === 'popular' ? 600 : 500,
            '&:hover': {
              backgroundColor: '#1a1a1b',
              color: sortBy === 'popular' ? '#ff6b35' : '#ffffff',
            },
            fontSize: '14px',
            p: '10px 12px',
            textTransform: 'none',
            justifyContent: 'flex-start',
          }}
        >
          Popularity
        </Button>
      </Stack>
    </Box>
  );
};
