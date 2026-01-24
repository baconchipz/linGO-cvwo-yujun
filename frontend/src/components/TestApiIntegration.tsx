import { useState, useEffect } from 'react';
import * as api from '../api/client';
import type { User, Module, Post } from '../types';

export function TestApiIntegration() {
  const [users, setUsers] = useState<User[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>API Integration Test</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {loading && <p>Loading...</p>}

      <div style={{ marginTop: '20px' }}>
        <h3>Users ({users.length})</h3>
        <ul>
          {users.map((user) => (
            <li key={user.user_id}>{user.username}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Modules ({modules.length})</h3>
        <ul>
          {modules.map((mod) => (
            <li key={mod.module_id}>{mod.module_title}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Posts ({posts.length})</h3>
        <ul>
          {posts.map((post) => (
            <li key={post.post_id}>{post.title}</li>
          ))}
        </ul>
      </div>

      <button onClick={fetchAll} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Refresh
      </button>
    </div>
  );
}
