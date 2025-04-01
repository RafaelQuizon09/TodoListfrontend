import React, { useState } from "react";
import {jwtDecode} from "jwt-decode"; // Install with: npm install jwt-decode
import { setUserId, setToken, setUsername,getUsername, setRefreshToken, setUserEmail } from "../config/config";
import { Navigate } from "react-router";
import { Link } from "react-router";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [redirect, setRedirect] = useState(false); // State for redirection

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(""); // Reset previous errors
        setLoading(true); // Set loading state

        try {
            const response = await fetch("/api/loginUser/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
              });              

            if (!response.ok) {
                throw new Error("Invalid credentials or server error");
            }

            const data = await response.json();
            console.log("Login successful:", data);

            if (data.refresh) {
                setToken(data.access);
                setRefreshToken(data.refresh);
                // Decode JWT token to extract user details
                const decodedToken = jwtDecode(data.refresh);
                console.log("Decoded JWT:", decodedToken);

                if (decodedToken.user_id) {
                    try {
                        const response = await fetch(`/api/getUserByID/${decodedToken.user_id}`);
                        const data = await response.json();
                        console.log("User data:", data);
                        setUserId(decodedToken.user_id);
                        setUsername(data.username);
                        setUserEmail(email);
                        
                        setTimeout(() => {
                            setRedirect(true);
                        }, 2000)
                    }
                    catch (error) {
                        console.error("Error fetching user data:", error);
                    }
                }
                console.log("User ID and username stored successfully");
            }

        } catch (error) {
            console.error("Error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    if (redirect) {
        return <Navigate to={"/dashboard"}/>;
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col p-30 rounded-lg" style={{backgroundColor: "#007BFF"}}>
                <h1 className="font-semibold text-white text-sm my-3">Login</h1>
                <h5 className="font-medium text-white text-lg">Email:</h5>
                <input
                    type="email"
                    className="bg-white mb-3 rounded-md"
                    placeholder="Input Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                />
                <h5 className="font-medium text-white text-lg">Password:</h5>
                <input
                    type="password"
                    className="bg-white mb-7 rounded-md"
                    placeholder="Input Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />
                <button type="submit" disabled={loading} className=" my-2">
                    {loading ? "Logging in..." : "Login"}
                </button>
                <div className="flex flex-row mt-2 text-sm justify-center">
                Don't have an account? <Link to="/signup"><div className="font-bold text-white ml-2">Register</div></Link>
            </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
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
        </div>
    );
}
