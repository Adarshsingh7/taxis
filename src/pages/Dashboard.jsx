/** @format */

import { Button } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { NavLink, Outlet } from 'react-router-dom';
import ProtectedRoute from '../utils/Protected';

const sharedClasses = {
	flex: 'flex',
	flexCol: 'flex flex-col',
	flex1: 'flex-1',
	itemsCenter: 'items-center',
	spaceX4: 'space-x-4',
	wFull: 'w-full',
	border: 'border',
	p2: 'p-2',
	rounded: 'rounded',
	textZinc700: 'text-zinc-700',
	bgGreen500: 'bg-green-500',
	textWhite: 'text-white',
	p4: 'p-4',
	justifyBetween: 'justify-between',
	textLg: 'text-lg',
	hidden: 'hidden',
	mdBlock: 'md:block',
	bgGradient: 'bg-gradient-to-r from-green-400 to-green-300',
	w1_4: 'w-1/4',
	p6: 'p-6',
	spaceY4: 'space-y-4 h-screen',
	block: 'block',
	textXl: 'text-xl',
	fontSemiBold: 'font-semibold',
	maxW2xl: 'max-w-2xl',
	mxAuto: 'mx-auto',
	mb8: 'mb-8',
	mb4: 'mb-4',
	textGreen500: 'text-green-500',
	w12: 'w-12',
	h12: 'h-12',
	roundedFull: 'rounded-full',
	px4: 'px-4',
	py2: 'py-2',
	shadowLg: 'shadow-lg',
};

const Header = () => {
	const { logout, currentUser } = useAuth();
	function handleLogout(e) {
		e.preventDefault();
		logout();
	}
	return (
		<header
			className={`bg-zinc-800 ${sharedClasses.textWhite} ${sharedClasses.p4} ${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter}`}
		>
			<div className={sharedClasses.textLg}>APP</div>
			<div
				className={`${sharedClasses.flex} ${sharedClasses.itemsCenter} ${sharedClasses.spaceX4}`}
			>
				<div>Welcome {currentUser?.userName}</div>
				<Button
					variant='outlined'
					color='warning'
					onClick={handleLogout}
				>
					LOGOUT
				</Button>
			</div>
		</header>
	);
};

const Sidebar = () => {
	return (
		<aside
			className={`${sharedClasses.bgGradient} ${sharedClasses.w1_4} ${sharedClasses.p6} ${sharedClasses.hidden} ${sharedClasses.mdBlock}`}
		>
			<nav className={sharedClasses.spaceY4}>
				<NavLink
					to='about'
					className={`${sharedClasses.block} ${sharedClasses.textWhite}`}
				>
					SETTINGS
				</NavLink>
				<NavLink
					to='contact'
					className={`${sharedClasses.block} ${sharedClasses.textWhite}`}
				>
					CONTACT
				</NavLink>
				<NavLink
					to='review'
					className={`${sharedClasses.block} ${sharedClasses.textWhite}`}
				>
					MY REVIEWS
				</NavLink>
				<NavLink
					to='billing'
					className={`${sharedClasses.block} ${sharedClasses.textWhite}`}
				>
					BILLING
				</NavLink>
			</nav>
		</aside>
	);
};

const AccountSettingsPage = () => {
	return (
		<ProtectedRoute>
			<div
				className={
					sharedClasses.minHScreen +
					' md:mx-56 md:my-20 ' +
					sharedClasses.bgZinc100 +
					' ' +
					sharedClasses.flexCol
				}
			>
				<Header />
				<div className={sharedClasses.flex + ' ' + sharedClasses.flex1}>
					<Sidebar />
					<div
						className={sharedClasses.flex + ' relative ' + sharedClasses.flex1}
					>
						<Outlet />
					</div>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default AccountSettingsPage;
