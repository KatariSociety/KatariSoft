import Header from "../components/common/Header";

import ImuChart from "../components/dashboard/ImuChart";
import AlturaCansat from "../components/dashboard/AlturaCansat";
import AlturaRocket from "../components/dashboard/AlturaRocket";
import TemperaturaCansat from "../components/dashboard/TemperaturaCansat";
import PresionCansatChart from "../components/dashboard/PresionCansatChart";

const DashboardPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title={"Dashboard"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>				
				
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>					
					<AlturaCansat />
					<AlturaRocket />					
				</div>
				<ImuChart />
				<TemperaturaCansat />
				<PresionCansatChart />
				
			</main>
		</div>
	);
};
export default DashboardPage;
