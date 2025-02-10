import { useState } from "react";
import SettingSection from "./SettingSection";
import { Bell, Plus, Settings } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import Alert from '../common/Alert';

const Sensores = () => {
	const [sensores, setSensores] = useState({
		gps: true,
		barometro: true,
		giroscopio: true,
		aire: true,
		camara: false,
	});
	const [showAlert, setShowAlert] = useState(false);
	const handleSettingsClick = (sensorlabel) => {
		alert(`Configuración de ${sensorlabel} en construcción`);
	};

	const sensorList = [
		{ label: "GY-NEO 6M", key: "gps" },
		{ label: "BMP280", key: "barometro" },
		{ label: "MPU-9250", key: "giroscopio" },
		{ label: "CCS811", key: "aire" },
		{ label: "Cámara Multiespectral", key: "camara" },
	];

	return (
		<SettingSection icon={Bell} title={"Gestión sensores"}>
			{sensorList.map((sensor) => (
				<ToggleSwitch
					key={sensor.key}
					label={sensor.label}
					isOn={sensores[sensor.key]}
					onToggle={() =>
						setSensores((prev) => ({
							...prev,
							[sensor.key]: !prev[sensor.key],
						}))
					}
					onSettingsClick={() => handleSettingsClick(sensor.label)}
				/>
			))}
			<button 
                onClick={() => setShowAlert(true)}
                className="mt-4 flex items-center text-indigo-400 hover:text-indigo-300 transition duration-200"
            >
            <Plus size={18} className="mr-2" /> Agregar Sensor
            </button>

            <Alert 
                title="Aviso"
                message="Inicie sesión para adicionar sensores"
                isVisible={showAlert}
                onClose={() => setShowAlert(false)}
            />
		</SettingSection>
	);
};

export default Sensores;
