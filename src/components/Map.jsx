/** @format */

import {
	APIProvider,
	Map,
	useMap,
	useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

const GoogleMap = () => {
	const pos = { lat: 51.0397, lng: -2.2863 };
	const mapRef = useRef(null);
	const [mapLoaded, setMapLoaded] = useState(false);
	const [tileLoaded, setTileLoaded] = useState(false);
	const [reloadKey, setReloadKey] = useState(0); // State to trigger re-render
	const timeoutRef = useRef(null);

	useEffect(() => {
		if (mapLoaded && !tileLoaded) {
			// Set a timeout to reload the map if tiles are not loaded
			timeoutRef.current = setTimeout(() => {
				setReloadKey((prevKey) => prevKey + 1);
			}, 3000);
		} else if (mapLoaded && tileLoaded) {
			// Clear the timeout when the map and tiles are fully loaded
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}

		// Clean up the timeout when the component unmounts or dependencies change
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [mapLoaded, tileLoaded]);

	return (
		<APIProvider
			apiKey={import.meta.env.VITE_GOOGLE_MAP_KEY}
			onLoad={() => setMapLoaded(true)}
		>
			{mapLoaded ? (
				<Map
					key={reloadKey} // Use the state as a key to force re-render
					defaultZoom={13}
					defaultCenter={pos}
					disableDefaultUI={true}
					onTilesLoaded={(tile) => {
						mapRef.current = tile.map;
						setTileLoaded(true);
					}}
					fullscreenControl={true}
					zoomControl={true}
					style={{ height: '50%', width: '100%' }}
					mapId='da37f3254c6a6d1c'
				>
					{tileLoaded && <Direction mapRef={mapRef} />}
				</Map>
			) : (
				<div className='flex justify-center items-center'>
					<div className='spinner'></div>
				</div>
			)}
		</APIProvider>
	);
};

function Direction({ mapRef }) {
	const map = useMap();
	const routeLibrary = useMapsLibrary('routes');
	const [directionService, setDirectionService] = useState(null);
	const [directionRenderer, setDirectionRenderer] = useState(null);

	const data = useSelector((state) => state.bookingForm.bookings);
	const activeTab = useSelector(
		(state) => state.bookingForm.activeBookingIndex
	);
	const currentBooking = data[activeTab];
	const {
		pickupAddress,
		pickupPostCode,
		destinationAddress,
		destinationPostCode,
		vias,
	} = currentBooking;

	useEffect(() => {
		if (!routeLibrary || !map) {
			// console.log('Map or routeLibrary not available');
			return;
		}
		// console.log('Initializing Directions Service and Renderer');
		setDirectionService(new routeLibrary.DirectionsService());
		setDirectionRenderer(new routeLibrary.DirectionsRenderer({ map }));
	}, [map, routeLibrary]);

	useEffect(() => {
		if (!directionService || !directionRenderer) {
			// console.log('DirectionService or DirectionRenderer not available');
			return;
		}

		if (!pickupAddress || !destinationAddress) {
			// console.log(
			// 	'Pickup or Destination address not available, disabling directions'
			// );
			directionRenderer.setDirections({ routes: [] });

			if (mapRef.current) {
				// Set the zoom and center to initial values
				mapRef.current.setZoom(13); // Set to your desired initial zoom level
				mapRef.current.setCenter({ lat: 51.0388, lng: -2.2799 }); // Set to your default center location
			}
			return;
		}

		const waypoints = vias.map((via) => ({
			location: `${via.address}, ${via.postcode}`,
		}));

		// console.log('Requesting directions', {
		// 	origin: `${pickupAddress}, ${pickupPostCode}`,
		// 	destination: `${destinationAddress}, ${destinationPostCode}`,
		// 	travelMode: window.google.maps.TravelMode.DRIVING,
		// 	waypoints,
		// });

		directionService
			.route({
				origin: `${pickupAddress}, ${pickupPostCode}`,
				destination: `${destinationAddress}, ${destinationPostCode}`,
				travelMode: window.google.maps.TravelMode.DRIVING,
				provideRouteAlternatives: true,
				waypoints,
			})
			.then((res) => {
				// console.log('Directions result:', res);
				directionRenderer.setDirections(res);

				// Adjust zoom to fit bounds
				if (mapRef.current && res.routes.length > 0) {
					const bounds = new window.google.maps.LatLngBounds();
					res.routes.forEach((route) => {
						route.bounds && bounds.extend(route.bounds.getNorthEast());
						route.bounds && bounds.extend(route.bounds.getSouthWest());
					});
					mapRef.current.fitBounds(bounds);
				}
			})
			.catch((err) =>
				console.log('Error occurred while fetching directions:', err)
			);
	}, [
		directionService,
		directionRenderer,
		pickupAddress,
		pickupPostCode,
		destinationAddress,
		destinationPostCode,
		vias,
		mapRef,
	]);

	return null;
}
export default GoogleMap;
