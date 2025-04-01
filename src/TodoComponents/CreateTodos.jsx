import React, { useState } from "react";
import { getUserId, getToken } from "../config/config";
import { FaPencilAlt } from "react-icons/fa";

export default function CreateTodos({addTodo}) {
    const [todoTitle, setTitle] = useState("");
    const [todoDescription, setDescription] = useState("");
    const [error, setError] = useState("");
    const [todoStatus, setStatus] = useState("");
    const [tododueDate, setDueDate] = useState("");
    const [isOpen, setOpen] = useState(false);

    const handleCreate = async (event) => {
        event.preventDefault();
        try{
            const userID = getUserId();
            setError("");
            const token = `Bearer ${getToken()}`
            const response = await fetch(`/api/createTodo/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({todoTitle, todoDescription, todoStatus, dueDate:tododueDate, userID})
            });
            if (!response.ok) {
                console.log("Error Creating Todo")
            }

            const data = await response.json();
            console.log("todoCreated", data);

            addTodo(data);
            setTitle("");
            setDescription("");
            setStatus("");
            setDueDate("");
        } catch(error){}
    }


    return <div>
        <div className="flex flex-row w-full"><button className="w-full flex flex-row justify-center items-center" onClick={() => setOpen(true)}><FaPencilAlt className="mr-3"/>Create To Do</button>{isOpen}</div>
        <br/>
        
        {isOpen && (
        <div className="modal-overlay">
            <div className="modal-content">
            <h1 className="text-3xl font-bold text-white mb-5">Create a To-Do</h1>
            <form onSubmit={handleCreate} className="flex flex-col" style={{backgroundColor: "#1A5E63;"}}>
                <div className="flex flex-col items-center">  
                <div className="flex flex-row m-1" >
                    <div className="flex flex-col">
                        <h5 className="font-medium text-white text-lg">Title:</h5>   
                        <input
                        className="bg-white m-1 rounded-md h-full"
                            type="text"
                            placeholder="To Do Title"
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
                            className="bg-white m-1 rounded-md h-full"
                            type="date"
                            value={tododueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                    </div>
                </div>

                </div>
            <button type="submit" className="my-1 mx-20">
                {error ? "Creating To-Do" : "Create"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button className="my-1 mx-20" onClick={() => setOpen(false)}>Close</button>
        </form>

    </div>
    </div>

        )}
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