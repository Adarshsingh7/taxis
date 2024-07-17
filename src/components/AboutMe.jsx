/** @format */
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import Loader from './Loader.jsx';

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
	spaceY4: 'space-y-4',
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

const AboutMe = () => {
	const { currentUser, isLoading } = useAuth();
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');

	useEffect(() => {
		if (!currentUser) return;
		setUsername(currentUser.fullName);
		setEmail(currentUser.email);
	}, [currentUser]);

	if (isLoading) return <Loader loading={isLoading} />;

	return (
		<main
			className={`${sharedClasses.flex1} ${sharedClasses.p6} ${sharedClasses.bgWhite} ${sharedClasses.shadowLg}`}
		>
			<div className={sharedClasses.maxW2xl + ' ' + sharedClasses.mxAuto}>
				<section className={sharedClasses.mb8}>
					<h2
						className={`${sharedClasses.textXl} ${sharedClasses.fontSemiBold} ${sharedClasses.mb4}`}
					>
						YOUR ACCOUNT SETTINGS
					</h2>
					<form className={sharedClasses.spaceY4}>
						<div>
							<label
								className={`${sharedClasses.block} ${sharedClasses.textZinc700}`}
							>
								Name
							</label>
							<input
								type='text'
								className={`${sharedClasses.wFull} ${sharedClasses.border} ${sharedClasses.borderZinc300} ${sharedClasses.p2} ${sharedClasses.rounded}`}
								placeholder='Username'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
						<div>
							<label
								className={`${sharedClasses.block} ${sharedClasses.textZinc700}`}
							>
								Email address
							</label>
							<input
								type='email'
								className={`${sharedClasses.wFull} ${sharedClasses.border} ${sharedClasses.borderZinc300} ${sharedClasses.p2} ${sharedClasses.rounded}`}
								placeholder='Email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div
							className={`${sharedClasses.flex} ${sharedClasses.itemsCenter} ${sharedClasses.spaceX4}`}
						>
							<img
								src='https://placehold.co/50x50'
								alt='Profile Picture'
								className={`${sharedClasses.w12} ${sharedClasses.h12} ${sharedClasses.roundedFull}`}
							/>
							<button
								type='button'
								className={sharedClasses.textGreen500}
							>
								Choose new photo
							</button>
						</div>
						<button
							type='submit'
							className={`${sharedClasses.bgGreen500} ${sharedClasses.textWhite} ${sharedClasses.px4} ${sharedClasses.py2} ${sharedClasses.rounded}`}
						>
							SAVE SETTINGS
						</button>
					</form>
				</section>

				<section>
					<h2
						className={`${sharedClasses.textXl} ${sharedClasses.fontSemiBold} ${sharedClasses.mb4}`}
					>
						PASSWORD CHANGE
					</h2>
					<form className={sharedClasses.spaceY4}>
						<div>
							<label
								className={`${sharedClasses.block} ${sharedClasses.textZinc700}`}
							>
								Current password
							</label>
							<input
								type='password'
								className={`${sharedClasses.wFull} ${sharedClasses.border} ${sharedClasses.borderZinc300} ${sharedClasses.p2} ${sharedClasses.rounded}`}
							/>
						</div>
						<div>
							<label
								className={`${sharedClasses.block} ${sharedClasses.textZinc700}`}
							>
								New password
							</label>
							<input
								type='password'
								className={`${sharedClasses.wFull} ${sharedClasses.border} ${sharedClasses.borderZinc300} ${sharedClasses.p2} ${sharedClasses.rounded}`}
							/>
						</div>
						<div>
							<label
								className={`${sharedClasses.block} ${sharedClasses.textZinc700}`}
							>
								Confirm password
							</label>
							<input
								type='password'
								className={`${sharedClasses.wFull} ${sharedClasses.border} ${sharedClasses.borderZinc300} ${sharedClasses.p2} ${sharedClasses.rounded}`}
							/>
						</div>
						<button
							type='submit'
							className={`${sharedClasses.bgGreen500} ${sharedClasses.textWhite} ${sharedClasses.px4} ${sharedClasses.py2} ${sharedClasses.rounded}`}
						>
							SAVE PASSWORD
						</button>
					</form>
				</section>
			</div>
		</main>
	);
};

export default AboutMe;
