/** @format */

import {
	APIProvider,
	Map,
	useMap,
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
				setMapLoaded(true);
			}}
		>
			{mapLoaded ? (
				<Map
					defaultZoom={13}
					defaultCenter={pos}
					disableDefaultUI={true}
					fullscreenControl={true}
					zoomControl={true}
					style={{ height: '50%', width: '100%' }}
					mapId='da37f3254c6a6d1c'
					onLoad={(map) => {
						mapRef.current = map;
						setTimeout(() => {
							setMapLoaded(true);
						}, 1000);
					}}
				>
					<Direction />
				</Map>
			) : (
				<div className='flex justify-center items-center'>
					<div className='spinner'></div>
				</div>
			)}
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
