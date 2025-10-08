import { useTimer } from "../../context/TimerContext";
import { FiClock } from 'react-icons/fi';

const Header = ({ title }) => {
    const { timer, formatTime } = useTimer();
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const secondsPadded = seconds < 10 ? `0${seconds}` : seconds;

    return (
        <header className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 top-0 left-0 w-full z-50'>
            <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
                <h1 className='text-2xl font-semibold text-gray-100'>{title}</h1>

                {/* Cronómetro sobrio y elegante */}
                <div
                    className='inline-flex items-center gap-3 bg-[rgba(255,255,255,0.03)] backdrop-blur-sm border border-gray-700 text-gray-100 px-3 py-1.5 rounded-full shadow-sm transition-shadow hover:shadow-md'
                    aria-live='polite'
                    title='Cronómetro'
                >
                    {/* Acento sutil */}
                    <span className='w-0.5 h-6 bg-amber-400/80 rounded' aria-hidden='true' />

                    {/* Icono de react-icons (FiClock) */}
                    <FiClock className='h-5 w-5 text-gray-200' aria-hidden='true' />

                    <div className='flex flex-col leading-tight'>
                        <span className='text-xs font-medium uppercase tracking-wide text-gray-300'>Cronómetro</span>
                        <div className='flex items-baseline gap-2'>
                            <span className='text-sm font-semibold text-gray-100'>{minutes}m</span>
                            <span className='text-sm font-semibold text-gray-100'>{secondsPadded}s</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
