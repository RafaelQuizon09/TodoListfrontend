import { useState, useEffect } from "react";
import { getToken, getUserId, getUsername, refreshToken, clearAllAuthData } from "../config/config";
import { Navigate } from "react-router";

export default function Dashboard() {
    const [userID, setUserID] = useState(getUserId()); // Set userID immediately
    const [userName, setUsername] = useState(getUsername());
    const [todos, setTodos] = useState([]); // Initialize as empty array
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        const fetchTodo = async () => {
            setError(""); 
            setLoading(true); 
            const token = `Bearer ${getToken()}`;

            try {
                const response = await fetch(`/api/getTodo/?userID=${userID}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });

                if (response.status === 401) {
                    console.warn("Token expired, refreshing...");
                    const newToken = await refreshToken();

                    if (!newToken) {
                        console.error("Failed to refresh token.");
                        clearAllAuthData();
                        return;
                    }
                }
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data);
                setTodos(data); // Update state with fetched todos
            } catch (err) {
                console.error(err);
                setError("Failed to fetch todos");
            } finally {
                setLoading(false);
            }
        };

        fetchTodo();
    }, [userID]);

    if (!getToken()) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <h1>Home</h1>
            <p>User ID: {userID}</p>
            <p>Username: {userName}</p>

            {loading ? <p>Loading...</p> : null}
            {error ? <p>{error}</p> : null}

            <div>
                {todos.length > 0 ? (
                    todos.map((todo) => (
                        <div key={todo.todoID}>
                            <h3>{todo.todoTitle}</h3>
                            <p>{todo.todoDescription}</p>
                            <p>Status: {todo.todoStatus}</p>
                            <p>Due Date: {todo.dueDate}</p>
                        </div>
                    ))
                ) : (
                    <p>No todos found</p>
                )}
            </div>
        </div>
    );
}
