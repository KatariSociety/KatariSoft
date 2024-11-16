import { useState } from "react";
import SettingSection from "./SettingSection";
import { Activity } from "lucide-react";

const TestType = () => {
  const [test, setTest] = useState(false);

  return (
    <SettingSection icon={Activity} title={"Configuración de prueba"}>
      <div className="flex items-center justify-between w-full">
        <span className="text-white">Defina el tipo de prueba a realizar</span>
        <button
          className={`px-3 py-1 rounded ${
            test ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          } transition duration-200`}
          onClick={() => setTest(!test)}
        >
          {test ? "Lanzamiento completo" : "Prueba unitaria"}
        </button>
      </div>
    </SettingSection>
  );
};

export default TestType;
