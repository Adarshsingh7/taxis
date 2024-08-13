/** @format */

import {
	ScheduleComponent,
	Day,
	Agenda,
	Inject,
	ViewsDirective,
	ViewDirective,
} from '@syncfusion/ej2-react-schedule';
import { registerLicense } from '@syncfusion/ej2-base';
import Modal from '../components/Modal';
import CustomDialog from '../components/CustomDialog';

registerLicense(import.meta.env.VITE_SYNCFUSION_KEY);

import './scheduler.css';
import ProtectedRoute from '../utils/Protected';
import { useEffect, useRef, useState } from 'react';
import Snackbar from '../components/Snackbar-v2';
import { useDispatch, useSelector } from 'react-redux';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import Button from '@mui/material/Button';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import LocalTaxiOutlinedIcon from '@mui/icons-material/LocalTaxiOutlined';
import CurrencyPoundOutlinedIcon from '@mui/icons-material/CurrencyPoundOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import isLightColor from '../utils/isLight';
import { Switch } from '@mui/material';
import {
	changeActiveDate,
	completeActiveBookingStatus,
	deleteSchedulerBooking,
	getRefreshedBookings,
	setActiveBookingIndex,
} from '../context/schedulerSlice';
import { useAuth } from '../hooks/useAuth';

const AceScheduler = ({ date }) => {
	const [dialogOpen, setDialogOpen] = useState(false);

	const { bookings, activeComplete, activeSearch, activeSearchResults } =
		useSelector((state) => state.scheduler);
	const activeTestMode = useSelector(
		(state) => state.bookingForm.isActiveTestMode
	);

	const [selectedBookingData, setSelectedBookingData] = useState();
	const [currentDate, setCurrentDate] = useState(new Date());
	const activeTestModeRef = useRef(activeTestMode);
	const currentDateRef = useRef(currentDate);
	const isActiveCompleteRef = useRef(activeComplete);
	const [viewBookingModal, setViewBookingModal] = useState(false);
	const dispatch = useDispatch();
	const { fullName, id } = useAuth().currentUser;

	const fieldsData = {
		id: 'bookingId',
		subject: { name: 'subject' },
		isAllDay: { name: 'isAllDay' },
		startTime: { name: 'pickupDateTime' },
		endTime: { name: 'endTime' },
		OwnerColor: { name: 'backgroundColorRGB' },
		recurrenceRule: { name: 'recurrenceRule' },
		Readonly: { name: 'Readonly' },
	};

	function onEventRendered(args) {
		args.element;
		args.element.style.backgroundColor = args.data.backgroundColorRGB;
		args.element.style.borderRadius = '10px';
		if (args.data.status === 1) {
			args.element.style.background = `repeating-linear-gradient(-40deg,  ${args.data.backgroundColorRGB}, ${args.data.backgroundColorRGB} 10px, rgb(187, 187, 187) 20px, rgb(187, 187, 187) 20px) ${args.data.backgroundColorRGB}`;
		}
		if (isLightColor(args.data.backgroundColorRGB)) {
			args.element.style.color = 'black';
		} else {
			args.element.style.color = 'white';
		}
	}

	useEffect(() => {
		currentDateRef.current = new Date(date);
		// setCurrentDate(new Date(date));
		dispatch(changeActiveDate(new Date(date).toISOString()));
	}, [date, dispatch]);

	useEffect(() => {
		activeTestModeRef.current = activeTestMode;
	}, [activeTestMode]);

	useEffect(() => {
		currentDateRef.current = currentDate;
		dispatch(changeActiveDate(new Date(currentDate).toISOString()));
	}, [currentDate, dispatch]);

	useEffect(() => {
		isActiveCompleteRef.current = activeComplete;
	}, [activeComplete]);

	useEffect(() => {
		async function helper() {
			dispatch(getRefreshedBookings());
		}
		helper();
	}, [activeTestMode, currentDate, dispatch, activeComplete]);

	useEffect(() => {
		async function helper() {
			dispatch(getRefreshedBookings());
		}
		const refreshInterval = setInterval(helper, 10000);
		return () => clearInterval(refreshInterval);
	}, [dispatch]);

	const eventSettings = {
		dataSource: activeSearch ? activeSearchResults : bookings,
		fields: fieldsData,
		allowAdding: false,
		allowEditing: false,
		allowDeleting: false,
	};

	const onEventClick = (args) => {
		setSelectedBookingData(args.event);
		setDialogOpen(true);
		dispatch(setActiveBookingIndex(args.event.bookingId));
	};

	function handleDeleteBooking(bookingId, cancelBlock) {
		dispatch(deleteSchedulerBooking(cancelBlock, fullName, id));
	}

	return (
		<ProtectedRoute>
			<Snackbar />
			<ScheduleComponent
				height={window.innerHeight - 150}
				currentView={activeSearch ? 'Agenda' : 'Day'}
				selectedDate={currentDate}
				navigating={(args) => setCurrentDate(args.currentDate)}
				eventSettings={eventSettings}
				eventRendered={onEventRendered}
				eventClick={onEventClick}
				editorTemplate={null}
				popupOpen={(args) => (args.cancel = true)}
			>
				{dialogOpen && !viewBookingModal && (
					<Modal
						open={dialogOpen}
						setOpen={setDialogOpen}
					>
						<CustomDialog
							closeDialog={() => setDialogOpen(false)}
							data={selectedBookingData}
							onDeleteBooking={handleDeleteBooking}
							setViewBookingModal={setViewBookingModal}
						/>
					</Modal>
				)}
				{viewBookingModal && (
					<Modal
						open={viewBookingModal}
						setOpen={setViewBookingModal}
					>
						<ViewBookingModal
							data={selectedBookingData}
							setViewBookingModal={setViewBookingModal}
						/>
					</Modal>
				)}
				<Inject services={[Day, Agenda]} />
			</ScheduleComponent>
			{/* Changed by Tanya - (9 Aug) */}
			<div className='flex justify-end w-[10%] fixed top-[185px] right-[20px] z-[1000]'>
				{!activeSearch && (
					<span className='flex flex-row gap-2 items-center align-middle'>
						<span className='select-none'>Completed</span>
						<Switch
							checked={activeComplete}
							onChange={() => {
								dispatch(completeActiveBookingStatus(!activeComplete));
							}}
						/>
					</span>
				)}
			</div>
		</ProtectedRoute>
	);
};
export default AceScheduler;

function ViewBookingModal({ data, setViewBookingModal }) {
	return (
		<div className='flex flex-col items-center justify-center w-[23vw] bg-white rounded-lg px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
			<div className='p-4 flex justify-center items-center text-center rounded-full bg-[#FEE2E2]'>
				<CalendarTodayIcon sx={{ color: '#E45454' }} />
			</div>
			<div className='flex w-full flex-col gap-2 justify-center items-center mt-3'>
				<div className='flex w-full flex-col justify-center items-center'>
					<p className='font-medium '>Booking Details</p>
					<div className='font-bold'># {data?.bookingId}</div>
				</div>
				<div className='bg-[#16A34A] text-center font-medium text-white py-2 px-4 w-full rounded-sm'>
					<p>Booking Confirmed</p>
				</div>
				<div className='max-h-[70vh] overflow-auto'>
					{/* Pickup */}
					<div className='bg-[#F3F4F6] w-full flex flex-row justify-between items-center gap-10 border-y-gray-300 border-y '>
						<HomeOutlinedIcon sx={{ color: '#16A34A', marginLeft: '1rem' }} />
						<div className='w-full flex flex-col items-start gap-1 mb-2'>
							<div className='w-full py-1 border-b-gray-300 border-b-[1px]'>
								<p className='font-medium'>Pickup</p>
							</div>
							<div className='w-full flex flex-col items-start'>
								<p className='font-medium'>
									{data?.dateCreated?.split('T').join(' ').split('.')[0]}
								</p>
								<p className='text-[14px] text-orange-900 cursor-pointer'>
									{data?.pickupAddress}
								</p>
								<p className='text-[14px] text-orange-900 cursor-pointer'>
									{data?.pickupPostCode}
								</p>
							</div>
						</div>
					</div>
					{/* Via if Present */}
					{data?.vias.length > 0 && (
						<div className='bg-[#F3F4F6] w-full flex flex-row justify-between items-center gap-10 border-y-gray-300 border-y'>
							<HomeOutlinedIcon sx={{ color: '#16A34A', marginLeft: '1rem' }} />
							<div className='w-full flex flex-col items-start gap-1 mb-2'>
								<div className='w-full py-1 border-b-gray-300 border-b-[1px]'>
									<p className='font-medium'>{`Via's`}</p>
								</div>
								{data?.vias.map((via, index) => (
									<div
										key={index}
										className='w-full flex flex-col items-start'
									>
										<p className='text-[14px] text-orange-900 cursor-pointer'>
											{via.address}
										</p>
										<p className='text-[14px] text-orange-900 cursor-pointer'>
											{via.postCode}
										</p>
									</div>
								))}
							</div>
						</div>
					)}
					{/* Destination */}
					<div className='bg-[#F3F4F6] w-full flex flex-row justify-between items-center gap-10 border-y-gray-300 border-y '>
						<HomeOutlinedIcon sx={{ color: '#16A34A', marginLeft: '1rem' }} />
						<div className='w-full flex flex-col items-start gap-1 mb-2'>
							<div className='w-full py-1 border-b-gray-300 border-b-[1px]'>
								<p className='font-medium'>Destination</p>
							</div>
							<div className='w-full flex flex-col items-start'>
								<p className='text-[14px] text-orange-900 cursor-pointer'>
									{data?.destinationAddress}
								</p>
								<p className='text-[14px] text-orange-900 cursor-pointer'>
									{data?.destinationPostCode}
								</p>
							</div>
						</div>
					</div>
					{/* Details - Journey */}
					<div className='bg-[#F3F4F6] w-full flex flex-row justify-between items-center gap-10 border-y-gray-300 border-y '>
						<div className='w-full flex flex-col items-start gap-1 mb-2'>
							<div className='w-full flex justify-end '>
								<div className='w-[80%] py-1 border-b-gray-300 border-b-[1px]'>
									<p className='font-medium'>Details</p>
								</div>
							</div>
							<div className='w-full flex flex-row justify-start gap-10 items-center'>
								<PersonOutlineOutlinedIcon
									sx={{ marginLeft: '1rem', padding: '1px' }}
								/>
								<div className=' w-full flex flex-col py-1'>
									<p className='font-medium text-black'>
										{data?.passengerName}
									</p>
									<p className='text-[14px] text-black'>
										{data?.passengers} <span>Passenger(s)</span>
									</p>
								</div>
							</div>
							<div className='w-full flex flex-row justify-start gap-10 items-center'>
								<LocalPhoneOutlinedIcon
									sx={{ marginLeft: '1rem', padding: '1px' }}
								/>
								<div className=' w-full flex flex-col py-1'>
									<p className='text-[14px] text-orange-900 cursor-pointer'>
										{data.phoneNumber}
									</p>
								</div>
							</div>
						</div>
					</div>
					{/* Price - Information */}
					<div className='bg-[#F3F4F6] w-full flex flex-row justify-between items-center gap-10 border-y-gray-300 border-y '>
						<div className='w-full flex flex-col items-start gap-1 mb-2'>
							<div className='w-full flex justify-end '>
								<div className='w-[80%] py-1 border-b-gray-300 border-b-[1px]'>
									<p className='font-medium'>Price - Journey Information</p>
								</div>
							</div>
							<div className='w-full flex flex-row justify-start gap-10 items-center'>
								<WatchLaterOutlinedIcon
									sx={{ marginLeft: '1rem', padding: '2px' }}
								/>
								<div className=' w-full flex flex-col py-1'>
									<p className='text-[14px] text-black'>
										{Math.floor(data?.durationMinutes / 60)}{' '}
										<span>Hour(s)</span> {data?.durationMinutes % 60}{' '}
										<span>Minute(s)</span>
									</p>
								</div>
							</div>
							{data?.mileageText > 0 && (
								<div className='w-full flex flex-row justify-start gap-10 items-center'>
									<LocalTaxiOutlinedIcon
										sx={{ marginLeft: '1rem', padding: '2px' }}
									/>
									<div className=' w-full flex flex-col py-1'>
										<p className='text-[14px] text-black'>
											{data?.mileageText}
										</p>
									</div>
								</div>
							)}
							{data?.price > 0 && (
								<div className='w-full flex flex-row justify-start gap-10 items-center'>
									<CurrencyPoundOutlinedIcon
										sx={{ marginLeft: '1rem', padding: '3px' }}
									/>
									<div className=' w-full flex flex-col py-1'>
										<p className='text-[14px] text-orange-900 cursor-pointer'>
											{data.price}
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				<Button
					variant='contained'
					color='error'
					sx={{ paddingY: '0.5rem', marginTop: '4px' }}
					className='w-full cursor-pointer'
					onClick={() => setViewBookingModal(false)}
				>
					Back
				</Button>
			</div>
		</div>
	);
}
