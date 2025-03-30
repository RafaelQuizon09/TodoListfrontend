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
            <div className="w-full h-full flex flex-col justify-center items-center parent">
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-3xl font-bold underline">Home</h1>
                    <p>User ID: {userID}</p>
                    <p>Username: {userName}</p>
                    <CreateTodos addTodo={addTodo}/>
                </div>
                <div className="flex flex-col">
                {loading ? <p>Loading...</p> : null}
                {error ? <p>{error}</p> : null}
                <div className="flex flex-row flex-wrap items-center justify-center">
                    {todos.length > 0 ? (
                        todos.map((todo) => (
                            <div key={todo.todoID} className="p-10 max-h-80 max-w-80 card-bg m-5">
                                <h3 className="py-2">{todo.todoTitle}</h3>
                                <p className="py-2 flex flex-wrap">{todo.todoDescription}</p>
                                <p className="py-2"> Status: {todo.todoStatus}</p>
                                <p className="py-2">Due Date: {todo.dueDate}</p>
                                <div className="flex flex-row"> 
                                <button className="py-2 mx-2" onClick={() => openUpdateModal(todo)}>Edit</button>
                                <button className="py-2 mx-2" onClick={() => deleteTodo(todo.todoID)}>Delete</button>
                                </div>
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
                <style jsx>{
                    `body {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    
                    .card-bg{
                        background-color: #007BFF;
                        color: white;
                    }
                    .card-bg button{
                    color: black;
                    }`}
                </style>
            </div>
            </div>
    );
}
