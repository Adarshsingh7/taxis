/** @format */
function LongButton({ children, color = 'bg-red-700', ...props }) {
	return (
		<button
			className={`w-full bg-destructive text-destructive-foreground py-2 rounded-lg ${color} text-white hover:bg-opacity-80`}
			type='button'
			{...props}
		>
			{children}
		</button>
	);
}
export default LongButton;
