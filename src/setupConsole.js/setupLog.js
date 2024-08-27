/** @format */

import { log, info, error, warn } from '../utils/logger';

const consoleMethods = () => {
	const originalConsoleLog = console.log;
	const originalConsoleError = console.error;
	const originalConsoleWarn = console.warn;
	const originalConsoleInfo = console.info;

	console.log = (...args) => {
		console.log(args);
		originalConsoleLog(...args);
		log(args.join(' '));
	};

	console.error = (...args) => {
		originalConsoleError(...args);
		error(args.join(' '));
	};

	console.warn = (...args) => {
		originalConsoleWarn(...args);
		warn(args.join(' '));
	};

	console.info = (...args) => {
		originalConsoleInfo(...args);
		info(args.join(' '));
	};
};

export default consoleMethods;
