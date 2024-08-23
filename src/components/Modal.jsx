/** @format */

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	// width: 1000,
	// bgcolor: 'background.paper',
	// boxShadow: 24,
};

export default function BasicModal({
	children,
	open,
	setOpen,
	disableEscapeKeyDown = false,
	disableMouseEvent = false,
}) {
	// const handleOpen = () => setOpen(true);
	// const handleClose = () => setOpen(false);
	const handleClose = (event, reason) => {
		if (reason === 'backdropClick' && !disableMouseEvent) {
			setOpen(false);
		}

		if (reason === 'escapeKeyDown' && !disableEscapeKeyDown) {
			setOpen(false);
		}
	};

	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				disableEscapeKeyDown={disableEscapeKeyDown}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
				// BackdropProps={{
				// 	onClick: (event) => {
				// 		if (disableMouseEvent) {
				// 			event.preventDefault(); // Add this line
				// 			event.stopPropagation();
				// 		}
				// 	},
				// }}
			>
				<Box sx={style}>{children}</Box>
			</Modal>
		</div>
	);
}
