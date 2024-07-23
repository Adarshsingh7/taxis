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

registerLicense(
	'Ngo9BigBOggjHTQxAR8/V1NCaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXhedHVUQ2hYVkN2V0c='
);

import './scheduler.css';
import ProtectedRoute from '../utils/Protected';
import { getBookingData } from '../utils/apiReq';
import { useEffect, useState } from 'react';
import Snackbar from '../components/SnackBar';
import { useBooking } from '../hooks/useBooking';

const AceScheduler = () => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [open, setOpen] = useState(false);
	const [snackbarMessage, setSnackBarMessage] = useState('');
	const [data, setData] = useState();
	const [selectedBookingData, setSelectedBookingData] = useState();
	const { onDeleteBooking } = useBooking();

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
		getBookingData().then((data) => {
			if (data.status === 'success') {
				setData(data.bookings);
				localStorage.setItem('bookings', JSON.stringify(data.bookings));
				setSnackBarMessage('Booking Refreshed');
			} else {
				setSnackBarMessage(data.message);
			}
			setOpen(true);
		});
	}, []);

	const eventSettings = {
		dataSource: data,
		fields: fieldsData,
		allowAdding: false,
		allowEditing: false,
		allowDeleting: false,
	};

	const onEventClick = (args) => {
		setSelectedEvent(args.event);
		setSelectedBookingData(args.event);
		setDialogOpen(true);
	};

	function handleDeleteBooking(bookingId) {
		onDeleteBooking(bookingId).then((res) => {
			if (res.status === 'success') {
				setDialogOpen(false);
				getBookingData().then((data) => {
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
				eventSettings={eventSettings}
				eventRendered={onEventRendered}
				eventClick={onEventClick}
				editorTemplate={null}
				popupOpen={(args) => (args.cancel = true)}
			>
				{dialogOpen && (
					<Modal
						open={dialogOpen}
						setOpen={setDialogOpen}
					>
						<CustomDialog
							closeDialog={() => setDialogOpen(false)}
							data={selectedBookingData}
							onDeleteBooking={handleDeleteBooking}
						/>
					</Modal>
				)}
				<Inject services={[Day, Agenda]} />
			</ScheduleComponent>
		</ProtectedRoute>
	);
};
export default AceScheduler;
