/** @format */

import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { closeSnackbar } from '../context/snackbarSlice';

export default function SimpleSnackbar() {
	// const [open, setOpen] = React.useState(false);
	const dispatch = useDispatch();
	const { open, message, color } = useSelector((state) => state.snackbar);
	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		dispatch(closeSnackbar());
	};

	// function handleReset() {
	// 	reset();
	// 	setOpen(false);
	// }

	const action = (
		<React.Fragment>
			<IconButton
				size='small'
				aria-label='close'
				color='inherit'
				onClick={handleClose}
			>
				<CloseIcon fontSize='small' />
			</IconButton>
		</React.Fragment>
	);

	return (
		<div>
			<Snackbar
				sx={{
					'& .MuiSnackbarContent-root': {
						backgroundColor: color,
						position: 'absolute',
						top: '50px',
						width: 'auto',
					},
				}}
				color='error'
				open={open}
				anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
				autoHideDuration={6000}
				onClose={handleClose}
				message={message}
				action={action}
			/>
		</div>
	);
}
