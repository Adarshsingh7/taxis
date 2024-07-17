/** @format */

import { createContext, useState, useEffect } from 'react';
import { getAccountList } from '../utils/apiReq';
import { getAllDrivers } from '../utils/apiReq';
//const BASEURL = 'https://abacusonline-001-site1.atempurl.com';
const BASEURL = 'https://api.acetaxisdorset.co.uk';

const AuthContext = createContext({
	currentUser: null,
	isAuth: false,
	login: () => {},
	logout: () => {},
	getToken: () => {},
	setToken: () => {},
	isLoading: false,
});

const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [isAuth, setIsAuth] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Function to handle login logic (replace with your backend API call)
	const login = async (credentials) => {
		setIsLoading(true);
		try {
			const response = await fetch(BASEURL + '/api/UserProfile/Login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(credentials),
			});

			if (response.ok) {
				const data = await response.json();
				setCurrentUser(data);
				getUserRole(data);
				setIsAuth(true);
				setToken(data.token); // Assuming response contains a token
				setUsername(credentials.username);
				alert('Login successful');
			} else {
				const data = await response.json();
				alert(data.message);
				// Handle login failure (e.g., display error message)
			}
		} catch (error) {
			console.error('Login error:', error);
			// Handle login error
		} finally {
			setIsLoading(false);
		}
	};

	// Function to get user from the token
	const getUser = async (token, username) => {
		setIsLoading(true);
		try {
			const response = await fetch(
				BASEURL + `/api/UserProfile/GetUser?username=${username}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				setCurrentUser(data);
				getUserRole(data);
				setIsAuth(true);
				getAccountList();
			} else {
				console.error('Get user failed:', response.statusText);
				// Handle get user failure
			}
		} catch (error) {
			console.error('Get user error:', error);
		} finally {
			setIsLoading(false);
		}
	};

	// Function to handle logout logic (replace with your backend API call)
	const logout = () => {
		localStorage.removeItem('authToken');
		localStorage.removeItem('username');
		setCurrentUser(null);
		setIsAuth(false);
	};

	// Function to retrieve stored token from local storage (optional)
	function getToken() {
		return localStorage.getItem('authToken');
	}
	function getUsername() {
		return localStorage.getItem('username');
	}

	// Function to save token to local storage (optional)
	const setToken = (token) => {
		localStorage.setItem('authToken', token);
	};
	function setUsername(username) {
		localStorage.setItem('username', username);
	}

	// Check if user is authenticated based on token or currentUser
	useEffect(() => {
		setIsLoading(true);
		const token = getToken();
		const username = getUsername();
		if (!token || !username) {
			setCurrentUser(null);
		}
		if (token && username && !currentUser) {
			getUser(token, username);
		} else {
			setCurrentUser(
				token ? JSON.parse(localStorage.getItem('userData')) : null
			);
			setIsAuth(!!token); // Assuming token presence indicates auth
			setIsLoading(false);
		}
	}, []); // Run only on component mount

	function getUserRole(currentUser) {
		getAllDrivers().then((res) => {
			const allUsers = res.users;
			const user = allUsers.find((user) => user.id === currentUser.id);
			if (user.role === 1) {
				setCurrentUser((prev) => ({ ...prev, isAdmin: true }));
			} else {
				setCurrentUser((prev) => ({ ...prev, isAdmin: false }));
			}
		});
	}

	const value = {
		currentUser,
		isAuth,
		isLoading,
		login,
		logout,
		getToken,
		setToken,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
