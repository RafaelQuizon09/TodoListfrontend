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
            <form onSubmit={handleUpdate}>
            <input
            type="text"
            placeholder="To Do Description"
            value={todoTitle}
            onChange={(e) => setTitle(e.target.value)}
            required
            />
            <textarea
            placeholder="To Do Description"
            value={todoDescription}
            onChange={(e) => setDescription(e.target.value)}
            required
            />
            <select value={todoStatus}
            onChange={(e) => setStatus(e.target.value)} required>
                <option value= "" disabled>Select Status</option>
                <option value= "Pending" >Pending</option>
                <option value= "In Progress" >In Progress</option>
                <option value= "Complete" >Complete</option>
            </select>
            <input
            type="date"
            placeholder="To Do Title"
            value={tododueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            />
            <button type="submit">
                {error ? "Updating To-Do" : "Update"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
        <button onClick={() => closeModal(true)}>Close</button>
    </div>
    </div>
    <style>
        {`
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
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                    text-align: center;
                }
            `}
            </style>
    </div>;
}