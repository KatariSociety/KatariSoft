import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// Cargar CSS de Leaflet en runtime (Vite)
const ensureLeafletCSS = () => {
    if (typeof document === 'undefined') return;
    if (document.getElementById('leaflet-css')) return;
    const link = document.createElement('link');
    link.id = 'leaflet-css';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
};

const defaultIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const GPSModal = ({ isVisible, onClose, gps }) => {
    useEffect(() => { ensureLeafletCSS(); }, []);

    const lat = parseFloat(gps?.readings?.location?.latitude ?? gps?.readings?.location?.lat);
    const lon = parseFloat(gps?.readings?.location?.longitude ?? gps?.readings?.location?.lon);
    const hasCoords = !isNaN(lat) && !isNaN(lon);
    const alt = gps?.readings?.location?.altitude?.value ?? gps?.readings?.location?.alt ?? '-';

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-gray-800 p-4 rounded-lg shadow-xl w-[95%] sm:w-11/12 lg:w-10/12 xl:w-3/4 2xl:w-2/3 max-h-[90vh] overflow-auto border border-gray-700 mx-4"
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                    >
                        <div className="flex items-center space-x-2 mb-4">
                            <MapPin className="w-6 h-6 text-green-400" />
                            <h2 className="text-xl font-bold text-white">Posición GPS</h2>
                        </div>

                        {!hasCoords && (
                            <div className="text-gray-300 text-sm mb-4">No hay coordenadas GPS disponibles.</div>
                        )}

                        {hasCoords && (
                            <div className="w-full mb-4 h-[60vh]">
                                <MapContainer center={[lat, lon]} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[lat, lon]} icon={defaultIcon}>
                                        <Popup>
                                            Lat: {lat.toFixed(6)}, Lon: {lon.toFixed(6)}<br />Alt: {alt}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        )}

                        <div className="text-gray-300 text-sm space-y-2 mb-4">
                            <div><strong>Latitud:</strong> {hasCoords ? lat.toFixed(6) : '-'}</div>
                            <div><strong>Longitud:</strong> {hasCoords ? lon.toFixed(6) : '-'}</div>
                            <div><strong>Altura:</strong> {alt} m</div>
                        </div>

                        <div className="flex justify-end">
                            <motion.button
                                className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                            >
                                Cerrar
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GPSModal;
