import { useState, useEffect } from "react";
import { getToken, getUserId, getUsername, refreshToken, clearToken, clearAllAuthData, getRefreshToken } from "../config/config";
import { Navigate } from "react-router";
import CreateTodos from "./CreateTodos";
import UpdateTodos from "./UpdateTodos";

export default function Dashboard() {
    const [userID, setUserID] = useState(() => getUserId()); 
    const [userName, setUsername] = useState(getUsername());
    const [todos, setTodos] = useState([]); 
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [refreshTodos, setRefreshTodos] = useState(false); // 👈 Added refresh state
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    useEffect(() => {
        const fetchTodo = async () => {
            setError(""); 
            setLoading(true); 
            let token = `Bearer ${getToken()}`;
        
            try {
                let response = await fetch(`/api/getTodo/?userID=${userID}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });
        
                if (response.status === 401){
                    console.warn("Token expired, refreshing");
                    const newToken = await refreshToken();
        
                    if (newToken) {
                        console.error("Complete");
                        return fetchTodo();
                    }

                    token = `Bearer ${newToken}`;
                    response = await fetch(`/api/getTodo/?userID=${userID}`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token,
                        },
                    });
                }
        
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
        
                const data = await response.json();
                setTodos(data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch todos");
            } finally {
                setLoading(false);
            }
        };

        fetchTodo();
    }, [userID, refreshTodos]);

    const addTodo = (newTodo) => {
        setTodos((prevTodos) => [newTodo, ...prevTodos]);
        setRefreshTodos((prev) => !prev);
    };
    
    const deleteTodo = async(todoID) => {
        setError(""); 
        setLoading(true); 
        console.log(getRefreshToken());
        const token = `Bearer ${getToken()}`;

        try {const response = await fetch(`api/deleteTodo/${todoID}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        });

        if (response.status === 401){
            console.warn("Token expired, refreshing");
            const newToken = await refreshToken();

            if (!newtoken) {
                console.error("Failed");
                clearAllAuthData();
                return;
            }

            return deleteTodo();
        }
                        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        }
        catch(err){
            console.error(err);
            setError("Failed to delete todos");
        } finally{
            setLoading(false);
        }
    };
    
    const testtoken = () => {
        clearToken();
        console.log("access token erased")
    }
    const openUpdateModal = (todo) => {
        setSelectedTodo(todo);
        setIsUpdateModalOpen(true);
    };

    const updateTodo = (updatedTodo) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) => (todo.todoID === updatedTodo.todoID ? updatedTodo : todo))
        );
        setRefreshTodos((prev) => !prev); 
    };
    
    return (
        <div>
            <h1>Home</h1>
            <p>User ID: {userID}</p>
            <p>Username: {userName}</p>

            {loading ? <p>Loading...</p> : null}
            {error ? <p>{error}</p> : null}
            <button onClick={testtoken}>Profile</button>
            <div>
                {todos.length > 0 ? (
                    todos.map((todo) => (
                        <div key={todo.todoID}>
                            <h3>{todo.todoTitle}</h3>
                            <p>{todo.todoDescription}</p>
                            <p>Status: {todo.todoStatus}</p>
                            <p>Due Date: {todo.dueDate}</p>
                            <button onClick={() => openUpdateModal(todo)}>Edit</button>
                            <button onClick={() => deleteTodo(todo.todoID)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No todos found</p>
                )}
            </div>
            
            {isUpdateModalOpen && (
                <UpdateTodos
                    todo={selectedTodo}
                    closeModal={() => setIsUpdateModalOpen(false)}
                    updateTodo={updateTodo}
                />
            )}
            <CreateTodos addTodo={addTodo}/>
        </div>
    );
}
