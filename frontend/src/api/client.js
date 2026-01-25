/// <reference types="vite/client" />
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
// Users
export async function listUsers() {
    const res = await fetch(`${API_BASE_URL}/users`);
    return res.json();
}
export async function createUser(username, password) {
    const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    return res.json();
}
export async function updateUser(userId, username) {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
    });
    return res.json();
}
export async function deleteUser(userId) {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
    });
    return res.json();
}
// Modules
export async function listModules() {
    const res = await fetch(`${API_BASE_URL}/modules`);
    return res.json();
}
export async function getModule(moduleId) {
    const res = await fetch(`${API_BASE_URL}/modules/${moduleId}`);
    return res.json();
}
export async function getModuleByCode(moduleCode) {
    const res = await fetch(`${API_BASE_URL}/modules/code/${moduleCode}`);
    return res.json();
}
export async function getUserModules(userId) {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/modules`);
    return res.json();
}
export async function subscribeToModule(userId, moduleId) {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/modules/${moduleId}`, {
        method: 'POST',
    });
    return res.json();
}
export async function unsubscribeFromModule(userId, moduleId) {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/modules/${moduleId}`, {
        method: 'DELETE',
    });
    return res.json();
}
// Posts
export async function listPosts() {
    const res = await fetch(`${API_BASE_URL}/posts`);
    return res.json();
}
export async function createPost(userId, title, body, moduleId) {
    const res = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, title, body, module_id: moduleId }),
    });
    return res.json();
}
export async function updatePost(postId, title, body) {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
    });
    return res.json();
}
export async function deletePost(postId) {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
    });
    return res.json();
}
// Comments
export async function listComments(postId) {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
    return res.json();
}
export async function createComment(postId, userId, body) {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, body }),
    });
    return res.json();
}
export async function updateComment(postId, commentId, body) {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
    });
    return res.json();
}
export async function deleteComment(postId, commentId) {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
    });
    return res.json();
}
// Like a post
export async function likePost(postId, userId) {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
    });
    return res.json();
}
