import React, {useEffect, useState} from "react";
import { User, ApiResponse } from "../types/api";

export const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://localhost:8080/users')
        .then(response => response.json())
        .then((data: ApiResponse<User[]>) => {
        setUsers(data.payload.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      })
    }, []); //runs only when component mounts

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Users List</h1>
            <ul>
            {users.map(user => (
                <li key={user.id}>
                {user.id} - {user.name} - {user.major} - Year {user.year}
                </li>
            ))}
            </ul>
        </div>
    );
}

// This functional react component uses react hook to fetch a list of users from local go backend upon mounting, 
// at the same time managing the application's state through loading error and data success phases to render list of users.