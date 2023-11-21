import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { loadUser } from '../../actions/userActions';

const ProtectedRoute = ({ element: Element }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                await loadUser();
                const user = JSON.parse(localStorage.getItem('user'));
                setIsAuthenticated(!!user);
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

    return isAuthenticated ? (
        <Element />
    ) : (
        <Navigate to="/login" />
    );
};

export default ProtectedRoute;
