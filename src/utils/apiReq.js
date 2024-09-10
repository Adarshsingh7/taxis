/** @format */

import axios from 'axios';
import { formatDate } from './formatDate';
import { sendLogs } from './getLogs';
import { filterVias } from './filterVias';
// const BASE = 'https://abacusonline-001-site1.atempurl.com';
const BASE = 'https://api.acetaxisdorset.co.uk';
// const BASE = 'https://abacusonline-001-site1.atempurl.com';
const TEST = 'https://abacusonline-001-site1.atempurl.com';
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

// this was needed when data was not mapped
// after replacement of context with redux use of this fn is not needed
function filterData(data) {
	return JSON.stringify({
		details: data.details,
		email: data.email,
		durationText: Number(data.durationText) ? String(data.durationText) : '0',
		// durationMinutes: data.durationText ? +data.durationText : 0,
		durationMinutes: data.durationMinutes || 0,
		isAllDay: data.isAllDay,
		passengerName: data.passengerName,
		passengers: data.passengers,
		paymentStatus: data.paymentStatus || 0,
		scope: data.scope,
		phoneNumber: data.phoneNumber,
		pickupAddress: data.pickupAddress,
		pickupDateTime: data.pickupDateTime,
		pickupPostCode: data.pickupPostCode,
		destinationAddress: data.destinationAddress,
		destinationPostCode: data.destinationPostCode,
		recurrenceRule: data.recurrenceRule || null,
		recurrenceID: null,
		price: data.price,
		priceAccount: data.priceAccount || 0,
		chargeFromBase: data.chargeFromBase || false,
		userId: data.userId || null,
		returnDateTime: data.returnDateTime || null,
		vias: filterVias(data),
		accountNumber: data.accountNumber,
		bookedByName: data.bookedByName || '',
		bookingId: data.bookingId || null,
		updatedByName: data.updatedByName || '',
		// actionByUserId: data.actionByUserId || null,
	});
}

function createDateObject(today = new Date()) {
	const fromDate =
		new Date(new Date(today).setHours(0, 0, 0, 0)).getTime() -
		24 * 60 * 60 * 1000;
	const formattedFrom = formatDate(new Date(fromDate));
	const formattedTo = formatDate(
		new Date(today).setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000
	);

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
		sendLogs({ url: URL, error: err.response }, 'error');
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
		sendLogs({ url: URL, error: err.response }, 'error');
		return {
			...err.response,
			status: err.response.status > 499 ? 'error' : 'fail',
			message: `${
				err.response.status > 499 ? 'server error' : 'Failed'
			} while fetching the data`,
		};
	}
}

async function makeBooking(data, testMode = false) {
	const URL = `${testMode ? TEST : BASE}/api/Bookings/Create`;
	const filteredData = filterData(data);
	console.log("filtered Data is coming",filteredData);
	// const filteredData = data;
	const res = await handlePostReq(URL, filteredData);
	if (res.status === 'success')
		sendLogs(
			{
				url: URL,
				requestBody: data,
				headers: setHeaders(),
				response: res,
			},
			'info'
		);
	return res;
}

const getBookingData = async function (date, testMode = false) {
	const accessToken = localStorage.getItem('authToken');
	if (!accessToken) return;

	const URL = `${testMode ? TEST : BASE}/api/Bookings/DateRange`;
	const dataToSend = createDateObject(date);

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
	const requestData = {
		pickupPostcode: data.pickupPostcode,
		viaPostcodes: data.viaPostcodes,
		destinationPostcode: data.destinationPostcode,
		pickupDateTime: convertDateString(data.pickupDateTime),
		passengers: data.passengers,
		priceFromBase: data.priceFromBase || data.chargeFromBase,
	};

	const res = await handlePostReq(URL, requestData);
	if (res.status === 'success')
		sendLogs(
			{
				url: URL,
				requestBody: data,
				headers: setHeaders(),
				response: res,
			},
			'info'
		);

	return res;
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

async function updateBooking(data, testMode = false) {
	const URL = `${testMode ? TEST : BASE}/api/Bookings/Update`;
	const filteredData = filterData(data);
	const res = await handlePostReq(URL, filteredData);
	if (res.status === 'success')
		sendLogs(
			{
				url: URL,
				requestBody: data,
				headers: setHeaders(),
				response: res,
			},
			'info'
		);

	return res;
}

async function deleteSchedulerBooking(data, testMode = true) {
	const URL = `${testMode ? TEST : BASE}/api/Bookings/Cancel`;
	const res = await handlePostReq(URL, {
		bookingId: data.bookingId,
		cancelledByName: data.cancelledByName,
		actionByUserId: data.actionByUserId,
		cancelBlock: data.cancelBlock,
		cancelledOnArrival: data.cancelledOnArrival,
	});
	if (res.status === 'success')
		sendLogs(
			{
				url: URL,
				requestBody: data,
				headers: setHeaders(),
				response: res,
			},
			'info'
		);

	return res;
}

// async function getDriverAvailability() {
// 	const URL = `${BASE}/api/UserProfile/GetAvailability`;
// 	return await handlePostReq(URL, { date: new Date().toISOString() });
// }

async function getDriverAvailability(dueDate, testMode = true) {
	const URL = `${
		testMode ? TEST : BASE
	}/api/Availability/General?date=${dueDate}`;
	return await handleGetReq(URL);
}

async function getAddressSuggestions(location) {
	const apiKey = import.meta.env.VITE_GETADDRESS_KEY;
	try {
		// Get autocomplete suggestions
		const autocompleteResponse = await axios.get(
			`https://api.getAddress.io/autocomplete/${location}?api-key=${apiKey}`
		);
		const suggestions = autocompleteResponse.data.suggestions;

		// Fetch details for each suggestion
		const detailsPromises = suggestions.map(async (suggestion) => {
			const detailResponse = await axios.get(
				`https://api.getAddress.io/get/${suggestion.id}?api-key=${apiKey}`
			);
			return detailResponse.data;
		});

		const details = await Promise.all(detailsPromises);

		return details;
	} catch (error) {
		console.error('Error fetching address suggestions:', error);
		return [];
	}
}

async function fireCallerEvent(number) {
	const URL = `${TEST}/api/CallEvents/CallerLookup?caller_id=${number}`;
	if (number.length < 10) return;
	return await handleGetReq(URL);
}

async function allocateDriver(allocateReqData, testMode = false) {
	const URL = `${testMode ? TEST : BASE}/api/Bookings/Allocate`;
	const res = await handlePostReq(URL, allocateReqData);
	if (res.status === 'success')
		sendLogs(
			{
				url: URL,
				requestBody: allocateReqData,
				headers: setHeaders(),
				response: res,
			},
			'info'
		);

	return res;
}

async function completeBookings(completeBookingData, testMode = false) {
	const URL = `${testMode ? TEST : BASE}/api/Bookings/Complete`;
	const res = await handlePostReq(URL, completeBookingData);
	if (res.status === 'success')
		sendLogs(
			{
				url: URL,
				requestBody: completeBookingData,
				headers: setHeaders(),
				response: res,
			},
			'info'
		);

	return res;
}

async function bookingFindByTerm(queryField, testMode = false) {
	const URL = `${
		testMode ? TEST : BASE
	}/api/Bookings/FindByTerm?term=${queryField}`;
	const res = await handleGetReq(URL);
	if (res.status === 'success')
		sendLogs(
			{
				url: URL,
				requestBody: queryField,
				headers: setHeaders(),
				// response: res,
			},
			'info'
		);

	return res;
}

async function bookingFindByKeyword(queryField, testMode = false) {
	const URL = `${
		testMode ? TEST : BASE
	}/api/Bookings/FindByKeyword?keyword=${queryField}`;
	const res = await handleGetReq(URL);
	if (res.status === 'success')
		sendLogs(
			{
				url: URL,
				requestBody: queryField,
				headers: setHeaders(),
				response: res,
			},
			'info'
		);

	return res;
}

async function findBookingById(bookingId, testMode) {
	const URL = `${
		testMode ? TEST : BASE
	}/api/Bookings/FindById/?bookingId=${bookingId}`;
	return await handleGetReq(URL);
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
	getDriverAvailability,
	getAddressSuggestions,
	fireCallerEvent,
	allocateDriver,
	completeBookings,
	bookingFindByTerm,
	bookingFindByKeyword,
	findBookingById,
};
