import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Pencil, Mail } from "lucide-react";
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
				<div className='flex items-center gap-3'>
					<h2 className='text-2xl font-bold text-white'>Lista de integrantes</h2>
					<span className='px-2 py-1 text-xs bg-white/6 text-white rounded-full'>
						{filteredUsers.length} integrantes
					</span>
				</div>
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
							{filteredUsers.map((user) => {
								const isSelected = selectedUser && selectedUser.id === user.id && showInfoModal;
								return (
									<motion.tr
										key={user.id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3 }}
										onClick={() => handleShowInfo(user)}
										className={`cursor-pointer hover:bg-white/3 ${isSelected ? 'bg-white/5 ring-1 ring-white/10' : ''}`}
									>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										<div className='flex-shrink-0 h-12 w-12'>
											<div className='h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg shadow'>
												{user.name.charAt(0)}
											</div>
										</div>
										<div className='ml-4'>
											<div className='text-sm font-semibold text-gray-100'>{user.name}</div>
											<div className='text-xs text-gray-400'>{user.role}</div>
										</div>
									</div>
								</td>

								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>{user.email}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white'>
										{user.role}
									</span>
								</td>

								<td className='px-6 py-4 whitespace-nowrap'>
									<span className='inline-flex items-center gap-2'>
										<span className={`w-3 h-3 rounded-full ${user.status === 'Active' ? 'bg-green-400' : 'bg-red-400'}`} />
										<span className='text-xs text-gray-300 font-semibold'>{user.status}</span>
									</span>
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									<button className='text-indigo-400 hover:text-indigo-300 mr-2' onClick={(e) => { e.stopPropagation(); setShowAlert(true); }}>
										<Pencil size={20} />
									</button>
									{/* botón Borrar eliminado */}
									<button
										className='text-cyan-400 hover:text-cyan-300'
										onClick={(e) => { 
											e.stopPropagation();
											const subject = encodeURIComponent('Contacto desde Katari');
											const body = encodeURIComponent(`Hola ${user.name},%0D%0A%0D%0A`);
											window.location.href = `mailto:${user.email}?subject=${subject}&body=${body}`;
										}}
										aria-label={`Enviar correo a ${user.email}`}
									>
										<Mail size={20} />
									</button>
								</td>
							</motion.tr>
						)})}
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

