import { useState } from 'react';
import { Settings } from "lucide-react";
import SettingSection from './SettingSection';
import { Plus } from "lucide-react";
import Alert from '../common/Alert';

const ConnectedAccounts = () => {
    const [showAlert, setShowAlert] = useState(false);

    return (
        <SettingSection icon={Settings} title={"Cuentas Conectadas"}>
            <button 
                onClick={() => setShowAlert(true)}
                className="mt-4 flex items-center text-indigo-400 hover:text-indigo-300 transition duration-200"
            >
            <Plus size={18} className="mr-2" /> Agregar Cuenta
            </button>

            <Alert 
                title="Aviso"
                message="Funcionalidad no disponible en este momento"
                isVisible={showAlert}
                onClose={() => setShowAlert(false)}
            />
        </SettingSection>
    );
};

export default ConnectedAccounts;