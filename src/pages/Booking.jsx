/** @format */
import { Button, Switch, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { RRule } from 'rrule';
import { useBooking } from '../hooks/useBooking';
import Autocomplete from '../components/AutoComplete';
import { useEffect, useState, Fragment, useRef } from 'react';
import Modal from '../components/Modal';
import Dragger from '../components/Dragger';
import { makeBookingQuoteRequest, getAllDrivers } from '../utils/apiReq';
import SimpleSnackbar from '../components/SnackBar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Loader from './../components/Loader';
import { useAuth } from './../hooks/useAuth';
import GoogleAutoComplete from '../components/GoogleAutoComplete';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

function Booking({ bookingData, id }) {
	const {
		updateValue,
		onBooking,
		deleteBooking,
		onUpdateBooking,
		callerId,
		updateValueSilentMode,
	} = useBooking();
	const [isPhoneModelActive, setIsPhoneModelActive] = useState(false);
	const [isRepeatBookingModelActive, setIsRepeatBookingModelActive] =
		useState(false);
	const [isAddVIAOpen, setIsAddVIAOpen] = useState(false);
	const [isQuoteSnackbarActive, setIsQuoteSnackbarActive] = useState(false);
	const [isDriverModalActive, setDriverModalActive] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [isQuoteDialogActive, setIsQuoteDialogActive] = useState(false);
	const [quote, setQuote] = useState(null);
	const { currentUser, isAuth } = useAuth();
	const [snackBarColor, setSnackbarColor] = useState('#2F3030');
	const pickupRef = useRef(null);
	const destinationRef = useRef(null);

	function toggleAddress() {
		updateData('DestinationAddress', bookingData.PickupAddress);
		updateData('DestinationPostCode', bookingData.PickupPostCode);
		updateData('PickupAddress', bookingData.DestinationAddress);
		updateData('PickupPostCode', bookingData.DestinationPostCode);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		let res;
		if (bookingData.bookingType === 'current') {
			updateData('updatedByName', currentUser.fullName);
			res = onUpdateBooking(id);
		} else {
			res = onBooking(id);
		}
		res.then(({ status }) => {
			if (status !== 'success') {
				setSnackbarMessage('Failed to create booking');
				setIsQuoteSnackbarActive(true);
			} else {
				setSnackbarMessage('booking created successfully');
				setIsQuoteSnackbarActive(true);
			}
		});
	}

	function updateData(property, val) {
		updateValue(id, property, val);
	}

	function handleAddPickup(location) {
		updateData('PickupAddress', location.address);
		updateData('PickupPostCode', location.postcode);
	}

	function handleAddDestination(location) {
		updateData('DestinationAddress', location.address);
		updateData('DestinationPostCode', location.postcode);
	}

	function addDriverToBooking(driverId) {
		setDriverModalActive(false);
		updateData('userId', driverId);
	}

	async function findQuote() {
		const quote = await makeBookingQuoteRequest({
			pickupPostcode: bookingData.PickupPostCode,
			viaPostcodes: bookingData.vias.map((via) => via.postcode),
			destinationPostcode: bookingData.DestinationPostCode,
			pickupDateTime: bookingData.PickupDateTime,
			passengers: bookingData.Passengers,
			priceFromBase: bookingData.chargeFromBase,
		});
		if (quote.status === 'success') {
			updateData('Price', +quote.totalPrice);
			setIsQuoteDialogActive(true);
			setQuote(quote);
		} else {
			setQuote(null);
			setSnackbarMessage('Failed to get quote');
			setIsQuoteSnackbarActive(true);
		}
	}

	function resetPrice() {
		updateData('Price', '');
		setQuote(null);
	}

	function deleteForm() {
		deleteBooking(id);
	}

	useEffect(() => {
		const handleKeyPress = (event) => {
			if (event.key === 'End') {
				document.getElementById('myForm').requestSubmit();
			}
		};

		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, []);

	useEffect(() => {
		if (!isAuth) return;
		if (currentUser && !currentUser.fullName) return;
		if (bookingData.bookingType === 'current') {
			updateData('updatedByName', currentUser.fullName);
		} else {
			updateData('bookedByName', currentUser.fullName);
		}
	}, [isAuth, currentUser]);

	// auto calculate the get quotes
	useEffect(() => {
		if (!bookingData.PickupPostCode) return;
		if (!bookingData.DestinationPostCode && bookingData.vias.length === 0)
			return;
		if (bookingData.scope !== 0) return;
		makeBookingQuoteRequest({
			pickupPostcode: bookingData.PickupPostCode,
			viaPostcodes: bookingData.vias.map((via) => via.postcode),
			destinationPostcode: bookingData.DestinationPostCode,
			pickupDateTime: bookingData.PickupDateTime,
			passengers: bookingData.Passengers,
			priceFromBase: bookingData.chargeFromBase,
		}).then((quote) => {
			if (quote.status === 'success') {
				updateValueSilentMode(id, 'Price', +quote.totalPrice);
				updateValueSilentMode(id, 'durationText', quote.journeyMinutes);
				updateValueSilentMode(
					id,
					'hours',
					Math.floor(quote.journeyMinutes / 60)
				);
				updateValueSilentMode(id, 'minutes', quote.journeyMinutes % 60);
				setQuote(quote);
			} else {
				setQuote(null);
				setSnackbarMessage('Failed to get quote');
			}
		});
	}, [
		bookingData.PickupPostCode,
		bookingData.DestinationPostCode,
		bookingData.postcode,
		bookingData.chargeFromBase,
		bookingData.vias,
		bookingData.PickupDateTime,
		bookingData.Passengers,
	]);

	useEffect(() => {
		if (callerId.length > 0 && bookingData.formBusy) {
			setIsQuoteSnackbarActive(true);
			setSnackbarMessage(`${callerId.length} Caller Waiting`);
			setSnackbarColor('#035418');
		}
	}, [callerId.length, bookingData.formBusy]);

	useEffect(() => {
		if (bookingData.formBusy) return;
		if (bookingData.bookingType === 'previous') {
			destinationRef.current.focus();
			destinationRef.current.select();
		} else {
			// pickupRef.current.focus();
			// pickupRef.current.select();
		}
	}, [
		bookingData.PickupAddress,
		bookingData.bookingType,
		bookingData.formBusy,
	]);

	function convertDateToInputFormat(dateStr) {
		// Parse the input date string
		let dateObj = new Date(dateStr);

		// Get the individual components
		let year = dateObj.getFullYear();
		let month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
		let day = String(dateObj.getDate()).padStart(2, '0');
		let hours = String(dateObj.getHours()).padStart(2, '0');
		let minutes = String(dateObj.getMinutes()).padStart(2, '0');

		// Format the date for datetime-local input
		let formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

		return formattedDate;
	}
	function formatDate(dateStr) {
		const date = new Date(dateStr);
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
			2,
			'0'
		)}-${String(date.getDate()).padStart(2, '0')}T${String(
			date.getHours()
		).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
	}

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
						open={isPhoneModelActive}
						setOpen={setIsPhoneModelActive}
					>
						<PhoneCheckModal setOpen={setIsPhoneModelActive} />
					</Modal>
					<Modal
						open={isRepeatBookingModelActive}
						setOpen={setIsRepeatBookingModelActive}
					>
						<RepeatBooking
							onSet={setIsRepeatBookingModelActive}
							id={id}
						/>
					</Modal>
					<Modal
						open={isDriverModalActive}
						setOpen={setDriverModalActive}
					>
						<ListDrivers
							onSet={addDriverToBooking}
							id={id}
						/>
					</Modal>
					<Modal
						open={isAddVIAOpen}
						setOpen={setIsAddVIAOpen}
					>
						<AddEditViaComponent
							onSet={setIsAddVIAOpen}
							id={id}
						/>
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
					{/* <div className='mb-4'>
						<LongButton onClick={() => setIsPhoneModelActive(true)}>
							Phone Number Lookup
						</LongButton>
					</div> */}

					<div className='flex items-center justify-between mb-4'>
						<div className='flex gap-5 flex-col md:flex-row'>
							<input
								required
								type='datetime-local'
								className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
								value={convertDateToInputFormat(bookingData.PickupDateTime)}
								onChange={(e) => {
									updateData('PickupDateTime', e.target.value);
									return e.target.value;
								}}
							/>

							{bookingData.returnBooking ? (
								<input
									disabled={bookingData.returnBooking ? false : true}
									required
									type='datetime-local'
									value={bookingData.returnTime}
									onChange={(e) => updateData('returnTime', e.target.value)}
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
													'returnTime',
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
						{/* <Autocomplete
							type='address'
							required={true}
							placeholder='Pickup Address'
							value={bookingData.PickupAddress}
							onPushChange={handleAddPickup}
							inputRef={pickupRef}
							onChange={(e) => updateData('PickupAddress', e.target.value)}
						/> */}
						<GoogleAutoComplete
							placeholder='Pickup Address'
							value={bookingData.PickupAddress}
							onPushChange={handleAddPickup}
							onChange={(e) => updateData('PickupAddress', e.target.value)}
							inputRef={pickupRef}
						/>
						<Autocomplete
							type='postal'
							required={false}
							placeholder='Post Code'
							value={bookingData.PickupPostCode}
							onPushChange={handleAddPickup}
							onChange={(e) => updateData('PickupPostCode', e.target.value)}
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
							value={bookingData.DestinationAddress}
							onPushChange={handleAddDestination}
							inputRef={destinationRef}
							onChange={(e) => updateData('DestinationAddress', e.target.value)}
						/>
						{/* <Autocomplete
							required={true}
							type='address'
							placeholder='Destination Address'
							value={bookingData.DestinationAddress}
							onPushChange={handleAddDestination}
							onChange={(e) => updateData('DestinationAddress', e.target.value)}
						/> */}
						<Autocomplete
							required={false}
							type='postal'
							placeholder='Post Code'
							value={bookingData.DestinationPostCode}
							onPushChange={handleAddDestination}
							onChange={(e) =>
								updateData('DestinationPostCode', e.target.value)
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
								value={bookingData.Passengers}
								onChange={(e) => updateData('Passengers', e.target.value)}
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
									{quote ? (
										<LongButton onClick={resetPrice}>Reset Price</LongButton>
									) : (
										<LongButton onClick={findQuote}>Get Quote</LongButton>
									)}
								</>
							)}
						</div>
					</div>

					{/* <div className='mb-4'>
						{bookingData.scope !== 1 && (
							<>
								{quote ? (
									<LongButton onClick={resetPrice}>Reset Price</LongButton>
								) : (
									<LongButton onClick={findQuote}>Get Quote</LongButton>
								)}
							</>
						)}
					</div> */}

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
						<div className='flex items-center gap-2'>
							<span>£</span>
							<Input
								type='number'
								required={true}
								placeholder='Driver Price (£)'
								value={bookingData.Price}
								onChange={(e) =>
									updateData(
										'Price',
										(() => {
											const value = parseFloat(e.target.value);
											if (e.target.value === '') return '';
											if (
												(!isNaN(value) && value >= 0) ||
												e.target.value === ''
											) {
												return value;
											} else return bookingData.Price;
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
													value * 60 + bookingData.minutes
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
													bookingData.hours * 60 + value
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
							value={bookingData.PassengerName}
							onChange={(e) => updateData('PassengerName', e.target.value)}
							className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
						/>
						<div className='flex justify-between flex-row items-center gap-1'>
							<Input
								type='text'
								placeholder='Phone'
								value={bookingData.PhoneNumber}
								onChange={(e) => {
									const value = e.target.value;
									// Remove non-numeric characters and limit to 12 digits
									const cleanedValue = value.replace(/\D/g, '').slice(0, 12);
									updateData('PhoneNumber', cleanedValue);
								}}
								className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
							/>
							<div
								className='px-3 bg-red-700 hover:bg-opacity-80 rounded-lg flex cursor-pointer'
								onClick={() => setIsPhoneModelActive(true)}
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
							value={bookingData.Email}
							onChange={(e) => updateData('Email', e.target.value)}
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
								{/* <Input
							type='text'
							placeholder='Payment Status'
							value={bookingData.options}
							onChange={(e) => updateData('options', e.target.value)}
							className='w-full bg-input text-foreground p-2 rounded-lg border border-border'
						/> */}
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

function PhoneCheckModal({ setOpen }) {
	const [phone, setPhone] = useState('');
	function handleSetPhone(e) {
		const digit = e.target.value;

		// Allow empty string to handle deletions
		if (digit === '' || /^\d+$/.test(digit)) {
			if (digit.length <= 11) {
				setPhone(digit);
			}
		}
	}

	return (
		<div className='relative bg-card p-10 rounded-lg shadow-lg w-full max-w-md transform transition-transform bg-white'>
			<button
				className='absolute top-5 right-5'
				onClick={() => setOpen(false)}
			>
				❌
			</button>

			<div className='flex justify-center mb-10 rounded-full '>
				<span className='rounded-full bg-gray-300 p-3'>📞</span>
			</div>
			<div className='flex gap-5 mb-5'>
				<TextField
					id='standard-error-helper-text'
					label='Phone Number'
					variant='standard'
					value={phone}
					onChange={handleSetPhone}
					autoComplete='off'
				/>
				<div className='flex gap-2'>
					<Button
						variant='contained'
						color='info'
					>
						Search
					</Button>
					<Button
						color='error'
						onClick={() => setPhone('')}
					>
						Clear
					</Button>
				</div>
			</div>
			<div className='p-3 bg-gray-200 cursor-pointer rounded-lg hidden'>
				<h1>username</h1>
				<div className='flex text-sm text-gray-500 '>
					<span>Start Address</span>-<span>End Address</span>
				</div>
			</div>
		</div>
	);
}

function LongButton({ children, color = 'bg-red-700', ...props }) {
	return (
		<button
			className={`w-full bg-destructive text-destructive-foreground py-2 rounded-lg ${color} text-white hover:bg-opacity-80`}
			type='button'
			{...props}
		>
			{children}
		</button>
	);
}

function parseRecurrenceRule(rule) {
	const daysOfWeek = {
		sun: false,
		mon: false,
		tue: false,
		wed: false,
		thu: false,
		fri: false,
		sat: false,
	};

	const ruleParts = rule.split(';');
	const bydayPart = ruleParts.find((part) => part.startsWith('BYDAY='));

	if (bydayPart) {
		const days = bydayPart.replace('BYDAY=', '').split(',');
		days.forEach((day) => {
			switch (day) {
				case 'SU':
					daysOfWeek.sun = true;
					break;
				case 'MO':
					daysOfWeek.mon = true;
					break;
				case 'TU':
					daysOfWeek.tue = true;
					break;
				case 'WE':
					daysOfWeek.wed = true;
					break;
				case 'TH':
					daysOfWeek.thu = true;
					break;
				case 'FR':
					daysOfWeek.fri = true;
					break;
				case 'SA':
					daysOfWeek.sat = true;
					break;
				default:
					break;
			}
		});
	}

	return daysOfWeek;
}

function RepeatBooking({ onSet, id }) {
	const { data, updateValue } = useBooking();
	const [frequency, setFrequency] = useState(data[id].frequency);
	const [repeatEnd, setRepeatEnd] = useState(data[id].repeatEnd);
	const [repeatEndValue, setRepeatEndValue] = useState(data[id].repeatEndValue);
	const [selectedDays, setSelectedDays] = useState(
		parseRecurrenceRule(data[id].recurrenceRule)
	);

	const handleClick = (day) => {
		setSelectedDays((prevDays) => ({
			...prevDays,
			[day]: !prevDays[day],
		}));
	};

	const dayLabels = [
		{ key: 'sun', label: 'S' },
		{ key: 'mon', label: 'M' },
		{ key: 'tue', label: 'T' },
		{ key: 'wed', label: 'W' },
		{ key: 'thu', label: 'T' },
		{ key: 'fri', label: 'F' },
		{ key: 'sat', label: 'S' },
	];

	function submitForm(e) {
		e.preventDefault();
		const rrule = calculateRecurrenceRule(
			frequency,
			repeatEndValue,
			selectedDays
		);
		updateValue(id, 'frequency', frequency);
		updateValue(id, 'repeatEnd', repeatEnd);
		updateValue(id, 'repeatEndValue', repeatEndValue);
		updateValue(id, 'recurrenceRule', rrule);
		onSet(false);
	}

	const calculateRecurrenceRule = (frequency, repeatEndValue, selectedDays) => {
		const daysOfWeek = {
			sun: RRule.SU,
			mon: RRule.MO,
			tue: RRule.TU,
			wed: RRule.WE,
			thu: RRule.TH,
			fri: RRule.FR,
			sat: RRule.SA,
		};

		const selectedWeekDays = Object.keys(selectedDays)
			.filter((day) => selectedDays[day])
			.map((day) => daysOfWeek[day]);

		const ruleOptions = {
			freq:
				frequency === 'daily'
					? RRule.DAILY
					: frequency === 'weekly'
					? RRule.WEEKLY
					: frequency === 'monthly'
					? RRule.MONTHLY
					: null,
			byweekday: selectedWeekDays,
		};

		if (repeatEndValue) {
			ruleOptions.until = new Date(repeatEndValue);
		}

		if (!ruleOptions.freq) {
			return '';
		}

		const rule = new RRule(ruleOptions);
		return rule.toString();
	};

	useEffect(() => {
		if (repeatEnd === 'never') setRepeatEndValue('');
		if (frequency === 'none') {
			setRepeatEnd('never');
			setSelectedDays({
				sun: false,
				mon: false,
				tue: false,
				wed: false,
				thu: false,
				fri: false,
				sat: false,
			});
		}
	}, [repeatEnd, frequency]);

	return (
		<form className='p-4 bg-card shadow rounded-lg max-w-lg w-[30vw] mx-auto mt-6 bg-white'>
			<div className='flex justify-between items-center mb-4'>
				<p className='text-xl font-bold'>Repeat Booking</p>
				<div className='flex items-center'></div>
			</div>
			<div className='space-y-4'>
				<div>
					<label
						htmlFor='frequency'
						className='block text-sm font-medium text-foreground mb-1'
					>
						Frequency
					</label>
					<select
						id='frequency'
						className='border border-border rounded-md p-2 w-full bg-input text-foreground focus:ring-primary focus:border-primary'
						value={frequency}
						onChange={(e) => setFrequency(e.target.value)}
					>
						<option value='none'>None</option>
						<option value='daily'>Daily</option>
						<option value='weekly'>Weekly</option>
					</select>
				</div>
				{frequency === 'daily' ? null : (
					<>
						{frequency !== 'none' ? (
							<div>
								<label className='block text-sm font-medium text-foreground mb-1'>
									Days
								</label>
								<div className='flex space-x-2 justify-center'>
									{dayLabels.map(({ key, label }) => (
										<div
											key={key}
											className={`w-10 h-10 rounded-full text-white flex items-center justify-center cursor-pointer select-none ${
												selectedDays[key] ? 'bg-red-700' : 'bg-red-500'
											}`}
											onClick={() => handleClick(key)}
										>
											{label}
										</div>
									))}
								</div>
							</div>
						) : null}
					</>
				)}

				<div>
					<label
						htmlFor='repeat-end'
						className='block text-sm font-medium text-foreground mb-1'
					>
						Repeat End
					</label>
					{frequency !== 'none' ? (
						<select
							id='repeat-end'
							className='border border-border rounded-md p-2 w-full bg-input text-foreground focus:ring-primary focus:border-primary '
							value={repeatEnd}
							onChange={(e) => setRepeatEnd(e.target.value)}
						>
							<option value='never'>Never</option>
							<option value='until'>Until</option>
						</select>
					) : (
						<select
							disabled
							required
							id='repeat-end'
							className='border border-border rounded-md p-2 w-full bg-input text-foreground focus:ring-primary focus:border-primary'
							value={repeatEnd}
							onChange={(e) => setRepeatEnd(e.target.value)}
						>
							<option value='never'>Never</option>
							<option value='until'>Until</option>
						</select>
					)}
				</div>
				<div>
					<label
						htmlFor='end-date'
						className='block text-sm font-medium text-foreground mb-1'
					>
						Repeat End Date
					</label>
					<input
						disabled={repeatEnd === 'never'}
						required
						type='date'
						value={repeatEndValue}
						onChange={(e) => setRepeatEndValue(e.target.value)}
						id='end-date'
						className='border border-border rounded-md p-2 w-full bg-input text-foreground focus:ring-primary focus:border-primary'
					/>
				</div>
				<div className='grid grid-cols-2 gap-4'>
					<LongButton onClick={submitForm}>Confirm</LongButton>
					<LongButton
						color='bg-gray-700'
						onClick={() => onSet(false)}
					>
						Cancel
					</LongButton>
				</div>
			</div>
		</form>
	);
}

// Via Section Modal
const AddEditViaComponent = ({ onSet, id }) => {
	const { updateValue, data } = useBooking();
	const [vias, setVias] = useState(data[id].vias);
	const [newViaAddress, setNewViaAddress] = useState('');
	const [newViaPostcode, setNewViaPostcode] = useState('');

	const handleAddVia = () => {
		if (newViaAddress || newViaPostcode) {
			setVias((prevVias) => [
				...prevVias,
				{
					address: newViaAddress,
					postcode: newViaPostcode,
					viaSequence: prevVias.length,
				},
			]);
			setNewViaAddress('');
			setNewViaPostcode('');
		}
	};

	function handleSetVias(viasArray) {
		setVias(viasArray.map((via, index) => ({ ...via, viaSequence: index })));
	}

	function handleSave() {
		updateValue(id, 'vias', vias);
		onSet(false);
	}

	function handleSelectAutocomplete(address, postcode) {
		setNewViaAddress(address);
		setNewViaPostcode(postcode);
	}

	return (
		<div className='bg-white p-6 rounded-lg shadow-lg w-[25vw] max-w-md mx-auto'>
			<h2 className='text-2xl font-semibold mb-4 flex items-center'>
				<svg
					className='h-6 w-6 text-gray-600 mr-2'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M9 11h6m-3-3v6m-4 4h8a2 2 0 002-2V7a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
					></path>
				</svg>
				Manage Via Points
			</h2>

			<div className='space-y-2 mb-4 max-h-[30vh] overflow-auto'>
				<Dragger
					items={vias}
					setItems={handleSetVias}
					Child={VIABar}
				/>
			</div>

			<div className='space-y-4'>
				<Autocomplete
					type='address'
					placeholder='Add Via Address'
					required={true}
					value={newViaAddress}
					onChange={(e) => setNewViaAddress(e.target.value)}
					onPushChange={handleSelectAutocomplete}
				/>
				<Autocomplete
					type='postal'
					required={false}
					placeholder='Add Via PostCode'
					value={newViaPostcode}
					onChange={(e) => setNewViaPostcode(e.target.value)}
					onPushChange={handleSelectAutocomplete}
				/>
				<LongButton
					color='bg-gray-700'
					onClick={handleAddVia}
				>
					Add New Via
				</LongButton>
			</div>

			<div className='mt-4 flex flex-row gap-1'>
				<LongButton
					color='bg-red-700'
					onClick={() => onSet(false)}
				>
					Cancel
				</LongButton>
				<LongButton
					onClick={handleSave}
					color='bg-green-700'
				>
					Save
				</LongButton>
			</div>
		</div>
	);
};

function VIABar({ data, onEdit, isEditing, setEditingItem }) {
	const [newAddress, setNewAddress] = useState(data.address);
	const [newPostcode, setNewPostcode] = useState(data.postcode);

	useEffect(() => {
		setNewAddress(data.address);
		setNewPostcode(data.postcode);
	}, [data]);

	const handleEdit = () => {
		if (!newAddress && !newPostcode) return;
		onEdit({ ...data, address: newAddress, postcode: newPostcode });
	};

	return (
		<div className='flex gap-5 p-2 rounded'>
			{isEditing ? (
				<div className='flex flex-col gap-2'>
					<input
						className='border'
						value={newAddress}
						onChange={(e) => setNewAddress(e.target.value)}
					/>
					<input
						className='border'
						value={newPostcode}
						onChange={(e) => setNewPostcode(e.target.value)}
					/>
				</div>
			) : (
				<span>
					{data.address} {data.postcode}
				</span>
			)}
			<div className='space-x-2 m-auto'>
				{isEditing ? (
					<button
						className='text-blue-500 hover:text-blue-700'
						onClick={handleEdit}
					>
						<CheckCircleIcon fontSize='5px' />
					</button>
				) : (
					<button
						className='text-blue-500 hover:text-blue-700'
						onClick={() => setEditingItem(data)}
					>
						<EditIcon fontSize='5px' />
					</button>
				)}
			</div>
		</div>
	);
}

function Input({ value, onChange, type, placeholder, required }) {
	return (
		<TextField
			autoComplete='new-password'
			required={required}
			type={type}
			value={value}
			onChange={onChange}
			id={Math.random() * 10000}
			label={placeholder}
		/>
	);
}

// Allocate Driver Section Modal

function ListDrivers({ id }) {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const { updateValue } = useBooking();

	useEffect(() => {
		getAllDrivers().then((res) => {
			setData(res.users.filter((user) => user.roleString !== 'Admin'));
		});
		setLoading(true);
		setLoading(false);
	}, []);

	function handleAttactDriver(driver) {
		updateValue(id, 'userId', driver.id);
	}

	return (
		<div className='bg-gray-100 w-[25vw] px-2 py-10 rounded'>
			<div className='header flex w-full flex-col gap-5 text-center text-gray-700'>
				<div className=''>
					<p className='text-5xl'>
						<AccountCircleIcon fontSize='35px' />
					</p>
					<p className='m-5 font-bold uppercase'>allocate driver</p>
				</div>
				<div>
					<p className='text-2xl font-bold uppercase'>select driver</p>
				</div>
				<div className='m-auto w-full h-[50vh] overflow-auto relative'>
					{loading ? (
						<Loader />
					) : (
						data.map((el, idx) => (
							<div
								key={idx}
								className='bg-gray-200 mb-2 cursor-pointer'
								onClick={() => handleAttactDriver(el)}
							>
								<div className='flex m-auto justify-center items-center align-middle gap-5'>
									<div
										style={{ backgroundColor: el.colorRGB }}
										className={`h-5 w-5 rounded-full`}
									></div>
									<p className='text-2xl'>{el?.fullName}</p>
								</div>
								<p>{el.regNo}</p>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}

// Quote Modal Section

function QuoteDialog({ onSet, quote }) {
	return (
		<div className='flex items-center justify-center w-[20vw] bg-white rounded-lg'>
			<div className='bg-white p-6 rounded-lg max-w-xs w-full px-12'>
				<div className='flex justify-center mb-4'>
					<div className='bg-red-100 rounded-full p-2'>
						<AccountCircleIcon />
					</div>
				</div>
				<div className='text-center mb-4'>
					<h2 className='text-lg font-semibold'>Booking Quote</h2>
				</div>
				<div className='bg-green-700 text-white py-4 px-8 rounded-lg text-center mb-4'>
					<p className='text-2xl font-bold'>£{quote.totalPrice.toFixed(2)}</p>
					<p className='text-sm'>{quote.tariff}</p>
				</div>
				<div className='text-center mb-2'>
					<p className='text-gray-600'>Journey Time</p>
					<p className='text-lg font-semibold'>{quote.totalMileage} Miles</p>
				</div>
				<div className='text-center mb-6'>
					<p className='text-gray-600'>Distance</p>
					<p className='text-lg font-semibold'>
						{Math.floor(quote.totalMinutes / 60)} Hour(s){' '}
						{quote.totalMinutes % 60} Minutes
					</p>
				</div>
				<div className='text-center'>
					<button
						className='bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600'
						onClick={() => onSet(false)}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}

export default Booking;
