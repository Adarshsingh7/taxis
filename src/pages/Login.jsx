/** @format */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Login() {
	const { login } = useAuth();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const { isAuth } = useAuth();
	const navigation = useNavigate();

	function handleSubmit(e) {
		e.preventDefault();
		const credentials = { username, password };
		login(credentials);
	}

	useEffect(() => {
		if (isAuth) {
			navigation('/pusher', { replace: true });
		}
	}, [isAuth, navigation]);

	return (
		<div className='min-h-screen flex items-center justify-center bg-blue-700 p-4'>
			<div className='bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full flex'>
				<div
					className='hidden md:block md:w-1/2 bg-cover'
					style={{
						backgroundImage:
							"url('https://wallpaperswide.com/download/dark_black_background-wallpaper-600x800.jpg",
					}}
				>
					<button
						className=' bg-white m-4 p-2 rounded-xl'
						onClick={(e) => {
							e.preventDefault();
							navigation('/');
						}}
					>
						⬅️ Back
					</button>
					<div className='p-8'>
						<h2 className='text-3xl font-bold text-white mb-4'>
							Start Your Journey With Us
						</h2>
						<p className='text-white'>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua.
						</p>
					</div>
				</div>
				<div className='w-full md:w-1/2 p-8'>
					<h2 className='text-2xl font-bold mb-6'>Welcome Back To Digital</h2>
					<p className='mb-4'>Enter the details below to get started</p>
					<form onSubmit={handleSubmit}>
						<div className='mb-4'>
							<label className='block text-zinc-700'>Username</label>
							<input
								type='text'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
								placeholder='andrew tate'
							/>
						</div>
						<div className='mb-4'>
							<label className='block text-zinc-700'>Password</label>
							<input
								type='password'
								onChange={(e) => setPassword(e.target.value)}
								value={password}
								className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
								placeholder='••••••••'
							/>
						</div>
						{/* <div className='flex items-center justify-between mb-6'>
							<a
								href='#'
								className='text-sm text-blue-500 hover:underline'
							>
								Forgot Password?
							</a>
						</div> */}
						<button
							type='submit'
							className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600'
						>
							Login
						</button>
					</form>
					{/* <div className='mt-6 text-center'>
						<p className='text-zinc-700'>
							For Sign Up{' '}
							<Link
								to='/signup'
								className='text-blue-500 hover:underline'
							>
								Register Here
							</Link>
						</p>
					</div> */}
				</div>
			</div>
		</div>
	);
}

const SignUp = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [email, setEmail] = useState('');
	const navigation = useNavigate();

	function handleSubmit(e) {
		e.preventDefault();
		// Removed signup(username, email, password, confirmPassword, category) function call
	}

	useEffect(() => {
		// Removed if (user) condition and navigation('/app/new', { replace: true }) function call
	}, []);

	return (
		<div className='min-h-screen flex items-center justify-center bg-blue-700 p-4'>
			<div className='bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full flex'>
				<div
					className='hidden md:block md:w-1/2 bg-cover'
					style={{
						backgroundImage:
							"url('https://wallpaperswide.com/download/dark_black_background-wallpaper-600x800.jpg",
					}}
				>
					<button
						className=' bg-white m-4 p-2 rounded-xl'
						onClick={() => navigation('/')}
					>
						⬅️ Back
					</button>
					<div className='p-8'>
						<h2 className='text-3xl font-bold text-white mb-4'>
							Start Your Journey With Us
						</h2>
						<p className='text-white'>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua.
						</p>
					</div>
				</div>
				<div className='w-full md:w-1/2 p-8'>
					<h2 className='text-2xl font-bold mb-6'>Sign Up Now</h2>
					<p className='mb-4'>Enter the details below to create your account</p>
					<form onSubmit={handleSubmit}>
						<div className='mb-4'>
							<label className={`block text-zinc-700`}>Username</label>
							<input
								type='text'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
								placeholder='Enter your username'
							/>
						</div>
						<div className='mb-4'>
							<label className={`block text-zinc-700`}>Email</label>
							<input
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
								placeholder='Enter your username'
							/>
						</div>
						<div className='mb-4'>
							<label className={`block text-zinc-700`}>Password</label>
							<input
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								type='password'
								className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
								placeholder='Enter your password'
							/>
						</div>
						<div className='mb-4'>
							<label className={`block text-zinc-700`}>Confirm Password</label>
							<input
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								type='password'
								className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
								placeholder='Confirm your password'
							/>
						</div>
						<button
							type='submit'
							className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600'
						>
							Sign Up
						</button>
					</form>
					<div className='mt-6 text-center'>
						<p className={`text-zinc-700`}>
							Already have an account?{' '}
							<Link
								to='/login'
								className='text-blue-500 hover:underline'
							>
								Login Here
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export { SignUp, Login };
