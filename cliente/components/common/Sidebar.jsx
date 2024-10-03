import { BarChart2, Menu, Settings, TrendingUp, TimerReset, Users, Rocket } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS_TOP = [
    { name: "Tiempo Real", icon: TimerReset, color: "#3B82F6", href: "/realtime" },
    { name: "Dashboard", icon: TrendingUp, color: "#6366f1", href: "/dashboard" },
    { name: "Histórico", icon: BarChart2, color: "#8B5CF6", href: "/historical" },
];

const SIDEBAR_ITEMS_BOTTOM = [
    { name: "Integrantes", icon: Users, color: "#EC4899", href: "/users" },
    { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings" },
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
                    <Link to="/" className='flex items-center'>
                        <Rocket size={24} className='text-white' />
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
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
                    >
                        <Menu size={24} />
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