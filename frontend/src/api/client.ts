const API_BASE_URL = 'http://localhost:8080/api';

interface ApiResponse<T> {
  payload: {
    data: T;
  };
  messages: string[];
  errorCode: number;
}

// Users
export async function listUsers() {
  const res = await fetch(`${API_BASE_URL}/users`);
  return res.json() as Promise<ApiResponse<any[]>>;
}

export async function createUser(username: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json() as Promise<ApiResponse<any>>;
}

export async function updateUser(userId: number, username: string) {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  return res.json() as Promise<ApiResponse<any>>;
}

export async function deleteUser(userId: number) {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
  });
  return res.json() as Promise<ApiResponse<any>>;
}

// Modules
export async function listModules() {
  const res = await fetch(`${API_BASE_URL}/modules`);
  return res.json() as Promise<ApiResponse<any[]>>;
}

export async function getModule(moduleId: string) {
  const res = await fetch(`${API_BASE_URL}/modules/${moduleId}`);
  return res.json() as Promise<ApiResponse<any>>;
}

export async function getModuleByCode(moduleCode: string) {
  const res = await fetch(`${API_BASE_URL}/modules/code/${moduleCode}`);
  return res.json() as Promise<ApiResponse<any>>;
}

export async function getUserModules(userId: number) {
  const res = await fetch(`${API_BASE_URL}/users/${userId}/modules`);
  return res.json() as Promise<ApiResponse<any[]>>;
}

export async function subscribeToModule(userId: number, moduleId: string) {
  const res = await fetch(`${API_BASE_URL}/users/${userId}/modules/${moduleId}`, {
    method: 'POST',
  });
  return res.json() as Promise<ApiResponse<any>>;
}

export async function unsubscribeFromModule(userId: number, moduleId: string) {
  const res = await fetch(`${API_BASE_URL}/users/${userId}/modules/${moduleId}`, {
    method: 'DELETE',
  });
  return res.json() as Promise<ApiResponse<any>>;
}

// Posts
export async function listPosts() {
  const res = await fetch(`${API_BASE_URL}/posts`);
  return res.json() as Promise<ApiResponse<any[]>>;
}

export async function createPost(userId: number, title: string, body: string, moduleId: string) {
  const res = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, title, body, module_id: moduleId }),
  });
  return res.json() as Promise<ApiResponse<any>>;
}

export async function updatePost(postId: number, title: string, body: string) {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body }),
  });
  return res.json() as Promise<ApiResponse<any>>;
}

export async function deletePost(postId: number) {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
  });
  return res.json() as Promise<ApiResponse<any>>;
}

// Comments
export async function listComments(postId: number) {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
  return res.json() as Promise<ApiResponse<any[]>>;
}

export async function createComment(postId: number, userId: number, body: string) {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, body }),
  });
  return res.json() as Promise<ApiResponse<any>>;
}

export async function updateComment(postId: number, commentId: number, body: string) {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
  return res.json() as Promise<ApiResponse<any>>;
}

export async function deleteComment(postId: number, commentId: number) {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
    method: 'DELETE',
  });
  return res.json() as Promise<ApiResponse<any>>;
}
// Like a post
export async function likePost(postId: number, userId: number) {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
  });
  return res.json() as Promise<ApiResponse<any>>;
}