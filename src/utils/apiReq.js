/** @format */

import axios from 'axios';
const BASE = 'https://abacusonline-001-site1.atempurl.com';
// const BASE = 'https://api.acetaxisdorset.co.uk';
// https://api.getaddress.io/v2/uk/sp84aa?api-key=RCX7bLL_a0C5xaApbiBLFQ983

// utils function
function convertDateString(inputDateString) {
	// Parse the input date string
	const date = new Date(inputDateString);

	// Get the components of the date
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');

	// Construct the output date string
	const outputDateString = `${year}-${month}-${day}T${hours}:${minutes}`;

	return outputDateString;
}

function filterData(data) {
	return JSON.stringify({
		details: data.details,
		email: data.Email,
		durationText: data.durationText + '',
		durationMinutes: data.durationText,
		isAllDay: data.isAllDay,
		passengerName: data.PassengerName,
		passengers: data.Passengers,
		paymentStatus: data.paymentStatus || 0,
		scope: data.scope,
		phoneNumber: data.PhoneNumber,
		pickupAddress: data.PickupAddress,
		pickupDateTime: data.PickupDateTime,
		pickupPostCode: data.PickupPostCode,
		destinationAddress: data.DestinationAddress,
		destinationPostCode: data.DestinationPostCode,
		recurrenceRule: data.recurrenceRule?.split('RRULE:')[1] || null,
		recurrenceID: null,
		price: data.Price,
		priceAccount: data.priceAccount || 0,
		chargeFromBase: data.chargeFromBase || false,
		userId: data.userId || null,
		returnDateTime: data.returnTime || null,
		vias: data.vias || [],
		accountNumber: data.accountNumber,
		bookedByName: data.bookedByName || '',
		bookingId: data.bookingId || null,
		updatedByName: data.updatedByName || '',
	});
}

function createObjectForToday(today = new Date()) {
	// Set time to 18:30:00
	today.setHours(18, 30, 0, 0); // Hours, Minutes, Seconds, Milliseconds

	// Calculate "to" date by adding 24 hours
	const toDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);

	// Format dates in ISO 8601
	const formattedFrom = today.toISOString();
	const formattedTo = toDate.toISOString();

	return {
		from: formattedFrom,
		to: formattedTo,
	};
}

function setHeaders() {
	const accessToken = localStorage.getItem('authToken');
	if (!accessToken) return {};
	return {
		'accept': '*/*',
		'Authorization': `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};
}

// event handlers
// Event handlers
async function handleGetReq(URL) {
	try {
		const response = await axios.get(URL, { headers: setHeaders() });
		if (response.status >= 200 && response.status < 300) {
			return { ...response.data, status: 'success' };
		} else {
			console.log('Unexpected response status:', response);
			return null;
		}
	} catch (err) {
		console.error('Error in GET request:', err);
		return {
			...err.response,
			status: err.response.status > 499 ? 'error' : 'fail',
			message: `${
				err.response.status > 499 ? 'server error' : 'Failed'
			} while fetching the data`,
		};
	}
}

async function handlePostReq(URL, data) {
	try {
		const response = await axios.post(URL, data, {
			headers: setHeaders(),
		});
		if (response.status >= 200 && response.status < 300) {
			return { ...response.data, status: 'success' };
		} else {
			console.log('Unexpected response status:', response);
			return null;
		}
	} catch (err) {
		return {
			...err.response,
			status: err.response.status > 499 ? 'error' : 'fail',
			message: `${
				err.response.status > 499 ? 'server error' : 'Failed'
			} while fetching the data`,
		};
	}
}

async function makeBooking(data) {
	const URL = BASE + '/api/Bookings/Create';
	const filteredData = filterData(data);
	console.log(filterData(data));
	console.log(data);
	return await handlePostReq(URL, filteredData);
}

const getBookingData = async function () {
	const accessToken = localStorage.getItem('authToken');
	if (!accessToken) return;

	const URL = `${BASE}/api/Bookings/DateRange`;
	const dataToSend = createObjectForToday();

	// Use handlePostReq function
	const response = await handlePostReq(URL, dataToSend);
	if (response) {
		localStorage.setItem('bookings', JSON.stringify(response.bookings));
		return response;
	} else {
		console.log('Unexpected response:', response);
	}
};

async function makeBookingQuoteRequest(data) {
	const URL = BASE + '/api/Bookings/Quote';
	console.log(data);
	const requestData = {
		pickupPostcode: data.pickupPostcode,
		viaPostcodes: data.viaPostcodes,
		destinationPostcode: data.destinationPostcode,
		pickupDateTime: convertDateString(data.pickupDateTime),
		passengers: data.passengers,
		priceFromBase: data.priceFromBase,
	};

	return await handlePostReq(URL, requestData);
}

async function getPoi(code) {
	try {
		const URL = `${BASE}/api/LocalPOI/GetPOI`;
		const config = {
			headers: setHeaders(),
		};
		const body = { searchTerm: `${code}` };
		const { data } = await axios.post(URL, body, config);
		return data;
	} catch (err) {
		console.log(err);
	}
}

async function getPostal(code) {
	const URL = `https://api.getaddress.io/v2/uk/${code}?api-key=RCX7bLL_a0C5xaApbiBLFQ983`;
	const res = await handleGetReq(URL);
	return res;
}

async function getAllDrivers() {
	const URL = `${BASE}/api/UserProfile/ListUsers`;
	return await handleGetReq(URL);
}

async function getAccountList() {
	const URL = `${BASE}/api/Accounts/GetList`;
	const data = await handleGetReq(URL);
	if (data.status === 'success') {
		const formatedData = Object.keys(data).map((el) => data[el]);
		localStorage.setItem(
			'accounts',
			JSON.stringify([{ accNo: 0, accountName: 'select-233' }, ...formatedData])
		);
	}
}

async function updateBooking(data) {
	const URL = BASE + '/api/Bookings/Update';
	const filteredData = filterData(data);
	return await handlePostReq(URL, filteredData);
}

async function deleteSchedulerBooking(data) {
	const URL = BASE + '/api/Bookings/Cancel';
	return await handlePostReq(URL, {
		bookingId: data.bookingId,
		cancelledByName: data.cancelledByName,
		actionByUserId: data.actionByUserId,
		cancelBlock: false,
		cancelledOnArrival: false,
	});
}

export {
	getBookingData,
	makeBooking,
	getPoi,
	makeBookingQuoteRequest,
	getAllDrivers,
	getPostal,
	getAccountList,
	updateBooking,
	deleteSchedulerBooking,
};
