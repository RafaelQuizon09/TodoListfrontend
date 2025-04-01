import { useState, useEffect } from "react";
import { getToken, getUserId, getUsername, refreshToken, clearAllAuthData, getRefreshToken } from "../config/config";
import { Navigate } from "react-router";
import DeleteUser from "../AuthComponents/DeleteUser.jsx";
import CreateTodos from "./CreateTodos";
import UpdateTodos from "./UpdateTodos";
import Profile from "../AuthComponents/Profile.jsx";
import { AiFillDelete, AiFillEdit,AiOutlineArrowLeft, AiOutlineArrowRight} from "react-icons/ai";

export default function Dashboard() {
    const [userID, setUserID] = useState(() => getUserId()); 
    const [userName, setUsername] = useState(getUsername());
    const [todos, setTodos] = useState([]); 
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [refreshTodos, setRefreshTodos] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const todosPerPage = 5; // Change this to adjust number of todos per page

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

    const deleteTodo = async (todoID) => {
        setError(""); 
        setLoading(true); 
        const token = `Bearer ${getToken()}`;
    
        try {
            const response = await fetch(`api/deleteTodo/${todoID}/`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
            });
    
            if (response.status === 401) {
                console.warn("Token expired, refreshing");
                const newToken = await refreshToken();
    
                if (!newToken) {
                    console.error("Failed to refresh token");
                    clearAllAuthData();
                    return;
                }
    
                return deleteTodo(todoID);
            }
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            if (response.status === 204) {
                console.log("Todo deleted successfully");
                setRefreshTodos((prev) => !prev);
                return;
            }
    
            setRefreshTodos((prev) => !prev);
        } catch (err) {
            console.error(err);
            setError("Failed to delete todo");
        } finally {
            setLoading(false);
        }
    };

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

    // Pagination Logic
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

    const nextPage = () => {
        if (currentPage < Math.ceil(todos.length / todosPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center parent">
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold text-white">Home</h1>
                <p className="text-xl font-medium text-white my-6">Welcome back, {userName}!</p>
                <CreateTodos addTodo={addTodo} />
            </div>
                            {/* Pagination Controls */}
                    <div className="flex justify-center my-4">
                    <button className="mx-2 px-4 py-2 bg-gray-300 rounded w-36 flex flex-row justify-center items-center" onClick={prevPage} disabled={currentPage === 1}>
                        <AiOutlineArrowLeft className="mr-3"/> Previous
                    </button>
                    <span className="px-4 py-2 text-white font-bold">{currentPage}</span>
                    <button className="mx-2 px-4 py-2 bg-gray-300 rounded w-36 flex flex-row justify-center items-center" onClick={nextPage} disabled={currentPage >= Math.ceil(todos.length / todosPerPage)}>
                    Next <AiOutlineArrowRight className="ml-3"/>
                    </button>
                </div>
            <div className="flex flex-col">
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                <div className="flex flex-row flex-wrap items-center justify-center">
                    {currentTodos.length > 0 ? (
                        currentTodos.map((todo) => (
                            <div 
                                key={todo.todoID} 
                                className="p-10 max-h-80 max-w-80 min-h-80 min-w-80 card-bg m-5 rounded-lg shadow-neutral-600 shadow-2xl flex flex-col"
                            >
                                <h3 className="py-2 font-semibold text-xl truncate">{todo.todoTitle}</h3>
                                <p className="py-2 truncate">{todo.todoDescription}</p>
                                <p className="py-2">Status: {todo.todoStatus}</p>
                                <p className="py-2">Due Date: {todo.dueDate}</p>

                                <div className="flex flex-row justify-center items-end mt-auto"> 
                                    <button className="py-2 mx-2 flex flex-row justify-center items-center" onClick={() => openUpdateModal(todo)}>
                                        <AiFillEdit className="mr-2" />Edit
                                    </button>
                                    <button className="py-2 mx-2 flex flex-row justify-center items-center" onClick={() => deleteTodo(todo.todoID)}>
                                        <AiFillDelete className="mr-2" />Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No todos found</p>
                    )}
                </div>

                <div className="flex justify-center my-4">
                    <button className="mx-2 px-4 py-2 bg-gray-300 rounded w-36 flex flex-row justify-center items-center" onClick={prevPage} disabled={currentPage === 1}>
                        <AiOutlineArrowLeft className="mr-3"/> Previous
                    </button>
                    <span className="px-4 py-2 text-white font-bold">{currentPage}</span>
                    <button className="mx-2 px-4 py-2 bg-gray-300 rounded w-36 flex flex-row justify-center items-center" onClick={nextPage} disabled={currentPage >= Math.ceil(todos.length / todosPerPage)}>
                    Next <AiOutlineArrowRight className="ml-3"/>
                    </button>
                </div>                
                {isUpdateModalOpen && (
                    <UpdateTodos
                        todo={selectedTodo}
                        closeModal={() => setIsUpdateModalOpen(false)}
                        updateTodo={updateTodo}
                    />
                )}
                                <style>{
                    `body {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background-color: #0B132B;
                    }
                    
                    .card-bg{
                        background-color: #007BFF;
                        color: white;
                    }
                    .card-bg button{
                    color: black;
                    }`}
                </style>

                <Profile/>
            </div>
        </div>
    );
}
