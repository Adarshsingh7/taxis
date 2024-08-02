/** @format */
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useBooking } from '../hooks/useBooking';


function CustomDialog({ closeDialog, data, onDeleteBooking, setViewBookingModal, viewBookingModal }) {
	const { insertData } = useBooking();
	

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


