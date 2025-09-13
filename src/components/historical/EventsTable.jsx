import { motion } from "framer-motion";
import { PlusCircle, Edit } from "lucide-react";
import { useState } from "react";

// Placeholder para un futuro modal de edición/creación
const EventModal = ({ event, onClose, onSave }) => {
    // Lógica interna del modal (formularios, etc.)
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl text-white mb-4">{event ? "Editar Evento" : "Nuevo Evento"}</h2>
                <p className="text-gray-400">Funcionalidad de modal no implementada.</p>
                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

const EventsTable = ({ events, isLoading, error, onEventSelect, selectedEventId, onEventsUpdated }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const handleAddEvent = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };
    
    const handleSaveEvent = (eventData) => {
        console.log("Guardando evento:", eventData);
        // Aquí llamarías al servicio para guardar/actualizar
        // y luego a onEventsUpdated()
        setIsModalOpen(false);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'exitoso': return 'text-green-400';
            case 'fallido': return 'text-red-400';
            case 'en progreso': return 'text-yellow-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold text-gray-100'>Eventos Registrados</h2>
                <button
                    onClick={handleAddEvent}
                    className='flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors'
                >
                    <PlusCircle size={18} />
                    Añadir Evento
                </button>
            </div>

            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead>
                        <tr>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Nombre del Evento</th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Descripción</th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Fecha Inicio</th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Estado</th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-700'>
                        {isLoading && <tr><td colSpan="5" className="text-center py-4 text-gray-400">Cargando eventos...</td></tr>}
                        {error && <tr><td colSpan="5" className="text-center py-4 text-red-400">{error}</td></tr>}
                        {!isLoading && !error && events.map(event => (
                            <tr
                                key={event.id_evento}
                                onClick={() => onEventSelect(event)}
                                className={`cursor-pointer transition-colors ${selectedEventId === event.id_evento ? 'bg-blue-900/50' : 'hover:bg-gray-700/50'}`}
                            >
                                <td className='px-4 py-4 whitespace-nowrap text-sm text-white font-medium'>{event.nombre_evento}</td>
                                <td className='px-4 py-4 text-sm text-gray-300 max-w-sm truncate'>{event.descripcion_evento}</td>
                                <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-300'>{event.fecha_inicio_evento}</td>
                                <td className={`px-4 py-4 whitespace-nowrap text-sm font-semibold ${getStatusColor(event.estado_evento)}`}>{event.estado_evento}</td>
                                <td className='px-4 py-4 whitespace-nowrap text-sm'>
                                    <button onClick={(e) => { e.stopPropagation(); handleEditEvent(event); }} className='text-gray-400 hover:text-white'>
                                        <Edit size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <EventModal 
                    event={editingEvent} 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleSaveEvent} 
                />
            )}
        </motion.div>
    );
};

export default EventsTable;