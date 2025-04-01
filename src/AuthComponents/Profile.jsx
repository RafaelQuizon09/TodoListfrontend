import { useState } from "react";
import { getToken, getUserId, getUsername, getUserEmail, clearAllAuthData } from "../config/config";
import { FaPencilAlt } from "react-icons/fa";
import { Navigate } from "react-router";
import DeleteUser from "./DeleteUser";

export default function Profile() {
    const [email, setEmail] = useState(getUserEmail());
    const [username, setUserName] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState("");
    const [isOpen, setOpen] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const handleChange = async (event) => {
        event.preventDefault();
        setError("");

        const token = getToken();
        if (!token) {
            setError("Missing authorization token.");
            return;
        }

        const authHeader = `Bearer ${token}`;
        const userID = getUserId();

        try {
            let payload = { userID, email, username };

            if (newPassword && oldPassword) {
                if (newPassword !== confirmNewPassword) {
                    setError("Passwords do not match.");
                    return;
                }

                const verifyResponse = await fetch("/api/verifyPassword/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": authHeader
                    },
                    body: JSON.stringify({ userID, oldPassword }),
                });

                if (!verifyResponse.ok) {
                    setError("Incorrect old password.");
                    return;
                }

                payload.newPassword = newPassword;
            }

            const updateResponse = await fetch("/api/updateUser/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authHeader
                },
                body: JSON.stringify(payload),
            });
            console.log(payload);
            if (!updateResponse.ok) {
                const errorData = await updateResponse.json();
                setError(errorData.message || "Error updating profile.");
                return;
            }

            console.log("Profile updated successfully! Clearing Data and redirecting you to login!");
            clearAllAuthData();
            
            setTimeout(() => {
                setRedirect(true);
            }, 2000)
            
        } catch (error) {
            console.error(error);
            setError("An error occurred while updating.");
        }
    };
    const handleLogout = () => {
        console.log("Logging Out");
        clearAllAuthData();
        setTimeout(() => {
            setRedirect(true);
        }, 2000)
    }
    if (redirect) {
        return <Navigate to={"/login"}/>;
    }

    return (
        <div>
            <button className="flex justify-center items-center fixed bottom-0 right-0 mr-5 mb-5" onClick={() => setOpen(true)}>
                <FaPencilAlt className="mr-3" />
                Edit Profile
            </button>

            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center modal-overlay">
                    <div className="p-5 rounded-lg shadow-2xl text-center flex flex-col modal-content" style={{ backgroundColor: "#1A5E63" }}>
                    <h1 className="text-md font-bold text-white mb-5">Adjust Profile</h1> 
                    {error && <p className="text-red-500">{error}</p>}
                    <button onClick={handleLogout}>Log Out</button>
                    <div className="flex flex-row items-center gap-4 w-full mt-5">
                        <hr className="flex-1 border-t-3 border-white" />
                        <span className="text-white font-semibold whitespace-nowrap">Update Account</span>
                        <hr className="flex-1 border-t-3 border-white" />
                    </div>
                        <form onSubmit={handleChange} className="flex flex-col">
                            {error && <p className="text-red-500">{error}</p>}
                            <input
                                type="text"
                                className="bg-gray-100 my-2 p-2 rounded-md"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                className="bg-gray-100 my-2 p-2 rounded-md"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                className="bg-gray-100 my-2 p-2 rounded-md"
                                placeholder="Old Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                className="bg-gray-100 my-2 p-2 rounded-md"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                className="bg-gray-100 my-2 p-2 rounded-md"
                                placeholder="Confirm New Password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                            <button type="submit" className="rounded-md mt-5 text-black ">
                                Update Profile
                            </button>
                            <button className="mt-2 text-black" onClick={() => setOpen(false)}>
                                Close
                            </button>
                        </form>
                        <div className="flex flex-col items-center w-full">
                            <div className="flex flex-row items-center gap-4 w-full mt-5">
                                <hr className="flex-1 border-t-3 border-red-600" />
                                <span className="text-red-600 font-semibold whitespace-nowrap">Danger Zone</span>
                                <hr className="flex-1 border-t-3 border-red-600" />
                            </div>
                            <DeleteUser />
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
                </div>
            )}
        </div>
    );
}