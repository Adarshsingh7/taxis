/** @format */

import { useState, useEffect, useRef } from 'react';
import { getPoi, getPostal } from '../utils/apiReq';
import { TextField } from '@mui/material';

const Autocomplete = ({
	placeholder,
	onPushChange,
	onChange,
	value,
	type,
	required,
	inputRef,
}) => {
	const [inputValue, setInputValue] = useState(value || '');
	const [options, setOptions] = useState([]);
	const [showOptions, setShowOptions] = useState(false);
	const [focus, setFocus] = useState(false);
	const [activeOptionIndex, setActiveOptionIndex] = useState(-1);

	// const inputRef = useRef(null);
	const optionsListRef = useRef(null);
	const activeOptionRef = useRef(null);

	useEffect(() => {
		setInputValue(value);
	}, [value]);

	useEffect(() => {
		if (inputValue.length < 3) {
			setOptions([]);
			return;
		}
		async function fetchPoi() {
			try {
				const response = await getPoi(inputValue);
				// const response = await getAddressSuggestions(inputValue);
				setOptions(
					response.map((item) => ({
						label: item.address,
						// label: item.formatted_address.join(' '),
						// address: item.formatted_address.join(' '),
						postcode: item.postcode,
						...item,
					}))
				);
				setShowOptions(true);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		}
		async function getPostalID() {
			const response = await getPostal(inputValue);
			if (response.status === 'success') {
				setOptions(
					response.Addresses.map((item) => {
						const filteredAddress = item
							.split(',')
							.map((part) => part.trim())
							.filter((part) => part.length > 0)
							.join(', ');

						return {
							label: filteredAddress,
							postcode: inputValue,
							address: filteredAddress,
							raw: item, // Retain the original address for reference if needed
						};
					})
				);
				setShowOptions(true);
			}
		}
		if (type === 'postal') {
			getPostalID();
		} else {
			fetchPoi();
		}
	}, [inputValue]);

	useEffect(() => {
		if (activeOptionRef.current && optionsListRef.current) {
			const list = optionsListRef.current;
			const item = activeOptionRef.current;
			const itemHeight = item.offsetHeight;
			const itemTop = item.offsetTop;
			const itemBottom = itemTop + itemHeight;

			if (itemTop < list.scrollTop) {
				list.scrollTop = itemTop;
			} else if (itemBottom > list.scrollTop + list.clientHeight) {
				list.scrollTop = itemBottom - list.clientHeight;
			}
		}
	}, [activeOptionIndex]);

	const handleInputChange = (e) => {
		const newValue = e.target.value;
		setInputValue(newValue);
		onChange(e);
		setActiveOptionIndex(-1);
	};

	const handleSelectOption = (option) => {
		console.log(option);
		onPushChange(option);
		setOptions(options.filter((opt) => opt.label !== option.label));
		setShowOptions(false);
		setFocus(false);
		setInputValue(value);
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Escape') {
			setShowOptions(false);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			setActiveOptionIndex((prevIndex) =>
				Math.min(prevIndex + 1, options.length - 1)
			);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			setActiveOptionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
		} else if (e.key === 'Enter' && activeOptionIndex >= 0) {
			e.preventDefault();
			handleSelectOption(options[activeOptionIndex]);
		}
	};

	function handleFocus() {
		setFocus(true);
	}

	function handleBlur() {
		// Delay onBlur to allow option click to register
		setTimeout(() => {
			setFocus(false);
			setShowOptions(false);
		}, 500);
	}

	return (
		<div className='relative'>
			<TextField
				type='text'
				autoComplete='new-password'
				id={Math.random().toString(36).substring(7)}
				ref={inputRef}
				label={placeholder}
				required={required}
				onBlur={handleBlur}
				onFocus={handleFocus}
				value={inputValue}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-full'
			/>
			{showOptions && focus && inputValue.length > 0 && (
				<ul
					className='absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-[40vh] overflow-auto'
					ref={optionsListRef}
				>
					{options.map((option, index) => (
						<li
							key={index}
							onClick={() => handleSelectOption(option)}
							className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
								index === activeOptionIndex ? 'bg-gray-200' : ''
							}`}
							ref={index === activeOptionIndex ? activeOptionRef : null}
						>
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Autocomplete;
