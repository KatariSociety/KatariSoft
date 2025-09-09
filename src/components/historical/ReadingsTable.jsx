import { motion } from 'framer-motion';

// Función para renderizar el valor de la lectura de forma legible
const renderValue = (value) => {
    if (typeof value !== 'object' || value === null) return String(value);
    if (value.error) return <span className="text-red-500">{value.error}: {value.raw}</span>;

    // Resumen genérico del objeto JSON
    return (
        <pre className="text-xs bg-gray-900/50 p-2 rounded overflow-x-auto">
            {JSON.stringify(value, null, 2)}
        </pre>
    );
};

const ReadingsTable = ({ data }) => {
    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <h3 className='text-lg font-semibold text-gray-100 mb-4'>Lecturas Registradas</h3>
            <div className='overflow-auto max-h-96'>
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead>
                        <tr>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Fecha y Hora</th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Sensor</th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Valores</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-700'>
                        {data.map(reading => (
                            <tr key={reading.id}>
                                <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-300'>{reading.date.toLocaleString()}</td>
                                <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-200 font-medium'>{reading.sensorName}</td>
                                <td className='px-4 py-3 text-sm text-gray-300'>{renderValue(reading.value)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default ReadingsTable;