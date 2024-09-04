/** @format */

const filterVias = function (data) {
	if (data?.Vias?.length) {
		return data.Vias?.map((el) => ({
			viaSequence: el.ViaSequence,
			postcode: el.PostCode,
			address: el.Address,
			id: el.Id,
		}));
	}
	if (data.vias?.length) {
		return data.vias?.map((el) => ({
			viaSequence: el.viaSequence,
			postCode: el.postCode,
			address: el.address,
			// id: el.Id,
		}));
	}
	return [];
};

export { filterVias };
// [
//     {
//         "address": "Red Lion",
//         "postcode": "SP8 4AA",
//         "viaSequence": 0
//     }
// ]

// {
// "details": "",
// "email": "",
// "durationText": "21",
// "durationMinutes": 21,
// "isAllDay": false,
// "passengerName": "test",
// "passengers": 1,
// "paymentStatus": 0,
// "scope": 0,
// "phoneNumber": "",
// "pickupAddress": "Asda Gill",
// "pickupDateTime": "2024-08-31T23:17",
// "pickupPostCode": "SP8 4QA",
// "destinationAddress": "Tesco Shaftesbury",
// "destinationPostCode": "SP7 8PF",
// "recurrenceRule": null,
// "recurrenceID": null,
// "price": 24,
// "priceAccount": 0,
// "chargeFromBase": true,
// "userId": null,
// "returnDateTime": null,
// "vias": [],
// "accountNumber": 0,
// "bookedByName": "Peter Farrell",
// "bookingId": null,
// "updatedByName": ""
// }
