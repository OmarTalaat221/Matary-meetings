const TOKEN_KEY = "matary_token";
const USER_KEY = "matary_user";

// ============ TOKEN ============
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// ============ USER ============
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

// ============ CLEAR ALL ============
export const clearAuth = () => {
  removeToken();
  removeUser();
};

// ============ CHECK AUTH ============
export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};
