import React, { useState, useEffect } from "react";

function FetchUser() {
    const [user, setUser] = useState("");

    useEffect(() => {   
        const getUser = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/getUser');
                const data = await response.json();
                setUser(data[0].username);
                console.log(data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        getUser();
    }, []);

    return (
        <div>
            <p>{user ? user : "Loading..."}</p> 
        </div>
    );
}

export default FetchUser;
