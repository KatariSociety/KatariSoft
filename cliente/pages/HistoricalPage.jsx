import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import { ShieldCheck, ShieldAlert, Package, ShieldX } from "lucide-react";
import HistoricalDistributionChart from "../components/historical/HistoricalDistributionChart";
import HistoricalTable from "../components/historical/HistoricalTable";
import HistoricalTrendChart from "../components/historical/HistoricalTrendChart";

const ProductsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Histórico' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total pruebas' icon={Package} value={50} color='#6366F1' />
					<StatCard name='Culminadas' icon={ShieldCheck} value={10} color='#10B981' />
					<StatCard name='Con errores' icon={ShieldAlert} value={25} color='#F59E0B' />
					<StatCard name='Fallidas' icon={ShieldX} value={15} color='#EF4444' />
				</motion.div>

				<HistoricalTable />

				{/* CHARTS */}
				<div className='grid grid-col-1 lg:grid-cols-2 gap-8'>
					<HistoricalTrendChart />
					<HistoricalDistributionChart />
				</div>
			</main>
		</div>
	);
};
export default ProductsPage;
