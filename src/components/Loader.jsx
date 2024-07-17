/** @format */
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loader({
	loading,
	backgruond = 'gray-200',
	loaderColor,
}) {
	return (
		<div
			className={`absolute m-auto w-full h-full z-50 ${
				loading ? '' : 'hidden'
			} bg-${backgruond} flex justify-center items-center`}
		>
			<Box sx={{ display: 'flex', color: loaderColor }}>
				<CircularProgress />
			</Box>
		</div>
	);
}
