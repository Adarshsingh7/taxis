/** @format */
import CircularProgress from '@mui/material/CircularProgress';
import { Backdrop } from '@mui/material';

export default function Loader() {
	return (
		<Backdrop
			sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
			open={true}
		>
			<CircularProgress color='inherit' />
		</Backdrop>
	);
}
