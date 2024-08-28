/** @format */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RRule } from 'rrule';

import { updateValue } from '../../context/bookingSlice';
import LongButton from './LongButton';

// This function destructure the recurrence rule and return the days of the week, it will help to mark the days of the week in the repeat booking modal
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
	let frequency = '';
	let interval = 1;
	let repeatEnd = false;
	let repeatEndValue = '';

	ruleParts.forEach((part) => {
		if (part.startsWith('FREQ=')) {
			frequency = part.replace('FREQ=', '').toLowerCase();
		} else if (part.startsWith('INTERVAL=')) {
			interval = parseInt(part.replace('INTERVAL=', ''), 10);
		} else if (part.startsWith('UNTIL=')) {
			repeatEnd = true;
			repeatEndValue = part.replace('UNTIL=', '');
		} else if (part.startsWith('BYDAY=')) {
			const days = part.replace('BYDAY=', '').split(',');
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
	});

	// Convert repeatEndValue to a Date object
	let repeatEndDate = null;
	if (repeatEndValue) {
		// Format the date string to "YYYY-MM-DD"
		const formattedDate = `${repeatEndValue.slice(0, 4)}-${repeatEndValue.slice(
			4,
			6
		)}-${repeatEndValue.slice(6, 8)}`;
		repeatEndDate = formattedDate;
	}

	return {
		f: frequency,
		i: interval,
		re: repeatEnd,
		rev: repeatEndDate,
		sd: daysOfWeek,
	};
}

function RepeatBooking({ onSet }) {
	// setting global state for booking form
	const dispatch = useDispatch();
	const data = useSelector((state) => state.bookingForm.bookings);
	const id = useSelector((state) => state.bookingForm.activeBookingIndex);
	const { f, i, re, rev, sd } = parseRecurrenceRule(data[id].recurrenceRule);

	// setting local state for repeat booking
	const [frequency, setFrequency] = useState(f);
	const [repeatEnd, setRepeatEnd] = useState(re ? 'until' : 'never');
	const [repeatEndValue, setRepeatEndValue] = useState(rev);
	const [selectedDays, setSelectedDays] = useState(sd);
	const dayLabels = [
		{ key: 'sun', label: 'S' },
		{ key: 'mon', label: 'M' },
		{ key: 'tue', label: 'T' },
		{ key: 'wed', label: 'W' },
		{ key: 'thu', label: 'T' },
		{ key: 'fri', label: 'F' },
		{ key: 'sat', label: 'S' },
	];

	// funciton to handle the selected days from week days
	const handleClick = (day) => {
		setSelectedDays((prevDays) => ({
			...prevDays,
			[day]: !prevDays[day],
		}));
	};

	// function update the global state/ global reducer
	function submitForm(e) {
		e.preventDefault();
		const rrule = calculateRecurrenceRule(
			frequency,
			repeatEndValue,
			selectedDays
		);
		dispatch(updateValue(id, 'frequency', frequency));
		dispatch(updateValue(id, 'repeatEnd', repeatEnd));
		dispatch(updateValue(id, 'repeatEndValue', repeatEndValue));
		if (frequency !== 'none') {
			dispatch(updateValue(id, 'recurrenceRule', rrule));
		}
		onSet(false);
	}

	// function to calculate the recurrence rule from the present condition of the form
	const calculateRecurrenceRule = (
		frequency,
		repeatEndValue,
		selectedDays,
		interval = 1
	) => {
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
			interval: interval,
		};

		if (repeatEndValue) {
			// Set the 'until' option as a Date object
			const untilDate = new Date(repeatEndValue);
			ruleOptions.until = untilDate;
		}

		if (!ruleOptions.freq) {
			return '';
		}

		const rule = new RRule(ruleOptions);
		let ruleString = rule.toString();

		// Remove the time portion (T000000Z) from the 'UNTIL' date
		ruleString = ruleString.replace(/T000000Z/, '');
		ruleString = ruleString.replace(/RRULE:/, '');
		ruleString += ';';

		return ruleString;
	};

	// This useEffect will update the state depending on condition of the form
	useEffect(() => {
		if (repeatEnd === 'never') setRepeatEndValue('');
		if (frequency === 'daily') {
			if (frequency === 'none') {
				setRepeatEnd('never');
			}
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
						{frequency === 'weekly' ? (
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
					<select
						disabled={frequency !== 'daily' && frequency !== 'weekly'}
						id='repeat-end'
						className='border border-border rounded-md p-2 w-full bg-input text-foreground focus:ring-primary focus:border-primary'
						value={repeatEnd}
						onChange={(e) => setRepeatEnd(e.target.value)}
					>
						<option value='never'>Never</option>
						<option value='until'>Until</option>
					</select>
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

export default RepeatBooking;
