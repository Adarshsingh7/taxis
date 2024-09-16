/** @format */
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { useState } from 'react';
import Modal from '../components/Modal';
import EditBookingModal from './CustomDialogButtons/EditBookingModal';
import AllocateModal from './CustomDialogButtons/AllocateModal';
import CompleteBookingModal from './CustomDialogButtons/CompleteBookingModal';
import DeleteBookingModal from './CustomDialogButtons/DeleteBookingModal';
import DuplicateBookingModal from './CustomDialogButtons/DuplicateBookingModal';
import { useDispatch, useSelector } from 'react-redux';
import { addDataFromSchedulerInEditMode } from '../context/bookingSlice';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import {
	deleteSchedulerBooking,
	setActiveSearchResultClicked,
} from '../context/schedulerSlice';
import { useAuth } from '../hooks/useAuth';
function CustomDialog({ closeDialog }) {
	const [allocateModal, setAllocateModal] = useState(false);
	const [isCompleteBookingModal, setIsCompleteBookingModal] = useState(false);
	const [editBookingModal, setEditBookingModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [duplicateBookingModal, setDuplicateBookingModal] = useState(false);
	const dispatch = useDispatch();
	const {
		bookings,
		currentlySelectedBookingIndex: index,
		activeSearch,
		activeSearchResult,
	} = useSelector((state) => state.scheduler);
	const user = useAuth();
	let data = {};
	data = bookings[index];
	if (activeSearch) data = activeSearchResult;

	if (!data?.bookingId) return null;

	const handleCancelOnArrival = () => {
		dispatch(
			deleteSchedulerBooking(
				false,
				user.currentUser.fullName,
				user.currentUser.id,
				true
			)
		);
		closeDialog();
	};

	return (
		<div className='fixed left-[-35vw] inset-0 w-[70vw] mx-auto z-50 flex items-center justify-center p-4 bg-background bg-opacity-50'>
			<div className='relative w-full max-w-7xl p-6 bg-card rounded-lg shadow-lg dark:bg-popover bg-white max-h-[90vh]'>
				<div className='flex items-center justify-between mb-6'>
					<h2 className='text-lg font-medium text-card'>
						BookingId:{' '}
						<span className='text-xl font-semibold text-green-900'>
							{data.bookingId}
						</span>
					</h2>

					<button
						className='rounded-full p-2'
						onClick={() => {
							closeDialog();
							dispatch(setActiveSearchResultClicked(null));
						}}
					>
						<CancelRoundedIcon />
					</button>
				</div>
				<div className='p-4 grid grid-cols-2 place-content-between gap-4 mt-4 border border-card dark:border-popover max-h-[70vh] overflow-scroll'>
					<div className='w-[100%]'>
						<div className='flex flex-col w-full gap-4'>
							<div className='border border-card p-4 shadow-md rounded-lg bg-[#F3F4F6]'>
								{/* <h3 className='text-xl absolute top-[-18px] bg-white text-red-700 flex justify-start items-center font-semibold'>
									Journey
								</h3> */}
								<div className='flex justify-center items-start gap-2 w-full'>
									<div className='w-full'>
										<div className='w-full flex'>
											<HomeIcon sx={{ fontSize: '32px', color: 'green' }} />
											<h3 className='w-full border-b border-b-gray-300 py-1 text-md font-medium mb-1'>
												Pickup
											</h3>
										</div>

										<BookingOption
											text={getTodayInEnGbFormat(data.pickupDateTime)}
											head='Booking Date'
										/>
										<BookingOption
											text={`${data.pickupAddress}, ${data.pickupPostCode}`}
											head='From'
										/>
									</div>
								</div>
							</div>
							{data.vias.length > 0 && (
								<div className='flex justify-center items-start gap-2 w-full border border-card p-4 shadow-md relative rounded-lg bg-[#F3F4F6]'>
									<div className='w-full'>
										<div className='flex w-full'>
											<HomeIcon sx={{ fontSize: '32px', color: 'green' }} />
											<h3 className='w-full border-b border-b-gray-300 py-1 text-md font-medium mb-1'>
												Vias
											</h3>
										</div>

										{data.vias.length > 0 &&
											data.vias.map((via, idx) => (
												<>
													<div className='flex items-start mb-1 w-full'>
														<p className='text-md font-medium pr-2 whitespace-nowrap w-[20%] flex justify-end items-end'>
															{`Via ${idx + 1}:`}
														</p>
														<span className='text-card dark:text-popover-foreground text-[1rem] w-[80%] flex justify-start items-start'>
															{`${via.address}, ${via.postCode}`}
														</span>
													</div>
												</>
											))}
									</div>
								</div>
							)}

							<div className='flex justify-center items-start gap-2 w-full border border-card p-4 shadow-md relative rounded-lg bg-[#F3F4F6]'>
								<div className='w-full'>
									<div className='w-full flex'>
										<HomeIcon sx={{ fontSize: '32px', color: 'green' }} />
										<h3 className='w-full border-b border-b-gray-300 py-1 text-md font-medium mb-1'>
											Destination
										</h3>
									</div>
									<div className='flex items-start mb-1 w-full'>
										<p className='text-md font-medium pr-2 whitespace-nowrap w-[20%] flex justify-end items-end'>
											To:
										</p>
										<span className='text-card dark:text-popover-foreground text-[1rem] w-[80%] flex justify-start items-start'>
											{`${data.destinationAddress}, ${data.destinationPostCode}`}
										</span>
									</div>
									{/* <BookingOption
										text={`${data.destinationAddress}, ${data.destinationPostCode}`}
										head='To'
									/> */}
								</div>
							</div>
							<div className='flex justify-center items-start gap-2 w-full border border-card p-4 shadow-md relative rounded-lg bg-[#F3F4F6]'>
								<div className='w-full'>
									<div className='flex w-full'>
										<PersonIcon sx={{ fontSize: '32px', color: 'green' }} />
										<h3 className='w-full border-b border-b-gray-300 py-1 text-md font-medium mb-1'>
											Passenger
										</h3>
									</div>

									<BookingOption
										text={data.passengerName ? data.passengerName : 'NA'}
										head='Passenger Name'
									/>
									<BookingOption
										text={data.email ? data.email : 'NA'}
										head='Email'
									/>
									<BookingOption
										text={data.phoneNumber ? data.phoneNumber : 'NA'}
										head='Phone Number'
									/>
									<BookingOption
										text={data.passengers ? data.passengers : 'NA'}
										head='Passenger Count'
									/>
								</div>
							</div>
						</div>
					</div>
					<div>
						<div className='flex h-full flex-col w-full gap-4'>
							<div className='flex justify-start items-start gap-2 w-full border border-card p-4 shadow-md relative rounded-lg bg-[#F3F4F6] h-full'>
								<div className='w-full flex justify-center items-start gap-2'>
									<div className='w-full'>
										<div className='flex w-full'>
											<TextSnippetIcon
												sx={{ fontSize: '32px', color: 'green' }}
											/>
											<h3 className='w-full border-b border-b-gray-300 py-1 text-md font-medium mb-1'>
												Details
											</h3>
										</div>

										<BookingOption
											text={data.details ? data.details : 'NA'}
											head='Details'
										/>
										<BookingOption
											head='Type'
											text={
												data.scope === 0
													? 'Cash Job'
													: data.scope === 1
													? 'Account'
													: data.scope === 2
													? 'Rank'
													: data.scope === 3
													? 'All'
													: ''
											}
										/>
										{data.scope === 1 && (
											<BookingOption
												text={data.accountNumber ? data.accountNumber : 'NA'}
												head='Account'
											/>
										)}
										<BookingOption
											text={data.fullname || 'NA'}
											head='Allocated Driver'
										/>
										<BookingOption
											text={data.price ? `£${data.price}` : 'NA'}
											head='Price'
										/>
										<BookingOption
											text={
												data.durationMinutes
													? Math.floor(Number(data.durationMinutes) / 60) +
													  ' Hour(s)'
													: 'NA'
											}
											head='Time'
										/>
										<BookingOption
											text={data.mileageText ? data.mileageText : 'NA'}
											head='Distance'
										/>

										{data.isAllDay && (
											<BookingOption
												text={data.isAllDay ? '✅' : '❎'}
												head='All Day'
											/>
										)}

										{data.recurrenceID && (
											<BookingOption
												text={data.recurrenceID ? 'Yes' : 'No'}
												head='Repeat Booking'
											/>
										)}
										<BookingOption
											text={
												data.paymentStatus === 0
													? 'Not Paid'
													: data.paymentStatus === 1
													? 'Paid'
													: data.paymentStatus === 2
													? 'Awaiting payment'
													: ''
											}
											head='Payment Status'
										/>
										<BookingOption
											text={
												data.confirmationStatus === 0
													? 'NA'
													: data.confirmationStatus === 1
													? 'Confirmed'
													: data.confirmationStatus
													? 'Not Confirmed'
													: 'NA'
											}
											head='Confirmation Status'
										/>

										<div>
											<div className='flex w-full items-start mb-4'>
												<p className='text-md font-medium pr-2 w-[30%] flex justify-end items-end'>
													Booked By:{' '}
												</p>
												<span
													className={`text-card dark:text-popover-foreground text-[1rem]`}
												>
													{data.bookedByName}{' '}
													<span className='text-md font-medium'>On</span>{' '}
													{getTodayInEnGbFormat(data.dateCreated)}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='my-auto pt-2 gap-4 flex flex-wrap justify-center items-center'>
					{/* <BookingButton
						text='View Booking'
						color='blue'
						// onClick={() => setViewBookingModal(true)}
					/> */}

					<BookingButton
						text='Allocate Booking'
						color='bg-blue-700'
						onClick={() => setAllocateModal(true)}
					/>
					<BookingButton
						onClick={() => {
							if (data.recurrenceRule) setEditBookingModal(true);
							else {
								const filterData = {
									...data,
									recurrenceID: '',
									recurrenceRule: '',
								};
								dispatch(addDataFromSchedulerInEditMode(filterData));
								closeDialog(false);
							}
						}}
						text='Edit Booking'
						color='bg-blue-700'
					/>
					<BookingButton
						text='Duplicate Booking'
						color='bg-blue-700'
						onClick={() => setDuplicateBookingModal(true)}
					/>
					<BookingButton
						text='Driver Arrived'
						color='bg-blue-700'
					/>
					<BookingButton
						text='Complete Booking'
						color='bg-green-700'
						onClick={() => setIsCompleteBookingModal(true)}
					/>
					{data.scope === 1 && user.currentUser?.isAdmin && (
						<BookingButton
							text='Cancel On Arrival'
							color='bg-orange-700'
							onClick={handleCancelOnArrival}
						/>
					)}
					<BookingButton
						text='Cancel Booking'
						color='bg-red-700'
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
					closeDialog={closeDialog}
				/>
			</Modal>
			<Modal
				open={isCompleteBookingModal}
				setOpen={setIsCompleteBookingModal}
			>
				<CompleteBookingModal
					setIsCompleteBookingModal={setIsCompleteBookingModal}
					closeDialog={closeDialog}
				/>
			</Modal>
			{data.recurrenceRule && (
				<Modal
					open={editBookingModal}
					setOpen={setEditBookingModal}
				>
					<EditBookingModal
						setEditBookingModal={setEditBookingModal}
						closeDialog={closeDialog}
					/>
				</Modal>
			)}

			<Modal
				open={duplicateBookingModal}
				setOpen={setDuplicateBookingModal}
			>
				<DuplicateBookingModal
					setDuplicateBookingModal={setDuplicateBookingModal}
					closeDialog={closeDialog}
				/>
			</Modal>
			<Modal
				open={deleteModal}
				setOpen={setDeleteModal}
			>
				<DeleteBookingModal
					setDeleteModal={setDeleteModal}
					closeDialog={closeDialog}
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
		hour: '2-digit',
		minute: '2-digit',
		hour12: false, // Use 24-hour format. Set to true for 12-hour format with AM/PM.
	});
	return enGbFormatter.format(today);
}

const BookingOption = ({ text, head }) => {
	return (
		<div className='flex items-start mb-1 w-full'>
			<p className='text-md font-medium pr-2 whitespace-nowrap w-[30%] flex justify-end items-end'>
				{head}:{' '}
			</p>
			<span className='text-card dark:text-popover-foreground text-[1rem] w-[70%] flex justify-start items-start'>
				{text}
			</span>
		</div>
	);
};

const BookingButton = ({ text, color, ...props }) => {
	return (
		<button
			{...props}
			className={`px-3 py-2 text-white ${color} hover:bg-opacity-80 rounded-lg`}
		>
			{text}
		</button>
	);
};

export default CustomDialog;
