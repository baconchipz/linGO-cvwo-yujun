import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Postcard } from '../components/Postcard';
import { ModuleBanner } from '../components/ModuleBanner';
import { Box, Typography, Stack, Container, } from '@mui/material';
import * as api from '../api/client';
export const Module = () => {
    const { moduleId } = useParams();
    const [posts, setPosts] = useState([]);
    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (moduleId) {
            fetchModulePosts();
        }
    }, [moduleId]);
    const fetchModulePosts = async () => {
        try {
            console.log('Loading module posts for:', moduleId);
            // get posts and module info
            const postsRes = await api.listPosts();
            const moduleRes = await api.getModule(moduleId);
            // filter posts for this module
            const filtered = postsRes.payload.data.filter(post => post.module_id === moduleId);
            console.log('Found posts:', filtered.length);
            setPosts(filtered);
            setModule(moduleRes.payload.data);
            setLoading(false);
        }
        catch (err) {
            console.log('Error:', err);
            setError(err instanceof Error ? err.message : 'Failed to load posts');
            setLoading(false);
        }
    };
    if (loading)
        return _jsx(Box, { sx: { p: 3 }, children: _jsx(Typography, { children: "Loading..." }) });
    if (error)
        return _jsx(Box, { sx: { p: 3 }, children: _jsxs(Typography, { color: "error", children: ["Error: ", error] }) });
    return (_jsxs(_Fragment, { children: [_jsx(ModuleBanner, { moduleCode: module?.module_code || moduleId || '', postCount: posts.length }), _jsx(Container, { maxWidth: "md", sx: { py: 3 }, children: _jsx(Stack, { spacing: 2, children: posts.length === 0 ? (_jsx(Typography, { sx: { color: '#818384', textAlign: 'center', py: 4 }, children: "No posts in this module yet" })) : (posts.map((post) => (_jsx(Postcard, { post: post, showModule: false }, post.post_id)))) }) })] }));
};
