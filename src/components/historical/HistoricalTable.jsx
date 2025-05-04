import { motion } from "framer-motion";
import { Search, Trash2, Eye, Save, ShieldAlert, ShieldCheck, ShieldX, ArrowUp, ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import Alert from '../common/Alert';
import lecturasService from "../../services/lecturasService";
import sensoresService from "../../services/sensoresService";


// Función para exportar los datos en CSV
const exportToCSV = () => {
	const headers = ["ID", "Sensor ID", "Evento ID", "Fecha", "Valor"];

	// Convertir datos a formato CSV
	const csvContent = [
		headers.join(","), // Encabezados
		...historicalData.map(item =>
			[
				item.id_lectura,
				item.id_sensor,
				item.id_evento,
				item.fecha_lectura,
				`"${item.valor_lectura.replace(/"/g, '""')}"` // Escapar comillas
			].join(",")
		)
	].join("\n");

	// Crear un Blob y generar la URL de descarga
	const blob = new Blob([csvContent], { type: "text/csv" });
	const url = URL.createObjectURL(blob);

	// Crear un enlace de descarga
	const link = document.createElement("a");
	link.href = url;
	link.download = "lecturas_data.csv";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

const HistoricalTable = () => {
	const [showAlert, setShowAlert] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredHistorical, setFilteredHistorical] = useState([]);
	const [sortOrder, setSortOrder] = useState("asc");
	const [filterIcon, setFilterIcon] = useState("");
	const [historicalData, setHistoricalData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [sensorNames, setSensorNames] = useState({});

	// Efecto para cargar los nombres de los sensores cuando cambian los datos
	useEffect(() => {
		const loadSensorNames = async () => {
			if (historicalData.length > 0) {
				const uniqueSensorIds = [...new Set(historicalData.map(item => item.id_sensor))];
				const newSensorNames = { ...sensorNames };
				let updated = false;

				for (const id of uniqueSensorIds) {
					if (!newSensorNames[id]) {
						try {
							const result = await sensoresService.obtenerSensorPorId(id);
							//console.log("resultado de nombres en servicio", result.body.data);
							if (result.error === false && result.body.success) {
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

		loadSensorNames();
	}, [historicalData]); // Solo depende de historicalData

	// Obtener valores de lectura 
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const result = await lecturasService.obtenerLecturas();
				//console.log("resultado del servicio ", result);
				if (result.error === false && result.body.success) {
					setHistoricalData(result.body.data);
					setFilteredHistorical(result.body.data);// Actualizar también los datos filtrados
				} else {
					setError("Error al cargar datos");
				}
			} catch (err) {
				setError("Error de conexión");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);


	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		filterAndSortData(term, filterIcon, sortOrder);
	};

	const handleSort = () => {
		const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
		setSortOrder(newSortOrder);
		filterAndSortData(searchTerm, filterIcon, newSortOrder);
	};

	const handleFilterIcon = (icon) => {
		setFilterIcon(icon);
		filterAndSortData(searchTerm, icon, sortOrder);
	};

	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const handleItemsPerPageChange = (e) => {
		setItemsPerPage(Number(e.target.value));
		setCurrentPage(1);
	};
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredHistorical.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filteredHistorical.length / itemsPerPage);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const determineIcon = (item) => {
		try {
			// Si es texto plano o no es JSON válido, devolver icono de alerta
			if (!item.valor_lectura.startsWith('{')) {
				return ShieldAlert;
			}

			const valor = JSON.parse(item.valor_lectura);

			// Determinar icono según el contenido
			if (valor.temperature || valor.pressure) {
				return ShieldCheck;
			} else if (valor.location || valor.speed) {
				return ShieldCheck;
			} else if (valor.accelerometer || valor.gyroscope) {
				return ShieldCheck;
			} else {
				return ShieldX;
			}
		} catch (e) {
			return ShieldAlert; // Error al parsear JSON
		}
	};

	const filterAndSortData = (term, icon, order) => {
		let filtered = historicalData.filter(
			(history) =>
				(history.fecha_lectura.toLowerCase().includes(term)) &&
				(icon ? determineIcon(history) === icon : true)
		);

		filtered = filtered.sort((a, b) => {
			if (order === "asc") {
				return a.fecha_lectura.localeCompare(b.fecha_lectura);
			} else {
				return b.fecha_lectura.localeCompare(a.fecha_lectura);
			}
		});

		setFilteredHistorical(filtered);
	};

	const renderLecturaValue = (valorStr) => {
		try {
			//console.log("valor origin: ", valorStr);
			if (!valorStr.startsWith('{')) {
				return valorStr; // Retornar texto plano si no es JSON
			}

			const valor = JSON.parse(valorStr);
			//console.log("valor JSON.parse() ", valor);
			// Crear una versión resumida para mostrar en la tabla
			if (valor.temperature) {
				return `Temperatura: ${valor.temperature.value}${valor.temperature.unit}, 
						Presión: ${valor.pressure.value}${valor.pressure.unit}
						altitud: ${valor.altitude.value}${valor.altitude.unit}`;
			} else if (valor.location) {
				return `GPS: ${valor.location.latitude}, ${valor.location.longitude}, 
						HDOP: ${valor.hdop || 'N/A'},
						Satelites: ${valor.satellites},
						Altitud: ${valor.location.altitude.value}${valor.location.altitude.unit}`;
			} else if (valor.accelerometer) {
				return `Acelerómetro: x=${valor.accelerometer.x.value}, y=${valor.accelerometer.y.value}, z=${valor.accelerometer.z.value},
						Giroscopio: x=${valor.gyroscope.x.value}, y=${valor.gyroscope.y.value}, z=${valor.gyroscope.z.value},
						Magnetómetro: x=${valor.magnetometer.x.value}, y=${valor.magnetometer.y.value}, z=${valor.magnetometer.z.value}`;
			} else {
				return "Datos personalizados";
			}
		} catch (e) {
			return "Error al procesar datos";
		}
	};

	const [detailItem, setDetailItem] = useState(null);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const handleViewDetails = (item) => {
		setDetailItem(item);
		setShowDetailModal(true);
	};

	const formatJsonIfPossible = (jsonStr) => {
		try {
			if (!jsonStr.startsWith('{')) return jsonStr;
			const obj = JSON.parse(jsonStr);
			return JSON.stringify(obj, null, 2);
		} catch (e) {
			return jsonStr;
		}
	};

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
						className='min-w-[40px] h-[40px] bg-gray-700 hover:bg-gray-600 text-green-400 hover:text-green-300 rounded-lg transition-colors flex items-center justify-center'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={exportToCSV}
					>
						<Save size={20} />
					</motion.button>
				</div>
			</div>

			{/*Paginacion*/}
			<div className='flex justify-between items-center mb-6'>
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
				<div className='flex space-x-2 ml-auto'>
					<button
						onClick={() => handleFilterIcon(ShieldCheck)}
						className={`p-2 rounded-full ${filterIcon === ShieldCheck ? 'bg-green-500 text-white shadow-lg' : 'text-green-400 hover:text-green-300'}`}
					>
						<ShieldCheck size={24} />
					</button>
					<button
						onClick={() => handleFilterIcon(ShieldAlert)}
						className={`p-2 rounded-full ${filterIcon === ShieldAlert ? 'bg-orange-500 text-white shadow-lg' : 'text-orange-400 hover:text-orange-300'}`}
					>
						<ShieldAlert size={24} />
					</button>
					<button
						onClick={() => handleFilterIcon(ShieldX)}
						className={`p-2 rounded-full ${filterIcon === ShieldX ? 'bg-red-500 text-white shadow-lg' : 'text-red-400 hover:text-red-300'}`}
					>
						<ShieldX size={24} />
					</button>
					<button
						onClick={() => handleFilterIcon("")}
						className={`p-2 rounded-full ${filterIcon === "" ? 'bg-gray-500 text-white shadow-lg' : 'text-gray-400 hover:text-gray-300'}`}
					>
						Todos
					</button>
				</div>
			</div >
			<div className='flex justify-between items-center mt-4'>
				<div className='flex gap-x-2'>
					{Array.from({ length: totalPages }, (_, index) => (
						<button
							key={index}
							onClick={() => handlePageChange(index + 1)}
							className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
						>
							{index + 1}
						</button>
					))}
				</div>
			</div>

			{/*Tabla */}
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					{/*cabecera de tabla */}
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								<div className='flex items-center'>
									Fecha de lectura
									<button onClick={handleSort} className='ml-2'>
										{sortOrder === "asc" ? (
											<ArrowUp className='text-gray-400 hover:text-gray-300' size={18} />
										) : (
											<ArrowDown className='text-gray-400 hover:text-gray-300' size={18} />
										)}
									</button>
								</div>
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								ID Sensor
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								ID Evento
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Valores
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Acciones
							</th>
						</tr>
					</thead>
					{/*cuerpo de tabla */}
					<tbody className='divide-y divide-gray-700'>
						{loading ? (
							<tr>
								<td colSpan="5" className="text-center py-4 text-gray-400">
									Cargando datos...
								</td>
							</tr>
						) : error ? (
							<tr>
								<td colSpan="5" className="text-center py-4 text-red-400">
									{error}
								</td>
							</tr>
						) : currentItems.length === 0 ? (
							<tr>
								<td colSpan="5" className="text-center py-4 text-gray-400">
									No hay datos disponibles
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
									>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300 flex items-center'>
											<IconComponent
												className='mr-2'
												color={
													IconComponent === ShieldCheck
														? 'green'
														: IconComponent === ShieldAlert
															? 'orange'
															: 'red'
												}
												size={18}
											/>
											{new Date(item.fecha_lectura).toLocaleString()}
										</td>

										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
											{sensorNames[item.id_sensor] || item.id_sensor}
										</td>

										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
											{item.id_evento}
										</td>

										<td className='px-6 py-4 text-sm text-gray-300 max-w-xs truncate'>
											{renderLecturaValue(item.valor_lectura)}
										</td>

										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
											<div className='flex space-x-2'>
												<button
													className='text-blue-400 hover:text-blue-300'
													onClick={() => handleViewDetails(item)}
												>
													<Eye size={18} />
												</button>
												<button
													className='text-green-400 hover:text-green-300'
													onClick={() => handleExportSingle(item)}
												>
													<Save size={18} />
												</button>
												<button
													className='text-red-400 hover:text-red-300'
													onClick={() => setShowAlert(true)}
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
			{showDetailModal && detailItem && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<motion.div
						className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
					>
						<h3 className="text-xl font-semibold text-white mb-4">Detalles de la lectura</h3>
						<div className="mb-4">
							<p className="text-gray-300"><span className="font-medium">ID:</span> {detailItem.id_lectura}</p>
							<p className="text-gray-300"><span className="font-medium">Sensor:</span> {detailItem.id_sensor}</p>
							<p className="text-gray-300"><span className="font-medium">Evento:</span> {detailItem.id_evento}</p>
							<p className="text-gray-300"><span className="font-medium">Fecha:</span> {new Date(detailItem.fecha_lectura).toLocaleString()}</p>
						</div>
						<div className="bg-gray-700 p-4 rounded-lg overflow-auto max-h-60">
							<pre className="text-gray-300 whitespace-pre-wrap break-words">
								{formatJsonIfPossible(detailItem.valor_lectura)}
							</pre>
						</div>
						<div className="mt-4 flex justify-end">
							<button
								className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
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
				message="Inicie sesión para realizar esta acción"
				isVisible={showAlert}
				onClose={() => setShowAlert(false)}
			/>
		</motion.div>
	);
};
export default HistoricalTable;