import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "../components/common/Header";
import EventsTable from "../components/historical/EventsTable";
import ReadingsView from "../components/historical/ReadingsView";
import eventoService from "../services/eventoService";

const HistoricalPage = () => {
	const [events, setEvents] = useState([]);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchEvents = async () => {
		try {
			setLoading(true);
			const result = await eventoService.obtenerEventos();
			//console.log("Respuesta del servicio de eventos:", result);
			if (result.body && result.body.success) {
				setEvents(result.body.data);
			} else {
				setError(result.body.message || "No se pudieron cargar los eventos.");
			}
		} catch (err) {
			setError("Error de conexión al obtener eventos.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchEvents();
	}, []);

	const handleEventSelect = (event) => {
		// Si se hace clic en el mismo evento, se deselecciona para ocultar las lecturas
		if (selectedEvent && selectedEvent.id_evento === event.id_evento) {
			setSelectedEvent(null);
		} else {
			setSelectedEvent(event);
		}
	};

	// Función para refrescar la tabla de eventos después de añadir/editar
	const handleEventsUpdated = () => {
		fetchEvents();
	};

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Histórico de Eventos' />
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<EventsTable
					events={events}
					isLoading={loading}
					error={error}
					onEventSelect={handleEventSelect}
					selectedEventId={selectedEvent?.id_evento}
					onEventsUpdated={handleEventsUpdated}
				/>

				{/* Vista de Lecturas y Gráficas que aparece al seleccionar un evento */}
				{selectedEvent && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="mt-8"
					>
						<ReadingsView
							key={selectedEvent.id_evento} // Forzar re-renderizado si cambia el evento
							event={selectedEvent}
						/>
					</motion.div>
				)}
			</main>
		</div>
	);
};

export default HistoricalPage;