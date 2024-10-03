import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const userData = [
	{ id: 1, name: "Sarah Cabeza", email: "integrante@example.com", role: "Mission leader", status: "Active" },
	{ id: 2, name: "Santiago Chaves", email: "integrante@example.com", role: "Technology Manager", status: "Active" },
	{ id: 3, name: "Alejandra Freire", email: "integrante@example.com", role: "Operations Manager", status: "Active" },
	{ id: 4, name: "Jarby Salazar", email: "integrante@example.com", role: "Safety Manager", status: "Active" },
	{ id: 5, name: "Esteban Yepez", email: "integrante@example.com", role: "Estación Terrena", status: "Active" },
	{ id: 6, name: "Eduar Cabrera", email: "integrante@example.com", role: "Propulsión", status: "Inactive" },
	{ id: 7, name: "Alejandro Patiño", email: "integrante@example.com", role: "Aeroestructura", status: "Active" },
	{ id: 8, name: "Laura García", email: "integrante@example.com", role: "Aeroestructura", status: "Active" },
	{ id: 9, name: "Jhonatan Becerra", email: "integrante@example.com", role: "Aviónica", status: "Active" },
	{ id: 10, name: "Jose Velasco ", email: "integrante@example.com", role: "Aviónica", status: "Active" },
	{ id: 11, name: "Joiner torres", email: "integrante@example.com", role: "Aviónica", status: "Active" },
	{ id: 12, name: "Maria Hurtado", email: "integrante@example.com", role: "Recuperación", status: "Active" },
	{ id: 13, name: "Elizabeth Muñoz", email: "integrante@example.com", role: "Recuperación", status: "Active" },
	{ id: 14, name: "Juliana Urrego", email: "integrante@example.com", role: "Marketing/Finanzas", status: "Active" },
	{ id: 15, name: "Juan Lozada", email: "integrante@example.com", role: "Marketing/Finanzas", status: "Active" },
	{ id: 16, name: "Oliver Davila", email: "integrante@example.com", role: "Marketing/Finanzas", status: "Active" },
];

const UsersTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUsers, setFilteredUsers] = useState(userData);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = userData.filter(
			(user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
		);
		setFilteredUsers(filtered);
	};

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Lista de integrantes</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Buscar integrantes...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
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
									<button className='text-indigo-400 hover:text-indigo-300 mr-2'>Edit</button>
									<button className='text-red-400 hover:text-red-300'>Delete</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};
export default UsersTable;
