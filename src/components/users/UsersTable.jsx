import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Pencil, Trash2, Info } from "lucide-react";
import Alert from '../common/Alert';
import UserInfoModal from "./UserInfoModal";
import usersData from '../../context/UsersData.json';

const UsersTable = () => {
	const [showAlert, setShowAlert] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [users, setUsers] = useState([]);
	const [showInfoModal, setShowInfoModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	useEffect(() => {
		setUsers(usersData);
		setFilteredUsers(usersData);
	}, []);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = users.filter(
			(user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
		);
		setFilteredUsers(filtered);
	};

	const handleShowInfo = (user) => {
		setSelectedUser(user);
		setShowInfoModal(true);
	};

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0'>
				<h2 className='text-xl font-semibold text-gray-100 w-full sm:w-auto text-center sm:text-left mb-4 sm:mb-0'>
					Lista de integrantes
				</h2>
				<div className='relative w-full sm:w-auto'>
					<input
						type='text'
						placeholder='Buscar integrantes...'
						className='w-full sm:w-64 bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Name
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Email
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Role
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Status
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
						{filteredUsers.map((user) => (
							<motion.tr
								key={user.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										<div className='flex-shrink-0 h-10 w-10'>
											<div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
												{user.name.charAt(0)}
											</div>
										</div>
										<div className='ml-4'>
											<div className='text-sm font-medium text-gray-100'>{user.name}</div>
										</div>
									</div>
								</td>

								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>{user.email}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100'>
										{user.role}
									</span>
								</td>

								<td className='px-6 py-4 whitespace-nowrap'>
									<span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
											user.status === "Active"
												? "bg-green-800 text-green-100"
												: "bg-red-800 text-red-100"
										}`}
									>
										{user.status}
									</span>
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									<button className='text-indigo-400 hover:text-indigo-300 mr-2' onClick={() => setShowAlert(true)}>
										<Pencil size={20} />
									</button>
									<button className='text-red-400 hover:text-red-300 mr-2' onClick={() => setShowAlert(true)}>
										<Trash2 size={20} />
									</button>
									<button className='text-blue-400 hover:text-blue-300' onClick={() => handleShowInfo(user)}>
										<Info size={20} />
									</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
			<Alert
				title="Aviso"
				message="Inicie sesión para realizar esta acción"
				isVisible={showAlert}
				onClose={() => setShowAlert(false)}
			/>
			<UserInfoModal
				isVisible={showInfoModal}
				onClose={() => setShowInfoModal(false)}
				user={selectedUser}
			/>
		</motion.div>
	);
};
export default UsersTable;

