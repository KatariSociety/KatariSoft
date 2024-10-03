import { motion } from "framer-motion";
import { Edit, Search, Trash2, Eye, Save, ShieldAlert, ShieldCheck, ShieldX, ArrowUp, ArrowDown  } from "lucide-react";
import { useState } from "react";
import { HISTORICAL_DATA } from './Historical_Data';

const HistoricalTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredHistorical, setFilteredHistorical] = useState(HISTORICAL_DATA);
    const [sortOrder, setSortOrder] = useState("asc");
    const [filterIcon, setFilterIcon] = useState("");

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


    const filterAndSortData = (term, icon, order) => {
        let filtered = HISTORICAL_DATA.filter(
            (history) =>
                (history.fecha.toLowerCase().includes(term)) &&
                (icon ? history.icon === icon : true)
        );

        filtered = filtered.sort((a, b) => {
            if (order === "asc") {
                return a.fecha.localeCompare(b.fecha);
            } else {
                return b.fecha.localeCompare(a.fecha);
            }
        });

        setFilteredHistorical(filtered);
    };

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold text-gray-100'>Registros almacenados</h2>
                <div className='flex items-center space-x-2'>
                    <div className='relative'>
                        <input
                            type='text'
                            placeholder='Buscar registro...'
                            className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            onChange={handleSearch}
                            value={searchTerm}
                        />
                        <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                    </div>
                    <button className='text-green-400 hover:text-green-300'>
                        <Save size={24} />
                    </button>
                </div>
            </div>

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
			</div>
			<div className='flex justify-between items-center mt-4'>
    			<div>
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

            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead>
                        <tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								<div className='flex items-center'>
									Fecha de la prueba
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
                                Aceleración promedio
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                Velocidad máxima
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                Altura
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                Temperatura
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className='divide-y divide-gray-700'>
						{currentItems.map((history) => {
							const IconComponent = history.icon;
							return (
								<motion.tr
									key={history.id}
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
										{history.fecha}
									</td>

									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										{history.aceleracion}
									</td>

									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{history.velocidad}</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{history.altura}</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{history.temperatura}</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										<div className='flex space-x-2'>
											<button className='text-blue-400 hover:text-blue-300'>
												<Eye size={18} />
											</button>
											<button className='text-green-400 hover:text-green-300'>
												<Save size={18} />
											</button>
											<button className='text-indigo-400 hover:text-indigo-300'>
												<Edit size={18} />
											</button>
											<button className='text-red-400 hover:text-red-300 '>
												<Trash2 size={18} />
											</button>
										</div>
									</td>
								</motion.tr>
							);
						})}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};
export default HistoricalTable;