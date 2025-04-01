import React, { useState } from "react";
import { Link } from "react-router";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setconfirmPass] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        console.log("Username:", username);
        console.log("Email:", email);
        console.log("Password:", password);

        if (password===confirmPass){
            try {
                const response = await fetch("http://127.0.0.1:8000/api/createUser/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, email, password }),
                });
    
                if (!response.ok) {
                    setError("Failed to Register. Please check your details");
                }
    
                const data = await response.json();
                console.log("Register successful:", data);
            } catch (error) {

                console.error("Error:", error);
            }
        }
        else {
            setError("Please enter the matching password!");
        }

    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col p-30 rounded-lg"  style={{backgroundColor: "#007BFF"}}>
            <h1 className="font-semibold text-white text-sm my-3">Sign-up</h1>
            <h5 className="font-medium text-white text-lg">Username:</h5>
            <input
                type="text"
                className="bg-white mb-3 rounded-md"
                placeholder="Input Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <h5 className="font-medium text-white text-lg">Email:</h5>
            <input
                type="email"
                className="bg-white mb-3 rounded-md"
                placeholder="Input Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <h5 className="font-medium text-white text-lg">Password:</h5>
            <input
                type="password"
                className="bg-white mb-3 rounded-md"
                placeholder="Input Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <h5 className="font-medium text-white text-lg">Confirm Password:</h5>
            <input
                type="password"
                className="bg-white mb-7 rounded-md"
                placeholder="Confirm Password"
                value={confirmPass}
                onChange={(e) => setconfirmPass(e.target.value)}
                required
            />
            <button type="submit">Register</button>
            <div className="flex flex-row mt-2 text-sm justify-center">
                Already have an account? <Link to="/login"><div className="font-bold text-white ml-2">Login</div></Link>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
            <style>{
                    `body {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        background-color: #0B132B;
                        justify-content: center;
                        align-items: center;
                    }
                    input {
                    padding: 8px; 
                    }`}
                </style>
        </form>
    );
}
