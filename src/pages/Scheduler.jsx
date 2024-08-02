/** @format */

import {
	ScheduleComponent,
	Day,
	Agenda,
	Inject,
} from '@syncfusion/ej2-react-schedule';
import { registerLicense } from '@syncfusion/ej2-base';
import Modal from '../components/Modal';
import CustomDialog from '../components/CustomDialog';

registerLicense(import.meta.env.VITE_SYNCFUSION_KEY);

import './scheduler.css';
import ProtectedRoute from '../utils/Protected';
import { getBookingData } from '../utils/apiReq';
import { useEffect, useState } from 'react';
import Snackbar from '../components/SnackBar';
import { useBooking } from '../hooks/useBooking';
import { useSelector } from 'react-redux';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import Button from '@mui/material/Button';

const AceScheduler = () => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [open, setOpen] = useState(false);
	const [snackbarMessage, setSnackBarMessage] = useState('');
	const [data, setData] = useState();
	const [selectedBookingData, setSelectedBookingData] = useState();
	const { onDeleteBooking } = useBooking();
	const [currentDate, setCurrentDate] = useState(new Date());
	const activeTestMode = useSelector(
		(state) => state.bookingForm.isActiveTestMode
	);
	const [viewBookingModal, setViewBookingModal] = useState(false);

	const fieldsData = {
		id: 'bookingId',
		subject: { name: 'passengerName' },
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
	}

	useEffect(() => {
		getBookingData(currentDate, activeTestMode).then((data) => {
			if (data.status === 'success') {
				setData(data.bookings);
				setSnackBarMessage('Booking Refreshed');
			} else {
				setSnackBarMessage(data.message);
			}
			if (currentDate.getDate() === new Date().getDate()) setOpen(true);
		});
	}, [activeTestMode, currentDate]);

	const eventSettings = {
		dataSource: data,
		fields: fieldsData,
		allowAdding: false,
		allowEditing: false,
		allowDeleting: false,
	};

	const onEventClick = (args) => {
		setSelectedBookingData(args.event);
		setDialogOpen(true);
	};

	function handleDeleteBooking(bookingId) {
		onDeleteBooking(bookingId, activeTestMode).then((res) => {
			if (res.status === 'success') {
				setDialogOpen(false);
				getBookingData(currentDate, activeTestMode).then((data) => {
					if (data.status === 'success') {
						setData(data.bookings);
						localStorage.setItem('bookings', JSON.stringify(data.bookings));
						setSnackBarMessage('Booking Refreshed');
					} else {
						setSnackBarMessage(data.message);
					}
					setOpen(true);
				});
			} else {
				alert('failed to delete');
			}
		});
	}

	return (
		<ProtectedRoute>
			<Snackbar
				message={snackbarMessage}
				open={open}
				disableReset={true}
				setOpen={setOpen}
			/>
			<ScheduleComponent
				currentView='Day'
				navigating={(args) => setCurrentDate(args.currentDate)}
				eventSettings={eventSettings}
				eventRendered={onEventRendered}
				eventClick={onEventClick}
				editorTemplate={null}
				popupOpen={(args) => (args.cancel = true)}
			>
				{(dialogOpen && !viewBookingModal) && (
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
				{ viewBookingModal &&
					<Modal
						open={viewBookingModal}
						setOpen={setViewBookingModal}
					>
						<ViewBookingModal data={selectedBookingData} setViewBookingModal={setViewBookingModal} />
					</Modal>
				}
				<Inject services={[Day, Agenda]} />
			</ScheduleComponent>
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
				<div className='bg-[#F3F4F6] w-full flex flex-row justify-between items-center gap-10 border-y-gray-300 border-y'>
					<HomeOutlinedIcon sx={{ color: '#16A34A', marginLeft: '1rem' }} />
					<div className='w-full flex flex-col items-start gap-1 mb-2'>
						<div className='w-full py-1 border-b-gray-300 border-b-[1px]'>
							<p className='font-medium'>Pickup</p>
						</div>
						<div className='w-full flex flex-col items-start'>
							<p className='font-medium'>
								{data?.dateCreated?.split('T').join(' ').split('.')[0]}
							</p>
							<p className='text-[14px] text-orange-900'>
								{data?.pickupAddress}
							</p>
							<p className='text-[14px] text-orange-900'>
								{data?.pickupPostCode}
							</p>
						</div>
					</div>
				</div>
				<div className='bg-[#F3F4F6] w-full flex flex-row justify-between items-center gap-10 border-y-gray-300 border-y '>
					<HomeOutlinedIcon sx={{ color: '#16A34A', marginLeft: '1rem' }} />
					<div className='w-full flex flex-col items-start gap-1 mb-2'>
						<div className='w-full py-1 border-b-gray-300 border-b-[1px]'>
							<p className='font-medium'>Destination</p>
						</div>
						<div className='w-full flex flex-col items-start'>
							<p className='text-[14px] text-orange-900'>
								{data?.destinationAddress}
							</p>
							<p className='text-[14px] text-orange-900'>
								{data?.destinationPostCode}
							</p>
						</div>
					</div>
				</div>
				<div className='bg-[#F3F4F6] w-full flex flex-row justify-between items-center gap-10 border-y-gray-300 border-y '>
					<div className='w-full flex flex-col items-start gap-1 mb-2'>
						<div className='w-full flex justify-end '>
							<div className='w-[80%] py-1 border-b-gray-300 border-b-[1px]'>
								<p className='font-medium'>Details</p>
							</div>
						</div>
						<div className='w-full flex flex-row justify-start gap-10 items-center'>
							<PersonOutlineOutlinedIcon sx={{ marginLeft: '1rem',  padding: "1px"}} />
							<div className=' w-full flex flex-col py-1'>
								<p className='font-medium text-black'>{data?.passengerName}</p>
								<p className='text-[14px] text-black'>
									{data?.passengers} <span>Passenger(s)</span>
								</p>
							</div>
						</div>
						<div className='w-full flex flex-row justify-start gap-10 items-center'>
							<LocalPhoneOutlinedIcon sx={{ marginLeft: '1rem', padding: "1px"}} />
							<div className=' w-full flex flex-col py-1'>
								<p className='text-[14px] text-orange-900'>
									{data.phoneNumber}
								</p>
							</div>
						</div>
					</div>
				</div>
				<Button variant='contained' color='error' sx={{paddingY: "0.5rem", marginTop: "4px"}} className='w-full' onClick={() => setViewBookingModal(false)}>Back</Button>
			</div>
		</div>
	);
}
