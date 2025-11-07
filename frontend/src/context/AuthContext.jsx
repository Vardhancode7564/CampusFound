import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user or admin is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Check user token
      const userToken = localStorage.getItem('userToken');
      if (userToken) {
        try {
          const response = await fetch('https://campusfound.onrender.com/api/auth/me', {
            headers: { 'Authorization': `Bearer ${userToken}` },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            localStorage.removeItem('userToken');
          }
        } catch (error) {
          localStorage.removeItem('userToken');
        }
      }
      
      // Check admin token
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        try {
          const response = await fetch('https://campusfound.onrender.com/api/admin/me', {
            headers: { 'Authorization': `Bearer ${adminToken}` },
          });
          if (response.ok) {
            const data = await response.json();
            setAdmin(data.admin);
          } else {
            localStorage.removeItem('adminToken');
          }
        } catch (error) {
          localStorage.removeItem('adminToken');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Register admin
  const register = async (userData) => {
    try {
      const response = await fetch('https://campusfound.onrender.com/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        setAdmin(data.admin);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Registration failed' };
    }
  };

  // Login admin
  const login = async (credentials) => {
    try {
      const response = await fetch('https://campusfound.onrender.com/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        setAdmin(data.admin);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  };

  // Logout admin
  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  // User login
  const userLogin = async (credentials) => {
    try {
      const response = await fetch('https://campusfound.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userToken', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  };

  // User logout
  const userLogout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  // User register
  const userRegister = async (userData) => {
    try {
      const response = await fetch('https://campusfound.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userToken', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please check your connection.' };
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    try {
      const userToken = localStorage.getItem('userToken');
      const response = await fetch('https://campusfound.onrender.com/api/auth/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'Failed to update profile. Please try again.' };
    }
  };

  const value = {
    user,
    admin,
    loading,
    register,
    login,
    logout,
    userLogin,
    userLogout,
    userRegister,
    updateUserProfile,
    isUserAuthenticated: !!user,
    isAdminAuthenticated: !!admin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
