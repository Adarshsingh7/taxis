/** @format */

import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function SimpleSnackbar({
	open,
	setOpen,
	message,
	reset,
	disableReset,
	color = '#2F3030',
}) {
	// const [open, setOpen] = React.useState(false);

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	};

	function handleReset() {
		reset();
		setOpen(false);
	}

	const action = (
		<React.Fragment>
			{!disableReset ? (
				<Button
					color='primary'
					size='small'
					onClick={handleReset}
				>
					RESET
				</Button>
			) : null}
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
				sx={{ '& .MuiSnackbarContent-root': { backgroundColor: color } }}
				color='error'
				open={open}
				autoHideDuration={6000}
				onClose={handleClose}
				message={message}
				action={action}
			/>
		</div>
	);
}
