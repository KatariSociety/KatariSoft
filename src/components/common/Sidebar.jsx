import { BarChart2, ChevronsLeft, Settings, TrendingUp, TimerReset, Users, Rocket, LogIn } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import logoImage from '/images/katariLogo.png';

const SIDEBAR_ITEMS_TOP = [
    { name: "Tiempo Real", icon: TimerReset, color: "#3B82F6", href: "/katarisoft/realtime" },
    { name: "Dashboard", icon: TrendingUp, color: "#6366f1", href: "/katarisoft/dashboard" },
    { name: "Histórico", icon: BarChart2, color: "#8B5CF6", href: "/katarisoft/historical" },
];

const SIDEBAR_ITEMS_BOTTOM = [
    { name: "Integrantes", icon: Users, color: "#EC4899", href: "/katarisoft/users" },
    { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/katarisoft/settings" },
    { name: "Login", icon: LogIn, color: "#3B82F6", href: "/katarisoft/login" },
];

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <motion.div
            className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
                isSidebarOpen ? "w-40" : "w-20"
            }`}
            animate={{ width: isSidebarOpen ? 170 : 80 }}
        >
            <div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
                <div className='flex items-center justify-between'>
                    <Link to="/katarisoft/" className='flex items-center'>
                        <AnimatePresence mode="wait">
                            {isSidebarOpen ? (
                                <motion.img 
                                    key="logo"
                                    src={logoImage} 
                                    alt="Katari Logo" 
                                    className="w-8 h-8 object-cover"
                                    initial={{ opacity: 0, rotate: -180 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 180 }}
                                    transition={{ duration: 0.3 }}
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
                                    className='ml-2 text-white text-lg font-semibold'
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.2, delay: 0.3 }}
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
                        className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
                    >
                        <ChevronsLeft
                            size={20}
                            className={`text-white-400 transition-transform duration-300 ${
                                isSidebarOpen ? '' : 'rotate-180'
                            }`}
                        />
                    </motion.button>
                </div>

                <nav className='mt-8 flex-grow'>
                    {SIDEBAR_ITEMS_TOP.map((item) => (
                        <Link key={item.href} to={item.href}>
                            <motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
                                <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            className='ml-4 whitespace-nowrap'
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.3 }}
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
                        <Link key={item.href} to={item.href}>
                            <motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
                                <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            className='ml-4 whitespace-nowrap'
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.3 }}
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    ))}
                </nav>
            </div>
        </motion.div>
    );
};

export default Sidebar;