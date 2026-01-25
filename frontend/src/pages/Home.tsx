import React, { useEffect, useState } from 'react';
import { Postcard } from '../components/Postcard';
import { CreatePostModal } from '../components/CreatePostModal';
import { ModuleFilter } from '../components/ModuleFilter';
import {
  Box,
  Typography,
  Stack,
  Container,
} from '@mui/material';
import { Post } from '../types/api';
import { useUser } from '../context/UserContext';
import * as api from '../api/client';

interface HomeProps {
  openCreatePost: boolean;
  onCloseCreatePost: () => void;
}

export const Home: React.FC<HomeProps> = ({ openCreatePost, onCloseCreatePost }) => {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [userModules, setUserModules] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
    if (user) {
      fetchUserModules();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      console.log('Fetching posts');
      const res = await api.listPosts();
      console.log('Got posts:', res.payload.data);
      setPosts(res.payload.data || []);
      setLoading(false);
    } catch (err) {
      console.log('Error loading posts', err);
      setError(err instanceof Error ? err.message : 'Failed to load posts');
      setLoading(false);
    }
  };

  const fetchUserModules = async () => {
    try {
      if (!user) return;
      console.log('Fetching user modules');
      const res = await api.getUserModules(user.user_id);
      const mods = res.payload.data || [];
      const codes = mods.map((m: any) => m.module_code);
      console.log('Got user modules:', codes);
      setUserModules(codes);
    } catch (err) {
      console.log('Error loading user modules', err);
    }
  };

  const getFilteredPosts = () => {
    // if home (null), show all posts, otherwise filter by module
    let filtered = selectedModule === null ? posts : posts.filter(post => post.module_code === selectedModule);
    
    // sort by recent or popular
    if (sortBy === 'popular') {
      filtered = filtered.sort((a, b) => b.like_count - a.like_count);
    } else {
      filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    
    return filtered;
  };

  if (loading) return <Box sx={{ p: 3 }}><Typography>Loading posts...</Typography></Box>;
  if (error) return <Box sx={{ p: 3 }}><Typography color="error">Error: {error}</Typography></Box>;

  const filteredPosts = getFilteredPosts();

  return (
    <>
      {/* create post modal */}
      <CreatePostModal
        open={openCreatePost}
        onClose={onCloseCreatePost}
        onPostCreated={fetchPosts}
      />

      {/* main layout */}
      <Box sx={{ display: 'flex' }}>
        {/* left sidebar */}
        <ModuleFilter
          userModules={userModules}
          selectedModule={selectedModule}
          sortBy={sortBy}
          onModuleSelect={setSelectedModule}
          onSortChange={setSortBy}
        />

        {/* right feed */}
        <Box sx={{ flex: 1, backgroundColor: '#030303', minHeight: '100vh' }}>
          <Container maxWidth="md" sx={{ py: 3 }}>
            <Stack spacing={2}>
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <Postcard key={post.post_id} post={post} />
                ))
              ) : (
                <Box sx={{ p: 3, textAlign: 'center', color: '#818384' }}>
                  <Typography>No posts in this module</Typography>
                </Box>
              )}
            </Stack>
          </Container>
        </Box>
      </Box>
    </>
  );
};