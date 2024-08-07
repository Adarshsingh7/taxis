/** @format */
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import { useBooking } from '../hooks/useBooking';
import { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Button, Switch } from '@mui/material';
import { allocateDriver, getAllDrivers, makeBooking } from '../utils/apiReq';
import { useAuth } from '../hooks/useAuth';

import CurrencyPoundOutlinedIcon from '@mui/icons-material/CurrencyPoundOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { completeBookings } from '../utils/apiReq';
import { openSnackbar } from '../context/snackbarSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './Loader';
import EditBookingModal from './Scheduler/EditBookingModal';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';

import { formatDate } from '../utils/formatDate';
import { getRefreshedBooking } from '../context/schedulerSlice';
function CustomDialog({
	closeDialog,
	data,
	onDeleteBooking,
	allocateDriverToBooking,
}) {
	const [allocateModal, setAllocateModal] = useState(false);
	const [isCompleteBookingModal, setIsCompleteBookingModal] = useState(false);
	const [editBookingModal, setEditBookingModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [duplicateBookingModal, setDuplicateBookingModal] = useState(false);
	return (
		<div className='fixed left-[-35vw] inset-0 w-[70vw] mx-auto z-50 flex items-center justify-center p-4 bg-background bg-opacity-50'>
			<div className='relative w-full max-w-7xl p-6 bg-card rounded-lg shadow-lg dark:bg-popover bg-white'>
				<div className='flex items-center justify-between mb-6'>
					<h2 className='text-lg font-medium text-card'>
						BookingId:{' '}
						<span className='text-xl font-semibold text-green-900'>
							{data.bookingId}
						</span>
					</h2>

					<button
						className='rounded-full p-2'
						onClick={closeDialog}
					>
						<CancelRoundedIcon />
					</button>
				</div>
				<div className='p-4 grid grid-cols-2 place-content-between mt-4 border border-card dark:border-popover'>
					<div>
						<BookingOption
							head='Scope'
							text={data.accountNumber ? 'Account Job' : 'Cash Job'}
						/>
						{data.scope >= 0 && (
							<BookingOption
								text={data.account}
								head='Account'
							/>
						)}
						<BookingOption
							text={data.fullname || 'No Name'}
							head='Allocated Driver'
						/>

						<div>
							<BookingOption
								text={`${data.pickupAddress}, ${data.pickupPostCode}`}
								head='Pickup Address'
							/>
							{data.vias.length > 0 && (
								<ul className=''>
									<BookingOption
										text={data.vias.map((via, idx) => (
											<li key={idx}>{via.address}</li>
										))}
										head='Vias'
									/>
								</ul>
							)}
							<BookingOption
								text={`${data.destinationAddress}, ${data.destinationPostCode}`}
								head='Destination Address'
							/>
						</div>
					</div>
					<div>
						<BookingOption
							text={data.price}
							head='Price'
						/>
						<BookingOption
							text={Math.floor(Number(data.durationMinutes) / 60) + ' Hour(s)'}
							head='Time'
						/>
						<BookingOption
							text={data.mileageText}
							head='Distance'
						/>
						<div>
							<BookingOption
								text={data.passengerName}
								head='Passenger Name'
							/>
							<BookingOption
								text={data.passengers}
								head='Passenger Count'
							/>
						</div>
						<BookingOption
							text={data.bookedByName}
							head='Booked By'
						/>
						<BookingOption
							text={getTodayInEnGbFormat(data.dateCreated.split('T')[0])}
							head='Booked On'
						/>
					</div>
				</div>
				<div className='mt-6 gap-4 flex flex-wrap items-center'>
					{/* <BookingButton
						text='View Booking'
						color='blue'
						// onClick={() => setViewBookingModal(true)}
					/> */}

					<BookingButton
						text='Allocate Booking'
						color='blue'
						onClick={() => setAllocateModal(true)}
					/>
					<BookingButton
						onClick={() => setEditBookingModal(true)}
						text='Edit Booking'
						color='blue'
					/>
					<BookingButton
						text='Duplicate Booking'
						color='blue'
						onClick={() => setDuplicateBookingModal(true)}
					/>
					<BookingButton
						text='Driver Arrived'
						color='blue'
					/>
					<BookingButton
						text='Complete Booking'
						color='green'
						onClick={() => setIsCompleteBookingModal(true)}
					/>
					<BookingButton
						text='Cancel Booking'
						color='red'
						onClick={() => setDeleteModal(true)}
					/>
				</div>
			</div>
			<Modal
				open={allocateModal}
				setOpen={setAllocateModal}
			>
				<AllocateModal
					setAllocateModal={setAllocateModal}
					allocateDriverToBooking={allocateDriverToBooking}
					data={data}
					closeDialog={closeDialog}
				/>
			</Modal>
			<Modal
				open={isCompleteBookingModal}
				setOpen={setIsCompleteBookingModal}
			>
				<CompleteBookingModal
					setIsCompleteBookingModal={setIsCompleteBookingModal}
					data={data}
					closeDialog={closeDialog}
				/>
			</Modal>
			<Modal
				open={editBookingModal}
				setOpen={setEditBookingModal}
			>
				<EditBookingModal
					setEditBookingModal={setEditBookingModal}
					data={data}
					closeDialog={closeDialog}
				/>
			</Modal>
			<Modal
				open={duplicateBookingModal}
				setOpen={setDuplicateBookingModal}
			>
				<DuplicateBookingModal
					setDuplicateBookingModal={setDuplicateBookingModal}
					data={data}
					closeDialog={closeDialog}
				/>
			</Modal>
			<Modal
				open={deleteModal}
				setOpen={setDeleteModal}
			>
				<DeleteBookingModal
					setDeleteModal={setDeleteModal}
					data={data}
					closeDialog={closeDialog}
					onDeleteBooking={onDeleteBooking}
				/>
			</Modal>
		</div>
	);
}

function getTodayInEnGbFormat(date) {
	const today = new Date(date);
	const enGbFormatter = new Intl.DateTimeFormat('en-GB', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
	return enGbFormatter.format(today);
}

const BookingOption = ({ text, head }) => {
	return (
		<div className='flex items-center align-middle mb-4'>
			<p className=' text-lg font-medium pr-2'>{head}: </p>
			<span className={`text-card dark:text-popover-foreground text-[1rem]`}>
				{text}
			</span>
		</div>
	);
};

const BookingButton = ({ text, color, ...props }) => {
	return (
		<button
			{...props}
			className={`px-4 py-4 text-white bg-${color}-700 hover:bg-${color}-600 `}
		>
			{text}
		</button>
	);
};

export default CustomDialog;

// Allocate Driver Modal Structure
function AllocateModal({
	setAllocateModal,
	closeDialog,
	data,
	allocateDriverToBooking,
}) {
	// console.log(data)
	const [loading, setLoading] = useState(false);
	const [driverData, setDriverData] = useState([]);
	const [bookingData, setBookingData] = useState({});
	const [confirmAllocation, setConfirmAllocation] = useState(false);
	const [selectedDriver, setSelectedDriver] = useState(null);
	useEffect(() => {
		getAllDrivers().then((res) => {
			setDriverData(res.users.filter((user) => user.roleString !== 'Admin'));
		});
		setLoading(true);
		setLoading(false);
	}, []);

	function handleAttactDriver(driver) {
		setConfirmAllocation(true);
		setSelectedDriver(driver);
		setBookingData(data);
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
				<Modal
					open={confirmAllocation}
					setOpen={setConfirmAllocation}
				>
					<ConfirmAllocationModal
						driver={selectedDriver}
						bookingData={bookingData}
						setAllocateModal={setAllocateModal}
						closeDialog={closeDialog}
						setConfirmAllocation={setConfirmAllocation}
						allocateDriverToBooking={allocateDriverToBooking}
					/>
				</Modal>
				<div className='m-auto w-full h-[50vh] overflow-auto'>
					{loading ? (
						<Loader />
					) : (
						driverData.map((el, idx) => (
							<>
								<div
									key={idx}
									className='bg-gray-200 flex justify-center w-full items-center mx-auto cursor-pointer gap-4 mb-2'
								>
									<div
										className='w-full mx-auto flex justify-center items-center'
										onClick={() => handleAttactDriver(el)}
									>
										<div
											style={{ backgroundColor: el.colorRGB }}
											className={`h-5 w-5 rounded-full`}
										></div>
										<div className='flex flex-col w-[50%] justify-center items-center'>
											<p className='text-xl'>{el?.fullName}</p>
											<p className='text-[.8rem]'>{el.regNo}</p>
										</div>
									</div>
								</div>
							</>
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

// Confirm Allocation Modal Structure

function ConfirmAllocationModal({
	setAllocateModal,
	closeDialog,
	driver,
	bookingData,
	setConfirmAllocation,
	allocateDriverToBooking,
}) {
	const dispatch = useDispatch();
	const user = useAuth();
	const activeTestMode = useSelector(
		(store) => store.bookingForm.isActiveTestMode
	);
	const handleConfirmClick = async (driver) => {
		const newAllocationData = {
			bookingId: bookingData.bookingId,
			userId: driver.id,
			actionByUserId: user.currentUser.id,
		};
		// console.log("driver", driver);
		const res = await allocateDriverToBooking(
			newAllocationData,
			activeTestMode
		);
		setConfirmAllocation(false);
		setAllocateModal(false);
		closeDialog();
		if (res.status === 'success') {
			dispatch(openSnackbar('Driver Allocated Successfully', 'success'));
		}
	};
	return (
		<div className='flex flex-col items-center justify-center w-[23vw] bg-white rounded-lg px-4 pb-4 pt-5 sm:p-6 sm:pb-4 gap-4'>
			<div className='flex w-full flex-col gap-2 justify-center items-center mt-3'>
				<div className='p-4 flex justify-center items-center text-center rounded-full bg-[#FEE2E2]'>
					<PersonOutlineOutlinedIcon sx={{ color: '#E45454' }} />
				</div>
				<div className='flex w-full flex-col justify-center items-center'>
					<p className='font-medium text-xl '>Confirm Driver Allocation</p>
				</div>
			</div>
			<div className='text-center w-full'>
				Are you sure you wish to select {driver.fullName} as the driver?
			</div>
			<div className='w-full flex items-center justify-center gap-4'>
				<Button
					variant='contained'
					color='error'
					sx={{ paddingY: '0.5rem', marginTop: '4px' }}
					className='w-full cursor-pointer'
					onClick={() => setConfirmAllocation(false)}
				>
					Cancel
				</Button>
				<Button
					variant='contained'
					color='success'
					sx={{ paddingY: '0.5rem', marginTop: '4px' }}
					className='w-full cursor-pointer'
					onClick={() => handleConfirmClick(driver)}
				>
					Confirm
				</Button>
			</div>
		</div>
	);
}

// Complete Booking Modal Structure

function CompleteBookingModal({
	setIsCompleteBookingModal,
	closeDialog,
	data,
}) {
	const [accountPrice, setAccountPrice] = useState(data.priceAccount);
	const [waitingTime, setWaitingTime] = useState(data.waitingTime);
	const [parkingCharge, setParkingCharge] = useState(data.parkingCharge);
	const [price, setPrice] = useState(data.price);
	const isActiveTestMode = useSelector(
		(store) => store.bookingForm.isActiveTestMode
	);

	const dispatch = useDispatch();

	const handleCompleteClick = async (e) => {
		console.log('clicked clicked');
		e.preventDefault();
		const completedBookingData = {
			bookingId: data.bookingId,
			waitingTime,
			parkingCharge,
			driverPrice: price,
			accountPrice: data.priceAccount,
		};
		// console.log("completedBookingData", completedBookingData);
		const response = await completeBookings(
			completedBookingData,
			isActiveTestMode
		);
		setIsCompleteBookingModal(false);
		closeDialog();
		if (response.status === 'success') {
			dispatch(openSnackbar('Booking Completed', 'success'));
		}
	};

	return (
		<div className='flex flex-col items-center justify-center w-[23vw] bg-white rounded-lg px-4 pb-4 pt-5 sm:p-6 sm:pb-4 gap-4'>
			<div className='flex w-full flex-col gap-2 justify-center items-center mt-3'>
				<div className='p-4 flex justify-center items-center text-center rounded-full bg-[#FEE2E2]'>
					<HelpOutlineOutlinedIcon sx={{ color: '#E45454' }} />
				</div>
				<div className='flex w-full flex-col justify-center items-center'>
					<p className='font-medium text-2xl '>Job completion</p>
				</div>
				<form
					onSubmit={handleCompleteClick}
					className='w-full flex flex-col justify-center items-center gap-3 mt-2'
				>
					<div className='w-full relative flex flex-col justify-center items-start gap-2'>
						<label>Waiting Time Minutes</label>
						<input
							type='number'
							min='0'
							value={waitingTime}
							onChange={(e) => setWaitingTime(e.target.value)}
							className='w-full pl-10 pr-4 py-2 p-2 border border-gray-500 rounded-md placeholder:text-slate-900'
							placeholder='0'
						/>
						<i className='absolute left-4 top-10 text-black'>
							<AccessTimeOutlinedIcon fontSize='12px' />
						</i>
					</div>
					<div className='w-full relative flex flex-col justify-center items-start gap-2'>
						<label>Parking Charge</label>
						<input
							type='number'
							value={parkingCharge}
							onChange={(e) => setParkingCharge(e.target.value)}
							min='0'
							className='w-full pl-10 pr-4 py-2 p-2 border border-gray-500 rounded-md placeholder:text-slate-900'
							placeholder='0'
						/>
						<i className='absolute left-4 top-10 text-black'>
							<CurrencyPoundOutlinedIcon fontSize='12px' />
						</i>
					</div>
					<div className='w-full relative flex flex-col justify-center items-start gap-2'>
						<label className=''>
							Price <span className='text-red-600'>*</span>
						</label>
						<input
							required
							type='number'
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							className='w-full pl-10 pr-4 py-2 p-2 border border-gray-500 rounded-md placeholder:text-slate-900'
							placeholder='0'
						/>
						<i className=' absolute left-4 top-10  text-black'>
							<CurrencyPoundOutlinedIcon fontSize='12px' />
						</i>
					</div>
					{data.priceAccount > 0 && (
						<div className='w-full relative flex flex-col justify-center items-start gap-2'>
							<label className=''>Account Price</label>
							<input
								type='number'
								value={accountPrice}
								onChange={(e) => setAccountPrice(e.target.value)}
								className='w-full pl-10 pr-4 py-2 p-2 border border-gray-500 rounded-md placeholder:text-slate-900'
								placeholder='0'
							/>
							<i className='absolute left-4 top-10  text-black'>
								<CurrencyPoundOutlinedIcon fontSize='12px' />
							</i>
						</div>
					)}
					<Button
						variant='contained'
						color='error'
						sx={{ paddingY: '0.5rem', marginTop: '4px' }}
						className='w-full cursor-pointer'
						type='submit'
					>
						Submit
					</Button>
				</form>
			</div>
		</div>
	);
}

function DeleteBookingModal({
	setDeleteModal,
	data,
	closeDialog,
	onDeleteBooking,
}) {
	// console.log(data);
	const handleSingleDelete = (id) => {
		onDeleteBooking(id, false);
		setDeleteModal(false);
		closeDialog();
	};

	const handleDeleteAllRepeat = async (id) => {
		onDeleteBooking(id, true);
		setDeleteModal(false);
		closeDialog();
	};

	return (
		<div className='flex flex-col items-center justify-center w-[23vw] bg-white rounded-lg px-4 pb-4 pt-5 sm:p-6 sm:pb-4 gap-4'>
			<div className='flex w-full flex-col gap-2 justify-center items-center mt-3'>
				<div className='p-4 flex justify-center items-center text-center rounded-full bg-[#FEE2E2]'>
					<DeleteOutlinedIcon sx={{ color: '#E45454' }} />
				</div>
				<div className='flex w-full flex-col justify-center items-center'>
					<p className='font-medium text-xl '>Delete Your Bookings</p>
				</div>
			</div>
			<div className='text-center w-full'>
				Are you sure you wish to delete the selected booking?
			</div>
			<div className='w-full flex items-center justify-center gap-4'>
				{data.recurrenceID && data.recurrenceRule ? (
					<>
						<Button
							variant='contained'
							color='error'
							sx={{ paddingY: '0.5rem', marginTop: '4px' }}
							className='w-full cursor-pointer'
							onClick={() => handleSingleDelete(data.bookingId)}
						>
							Delete
						</Button>
						<Button
							variant='contained'
							color='error'
							sx={{ paddingY: '0.5rem', marginTop: '4px' }}
							className='w-full cursor-pointer'
							onClick={() => handleDeleteAllRepeat(data.bookingId)}
						>
							Delete All
						</Button>
					</>
				) : (
					<Button
						variant='contained'
						color='error'
						sx={{ paddingY: '0.5rem', marginTop: '4px' }}
						className='w-full cursor-pointer'
						onClick={() => handleSingleDelete(data.bookingId)}
					>
						Delete
					</Button>
				)}
			</div>
		</div>
	);
}

// Duplicate Booking button Modal
function DuplicateBookingModal({
	data,
	setDuplicateBookingModal,
	closeDialog,
}) {
	const [isToggleTrue, setToggleTrue] = useState(true);
	const [newDate, setNewDate] = useState(formatDate(data.pickupDateTime));
	const handleToggleChange = () => {
		setToggleTrue(!isToggleTrue);
	};
	const handleDateChange = (e) => {
		setNewDate(e.target.value);
	};
	const handleSave = async(data) => {
		const newData = {
			...data,
			pickupDateTime: newDate,
		};
		console.log(newData);
		setDuplicateBookingModal(false);
		closeDialog();
		const res = await makeBooking(newData, true);
		if (res.status === 'success') {
			dispatch(openSnackbar('Booking Created Successfully!', 'success'));
		}
		getRefreshedBooking();
	};
	const createDuplicateBooking = (originalBookingData, newPickupDateTime) => {
		// Replace this with the actual implementation to create a new booking
		// using the selected date and the original booking data.
		console.log('Creating new booking with date:', newPickupDateTime);
	};

	return (
		<div className='flex flex-col items-center justify-center w-[23vw] bg-white rounded-lg px-4 pb-4 pt-5 sm:p-6 sm:pb-4 gap-4'>
			<div className='flex w-full flex-col gap-2 justify-center items-center mt-3'>
				<div className='p-4 flex justify-center items-center text-center rounded-full bg-[#FEE2E2]'>
					<FileCopyOutlinedIcon sx={{ color: '#E45454' }} />
				</div>
				<div className='flex w-full flex-col justify-center items-center'>
					<p className='font-medium text-xl '>Duplicate Booking</p>
				</div>
			</div>
			<div className='text-center w-full'>
				Select a new pickup time for the duplicate booking:
			</div>
			<div className='w-full flex items-center justify-start gap-1'>
				<Switch
					checked={isToggleTrue}
					onChange={handleToggleChange}
				/>
				<span>Use existing booking datetime</span>
			</div>
			{!isToggleTrue && (
				<div className='w-full'>
					<input
						required
						type='datetime-local'
						className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
						value={newDate}
						onChange={handleDateChange}
					/>
				</div>
			)}
			<div className='w-full flex items-center justify-center gap-4'>
				<Button
					variant='contained'
					color='error'
					sx={{ paddingY: '0.5rem', marginTop: '4px' }}
					className='w-full cursor-pointer'
					onClick={() => handleSave({ ...data, bookingId: null })}
				>
					Save
				</Button>
			</div>
		</div>
	);
}
