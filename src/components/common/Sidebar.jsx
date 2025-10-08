import { BarChart2, ChevronsLeft, Settings, TrendingUp, TimerReset, Users, Rocket, LogIn } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import logoImage from '/images/katariLogo.png';

const Sidebar = ({ basePath = '' }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const SIDEBAR_ITEMS_TOP = [
        { name: "Tiempo Real", icon: TimerReset, color: "#3B82F6", href: `${basePath}/realtime` },
        { name: "Dashboard", icon: TrendingUp, color: "#6366f1", href: `${basePath}/dashboard` },
        { name: "Histórico", icon: BarChart2, color: "#8B5CF6", href: `${basePath}/historical` },
    ];

    const SIDEBAR_ITEMS_BOTTOM = [
        { name: "Settings", icon: Settings, color: "#6EE7B7", href: `${basePath}/settings` },
        { name: "Login", icon: LogIn, color: "#3B82F6", href: `${basePath}/login` },
    ];
    return (
        <motion.div
            className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0`}
            animate={{ width: isSidebarOpen ? 220 : 72 }}
        >
            <div className='h-full bg-gradient-to-b from-slate-900 to-gray-900/95 backdrop-blur-md p-4 flex flex-col border-r border-gray-800 shadow-xl'>
                <div className='flex items-center justify-between'>
                    <Link to={`${basePath}/`} className='flex items-center'>
                        <AnimatePresence mode="wait">
                            {isSidebarOpen ? (
                                <motion.img 
                                    key="logo"
                                    src={logoImage} 
                                    alt="Katari Logo" 
                                    className="w-10 h-10 object-cover rounded-md"
                                    initial={{ opacity: 0, rotate: -180 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 180 }}
                                    transition={{ duration: 0.35 }}
                                />
                            ) : (
                                <motion.div
                                    key="rocket"
                                    initial={{ opacity: 0, rotate: -180 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 180 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Rocket size={24} className="text-white-400" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.span
                                    className='ml-3 text-white text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 to-blue-200'
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.25, delay: 0.25 }}
                                >
                                    Katari
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                    <motion.button
                        whileHover={{ scale: 0.9 }}
                        whileTap={{ scale: 0.7 }}
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className='p-2 rounded-full hover:bg-gray-700/30 transition-colors max-w-fit'
                    >
                        <ChevronsLeft
                            size={20}
                            className={`text-white-400 transition-transform duration-300 ${
                                isSidebarOpen ? '' : 'rotate-180'
                            }`}
                        />
                    </motion.button>
                </div>

                {/* ...existing code... */}

                <nav className='mt-8 flex-grow'>
                    {SIDEBAR_ITEMS_TOP.map((item) => (
                        <Link key={item.href} to={item.href} title={item.name}>
                            <motion.div whileHover={{ x: 6 }} className='group flex items-center p-3 text-sm font-medium rounded-lg hover:bg-white/5 transition-colors mb-2'>
                                <div className='w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-white/3 group-hover:scale-105 transform transition-transform'>
                                    <item.icon size={18} style={{ color: item.color }} />
                                </div>
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            className='ml-1 whitespace-nowrap text-white'
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.18, delay: 0.12 }}
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    ))}
                </nav>

                <nav className='mt-auto'>
                    {SIDEBAR_ITEMS_BOTTOM.map((item) => (
                        <Link key={item.href} to={item.href} title={item.name}>
                            <motion.div whileHover={{ x: 6 }} className='group flex items-center p-3 text-sm font-medium rounded-lg hover:bg-white/5 transition-colors mb-2'>
                                <div className='w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-white/3 group-hover:scale-105 transform transition-transform'>
                                    <item.icon size={18} style={{ color: item.color }} />
                                </div>
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            className='ml-1 whitespace-nowrap text-white'
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.18, delay: 0.12 }}
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    ))}

                    {/* botón Equipo en la parte inferior */}
                    <div className='mt-4 pt-4 border-t border-gray-800'>
                        <Link to={`${basePath}/users`} title='Equipo'>
                            <motion.div whileHover={{ scale: 1.02 }} className='w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors'>
                                <div className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white shadow'>
                                    <Users size={18} />
                                </div>
                                {isSidebarOpen ? (
                                    <span className='text-white font-medium'>Equipo</span>
                                ) : (
                                    <span className='sr-only'>Equipo</span>
                                )}
                            </motion.div>
                        </Link>
                    </div>
                </nav>
            </div>
        </motion.div>
    );
};

export default Sidebar;