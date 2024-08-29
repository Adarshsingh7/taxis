/** @format */

function transformData(bookings) {
	return bookings.map((booking) => {
		let subjectString = '';
		if (booking.scope === 0 && booking.status !== 2) {
			subjectString = `${booking.pickupAddress} - ${booking.destinationAddress}`;
		}
		if (booking.scope === 0 && booking.status === 2) {
			subjectString = `[R]:${booking.pickupAddress} - ${booking.destinationAddress}`;
		}
		if (booking.scope === 1 && booking.status !== 2) {
			subjectString = booking.passengerName;
		}
		if (booking.scope === 1 && booking.status === 2) {
			subjectString = `[R]:${booking.passengerName}`;
		}
		if (booking.scope === 2 && booking.status !== 2) {
			subjectString = booking.passengerName;
		}
		if (booking.scope === 2 && booking.status === 2) {
			subjectString = `[R]:${booking.passengerName}`;
		}

		return {
			...booking,
			subject: subjectString,
		};
	});
}

export { transformData };
