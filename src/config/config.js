const config = {
    TOKEN_STORAGE_KEY: 'token',
    REFRESH_TOKEN_STORAGE_KEY: 'refreshToken',
    USERID_STORAGE_KEY: 'userId',
    USEREMAIL_STORAGE_KEY: 'sample@email.com',
    USERNAME_STORAGE_KEY: 'username',
    PERMISSION_STORAGE_KEY: 'role',
    DEFAULT_TOKEN: '',
    DEFAULT_REFRESH_TOKEN: '',
    DEFAULT_ID: '1',
    DEFAULT_USERNAME: 'guest',
};

export const getUserId = () => localStorage.getItem(config.USERID_STORAGE_KEY) || config.DEFAULT_ID;
export const setUserId = (id) => localStorage.setItem(config.USERID_STORAGE_KEY, id);
export const clearUserId = () => localStorage.removeItem(config.USERID_STORAGE_KEY);

export const getUserEmail = () => localStorage.getItem(config.USEREMAIL_STORAGE_KEY);
export const setUserEmail = (email) => localStorage.setItem(config.USEREMAIL_STORAGE_KEY, email);
export const clearUserEmail = () => localStorage.removeItem(config.USEREMAIL_STORAGE_KEY);

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
    clearUserId();
    clearUsername();
    clearUserEmail();
    clearToken(); // 👈 Add this to make sure access token is cleared
    clearRefreshToken(); // 👈 This prevents keeping a stale refresh token
};

export const refreshToken = async () => {
    const refresh = getRefreshToken();
    if (!refresh) {
        console.error("No refresh token found.");
        return null;
    }

    try {
        const response = await fetch('/api/refreshToken/', { // Ensure this is the correct API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh }),
        });

        if (!response.ok) {
            console.error("Failed to refresh token.");
            clearAllAuthData();
            return null;
        }

        const data = await response.json();
        setToken(data.access);
        setRefreshToken(data.refresh); // Ensure this is saved
        return data.access; // 👈 Return new access token
    } catch (error) {
        console.error("Error refreshing token:", error);
        clearAllAuthData();
        return null;
    }
};

export default config;
