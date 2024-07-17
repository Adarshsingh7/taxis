/** @format */

import { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';

const Dragger = ({ items, setItems, Child }) => {
	const [draggingItem, setDraggingItem] = useState(null);
	const [editingItem, setEditingItem] = useState(null);

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
