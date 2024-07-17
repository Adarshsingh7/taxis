/** @format */

import { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';

const Dragger = ({ items, setItems, Child }) => {
	const [draggingItem, setDraggingItem] = useState(null);
	const [editingItem, setEditingItem] = useState(null);
	const [touchStartX, setTouchStartX] = useState(0);
	const [touchStartY, setTouchStartY] = useState(0);

	const handleDragStart = (e, item) => {
		setDraggingItem(item);
		e.dataTransfer.setData('text/plain', '');
	};

	const handleDragEnd = () => {
		setDraggingItem(null);
	};

	const handleDragOver = (e) => {
		e.preventDefault();
	};

	const handleDrop = (e, targetItem) => {
		if (!draggingItem) return;

		const currentIndex = items.indexOf(draggingItem);
		const targetIndex = items.indexOf(targetItem);

		if (currentIndex !== -1 && targetIndex !== -1) {
			const newItems = [...items];
			newItems.splice(currentIndex, 1);
			newItems.splice(targetIndex, 0, draggingItem);
			setItems(newItems);
		}
	};

	const handleDelete = (id) => {
		const newItems = items.filter((item) => item.id !== id);
		setItems(newItems);
	};

	const handleEdit = (updatedItem) => {
		const newItems = items.map((item) =>
			item.id === updatedItem.id ? updatedItem : item
		);
		setItems(newItems);
		setEditingItem(null);
	};

	const handleTouchStart = (e) => {
		setTouchStartX(e.touches[0].clientX);
		setTouchStartY(e.touches[0].clientY);
	};

	const handleTouchMove = (e) => {
		e.preventDefault();
		const touchEndX = e.touches[0].clientX;
		const touchEndY = e.touches[0].clientY;

		if (
			Math.abs(touchEndX - touchStartX) > 10 ||
			Math.abs(touchEndY - touchStartY) > 10
		) {
			e.target.style.transform = `translate(${touchEndX - touchStartX}px, ${
				touchEndY - touchStartY
			}px)`;
		}
	};

	const handleTouchEnd = (e, targetItem) => {
		if (!draggingItem) return;

		const touchEndX = e.changedTouches[0].clientX;
		const touchEndY = e.changedTouches[0].clientY;

		const targetElement = document.elementFromPoint(touchEndX, touchEndY);
		const targetIndex = items.indexOf(targetItem);

		if (targetElement && targetIndex !== -1) {
			const currentIndex = items.indexOf(draggingItem);
			if (currentIndex !== -1) {
				const newItems = [...items];
				newItems.splice(currentIndex, 1);
				newItems.splice(targetIndex, 0, draggingItem);
				setItems(newItems);
			}
		}

		e.target.style.transform = 'translate(0, 0)';
		setDraggingItem(null);
	};

	return (
		<div className='bg-white rounded-lg p-5 shadow-lg'>
			{items.map((item, id) => (
				<div
					key={id}
					className={`mt-4 border border-gray-300 flex justify-between cursor-move bg-white items-center rounded-lg p-4 mb-2 shadow-sm ${
						item === draggingItem
							? 'opacity-60 transform scale-105 bg-gray-200'
							: ''
					}`}
					draggable='true'
					onDragStart={(e) => handleDragStart(e, item)}
					onDragEnd={handleDragEnd}
					onDragOver={handleDragOver}
					onDrop={(e) => handleDrop(e, item)}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={(e) => handleTouchEnd(e, item)}
				>
					<Child
						data={item}
						onEdit={handleEdit}
						isEditing={editingItem?.id === item.id}
						setEditingItem={setEditingItem}
					/>
					<button onClick={() => handleDelete(item.id)}>
						<CancelIcon fontSize='5px' />
					</button>
				</div>
			))}
		</div>
	);
};

export default Dragger;
