/** @format */

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import Loader from '../components/Loader';

const ProtectedRoute = ({ children }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const { isAuth, isLoading } = useAuth();

	useEffect(() => {
		// Only navigate to login if not authenticated and not loading
		if (!isLoading && !isAuth) {
			navigate('/login');
		}
	}, [isAuth, isLoading, navigate]);

	// Show loader if authentication status is still loading
	if (isLoading) {
		return (
			<Loader
				loading
				background='#2ecc71'
				loaderColor='#3498db'
			/>
		);
	}

	// If authenticated, render children
	return <>{children}</>;
};

export default ProtectedRoute;
