const config = {
    TOKEN_STORAGE_KEY: 'token', // Key for storing the token
    REFRESH_TOKEN_STORAGE_KEY: 'refreshToken',
    USERID_STORAGE_KEY: 'userId', // Key for storing the user ID
    USERNAME_STORAGE_KEY: 'username', // Key for storing the username
    PERMISSION_STORAGE_KEY: 'role', // Key for storing permissions
    DEFAULT_TOKEN: '', // Default token value
    DEFAULT_REFRESH_TOKEN: '',
    DEFAULT_ID: '1', // Default ID value
    DEFAULT_USERNAME: 'guest', // Default username if not logged in
};

export const getUserId = () => localStorage.getItem(config.USERID_STORAGE_KEY) || config.DEFAULT_ID;
export const setUserId = (id) => localStorage.setItem(config.USERID_STORAGE_KEY, id);
export const clearUserId = () => localStorage.removeItem(config.USERID_STORAGE_KEY);

export const getToken = () => localStorage.getItem(config.TOKEN_STORAGE_KEY) || config.DEFAULT_TOKEN;
export const setToken = (token) => localStorage.setItem(config.TOKEN_STORAGE_KEY, token);
export const clearToken = () => localStorage.removeItem(config.TOKEN_STORAGE_KEY);

export const getRefreshToken = () => localStorage.getItem(config.REFRESH_TOKEN_STORAGE_KEY) || config.DEFAULT_REFRESH_TOKEN;
export const setRefreshToken = (refreshToken) => localStorage.setItem(config.REFRESH_TOKEN_STORAGE_KEY, refreshToken);
export const clearRefreshToken = () => localStorage.removeItem(config.REFRESH_TOKEN_STORAGE_KEY);

export const getUsername = () => localStorage.getItem(config.USERNAME_STORAGE_KEY) || config.DEFAULT_USERNAME;
export const setUsername = (username) => localStorage.setItem(config.USERNAME_STORAGE_KEY, username);
export const clearUsername = () => localStorage.removeItem(config.USERNAME_STORAGE_KEY);


export const clearAllAuthData = () => {
    clearToken();
    clearRefreshToken();
    clearUserId();
    clearUsername();

};

export const refreshToken = async() => {
    const refresh = getRefreshToken();
    if (!refresh) {
        console.error("No refresh token found.");
        return null;
    }

    try {
        const response = await fetch ('api/refreshToken/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh }),
        });

        if (!response.ok) {
            console.error("Failed to refresh token.");
            clearAllAuthData
            return null;
        }
        const data = await response.json();
        setToken(data.access);
        setRefreshToken(data.refresh);
        return data.access;
    } catch (error) {
        console.error("Error refreshing token:", error);
        clearAllAuthData();
        return null;
    }
        };

export default config;