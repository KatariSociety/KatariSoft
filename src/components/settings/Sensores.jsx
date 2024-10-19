import { useState } from "react";
import SettingSection from "./SettingSection";
import { Bell } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";

const Sensores = () => {
	const [sensores, setSensores] = useState({
		gps: true,
		acelera: true,
		giro: true,
		temp: true,
		cam: false,
	});

	return (
		<SettingSection icon={Bell} title={"Activar sensores"}>
			<ToggleSwitch
				label={"GPS"}
				isOn={sensores.gps}
				onToggle={() => setSensores({ ...sensores, gps: !sensores.gps })}
			/>
			<ToggleSwitch
				label={"Temperatura"}
				isOn={sensores.temp}
				onToggle={() => setSensores({ ...sensores, temp: !sensores.temp })}
			/>
			<ToggleSwitch
				label={"Aceleración"}
				isOn={sensores.acelera}
				onToggle={() => setSensores({ ...sensores, acelera: !sensores.acelera })}
			/>
			<ToggleSwitch
				label={"Giroscopio"}
				isOn={sensores.giro}
				onToggle={() => setSensores({ ...sensores, giro: !sensores.giro })}
			/>
			<ToggleSwitch
				label={"Cámara"}
				isOn={sensores.cam}
				onToggle={() => setSensores({ ...sensores, cam: !sensores.cam })}
			/>
		</SettingSection>
	);
};
export default Sensores;
