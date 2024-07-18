/** @format */

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 1000,
	bgcolor: 'background.paper',
	boxShadow: 24,
};

export default function BasicModal({ children, open, setOpen }) {
	// const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
				BackdropProps={{
					onClick: (event) => event.stopPropagation(),
				}}
			>
				<Box sx={style}>{children}</Box>
			</Modal>
		</div>
	);
}
