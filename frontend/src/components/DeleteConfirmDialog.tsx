import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

// Props for DeleteConfirmDialog component
interface DeleteConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting?: boolean;
}

// Delete confirmation dialog component
export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { bgcolor: '#1a1a1b', color: '#d7dadc' }
      }}
    >
      <DialogTitle sx={{ color: '#d7dadc', borderBottom: '1px solid #343536' }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Typography sx={{ color: '#818384' }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid #343536', p: 2 }}>
        <Button
          onClick={onCancel}
          disabled={isDeleting}
          sx={{ color: '#818384', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isDeleting}
          variant="contained"
          sx={{
            bgcolor: '#ff4444',
            color: '#fff',
            textTransform: 'none',
            '&:hover': { bgcolor: '#cc0000' },
            '&:disabled': { bgcolor: '#343536', color: '#818384' },
          }}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};