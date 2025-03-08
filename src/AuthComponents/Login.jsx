import React, { useState } from "react";
import {jwtDecode} from "jwt-decode"; // Install with: npm install jwt-decode
import { setUserId, setToken, setUsername,getUsername, setRefreshToken, } from "../config/config";
import { Navigate } from "react-router";

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
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Input Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
            />
            <input
                type="password"
                placeholder="Input Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
            />
            <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
}
