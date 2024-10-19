import { useTimer } from "../../context/TimerContext";

const Header = ({ title }) => {
    const { timer, formatTime } = useTimer();

    return (
        <header className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 top-0 left-0 w-full z-50'>
            <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
                <h1 className='text-2xl font-semibold text-gray-100'>{title}</h1>
                <span className='text-xl font-semibold text-gray-100'>{formatTime(timer)}</span>
            </div>
        </header>
    );
};

export default Header;
