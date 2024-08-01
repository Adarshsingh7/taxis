/** @format */
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useBooking } from '../hooks/useBooking';
import Modal from '../components/Modal';
import { useState } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

function CustomDialog({ closeDialog, data, onDeleteBooking }) {
	const { insertData } = useBooking();
	const [viewBookingModal, setViewBookingModal] = useState(false);

	return (
		<div className='fixed left-[-20vw] inset-0 w-[40vw] z-50 flex items-center justify-center p-4 bg-background bg-opacity-50'>
			<div className='relative w-full max-w-md p-6 bg-card rounded-lg shadow-lg dark:bg-popover bg-white'>
				<div className='flex items-center justify-between mb-6'>
					<h2 className='text-lg font-medium text-card'>Booking Options</h2>
					<button
						className='trounded-full p-2'
						onClick={closeDialog}
					>
						<CancelRoundedIcon />
					</button>
				</div>
				<div className='p-4 border border-card dark:border-popover'>
					<BookingOption
						Icon={AccountBalanceRoundedIcon}
						text={data.accountNumber ? 'Account Job' : 'Cash Job'}
					/>
					<BookingOption
						Icon={AccountCircleRoundedIcon}
						text={data.fullname || 'No Name'}
					/>
					<BookingOption
						Icon={HomeRoundedIcon}
						text={data.cellText}
					/>
				</div>
				<div className='mt-6 space-y-4'>
					<BookingButton
						text='View Booking'
						color='blue'
						onClick={() => setViewBookingModal(true)}
					/>
					<Modal
						open={viewBookingModal}
						setOpen={setViewBookingModal}
					>
						<ViewBookingModal data={data} />
					</Modal>
					<BookingButton
						text='Allocate Booking'
						color='blue'
					/>
					<BookingButton
						onClick={() => insertData(data)}
						text='Edit Booking'
						color='blue'
					/>
					<BookingButton
						text='Duplicate Booking'
						color='blue'
					/>
					<BookingButton
						text='Complete Booking'
						color='green'
					/>
					<BookingButton
						text='Cancel Booking'
						color='red'
						onClick={() => onDeleteBooking(data.bookingId)}
					/>
				</div>
			</div>
		</div>
	);
}

const BookingOption = ({ text, Icon }) => {
	return (
		<div className='flex items-center mb-4'>
			<Icon />
			<span className={`text-card dark:text-popover-foreground line-clamp-1`}>
				{text}
			</span>
		</div>
	);
};

const BookingButton = ({ text, color, ...props }) => {
	return (
		<button
			{...props}
			className={`w-full px-4 py-2 text-white bg-${color}-700 rounded-lg hover:bg-${color}-600`}
		>
			{text}
		</button>
	);
};

export default CustomDialog;

function ViewBookingModal({ data }) {
	return (
		<div className='flex flex-col items-center justify-center w-[23vw] bg-white rounded-lg px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
			<div className='p-4 flex justify-center items-center text-center rounded-full bg-[#FEE2E2]'>
				<CalendarTodayIcon sx={{ color: '#E45454' }} />
			</div>
			<div className='flex w-full flex-col gap-2 justify-center items-center mt-3'>
				<div className='flex w-full flex-col justify-center items-center'>
					<p className='font-medium '>Booking Details</p>
					<div className='font-bold'># {data.bookingId}</div>
				</div>
			</div>
		</div>
	);
}
