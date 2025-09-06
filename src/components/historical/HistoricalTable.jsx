import { motion } from "framer-motion";
import { Search, Trash2, Eye, Save, ShieldAlert, ShieldCheck, ShieldX, ArrowUp, ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import Alert from '../common/Alert';
import sensoresService from "../../services/sensoresService";

/**
 * Tabla de historial de lecturas
 * @returns Tabla de historial de lecturas
 */
const HistoricalTable = ({ initialData, isLoading, dataError, onFilterSubmit }) => {
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("Acción no disponible."); // Para mensajes de alerta dinámicos
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredHistorical, setFilteredHistorical] = useState([]);
	const [sortOrder, setSortOrder] = useState("asc");
	const [filterIcon, setFilterIcon] = useState("");
	const [sensorNames, setSensorNames] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredHistorical.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filteredHistorical.length / itemsPerPage);
	const [sensorIdFilter, setSensorIdFilter] = useState("");
	const [eventoIdFilter, setEventoIdFilter] = useState("");
	const [detailItem, setDetailItem] = useState(null);
	const [showDetailModal, setShowDetailModal] = useState(false);

	const exportToCSV = () => {
		const headers = ["ID", "Sensor ID", "Evento ID", "Fecha", "Valor"];
		if (filteredHistorical.length === 0) {
			setAlertMessage("No hay datos para exportar.");
			setShowAlert(true);
			return;
		}
		const csvContent = [
			headers.join(","),
			...filteredHistorical.map(item =>
				[
					item.id_lectura,
					item.id_sensor,
					item.id_evento,
					item.fecha_lectura,
					`"${item.valor_lectura.replace(/"/g, '""')}"`
				].join(",")
			)
		].join("\n");
		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "lecturas_data.csv";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	useEffect(() => {
		const loadSensorNames = async () => {
			if (initialData && initialData.length > 0) {
				const uniqueSensorIds = [...new Set(initialData.map(item => item.id_sensor))];
				const newSensorNames = { ...sensorNames };
				let updated = false;

				for (const id of uniqueSensorIds) {
					if (!newSensorNames[id]) {
						try {
							const result = await sensoresService.obtenerSensorPorId(id);
							if (result.error === false && result.body.success && result.body.data.length > 0) {
								newSensorNames[id] = result.body.data[0].nombre_sensor;
								updated = true;
							} else {
								newSensorNames[id] = `Sensor ${id}`;
							}
						} catch (err) {
							console.error(`Error al obtener nombre del sensor ${id}:`, err);
							newSensorNames[id] = `Sensor ${id}`;
						}
					}
				}
				if (updated) {
					setSensorNames(newSensorNames);
				}
			}
		};
		if (!isLoading && initialData) {
			loadSensorNames();
		}
	}, [initialData, isLoading]);

	/**
	 * Actualiza filteredHistorical cuando initialData, searchTerm, filterIcon, o sortOrder cambien
	 */
	useEffect(() => {
		if (initialData) {
			filterAndSortData(searchTerm, filterIcon, sortOrder, initialData);
		} else {
			setFilteredHistorical([]); // Si no hay initialData, limpiar filtrados
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialData, searchTerm, filterIcon, sortOrder]); // Re-ejecutar cuando cambien estos

	/**
	 * Maneja la búsqueda de lecturas
	 * @param {*} e evento de búsqueda
	 */
	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		// El useEffect se encargará de re-filtrar
	};

	/**
	 * Maneja el ordenamiento de las lecturas
	 */
	const handleSort = () => {
		const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
		setSortOrder(newSortOrder);
		// El useEffect se encargará de re-ordenar
	};

	const handleFilterIcon = (icon) => {
		setFilterIcon(icon);
		setCurrentPage(1); // Resetear a primera página al cambiar filtro
		// El useEffect se encargará de re-filtrar
	};

	const handleItemsPerPageChange = (e) => {
		setItemsPerPage(Number(e.target.value));
		setCurrentPage(1); // Resetear a primera página
	};

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const determineIcon = (item) => {
		try {
			if (!item.valor_lectura || !item.valor_lectura.startsWith('{')) {
				return ShieldAlert;
			}
			const valor = JSON.parse(item.valor_lectura);
			if (valor.temperature || valor.pressure || valor.location || valor.speed || valor.accelerometer || valor.gyroscope) {
				return ShieldCheck;
			}
			return ShieldX;
		} catch (e) {
			return ShieldAlert;
		}
	};

	const filterAndSortData = (term, iconType, order, dataToProcess) => {
		if (!dataToProcess) return;

		let filtered = dataToProcess.filter(
			(history) =>
				((sensorNames[history.id_sensor] || String(history.id_sensor)).toLowerCase().includes(term) ||
					(String(history.id_evento)).toLowerCase().includes(term) ||
					new Date(history.fecha_lectura).toLocaleString().toLowerCase().includes(term) ||
					history.valor_lectura.toLowerCase().includes(term)
				) &&
				(iconType ? determineIcon(history) === iconType : true)
		);

		filtered = filtered.sort((a, b) => {
			const dateA = new Date(a.fecha_lectura);
			const dateB = new Date(b.fecha_lectura);
			if (order === "asc") {
				return dateA - dateB;
			} else {
				return dateB - dateA;
			}
		});
		setFilteredHistorical(filtered);
		if (currentPage > Math.ceil(filtered.length / itemsPerPage) && filtered.length > 0) {
			setCurrentPage(Math.ceil(filtered.length / itemsPerPage));
		} else if (filtered.length === 0) {
			setCurrentPage(1);
		}
	};

	const renderLecturaValue = (valorStr) => {
		try {
			if (!valorStr || !valorStr.startsWith('{')) {
				return valorStr || "N/A";
			}

			const valor = JSON.parse(valorStr);
			if (valor.temperature && valor.pressure && valor.altitude) {
				return `Temp: ${valor.temperature.value}${valor.temperature.unit}, Pres: ${valor.pressure.value}${valor.pressure.unit}, Alt: ${valor.altitude.value}${valor.altitude.unit}`;
			} else if (valor.location && valor.location.altitude) {
				return `GPS: ${valor.location.latitude}, ${valor.location.longitude}, HDOP: ${valor.hdop || 'N/A'}, Sat: ${valor.satellites || 'N/A'}, Alt: ${valor.location.altitude.value}${valor.location.altitude.unit}`;
			} else if (valor.accelerometer && valor.gyroscope && valor.magnetometer) {
				return `Accel: X=${valor.accelerometer.x.value},Y=${valor.accelerometer.y.value},Z=${valor.accelerometer.z.value}; Gyro: X=${valor.gyroscope.x.value},Y=${valor.gyroscope.y.value},Z=${valor.gyroscope.z.value}; Mag: X=${valor.magnetometer.x.value},Y=${valor.magnetometer.y.value},Z=${valor.magnetometer.z.value}`;
			} else {
				// Si no coincide con formatos conocidos, mostrar un resumen genérico
				const keys = Object.keys(valor);
				if (keys.length > 0) {
					return keys.slice(0, 2).map(key => `${key}: ${JSON.stringify(valor[key])}`).join(', ') + (keys.length > 2 ? '...' : '');
				}
				return "Datos JSON complejos";
			}
		} catch (e) {
			return "Error al procesar datos";
		}
	};

	const handleViewDetails = (item) => {
		setDetailItem(item);
		setShowDetailModal(true);
	};

	const handleDeleteClick = (item) => { // Placeholder para borrado
		// Aquí iría la lógica para borrar el item, ej: llamar a un servicio
		console.log("Borrar item:", item.id_lectura);
		setAlertMessage(`La funcionalidad de borrar el item ${item.id_lectura} no está implementada.`);
		setShowAlert(true);
	};


	const formatJsonIfPossible = (jsonStr) => {
		try {
			if (!jsonStr || !jsonStr.startsWith('{')) return jsonStr || "";
			const obj = JSON.parse(jsonStr);
			return JSON.stringify(obj, null, 2);
		} catch (e) {
			return jsonStr;
		}
	};

	const handleApplyServerFilters = () => {
		onFilterSubmit({ sensorId: sensorIdFilter, eventoId: eventoIdFilter });
	};

    const handleClearServerFilters = () => {
        setSensorIdFilter("");
        setEventoIdFilter("");
        onFilterSubmit({});
    }

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			{/*Busqueda */}
			<div className='flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0'>
				<h2 className='text-xl font-semibold text-gray-100 w-full sm:w-auto text-center sm:text-left mb-4 sm:mb-0'>
					Registros almacenados
				</h2>
				<div className='flex w-full sm:w-auto items-center gap-2'>
					<div className='relative flex-1 sm:flex-none'>
						<input
							type='text'
							placeholder='Buscar registro...'
							className='w-full sm:w-64 bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
							onChange={handleSearch}
							value={searchTerm}
						/>
						<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
					</div>
					<motion.button
						title="Exportar CSV (filtrado)"
						className='min-w-[40px] h-[40px] bg-gray-700 hover:bg-gray-600 text-green-400 hover:text-green-300 rounded-lg transition-colors flex items-center justify-center'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={exportToCSV}
					>
						<Save size={20} />
					</motion.button>
				</div>
			</div>
			
			{/*Filtros de servidor*/}
			<div className='flex flex-col sm:flex-row justify-start items-center mb-6 gap-4 p-4 bg-gray-900/50 rounded-lg'>
				<span className="text-gray-300 font-medium">Filtros Avanzados:</span>
				<div className='relative'>
					<input
						type='text'
						placeholder='ID del Sensor'
						className='w-full sm:w-40 bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={sensorIdFilter}
						onChange={(e) => setSensorIdFilter(e.target.value)}
					/>
				</div>
				<div className='relative'>
					<input
						type='text'
						placeholder='ID del Evento'
						className='w-full sm:w-40 bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={eventoIdFilter}
						onChange={(e) => setEventoIdFilter(e.target.value)}
					/>
				</div>
				<motion.button
					className='px-4 h-[40px] bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center justify-center'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleApplyServerFilters}
				>
					Aplicar Filtros
				</motion.button>
                <motion.button
					className='px-4 h-[40px] bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors flex items-center justify-center'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleClearServerFilters}
				>
					Limpiar
				</motion.button>
			</div>

			{/*Filtros*/}
			<div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-4'>
				<div className='flex space-x-2'>
					<button
						title="Filtrar Culminadas"
						onClick={() => handleFilterIcon(ShieldCheck)}
						className={`p-2 rounded-full ${filterIcon === ShieldCheck ? 'bg-green-500 text-white shadow-lg' : 'text-green-400 hover:text-green-300'}`}
					>
						<ShieldCheck size={24} />
					</button>
					<button
						title="Filtrar Con Errores"
						onClick={() => handleFilterIcon(ShieldAlert)}
						className={`p-2 rounded-full ${filterIcon === ShieldAlert ? 'bg-yellow-500 text-white shadow-lg' : 'text-yellow-400 hover:text-yellow-300'}`}
					>
						<ShieldAlert size={24} />
					</button>
					<button
						title="Filtrar Fallidas"
						onClick={() => handleFilterIcon(ShieldX)}
						className={`p-2 rounded-full ${filterIcon === ShieldX ? 'bg-red-500 text-white shadow-lg' : 'text-red-400 hover:text-red-300'}`}
					>
						<ShieldX size={24} />
					</button>
					<button
						title="Mostrar Todos"
						onClick={() => handleFilterIcon("")}
						className={`p-2 rounded-lg ${filterIcon === "" ? 'bg-gray-500 text-white shadow-lg' : 'text-gray-400 hover:text-gray-300'}`}
					>
						Todos
					</button>
				</div>
			</div >


			{/*Tabla */}
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					{/*cabecera de tabla */}
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								<div className='flex items-center cursor-pointer' onClick={handleSort}>
									Fecha de lectura
									<button className='ml-2 bg-transparent border-none p-0'>
										{sortOrder === "asc" ? (
											<ArrowUp className='text-gray-400 hover:text-gray-300' size={18} />
										) : (
											<ArrowDown className='text-gray-400 hover:text-gray-300' size={18} />
										)}
									</button>
								</div>
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Sensor
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								ID Evento
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Valores (resumen)
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Acciones
							</th>
						</tr>
					</thead>
					{/*cuerpo de tabla */}
					<tbody className='divide-y divide-gray-700'>
						{isLoading ? (
							<tr>
								<td colSpan="5" className="text-center py-4 text-gray-400">
									Cargando datos...
								</td>
							</tr>
						) : dataError ? (
							<tr>
								<td colSpan="5" className="text-center py-4 text-red-400">
									{dataError}
								</td>
							</tr>
						) : currentItems.length === 0 ? (
							<tr>
								<td colSpan="5" className="text-center py-4 text-gray-400">
									No hay datos disponibles que coincidan con los filtros.
								</td>
							</tr>
						) : (
							currentItems.map((item) => {
								const IconComponent = determineIcon(item);
								return (
									<motion.tr
										key={item.id_lectura}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3 }}
										className="hover:bg-gray-700/50"
									>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300 flex items-center'>
											<IconComponent
												className='mr-2 flex-shrink-0'
												color={
													IconComponent === ShieldCheck
														? '#10B981' // Verde
														: IconComponent === ShieldAlert
															? '#F59E0B' // Naranja/Amarillo
															: '#EF4444'  // Rojo
												}
												size={18}
											/>
											{new Date(item.fecha_lectura).toLocaleString()}
										</td>

										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
											{sensorNames[item.id_sensor] || `ID: ${item.id_sensor}`}
										</td>

										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
											{item.id_evento}
										</td>

										<td className='px-6 py-4 text-sm text-gray-300 max-w-xs truncate' title={renderLecturaValue(item.valor_lectura)}>
											{renderLecturaValue(item.valor_lectura)}
										</td>

										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
											<div className='flex space-x-2'>
												<button
													title="Ver detalles"
													className='text-blue-400 hover:text-blue-300'
													onClick={() => handleViewDetails(item)}
												>
													<Eye size={18} />
												</button>
												{/* <button
													title="Guardar item (no implementado)"
													className='text-green-400 hover:text-green-300'
													// onClick={() => handleExportSingle(item)} // Comentado porque no está implementado
												>
													<Save size={18} />
												</button> */}
												<button
													title="Eliminar item (no implementado)"
													className='text-red-400 hover:text-red-300'
													onClick={() => handleDeleteClick(item)}
												>
													<Trash2 size={18} />
												</button>
											</div>
										</td>
									</motion.tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>

			{/* Controles de paginación */}
			<div className='flex justify-between items-center mt-6'>
				<div>
					<label htmlFor="itemsPerPage" className='text-gray-400'>Mostrar: </label>
					<select
						id="itemsPerPage"
						value={itemsPerPage}
						onChange={handleItemsPerPageChange}
						className='bg-gray-700 text-white rounded-lg p-2 ml-2'
					>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={15}>15</option>
						<option value={50}>50</option>
					</select>
				</div>
				<span className="text-gray-400 text-sm">
					Mostrando {currentItems.length > 0 ? indexOfFirstItem + 1 : 0}-
					{Math.min(indexOfLastItem, filteredHistorical.length)} de {filteredHistorical.length} registros
				</span>
				<div className='flex gap-x-1'>
					<button
						onClick={() => handlePageChange(1)}
						disabled={currentPage === 1}
						className={`px-3 py-1 rounded text-sm ${currentPage === 1 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
					>
						{"<<"}
					</button>
					<button
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className={`px-3 py-1 rounded text-sm ${currentPage === 1 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
					>
						{"<"}
					</button>
					{/* Generar botones de página dinámicamente puede ser complejo, un simple indicador de página es más fácil */}
					<span className="px-3 py-1 rounded bg-blue-500 text-white text-sm">
						{currentPage} / {totalPages > 0 ? totalPages : 1}
					</span>
					<button
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages || totalPages === 0}
						className={`px-3 py-1 rounded text-sm ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
					>
						{">"}
					</button>
					<button
						onClick={() => handlePageChange(totalPages)}
						disabled={currentPage === totalPages || totalPages === 0}
						className={`px-3 py-1 rounded text-sm ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
					>
						{">>"}
					</button>
				</div>
			</div>

			{showDetailModal && detailItem && (
				<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
					<motion.div
						className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 border border-gray-700 shadow-2xl"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
					>
						<h3 className="text-xl font-semibold text-white mb-4">Detalles de la lectura</h3>
						<div className="mb-4 space-y-1">
							<p className="text-gray-300"><span className="font-medium text-gray-100">ID Lectura:</span> {detailItem.id_lectura}</p>
							<p className="text-gray-300"><span className="font-medium text-gray-100">Sensor:</span> {sensorNames[detailItem.id_sensor] || `ID: ${detailItem.id_sensor}`}</p>
							<p className="text-gray-300"><span className="font-medium text-gray-100">Evento:</span> {detailItem.id_evento}</p>
							<p className="text-gray-300"><span className="font-medium text-gray-100">Fecha:</span> {new Date(detailItem.fecha_lectura).toLocaleString()}</p>
						</div>
						<h4 className="text-md font-medium text-gray-100 mb-2">Valor Lectura (JSON):</h4>
						<div className="bg-gray-900 p-4 rounded-lg overflow-auto max-h-60 border border-gray-700">
							<pre className="text-gray-300 whitespace-pre-wrap break-words text-sm">
								{formatJsonIfPossible(detailItem.valor_lectura)}
							</pre>
						</div>
						<div className="mt-6 flex justify-end">
							<button
								className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
								onClick={() => setShowDetailModal(false)}
							>
								Cerrar
							</button>
						</div>
					</motion.div>
				</div>
			)}
			<Alert
				title="Aviso"
				message={alertMessage}
				isVisible={showAlert}
				onClose={() => setShowAlert(false)}
			/>
		</motion.div>
	);
};

export default HistoricalTable;