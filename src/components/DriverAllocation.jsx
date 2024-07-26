/** @format */

import React, { useEffect, useState } from 'react';
import {
	ScheduleComponent,
	ViewsDirective,
	ViewDirective,
	TimelineViews,
	Agenda,
	Inject,
	ResourcesDirective,
	ResourceDirective,
} from '@syncfusion/ej2-react-schedule';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-calendars/styles/material.css';
import '@syncfusion/ej2-dropdowns/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import '@syncfusion/ej2-splitbuttons/styles/material.css';
import '@syncfusion/ej2-react-schedule/styles/material.css';

import { getDriverAvailability } from '../utils/apiReq';

const DriverAllocation = () => {
	const [data, setData] = useState([]);
	const [employeeData, setEmployeeData] = useState([]);

	// Get current time and end time (5 hours later)
	const currentTime = new Date();
	const endTime = new Date(currentTime.getTime() + 10 * 60 * 60 * 1000);

	// Format the time in HH:mm format
	const formatTime = (date) => {
		const hours = date.getHours();
		const minutes = date.getMinutes();
		return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
	};

	const startHour = formatTime(currentTime);
	const endHour = formatTime(endTime);

	useEffect(() => {
		const fetchDriverAvailability = async () => {
			try {
				const res = await getDriverAvailability();
				if (res.status === 'success') {
					const formattedData = res.drivers.map((driver) => ({
						Id: driver.userId,
						Subject: driver.description,
						from: new Date(driver.date.split('T')[0] + 'T' + driver.from),
						to: new Date(driver.date.split('T')[0] + 'T' + driver.to),
						EmployeeId: driver.userId,
					}));
					const formattedEmployeeData = res.drivers.map((driver) => ({
						Text: driver.fullName,
						Id: driver.userId,
						Color: driver.colorCode,
					}));
					setData(formattedData);
					setEmployeeData(formattedEmployeeData);
				}
			} catch (error) {
				console.error('Error fetching driver availability:', error);
			}
		};
		fetchDriverAvailability();
	}, []);

	const onPopupOpen = (args) => {
		args.cancel = true; // Disable popup editing
	};

	const onActionBegin = (args) => {
		if (
			args.requestType === 'eventRemove' ||
			args.requestType === 'eventChange'
		) {
			args.cancel = true; // Disable delete and edit actions
		}
	};

	return (
		<ScheduleComponent
			height={'50%'}
			selectedDate={new Date()}
			eventSettings={{
				dataSource: data,
				fields: {
					subject: { name: 'Subject' },
					startTime: { name: 'from' },
					endTime: { name: 'to' },
				},
			}}
			group={{ resources: ['Employees'] }}
			showHeaderBar={false}
			popupOpen={onPopupOpen}
			actionBegin={onActionBegin}
		>
			<ResourcesDirective>
				<ResourceDirective
					field='EmployeeId'
					title='Employee'
					name='Employees'
					allowMultiple={false}
					dataSource={employeeData}
					textField='Text'
					idField='Id'
					colorField='Color'
				/>
			</ResourcesDirective>
			<ViewsDirective>
				<ViewDirective
					option='TimelineDay'
					startHour={startHour}
					endHour={endHour}
				/>
				<ViewDirective option='Agenda' />
			</ViewsDirective>
			<Inject services={[TimelineViews, Agenda]} />
		</ScheduleComponent>
	);
};

const DriverAllocationMemo = React.memo(DriverAllocation);
export default DriverAllocationMemo;
