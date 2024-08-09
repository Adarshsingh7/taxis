/** @format */

import  React, {useState} from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Box, Switch } from '@mui/material';
import { setActiveTestMode } from '../context/bookingSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
	return (
		<Slide
			direction='up'
			ref={ref}
			{...props}
		/>
	);
});

export default function FullScreenDialog({ children, open, setOpen, isActiveComplete, setIsActiveComplete }) {
	const handleClose = () => {
		setOpen(false);
	};
	

	return (
		<React.Fragment>
			<Dialog
				fullScreen
				open={open}
				onClose={handleClose}
				TransitionComponent={Transition}
			>
				<AppBar
					sx={{
						position: 'relative',
						backgroundColor: '#424242',
					}}
				>
					<Toolbar className='flex justify-between'>
						<IconButton
							edge='start'
							color='inherit'
							onClick={handleClose}
							aria-label='close'
						>
							<CloseIcon />
							
						</IconButton>
					</Toolbar>
				</AppBar>
				<Box>{children}</Box>
			</Dialog>
		</React.Fragment>
	);
}
