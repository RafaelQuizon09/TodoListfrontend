import { AiFillDelete } from "react-icons/ai";
import { useState } from "react";
import { getToken, getUserId } from "../config/config";

export default function DeleteUser() {
    const [userID] = useState(getUserId());
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setOpen] = useState(false);

    const handleDelete = async () => {
        setError(""); 
        setLoading(true); 
        let token = `Bearer ${getToken()}`;

        try {
            let response = await fetch(`/api/deleteUser/${userID}/`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
            });
            console.log(response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log("User deleted successfully");

        } catch (err) {
            console.error(err);
            setError("Failed to delete user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <button 
                className="flex flex-row justify-center items-center mt-2 font-black text-white px-4 py-2 rounded-lg" 
                style={{ fontSize: "16px", background: "red" }} 
                onClick={() => setOpen(true)} 
                disabled={loading}
            >
                <AiFillDelete className="mr-2" /> {loading ? "Deleting..." : "Delete Account?"}
            </button>
            {isOpen && (
                <div className="mt-4 p-4 bg-white shadow-lg rounded-lg modal-overlay">
                    <div className="p-5 rounded-xl shadow-md text-center flex flex-col modal-content">
                        <p className="text-white font-medium text-lg text-center ">
                            Before proceeding, please be aware that deleting your account is an irreversible action. 
                            <br/>All your data, including your profile information, settings, saved content, <br/>and any other 
                            associated files, will be permanently removed and cannot be restored! <br/><p className="font-black my-5 text-xl">Delete Account?</p>
                        </p>
                        <div className="flex flex-row justify-center items-center" style={{ gap: '1rem' }}>
                            <button 
                                onClick={() => setOpen(false)} 
                                style={{
                                    backgroundColor: 'transparent', 
                                    border: '1px solid #D1D5DB', 
                                    padding: '0.5rem 1rem',  
                                    borderRadius: '0.375rem',
                                    cursor: 'pointer',
                                    color: 'white',
                                    transition: 'background-color 0.3s ease'
                                }}
                                className="transform transition-transform duration-300 ease-in hover:scale-110"
                                onMouseEnter={(e) => {e.target.style.backgroundColor = '#F3F4F6'; e.target.style.color = 'black'}}
                                onMouseLeave={(e) => {e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'white'}}>
                                Cancel Delete
                            </button>
                            <button 
                                onClick={handleDelete} 
                                style={{
                                    backgroundColor: '#DC2626', 
                                    color: 'white', 
                                    padding: '0.5rem 1rem', 
                                    borderRadius: '0.375rem',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease'
                                }}
                                className="transform transition-transform duration-300 ease-in hover:scale-110"
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#B91C1C'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#DC2626'}>
                                Proceed Deletion
                            </button>
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