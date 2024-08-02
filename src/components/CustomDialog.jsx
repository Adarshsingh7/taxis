/** @format */
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useBooking } from '../hooks/useBooking';
import { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Button } from '@mui/material';
import { getAllDrivers } from '../utils/apiReq';

function CustomDialog({
	closeDialog,
	data,
	onDeleteBooking,
	setViewBookingModal,
}) {
	const { insertData } = useBooking();
	const [allocateModal, setAllocateModal] = useState(false);


	
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
						onClick={() => setAllocateModal(true)}
					/>
					<Modal
						open={allocateModal}
						setOpen={setAllocateModal}
					>
						<AllocateModal setAllocateModal={setAllocateModal} />
					</Modal>
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

function AllocateModal({setAllocateModal , data }) {
	const [loading, setLoading] = useState(false);
	const [driverData, setDriverData] = useState([]);
	
	

	useEffect(() => {
		getAllDrivers().then((res) => {
			setDriverData(res.users.filter((user) => user.roleString !== 'Admin'));
		});
		setLoading(true);
		setLoading(false);
	}, []);

	function handleAttactDriver(driver) {
		
		setOpen(false);
	}

	return (
		<div className='flex flex-col items-center justify-center w-[23vw] bg-white rounded-lg px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
			<div className='p-4 flex justify-center items-center text-center rounded-full bg-[#FEE2E2]'>
				<PersonOutlineOutlinedIcon sx={{ color: '#E45454' }} />
			</div>
			<div className='flex w-full flex-col gap-2 justify-center items-center mt-3'>
				<div className='flex w-full flex-col justify-center items-center'>
					<p className='font-medium '>Allocate Booking</p>
				</div>
				<div className='bg-[#16A34A] text-center font-medium text-white py-2 px-4 w-full rounded-sm'>
					<p>Gillingham station -- Guys Marsh</p>
				</div>

				<div className='w-full flex justify-center items-center border-b-gray-300 border-b-[1px] p-1'>
					<p>Select Driver</p>
				</div>
				<div className='m-auto w-full h-[50vh] overflow-auto relative'>
					{loading ? (
						<Loader />
					) : (
						driverData.map((el, idx) => (
							<div
								key={idx}
								className='bg-gray-200 flex flex-col justify-center items-center mb-2 cursor-pointer'
								onClick={() => handleAttactDriver(el)}
							>
								<div className='flex m-auto justify-center items-center align-middle gap-5'>
									<div
										style={{ backgroundColor: el.colorRGB }}
										className={`h-5 w-5 rounded-full`}
									></div>
									<p className='text-xl'>{el?.fullName}</p>
								</div>
								<p>{el.regNo}</p>
							</div>
						))
					)}
				</div>

				<Button
					variant='contained'
					color='error'
					sx={{ paddingY: '0.5rem', marginTop: '4px' }}
					className='w-full cursor-pointer'
					onClick={() => setAllocateModal(false)}
				>
					Back
				</Button>
			</div>
		</div>
	);
}
