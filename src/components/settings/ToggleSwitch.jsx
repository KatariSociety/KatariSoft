import { Settings } from "lucide-react";

const ToggleSwitch = ({ label, isOn, onToggle, onSettingsClick }) => {
	return (
		<div className="flex items-center justify-between py-3">
			<span className="text-gray-300">{label}</span>
			<div className="flex items-center space-x-2">
				<button
					className={`
						relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none
						${isOn ? "bg-green-600" : "bg-gray-600"}
					`}
					onClick={onToggle}
				>
					<span
						className={`inline-block size-4 transform transition-transform bg-white rounded-full 
							${isOn ? "translate-x-6" : "translate-x-1"}
						`}
					/>
				</button>
				<button
					className="text-indigo-600 hover:text-indigo-400 transition duration-200"
					onClick={onSettingsClick}
				>
					<Settings size={18} />
				</button>
			</div>
		</div>
	);
};

export default ToggleSwitch;

