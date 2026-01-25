import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import * as api from '../api/client';
export function TestApiIntegration() {
    const [users, setUsers] = useState([]);
    const [modules, setModules] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        fetchAll();
    }, []);
    const fetchAll = async () => {
        setLoading(true);
        setError('');
        try {
            const usersRes = await api.listUsers();
            setUsers(usersRes.payload.data);
            const modulesRes = await api.listModules();
            setModules(modulesRes.payload.data);
            const postsRes = await api.listPosts();
            setPosts(postsRes.payload.data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
        setLoading(false);
    };
    return (_jsxs("div", { style: { padding: '20px' }, children: [_jsx("h2", { children: "API Integration Test" }), error && _jsxs("p", { style: { color: 'red' }, children: ["Error: ", error] }), loading && _jsx("p", { children: "Loading..." }), _jsxs("div", { style: { marginTop: '20px' }, children: [_jsxs("h3", { children: ["Users (", users.length, ")"] }), _jsx("ul", { children: users.map((user) => (_jsx("li", { children: user.username }, user.user_id))) })] }), _jsxs("div", { style: { marginTop: '20px' }, children: [_jsxs("h3", { children: ["Modules (", modules.length, ")"] }), _jsx("ul", { children: modules.map((mod) => (_jsx("li", { children: mod.module_title }, mod.module_id))) })] }), _jsxs("div", { style: { marginTop: '20px' }, children: [_jsxs("h3", { children: ["Posts (", posts.length, ")"] }), _jsx("ul", { children: posts.map((post) => (_jsx("li", { children: post.title }, post.post_id))) })] }), _jsx("button", { onClick: fetchAll, style: { marginTop: '20px', padding: '10px 20px' }, children: "Refresh" })] }));
}
