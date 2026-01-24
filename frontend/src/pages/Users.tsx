import React, {useEffect, useState} from "react";
import { User } from "../types/api";
import * as api from "../api/client";
import { Box, Typography, Container, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

export const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.listUsers();
            setUsers(response.payload.data || []);
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load users');
            setLoading(false);
        }
    };

    if (loading) {
        return <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Box sx={{ p: 3 }}><Typography color="error">Error: {error}</Typography></Box>;
    }

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Users ({users.length})</Typography>
            <List>
                {users.map(user => (
                    <ListItem key={user.user_id}>
                        <ListItemText
                            primary={user.username}
                            secondary={`ID: ${user.user_id} | Joined: ${new Date(user.created_at).toLocaleDateString()}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}

// This functional react component uses react hook to fetch a list of users from local go backend upon mounting, 
// at the same time managing the application's state through loading error and data success phases to render list of users.