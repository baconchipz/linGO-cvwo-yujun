import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Postcard } from '../components/Postcard';
import { CreatePostModal } from '../components/CreatePostModal';
import { ModuleFilter } from '../components/ModuleFilter';
import { Box, Typography, Stack, } from '@mui/material';
import { useUser } from '../context/UserContext';
import * as api from '../api/client';
export const Home = ({ openCreatePost, onCloseCreatePost }) => {
    const { user } = useUser();
    const [posts, setPosts] = useState([]);
    const [userModules, setUserModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [sortBy, setSortBy] = useState('recent');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
        }
        catch (err) {
            console.log('Error loading posts', err);
            setError(err instanceof Error ? err.message : 'Failed to load posts');
            setLoading(false);
        }
    };
    const fetchUserModules = async () => {
        try {
            if (!user)
                return;
            console.log('Fetching user modules');
            const res = await api.getUserModules(user.user_id);
            const mods = res.payload.data || [];
            const codes = mods.map((m) => m.module_code);
            console.log('Got user modules:', codes);
            setUserModules(codes);
        }
        catch (err) {
            console.log('Error loading user modules', err);
        }
    };
    const getFilteredPosts = () => {
        // if home (null), show all posts, otherwise filter by module
        let filtered = selectedModule === null ? posts : posts.filter(post => post.module_code === selectedModule);
        // sort by recent or popular
        if (sortBy === 'popular') {
            filtered = filtered.sort((a, b) => b.like_count - a.like_count);
        }
        else {
            filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        return filtered;
    };
    if (loading)
        return _jsx(Box, { sx: { p: 3 }, children: _jsx(Typography, { children: "Loading posts..." }) });
    if (error)
        return _jsx(Box, { sx: { p: 3 }, children: _jsxs(Typography, { color: "error", children: ["Error: ", error] }) });
    const filteredPosts = getFilteredPosts();
    return (_jsxs(_Fragment, { children: [_jsx(CreatePostModal, { open: openCreatePost, onClose: onCloseCreatePost, onPostCreated: fetchPosts }), _jsxs(Box, { sx: { display: 'flex', width: '100vw', backgroundColor: '#030303', minHeight: '100vh' }, children: [_jsx(ModuleFilter, { userModules: userModules, selectedModule: selectedModule, sortBy: sortBy, onModuleSelect: setSelectedModule, onSortChange: setSortBy }), _jsx(Box, { sx: { flex: 1, display: 'flex', justifyContent: 'center', px: 3, pt: 0, pb: 3 }, children: _jsx(Box, { sx: { width: '100%', maxWidth: '1000px' }, children: _jsx(Stack, { spacing: 2, children: filteredPosts.length > 0 ? (filteredPosts.map(post => (_jsx(Postcard, { post: post }, post.post_id)))) : (_jsx(Box, { sx: { p: 3, textAlign: 'center', color: '#818384' }, children: _jsx(Typography, { children: "No posts in this module" }) })) }) }) })] })] }));
};
