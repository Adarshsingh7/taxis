/** @format */
// all External Libraries and Components are imports
import { Switch, TextField } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { useEffect, useState, Fragment, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Context And Hooks imports for data flow and management
import {
	removeBooking,
	updateValue,
	updateValueSilentMode,
} from '../context/bookingSlice';
import { useAuth } from './../hooks/useAuth';
import { makeBookingQuoteRequest, fireCallerEvent } from '../utils/apiReq';

// All local component utilitys
import Autocomplete from '../components/AutoComplete';
import Modal from '../components/Modal';
import SimpleSnackbar from '../components/SnackBar';
import GoogleAutoComplete from '../components/GoogleAutoComplete';
import LongButton from '../components/BookingForm/LongButton';

// All Modals and dialogs for the booking form
import RepeatBooking from '../components/BookingForm/RepeatBooking';
import AddAndEditVia from '../components/BookingForm/AddAndEditVia';
import ListDrivers from '../components/BookingForm/ListDrivers';
import QuoteDialog from '../components/BookingForm/QuoteDialog';
import { addCallerToLookup } from '../context/callerSlice';
import { convertKeysToFirstUpper } from '../utils/casingConverter';

function Booking({ bookingData, id, onBookingUpload }) {
	// All Hooks and Contexts for the data flow and management
	const { currentUser, isAuth } = useAuth();
	const dispatch = useDispatch();
	const callerId = useSelector((state) => state.caller);

	// All Local States and Hooks for ui and fligs
	const [isAddVIAOpen, setIsAddVIAOpen] = useState(false);
	const [isRepeatBookingModelActive, setIsRepeatBookingModelActive] =
		useState(false);
	const [isQuoteSnackbarActive, setIsQuoteSnackbarActive] = useState(false);
	const [isDriverModalActive, setDriverModalActive] = useState(false);

	const pickupRef = useRef(null);
	const destinationRef = useRef(null);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackBarColor, setSnackbarColor] = useState('#2F3030');
	const [isQuoteDialogActive, setIsQuoteDialogActive] = useState(false);
	const [quote, setQuote] = useState(null);

	// working for 🔁 button basically toggles between pickup and destination addresses
	function toggleAddress() {
		updateData('destinationAddress', bookingData.pickupAddress);
		updateData('destinationPostCode', bookingData.pickupPostCode);
		updateData('pickupAddress', bookingData.destinationAddress);
		updateData('pickupPostCode', bookingData.destinationPostCode);
	}

	// Submit the form data to the Puser Component
	async function handleSubmit(e) {
		e.preventDefault();
		onBookingUpload(id);
	}

	// Abstract way to call the updateValue redux function setting the ID
	function updateData(property, val) {
		dispatch(updateValue(id, property, val));
	}

	// This Function sets the pickup address and postcode by location data used in autocomplete
	function handleAddPickup(location) {
		updateData('pickupAddress', location.address);
		updateData('pickupPostCode', location.postcode);
	}

	// This Function sets the destination address and postcode by location data used in autocomplete
	function handleAddDestination(location) {
		updateData('destinationAddress', location.address);
		updateData('destinationPostCode', location.postcode);
	}

	// This Function adds the driver to the booking form
	function addDriverToBooking(driverId) {
		setDriverModalActive(false);
		updateData('userId', driverId);
	}

	// This Function gets the quote and set the value to the booking form
	async function findQuote() {
		const quote = await makeBookingQuoteRequest({
			pickupPostcode: bookingData.pickupPostCode,
			viaPostcodes: bookingData.vias.map((via) => via.postcode),
			destinationPostcode: bookingData.destinationPostCode,
			pickupDateTime: bookingData.pickupDateTime,
			passengers: bookingData.passengers,
			priceFromBase: bookingData.chargeFromBase,
		});
		if (quote.status === 'success') {
			updateData('price', +quote.totalPrice);
			updateData('durationText', String(quote.totalMinutes));
			setIsQuoteDialogActive(true);
			setQuote(quote);
		} else {
			setQuote(null);
			setSnackbarMessage('Failed to get quote');
			setIsQuoteSnackbarActive(true);
		}
	}

	// This Function cancels the booking form
	function deleteForm() {
		dispatch(removeBooking(id));
	}

	async function handleFireCallerEvent() {
		const data = await fireCallerEvent(bookingData.phoneNumber);
		if (data.status === 'success') {
			if (data.current.length && data.previous.length) {
				dispatch(addCallerToLookup(convertKeysToFirstUpper(data)));
			} else {
				setSnackbarMessage('No caller found');
				// setSnackbarColor('#035418');
				setIsQuoteSnackbarActive(true);
			}
		}
	}

	// This Function formats the date to the required format
	function formatDate(dateStr) {
		const date = new Date(dateStr);
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
			2,
			'0'
		)}-${String(date.getDate()).padStart(2, '0')}T${String(
			date.getHours()
		).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
	}

	// auto calculate the quotes based on Pickup and destination
	useEffect(() => {
		if (
			!bookingData.pickupPostCode ||
			(!bookingData.destinationPostCode && bookingData.vias.length === 0) ||
			bookingData.scope !== 0
		) {
			return;
		}
		makeBookingQuoteRequest({
			pickupPostcode: bookingData.pickupPostCode,
			viaPostcodes: bookingData.vias.map((via) => via.postcode),
			destinationPostcode: bookingData.destinationPostCode,
			pickupDateTime: bookingData.pickupDateTime,
			passengers: bookingData.passengers,
			priceFromBase: bookingData.chargeFromBase,
		}).then((quote) => {
			if (quote.status === 'success') {
				dispatch(updateValueSilentMode(id, 'price', +quote.totalPrice));
				dispatch(
					updateValueSilentMode(id, 'durationText', String(quote.totalMinutes))
				);
				dispatch(
					updateValueSilentMode(
						id,
						'hours',
						Math.floor(quote.totalMinutes / 60)
					)
				);
				dispatch(updateValueSilentMode(id, 'minutes', quote.totalMinutes % 60));
			} else {
				// setQuote(null);
				updateData('price', '');
				setSnackbarMessage('Failed to get quote');
			}
		});
	}, [
		bookingData.pickupPostCode,
		bookingData.destinationPostCode,
		bookingData.postcode,
		bookingData.chargeFromBase,
		bookingData.vias,
		bookingData.pickupDateTime,
		bookingData.passengers,
		bookingData.scope,
		dispatch,
		id,
	]);

	// This Function sets the END key functionality
	useEffect(() => {
		const handleKeyPress = (event) => {
			if (event.key === 'End') {
				document.getElementById('myForm').requestSubmit();
			}
			if (event.key === 'Enter') event.preventDefault();
		};

		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, []);

	// This Function sets the user name to the booking form
	useEffect(() => {
		if (!isAuth) return;
		if (currentUser && !currentUser.fullName) return;
		if (bookingData.bookingType === 'current') {
			dispatch(
				updateValueSilentMode(id, 'updatedByName', currentUser.fullName)
			);
		} else {
			dispatch(updateValueSilentMode(id, 'bookedByName', currentUser.fullName));
		}
	}, [isAuth, currentUser, bookingData.bookingType, dispatch, id]);

	// Set the snackbar for caller event
	useEffect(() => {
		if (callerId.length > 0 && bookingData.formBusy) {
			setIsQuoteSnackbarActive(true);
			setSnackbarMessage(`${callerId.length} Caller Waiting`);
			setSnackbarColor('#035418');
		}
	}, [callerId.length, bookingData.formBusy]);

	// Focus on the input field based on the booking type
	useEffect(() => {
		if (bookingData.formBusy) return;
		if (bookingData.bookingType === 'previous') {
			destinationRef.current.focus();
			destinationRef.current.select();
		} else {
			pickupRef.current.focus();
			pickupRef.current.select();
		}
	}, [
		bookingData.pickupAddress,
		bookingData.bookingType,
		bookingData.formBusy,
	]);

	// update the time of the form if form is not busy every 30 sec
	useEffect(() => {
		function updateToCurrentTime() {
			if (bookingData.formBusy) {
				clearInterval(updateTimeInterval);
				return;
			}
			dispatch(
				updateValueSilentMode(id, 'pickupDateTime', formatDate(new Date()))
			);
		}
		const updateTimeInterval = setInterval(updateToCurrentTime, 30 * 1000);
		return () => clearInterval(updateTimeInterval);
	}, [dispatch, id, bookingData.formBusy]);

	if (!bookingData) return null;

	return (
		<div className='min-h-screen bg-background text-foreground p-4'>
			<form
				autoComplete='off'
				id='myForm'
				action=''
				onSubmit={handleSubmit}
			>
				<>
					<Modal
						open={isRepeatBookingModelActive}
						setOpen={setIsRepeatBookingModelActive}
					>
						<RepeatBooking onSet={setIsRepeatBookingModelActive} />
					</Modal>
					<Modal
						open={isDriverModalActive}
						setOpen={setDriverModalActive}
					>
						<ListDrivers
							onSet={addDriverToBooking}
							setOpen={setDriverModalActive}
						/>
					</Modal>
					<Modal
						open={isAddVIAOpen}
						setOpen={setIsAddVIAOpen}
					>
						<AddAndEditVia onSet={setIsAddVIAOpen} />
					</Modal>
					<Modal
						open={isQuoteDialogActive}
						setOpen={setIsQuoteDialogActive}
					>
						<QuoteDialog
							onSet={setIsQuoteDialogActive}
							id={id}
							quote={quote}
						/>
					</Modal>
					<SimpleSnackbar
						disableReset={true}
						open={isQuoteSnackbarActive}
						setOpen={setIsQuoteSnackbarActive}
						message={snackbarMessage}
						color={snackBarColor}
					/>
				</>
				<div className='max-w-3xl mx-auto bg-card p-6 rounded-lg shadow-lg'>
					<div className='flex items-center justify-between mb-4'>
						<div className='flex gap-5 flex-col md:flex-row'>
							<input
								required
								type='datetime-local'
								className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
								value={formatDate(bookingData.pickupDateTime)}
								onChange={(e) => {
									updateData('pickupDateTime', e.target.value);
									return e.target.value;
								}}
							/>

							{bookingData.returnBooking ? (
								<input
									disabled={bookingData.returnBooking ? false : true}
									required
									type='datetime-local'
									value={bookingData.returnDateTime}
									onChange={(e) => updateData('returnDateTime', e.target.value)}
									className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
								/>
							) : null}
						</div>
						<div className='flex gap-5 flex-col md:flex-row justify-between items-center align-middle'>
							<div className='bg-red-700 hover:bg-opacity-80 rounded-lg flex  text-white'>
								<button
									type='button'
									className='px-3 py-2'
									onClick={() => setIsRepeatBookingModelActive(true)}
								>
									Repeat Booking
								</button>
							</div>
							<div>
								<span className='mr-2'>Return</span>
								<Switch
									color='error'
									checked={bookingData.returnBooking}
									onClick={() => {
										!bookingData.returnBooking
											? updateData(
													'returnDateTime',
													formatDate(Date.now() + 1 * 60 * 60 * 1000)
													// eslint-disable-next-line no-mixed-spaces-and-tabs
											  )
											: null;
										updateData('returnBooking', !bookingData.returnBooking);
									}}
								/>
							</div>
							<></>
						</div>
					</div>
					{/* Google AutoSuggestion 1 */}

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
						<GoogleAutoComplete
							placeholder='Pickup Address'
							value={bookingData.pickupAddress}
							onPushChange={handleAddPickup}
							onChange={(e) => updateData('pickupAddress', e.target.value)}
							inputRef={pickupRef}
						/>
						<Autocomplete
							type='postal'
							required={false}
							placeholder='Post Code'
							value={bookingData.pickupPostCode}
							onPushChange={handleAddPickup}
							onChange={(e) => updateData('pickupPostCode', e.target.value)}
						/>
					</div>
					{/* Toogle Button Start*/}
					<div className='flex justify-center mb-4'>
						<button
							type='button'
							onClick={toggleAddress}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
								fill='currentColor'
								aria-hidden='true'
								className='h-7 w-7 text-red-600 mx-auto'
							>
								<path
									fillRule='evenodd'
									d='M6.97 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06L8.25 4.81V16.5a.75.75 0 01-1.5 0V4.81L3.53 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zm9.53 4.28a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V7.5a.75.75 0 01.75-.75z'
									clipRule='evenodd'
								></path>
							</svg>
						</button>
					</div>
					{/* Toogle Button Ends */}

					{/* Google AutoSuggestion 2 */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
						<GoogleAutoComplete
							placeholder='Destination Address'
							value={bookingData.destinationAddress}
							onPushChange={handleAddDestination}
							inputRef={destinationRef}
							onChange={(e) => updateData('destinationAddress', e.target.value)}
						/>
						<Autocomplete
							required={false}
							type='postal'
							placeholder='Post Code'
							value={bookingData.destinationPostCode}
							onPushChange={handleAddDestination}
							onChange={(e) =>
								updateData('destinationPostCode', e.target.value)
							}
						/>
					</div>

					<div className='mb-4'>
						<textarea
							placeholder='Booking Details'
							className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
							value={bookingData.details}
							onChange={(e) => updateData('details', e.target.value)}
						></textarea>
					</div>

					<div className='mb-4'>
						<LongButton onClick={() => setIsAddVIAOpen(true)}>
							Add VIA
						</LongButton>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 '>
						<div className='flex items-center'>
							<label className='mr-2'>Passengers</label>
							<select
								value={bookingData.passengers}
								onChange={(e) => updateData('passengers', e.target.value)}
								className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
							>
								<option value={1}>1</option>
								<option value={2}>2</option>
								<option value={3}>3</option>
								<option value={4}>4</option>
								<option value={5}>5</option>
								<option value={6}>6</option>
								<option value={7}>7</option>
								<option value={8}>8</option>
								<option value={9}>9</option>
							</select>
						</div>
						<label className='flex items-center'>
							<span className='mr-2'>Charge From Base</span>
							<Switch
								color='error'
								checked={bookingData.chargeFromBase}
								onChange={() =>
									updateData('chargeFromBase', !bookingData.chargeFromBase)
								}
							/>
						</label>
						<div className='mb-4'>
							{bookingData.scope !== 1 && (
								<>
									{bookingData.price ? (
										<LongButton onClick={() => updateData('price', '')}>
											Reset Price
										</LongButton>
									) : (
										<LongButton onClick={findQuote}>Get Quote</LongButton>
									)}
								</>
							)}
						</div>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
						<div className='flex items-center gap-2'>
							<span>£</span>
							<Input
								type='number'
								required={true}
								placeholder='Driver Price (£)'
								value={bookingData.price}
								onChange={(e) =>
									updateData(
										'price',
										(() => {
											const value = parseFloat(e.target.value);
											if (e.target.value === '') return '';
											if (
												(!isNaN(value) && value >= 0) ||
												e.target.value === ''
											) {
												return value;
											} else return bookingData.price;
										})()
									)
								}
							/>
						</div>

						{/* Hours Duration Section Details */}
						<div className='flex items-center'>
							<Input
								type='number'
								placeholder='Hours'
								required
								className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
								value={Math.floor(bookingData.durationText / 60)}
								onChange={(e) =>
									updateData(
										'hours',
										(() => {
											const value = parseInt(e.target.value, 10);
											if (!isNaN(value) && value >= 0 && value <= 99) {
												updateData(
													'durationText',
													String(value * 60 + bookingData.minutes)
												);
												return value;
											} else if (e.target.value === '') {
												return '';
											} else return bookingData.hours;
										})()
									)
								}
							/>
							<Input
								type='number'
								required
								placeholder='Minutes'
								value={Math.floor(bookingData.durationText % 60)}
								onChange={(e) =>
									updateData(
										'minutes',
										(() => {
											const value = parseInt(e.target.value, 10);
											if (!isNaN(value) && value >= 0 && value <= 59) {
												updateData(
													'durationText',
													String(bookingData.hours * 60 + value)
												);
												return value;
											} else if (e.target.value === '') {
												return '';
											} else {
												// If value is greater than 59, keep it unchanged
												return Math.min(59, Math.max(0, value)); // Clamp value between 0 and 59
											}
										})()
									)
								}
							/>
						</div>

						<label className='flex items-center'>
							<span className='mr-2'>All Day</span>
							<input
								type='checkbox'
								checked={bookingData.isAllDay}
								onChange={(e) => updateData('isAllDay', e.target.checked)}
								className='form-checkbox h-5 w-5 text-primary'
							/>
						</label>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
						<Input
							required
							type='text'
							placeholder='Name'
							value={bookingData.passengerName}
							onChange={(e) => updateData('passengerName', e.target.value)}
							className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
						/>
						<div className='flex justify-between flex-row items-center gap-1'>
							<Input
								type='text'
								placeholder='Phone'
								value={bookingData.phoneNumber}
								onChange={(e) => {
									const value = e.target.value;
									// Remove non-numeric characters and limit to 12 digits
									const cleanedValue = value.replace(/\D/g, '').slice(0, 12);
									updateData('phoneNumber', cleanedValue);
								}}
								className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
							/>
							<div
								className='px-3 bg-red-700 hover:bg-opacity-80 rounded-lg flex cursor-pointer'
								onClick={() => handleFireCallerEvent()}
							>
								<span
									style={{ padding: '1rem 0' }}
									color='error'
									className='text-white flex gap-2 px-3'
									type='button'
								>
									<LocalPhoneIcon />
									<span>Lookup</span>
								</span>
							</div>
						</div>
					</div>

					<div className='mb-4'>
						<Input
							type='email'
							placeholder='Email'
							value={bookingData.email}
							onChange={(e) => updateData('email', e.target.value)}
							className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
						/>
						{bookingData.scope === 1 ? (
							<Input
								type='number'
								placeholder='Price Account'
								value={bookingData.priceAccount}
								onChange={(e) => {
									const newValue = parseFloat(e.target.value);
									if (e.target.value === '')
										return updateData('priceAccount', '');
									if (!isNaN(newValue) && newValue >= 0) {
										return updateData('priceAccount', +e.target.value);
									}
								}}
								className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
							/>
						) : null}
					</div>

					{currentUser?.isAdmin ? (
						<>
							<p>options</p>
							<div className='options mb-4 flex justify-between gap-3 align-middle items-center'>
								<p className='text-gray-700 text-sm'>status:</p>
								<select
									name='status'
									onChange={(e) => updateData('paymentStatus', +e.target.value)}
									id='options'
									value={bookingData.paymentStatus}
									className='block w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
								>
									<option value={0}>None</option>
									<option value={2}>Paid</option>
									<option value={3}>Awaiting payment</option>
								</select>
								<p className='text-gray-700 text-sm'>scope:</p>
								<select
									name='scope'
									id='options'
									value={bookingData.scope}
									onChange={(e) => updateData('scope', +e.target.value)}
									className='block w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
								>
									<option value={0}>Cash</option>
									<option value={1}>Account</option>
									<option value={2}>Rank</option>
									<option value={3}>All</option>
								</select>
							</div>
							{bookingData.scope === 1 ? (
								<div>
									<p className='text-gray-700 text-sm capitalize'>
										Account number
									</p>
									<select
										name='account'
										id='account'
										value={bookingData.accountNumber}
										onChange={(e) =>
											updateData('accountNumber', +e.target.value)
										}
										className='mb-10 block w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									>
										{JSON.parse(localStorage.getItem('accounts')).map(
											(el, i) => (
												<Fragment key={i}>
													{el.accountName && (
														<option value={el.accNo}>
															{el.accNo === 0
																? 'select'
																: `${el.accNo}-${el.accountName}`}
														</option>
													)}
												</Fragment>
											)
										)}
									</select>
								</div>
							) : null}
						</>
					) : null}

					<div className='flex justify-between gap-5 mb-5'>
						<LongButton onClick={() => setDriverModalActive(true)}>
							Allocate Driver
						</LongButton>
					</div>

					<div className='flex justify-end space-x-4'>
						<button
							onClick={deleteForm}
							className='bg-muted text-muted-foreground px-4 py-2 rounded-lg bg-gray-100'
							type='button'
						>
							Cancel
						</button>
						<button
							className='bg-primary text-primary-foreground px-4 py-2 rounded-lg text-white bg-gray-900'
							type='submit'
						>
							Create
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}

// Via Section Modal

function Input({ value, onChange, type, placeholder, required }) {
	return (
		<TextField
			autoComplete='new-password'
			required={required}
			type={type}
			value={value}
			onChange={onChange}
			id={String(Math.random() * 10000)}
			label={placeholder}
		/>
	);
}

export default Booking;
