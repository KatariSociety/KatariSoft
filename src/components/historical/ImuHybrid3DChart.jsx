import Plot from 'react-plotly.js';
import { motion } from "framer-motion";
import { Move3d, Orbit } from 'lucide-react';
import { useMemo } from 'react';

const ImuHybrid3DChart = ({ allData, activeData }) => {
    // Memoizamos los datos de la trayectoria para evitar recalcularlos en cada render
    const trajectories = useMemo(() => {
        if (!allData || allData.length === 0) {
            return { accel: { x: [], y: [], z: [] }, gyro: { x: [], y: [], z: [] } };
        }
        const accel = { x: [], y: [], z: [] };
        const gyro = { x: [], y: [], z: [] };
        allData.forEach(d => {
            accel.x.push(d.accel.x);
            accel.y.push(d.accel.y);
            accel.z.push(d.accel.z);
            gyro.x.push(d.gyro.x);
            gyro.y.push(d.gyro.y);
            gyro.z.push(d.gyro.z);
        });
        return { accel, gyro };
    }, [allData]);

    const hasActiveData = activeData && activeData.accel && activeData.gyro;

    // Construimos dinámicamente el array de datos para Plotly
    const plotData = [
        // --- TRAYECTORIAS BASE (siempre visibles) ---
        {
            type: 'scatter3d', mode: 'lines', name: 'Trayectoria Accel',
            x: trajectories.accel.x, y: trajectories.accel.y, z: trajectories.accel.z,
            line: { color: 'rgba(107, 114, 128, 0.5)', width: 2 }, // Gris semitransparente
            hoverinfo: 'none' // Desactivar tooltip para las trayectorias
        },
        {
            type: 'scatter3d', mode: 'lines', name: 'Trayectoria Gyro',
            x: trajectories.gyro.x, y: trajectories.gyro.y, z: trajectories.gyro.z,
            line: { color: 'rgba(107, 114, 128, 0.5)', width: 2, dash: 'dot' },
            hoverinfo: 'none'
        },
    ];

    // --- DATOS ACTIVOS (solo visibles en hover) ---
    if (hasActiveData) {
        plotData.push(
            // Vector activo de Aceleración
            {
                type: 'scatter3d', mode: 'lines', name: 'Vector Accel Activo',
                x: [0, activeData.accel.x], y: [0, activeData.accel.y], z: [0, activeData.accel.z],
                line: { color: '#3B82F6', width: 6 }
            },
            // Marcador en la trayectoria de Aceleración
            {
                type: 'scatter3d', mode: 'markers', name: 'Punto Accel Activo',
                x: [activeData.accel.x], y: [activeData.accel.y], z: [activeData.accel.z],
                marker: { color: '#3B82F6', size: 6, symbol: 'circle' }
            },
            // Vector activo de Giroscopio
            {
                type: 'scatter3d', mode: 'lines', name: 'Vector Gyro Activo',
                x: [0, activeData.gyro.x], y: [0, activeData.gyro.y], z: [0, activeData.gyro.z],
                line: { color: '#EC4899', width: 6 }
            },
            // Marcador en la trayectoria de Giroscopio
            {
                type: 'scatter3d', mode: 'markers', name: 'Punto Gyro Activo',
                x: [activeData.gyro.x], y: [activeData.gyro.y], z: [activeData.gyro.z],
                marker: { color: '#EC4899', size: 6, symbol: 'circle' }
            }
        );
    }

    const layout = {
        title: `Trayectoria y Vector en T=${activeData?.timeFormatted || 'Inicio'}`,
        autosize: true,
        margin: { l: 0, r: 0, b: 0, t: 40 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#E5E7EB' },
        showlegend: true,
        legend: { x: 0.7, y: 1, orientation: 'h' },
        scene: {
            xaxis: { title: 'X', color: '#9CA3AF', range: [-15, 15] },
            yaxis: { title: 'Y', color: '#9CA3AF', range: [-15, 15] },
            zaxis: { title: 'Z', color: '#9CA3AF', range: [-15, 15] },
            bgcolor: 'rgba(17, 24, 39, 0.5)',
            aspectmode: 'cube', // Asegura que los ejes tengan la misma escala
            camera: { eye: { x: 1.8, y: 1.8, z: 0.8 } }
        }
    };

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className='flex items-center mb-4'>
                <Orbit className='w-6 h-6 text-teal-400 mr-3' />
                <h2 className='text-xl font-semibold text-gray-100'>Visor de Trayectoria 3D</h2>
            </div>
            <div className="h-96"> {/* Un poco más de altura para el 3D */}
                <Plot
                    data={plotData}
                    layout={layout}
                    useResizeHandler={true}
                    style={{ width: '100%', height: '100%' }}
                    config={{ responsive: true, displayModeBar: true }} // Activamos la barra de modo para interactuar
                />
            </div>
        </motion.div>
    );
};

export default ImuHybrid3DChart;