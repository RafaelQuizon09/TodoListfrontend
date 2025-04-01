import React, { useEffect, useState } from "react";
import { getUserId, getToken } from "../config/config";

export default function UpdateTodos ({todo, closeModal, updateTodo }) {
    const [todoID, settodoID] = useState(0);
    const [todoTitle, setTitle] = useState("");
    const [todoDescription, setDescription] = useState("");
    const [error, setError] = useState("");
    const [todoStatus, setStatus] = useState("");
    const [tododueDate, setDueDate] = useState("");
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        if (todo) {
            settodoID(todo.todoID);
            setTitle(todo.todoTitle);
            setDescription(todo.setDescription);
            setStatus(todo.todoStatus);
            setDueDate(todo.dueDate);
        }
    }, [todo]);

    const handleUpdate = async (event) => {
        event.preventDefault();
        try{
            const userID = getUserId();
            setError("");
            const token = `Bearer ${getToken()}`
            const response = await fetch(`api/updateTodo/`, {
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({todoID, todoTitle, todoDescription, todoStatus, dueDate:tododueDate, userID})
            });
            if (!response.ok) {
                throw new Error("Error Updating Todo");
            }

            const updatedTodo = await response.json();
            console.log("Todo Updated", updatedTodo);

            updateTodo(updatedTodo);
            closeModal();

            setTitle("");
            setDescription("");
            setStatus("");
            setDueDate("");
        }
        catch (err) {}
    }

    return <div>
                <div className="modal-overlay">
            <div className="modal-content">
            <h1 className="text-md font-bold text-white mb-5">Update To-Do</h1>
            <form onSubmit={handleUpdate} className="flex flex-col" style={{backgroundColor: "#1A5E63;"}}>
                <div className="flex flex-col items-center">  
                <div className="flex flex-row m-1" >
                    <div className="flex flex-col">
                        <h5 className="font-medium text-white text-lg">Title:</h5>   
                        <input
                        className="bg-white m-1 rounded-md h-full"
                            type="text"
                            placeholder="To Do Description"
                            value={todoTitle}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            />
                    </div>
                    <div className="flex flex-col">
                        <h5 className="font-medium text-white text-lg">Description:</h5>   
                        <textarea
                        className="bg-white m-1 rounded-md"
                        style={{minHeight:"100px", maxHeight: "100px"}}
                            placeholder="To Do Description"
                            value={todoDescription}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                </div>
                <div className="flex flex-row m-1">
                    <div className="flex flex-col">
                    <h5 className="font-medium text-white text-lg">Status:</h5>   
                    <select value={todoStatus} className="bg-white m-1 rounded-md h-full"
                        onChange={(e) => setStatus(e.target.value)} required>
                            <option value= "" disabled>Select Status</option>
                            <option value= "Pending" >Pending</option>
                            <option value= "In Progress" >In Progress</option>
                            <option value= "Complete" >Complete</option>
                    </select>
                    </div>
                    <div className="flex flex-col">        
                    <h5 className="font-medium text-white text-lg">Due Date:</h5>   
                        <input
                        className="bg-white m-1 rounded-md"
                        type="date"
                        value={tododueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    /></div>
                </div>
                </div>
            <button type="submit" className="my-1 mx-20">
                {error ? "Updating To-Do" : "Update"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button className="my-1 mx-20" onClick={() => closeModal(true)}>Close</button>
        </form>
    </div>
    </div>
    <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .modal-content {
                    background: #1A5E63;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                }
            `}
    </style>
    </div>;
}