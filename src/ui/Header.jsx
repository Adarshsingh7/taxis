/** @format */

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Avatar, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

const Navbar = () => {
	const navigate = useNavigate();
	const { isAuth, logout } = useAuth();

	return (
		<nav className='sticky top-0 z-50 flex justify-between items-center bg-zinc-900 text-white p-4'>
			<span className='flex gap-10'>
				{/* <Link
					to='/'
					className='text-lg font-bold'
				>
					ACE-TAXI
				</Link>
				<Link
					to='/app'
					className='text-lg font-bold'
				>
					APP
				</Link> */}
				<Link
					to='/pusher'
					className='text-lg font-bold uppercase'
				>
					create
				</Link>
			</span>

			<span className='flex gap-10'>
				{!isAuth ? (
					// <button
					// 	className='bg-blue-500 text-white px-4 py-2 rounded-lg'
					// 	onClick={() => navigate('/login')}
					// >
					// 	Login
					// </button>
					<></>
				) : (
					<button
						className='bg-blue-500 text-white px-4 py-2 rounded-lg'
						onClick={() => {
							logout();
							navigate('/login');
						}}
					>
						logout
					</button>
				)}
				{/* <MuiMenu /> */}
			</span>
		</nav>
	);
};

function MuiMenu() {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<div>
			<Avatar
				sx={{ bgcolor: 'primary' }}
				onClick={handleClick}
				className='w-10 h-10 rounded-full cursor-pointer'
			>
				👨‍🦳
			</Avatar>
			<Menu
				id='basic-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
			>
				{' '}
				<Link to='/dashboard/about'>
					<MenuItem onClick={handleClose}>Profile</MenuItem>
				</Link>
				<MenuItem onClick={handleClose}>My account</MenuItem>
			</Menu>
		</div>
	);
}

export default Navbar;
