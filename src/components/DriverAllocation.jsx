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
import './DriverAllocation.css';

import isLightColor from '../utils/isLight';
import { getDriverAvailability, getDriversAvailablity } from '../utils/apiReq';
const DriverAllocation = ({ currentBookingDateTime }) => {
	const [data, setData] = useState([]);
	const [employeeData, setEmployeeData] = useState([]);

	const bookingTime = new Date(currentBookingDateTime + ':00').getTime();
	// Get current time and end time (10 hours later)
	// const currentTime = new Date(bookingTime - 30 * 60 * 1000);
	const currentTime = new Date(new Date(bookingTime).setHours(1, 0, 0, 0));
	const endTime = new Date(currentTime.getTime() + 22 * 60 * 60 * 1000);

	// Format the time in HH:mm format
	const formatTime = (date) => {
		const hours = date.getHours();
		const minutes = 0;
		return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
	};

	const startHour = formatTime(currentTime);
	const endHour = formatTime(endTime);

	useEffect(() => {
		function transformData(data) {
			return data.flatMap((item) => {
				return item.availableHours.map((hours) => ({
					userId: item.userId,
					fullName: item.fullName,
					date: item.date,
					colorCode: item.colorCode,
					vehicleType: item.vehicleType,
					from: hours.from,
					to: hours.to,
					note: hours.note,
				}));
			});
		}

		const fetchDriverAvailability = async () => {
			try {
				const res = await getDriverAvailability();
				const data = Object.values(
					await getDriversAvailablity(currentBookingDateTime + ':00')
				);
				data.pop();
				let driverData = transformData(data);
				console.log(data);
				if (res.status === 'success') {
					const formattedData = driverData.map((driver) => ({
						Id: driver.userId,
						Subject: driver.note,
						from: new Date(driver.date.split('T')[0] + 'T' + driver.from),
						to: new Date(driver.date.split('T')[0] + 'T' + driver.to),
						EmployeeId: driver.userId,
						color: driver.colorCode,
					}));
					const formattedEmployeeData = data
						.map((driver) => ({
							Text: driver.fullName,
							Id: driver.userId,
							Color: '#4CAF50',
							...driver,
						}))
						.filter((driver) => driver.availableHours.length > 0);

					setData(formattedData);
					setEmployeeData(formattedEmployeeData);
				}
			} catch (error) {
				console.error('Error fetching driver availability:', error);
			}
		};
		fetchDriverAvailability();
	}, [currentBookingDateTime]);

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

	function onEventRender() {
		// args.element.style.color = isLightColor(args.data.color)
		// 	? 'black'
		// 	: 'white';
	}

	function onRenderCell(args) {
		if (args.elementType === 'resourceHeader') {
			args.element.style.backgroundColor =
				employeeData[args.groupIndex].colorCode;
			args.element.childNodes[0].style.color = isLightColor(
				employeeData[args.groupIndex].colorCode
			)
				? 'black'
				: 'white';
		}
		args.element.style.fontWeight = 'bold';
	}

	return (
		<ScheduleComponent
			renderCell={onRenderCell}
			selectedDate={new Date(currentTime - 30 * 60 * 1000)}
			eventRendered={onEventRender}
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
