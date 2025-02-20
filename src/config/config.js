const config = {
    TOKEN_STORAGE_KEY: 'token', // Key for storing the token
    USERID_STORAGE_KEY: 'userId', // Key for storing the user ID
    USERNAME_STORAGE_KEY: 'username', // Key for storing the username
    PERMISSION_STORAGE_KEY: 'role', // Key for storing permissions
    DEFAULT_TOKEN: '', // Default token value
    DEFAULT_ID: '1', // Default ID value
    DEFAULT_USERNAME: 'guest', // Default username if not logged in
    DEFAULT_PERMISSION: 'guest_permission', // Default permission value
};

export const getUserId = () => localStorage.getItem(config.USERID_STORAGE_KEY) || config.DEFAULT_ID;
export const setUserId = (id) => localStorage.setItem(config.USERID_STORAGE_KEY, id);
export const clearUserId = () => localStorage.removeItem(config.USERID_STORAGE_KEY);

export const getToken = () => localStorage.getItem(config.TOKEN_STORAGE_KEY) || config.DEFAULT_TOKEN;
export const setToken = (token) => localStorage.setItem(config.TOKEN_STORAGE_KEY, token);
export const clearToken = () => localStorage.removeItem(config.TOKEN_STORAGE_KEY);

export const getUsername = () => localStorage.getItem(config.USERNAME_STORAGE_KEY) || config.DEFAULT_USERNAME;
export const setUsername = (username) => localStorage.setItem(config.USERNAME_STORAGE_KEY, username);
export const clearUsername = () => localStorage.removeItem(config.USERNAME_STORAGE_KEY);

export const getUserRole = () => localStorage.getItem(config.PERMISSION_STORAGE_KEY) || config.DEFAULT_PERMISSION;
export const setUserRole = (role) => localStorage.setItem(config.PERMISSION_STORAGE_KEY, role);
export const clearUserRole = () => localStorage.removeItem(config.PERMISSION_STORAGE_KEY);

export const clearAllAuthData = () => {
    clearToken();
    clearUsername();
    clearPermission();
};

export default config;