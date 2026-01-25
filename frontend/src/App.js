import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { TestApiIntegration } from './components/TestApiIntegration';
import './App.css';
import { Users } from './pages/Users';
import { Home } from './pages/Home';
import { Module } from './pages/Module';
import { PostDetail } from './pages/PostDetails';
import { Profile } from './pages/Profile';
import { ModuleSelection } from './pages/ModuleSelection';
import { UserProvider, useUser } from './context/UserContext';
import { LoginModal } from './components/LoginModal';
const Shell = () => {
    const { user } = useUser();
    const [openCreatePost, setOpenCreatePost] = useState(false);
    return (_jsxs(_Fragment, { children: [_jsx(Header, { onPostClick: () => setOpenCreatePost(true) }), _jsx("main", { className: "main-content", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, { openCreatePost: openCreatePost, onCloseCreatePost: () => setOpenCreatePost(false) }) }), _jsx(Route, { path: "/test", element: _jsx(TestApiIntegration, {}) }), _jsx(Route, { path: "/module/:moduleId", element: _jsx(Module, {}) }), _jsx(Route, { path: "/post/:postId", element: _jsx(PostDetail, {}) }), _jsx(Route, { path: "/modules", element: _jsx(ModuleSelection, {}) }), _jsx(Route, { path: "/profile", element: _jsx(Profile, {}) }), _jsx(Route, { path: "/users", element: _jsx(Users, {}) }), _jsx(Route, { path: "/search", element: _jsxs("div", { className: "placeholder", children: [_jsx("h2", { children: "Search Results" }), _jsx("p", { children: "Search results will appear here..." })] }) })] }) }), _jsx(LoginModal, { open: !user })] }));
};
export const App = () => {
    return (_jsx(UserProvider, { children: _jsx(Router, { children: _jsx(Shell, {}) }) }));
};
export default App;
