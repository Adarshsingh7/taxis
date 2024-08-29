/** @format */

// import { getAllDrivers } from './apiReq';

// async function transformData(bookings) {
// 	const driverList = await getAllDrivers();
// 	return bookings.map((booking) => {
// 		const driver = driverList.users.filter(
// 			(driver) => driver.regNo === booking.regNo
// 		);
// 		const vehicleType = driver[0]?.vehicleType;
// 		const vehicleTypeString = vehicleType === 3 ? '[MPV]:' :"";
// 		let subjectString = '';
// 		if (booking.scope === 0 && booking.status !== 2) {
// 			subjectString = `${[vehicleTypeString]} ${booking.pickupAddress} - ${booking.destinationAddress}`;
// 		}
// 		if (booking.scope === 0 && booking.status === 2) {
// 			subjectString = `[R]:${[vehicleTypeString]} ${booking.pickupAddress} - ${booking.destinationAddress}`;
// 		}
// 		if (booking.scope === 1 && booking.status !== 2) {
// 			subjectString = `${[vehicleTypeString]} ${booking.passengerName}`;
// 		}
// 		if (booking.scope === 1 && booking.status === 2) {
// 			subjectString = `[R]:${[vehicleTypeString]} ${booking.passengerName}`;
// 		}
// 		if (booking.scope === 2 && booking.status !== 2) {
// 			subjectString = `${[vehicleTypeString]} ${booking.passengerName}`;
// 		}
// 		if (booking.scope === 2 && booking.status === 2) {
// 			subjectString = `[R]:${[vehicleTypeString]} ${booking.passengerName}`;
// 		}

// 		return {
// 			...booking,
// 			subject: subjectString,
// 		};
// 	});
// }

// export { transformData };
