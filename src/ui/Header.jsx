/** @format */

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Avatar, Menu, MenuItem, Switch } from '@mui/material';
import { useState } from 'react';
import { useBooking } from '../hooks/useBooking';
import CallIcon from '@mui/icons-material/Call';
import Badge from '@mui/material/Badge';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTestMode } from '../context/bookingSlice';

const Navbar = () => {
	const navigate = useNavigate();
	const { isAuth, logout } = useAuth();
	const dispatch = useDispatch();
	// const { setActiveTestMode, callerId } = useBooking();
	const activeTestMode = useSelector(
		(state) => state.bookingForm.isActiveTestMode
	);
	const callerId = useSelector((state) => state.caller);

	return (
		<nav className='sticky top-0 z-50 flex justify-between items-center bg-[#424242] text-white p-4'>
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
					<div className='flex flex-row items-center align-middle gap-8'>
						{callerId.length > 0 && (
							<Badge
								badgeContent={callerId.length}
								color='error'
								className='cursor-pointer select-none animate-bounce'
							>
								<CallIcon />
							</Badge>
						)}
						<span className='flex flex-row gap-2 items-center align-middle'>
							<span>Test Mode</span>
							<Switch
								checked={activeTestMode}
								onChange={(e) => {
									dispatch(setActiveTestMode(e.target.checked));
								}}
							/>
						</span>
						<button
							className='bg-blue-500 text-white px-4 py-2 rounded-lg'
							onClick={() => {
								logout();
								navigate('/login');
							}}
						>
							logout
						</button>
					</div>
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
