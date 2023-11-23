import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { loadUser } from '../../actions/userActions';

const ProtectedRoute = ({ isAdmin, element: Element }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                await loadUser();
                const loadedUser = JSON.parse(localStorage.getItem('user'));
                setUser(loadedUser);
                setIsAuthenticated(!!loadedUser);
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (isAdmin && user && user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return <Element />;
};

export default ProtectedRoute;
