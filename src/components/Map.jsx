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
	const [reloadKey, setReloadKey] = useState(0);
	const timeoutRef = useRef(null);

	const handleMapLoad = () => {
		setMapLoaded(true);
	};

	const handleMapError = (error) => {
		console.error('Error loading Google Maps API:', error);
		setMapLoaded(false);
	};

	useEffect(() => {
		if (!mapLoaded || (mapLoaded && !tileLoaded)) {
			timeoutRef.current = setTimeout(() => {
				setReloadKey((prevKey) => prevKey + 1);
			}, 1000);
		} else if (mapLoaded && tileLoaded) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [mapLoaded, tileLoaded]);

	return (
		<APIProvider
			apiKey={import.meta.env.VITE_GOOGLE_MAP_KEY}
			onLoad={handleMapLoad}
			onError={handleMapError}
		>
			{mapLoaded ? (
				<Map
					key={reloadKey}
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
			return;
		}
		setDirectionService(new routeLibrary.DirectionsService());
		setDirectionRenderer(new routeLibrary.DirectionsRenderer({ map }));
	}, [map, routeLibrary]);

	useEffect(() => {
		if (!directionService || !directionRenderer) {
			return;
		}

		if (!pickupAddress || !destinationAddress) {
			directionRenderer.setDirections({ routes: [] });

			if (mapRef.current) {
				mapRef.current.setZoom(13);
				mapRef.current.setCenter({ lat: 51.0388, lng: -2.2799 });
			}
			return;
		}

		const waypoints = vias.map((via) => ({
			location: `${via.address}, ${via.postCode}`,
		}));

		directionService
			.route({
				origin: `${pickupAddress}, ${pickupPostCode}`,
				destination: `${destinationAddress}, ${destinationPostCode}`,
				travelMode: window.google.maps.TravelMode.DRIVING,
				provideRouteAlternatives: true,
				waypoints,
			})
			.then((res) => {
				directionRenderer.setDirections(res);

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
				console.error('Error occurred while fetching directions:', err)
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
