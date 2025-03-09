
/**
 * Authentication utility functions
 */

export interface User {
  isLoggedIn: boolean;
  userName: string;
}

export const getUser = (): User | null => {
  const userData = localStorage.getItem('user');
  if (!userData) {
    return null;
  }
  
  try {
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('Error parsing user data', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const user = getUser();
  return !!user?.isLoggedIn;
};

export const logout = (): void => {
  localStorage.removeItem('user');
};
