/** @format */

// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { useBooking } from '../hooks/useBooking';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Icon } from 'leaflet';

// const position = [51.0388, -2.2799];

// const LeafletMapComponent = () => {
// 	const { data, activeTab } = useBooking();
// 	const [markers, setMarkers] = useState([]);
// 	const {
// 		PickupPostCode,
// 		PickupAddress,
// 		DestinationPostCode,
// 		DestinationAddress,
// 	} = data[activeTab];

// 	const newIcon = new Icon({
// 		iconUrl: '/map-pointer.png',
// 		iconSize: [25, 25],
// 	});

// 	// this is temperory code to get the lat and lng from the postal code
// 	// we need lat lng in the booking data context
// 	useEffect(() => {
// 		const getLatLngFromPostalCode = async (postalCode, apiKey) => {
// 			try {
// 				const response = await axios.get(
// 					'https://maps.googleapis.com/maps/api/geocode/json',
// 					{
// 						params: {
// 							address: postalCode,
// 							key: apiKey,
// 						},
// 					}
// 				);

// 				if (response.data.status === 'OK') {
// 					const { lat, lng } = response.data.results[0].geometry.location;
// 					return { lat, lng };
// 				} else {
// 					throw new Error('No results found');
// 				}
// 			} catch (error) {
// 				console.error('Error fetching the location:', error);
// 				throw error;
// 			}
// 		};
// 		const apiKey = import.meta.env.VITE_GOOGLE_MAP_KEY;
// 		if (PickupPostCode)
// 			getLatLngFromPostalCode(PickupPostCode, apiKey).then((res) => {
// 				console.log(res);
// 				setMarkers((prev) => [
// 					...prev,
// 					{
// 						coords: [res.lat, res.lng],
// 						address: PickupAddress,
// 						postCode: PickupPostCode,
// 					},
// 				]);
// 			});
// 		if (DestinationPostCode)
// 			getLatLngFromPostalCode(DestinationPostCode, apiKey).then((res) =>
// 				setMarkers((prev) => [
// 					...prev,
// 					{
// 						coords: [res.lat, res.lng],
// 						address: DestinationAddress,
// 						postCode: DestinationPostCode,
// 					},
// 				])
// 			);
// 	}, [PickupPostCode, DestinationPostCode, PickupAddress, DestinationAddress]);
// 	console.log('markers', markers);

// 	return (
// 		<MapContainer
// 			center={position}
// 			zoom={8}
// 			style={{ height: '50%', width: '100%' }}
// 		>
// 			<TileLayer
// 				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
// 				attribution=''
// 			/>
// 			<Marker
// 				position={position}
// 				icon={newIcon}
// 			>
// 				<Popup>
// 					A pretty CSS3 popup. <br /> Easily customizable.
// 				</Popup>
// 			</Marker>
// 			{markers.map((marker, idx) => (
// 				<Marker
// 					icon={newIcon}
// 					key={idx}
// 					position={marker.coords}
// 				>
// 					<Popup>
// 						A pretty CSS3 popup. <br /> Easily customizable.
// 					</Popup>
// 				</Marker>
// 			))}
// 		</MapContainer>
// 	);
// };

// export default LeafletMapComponent;

import {
	APIProvider,
	Map,
	useMap,
	AdvancedMarker,
	Pin,
	InfoWindow,
	useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { useState, useRef, useEffect } from 'react';
import { useBooking } from '../hooks/useBooking';

const GoogleMap = () => {
	const pos = { lat: 51.0388, lng: -2.2799 };
	const mapRef = useRef(null);
	const [mapLoaded, setMapLoaded] = useState(false);

	return (
		<APIProvider
			apiKey={import.meta.env.VITE_GOOGLE_MAP_KEY}
			onLoad={() => {
				console.log('Maps API has loaded.');
				setMapLoaded(true);
			}}
		>
			<Map
				defaultZoom={13}
				defaultCenter={pos}
				style={{ height: '50%', width: '100%' }}
				mapId='da37f3254c6a6d1c'
				onLoad={(map) => {
					mapRef.current = map;
					setTimeout(() => {
						setMapLoaded(true);
					}, 100);
				}}
			>
				<Direction />
			</Map>
		</APIProvider>
	);
};

function Direction() {
	const map = useMap();
	const routeLibrary = useMapsLibrary('routes');
	const [directionService, setDirectionService] = useState(null);
	const [directionRenderer, setDirectionRenderer] = useState(null);

	const { data, activeTab } = useBooking();
	const currentBooking = data[activeTab];
	const {
		PickupAddress,
		PickupPostCode,
		DestinationAddress,
		DestinationPostCode,
		vias,
	} = currentBooking;

	useEffect(() => {
		if (!routeLibrary || !map) return;
		setDirectionService(new routeLibrary.DirectionsService());
		setDirectionRenderer(new routeLibrary.DirectionsRenderer({ map }));
	}, [map, routeLibrary]);

	useEffect(() => {
		if (!directionService || !directionRenderer) return;
		if (!PickupAddress || !DestinationAddress) return;

		const waypoints = vias.map((via) => ({
			location: `${via.address}, ${via.postcode}`,
		}));

		directionService
			.route({
				origin: `${PickupAddress}, ${PickupPostCode}`,
				destination: `${DestinationAddress}, ${DestinationPostCode}`,
				travelMode: window.google.maps.TravelMode.DRIVING,
				provideRouteAlternatives: true,
				waypoints: waypoints,
			})
			.then((res) => {
				directionRenderer.setDirections(res);
			})
			.catch((err) => console.log('error occurred:', err));
	}, [
		directionService,
		directionRenderer,
		PickupAddress,
		PickupPostCode,
		DestinationAddress,
		DestinationPostCode,
		vias,
	]);

	return null;
}

export default GoogleMap;
