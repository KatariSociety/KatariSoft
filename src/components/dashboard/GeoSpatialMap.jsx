import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './GeoSpatialMap.css';
import { Satellite, MapPin, Activity } from 'lucide-react';

// Coordenadas de referencia del código Arduino
const REF_LATITUD = 2.4764896;
const REF_LONGITUD = -76.6221040;
const REF_ALTITUD = 1760;

// Componente para centrar el mapa automáticamente
function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
}

// Componente para seguir la posición actual
function AutoFollow({ position, enabled }) {
  const map = useMap();
  
  useEffect(() => {
    if (enabled && position && position.lat && position.lng) {
      map.setView(position, map.getZoom());
    }
  }, [position, enabled, map]);
  
  return null;
}

const GeoSpatialMap = ({ 
  gpsData, 
  sensorData, 
  trajectoryData = [], 
  autoFollow = false 
}) => {
  const [mapCenter, setMapCenter] = useState({
    lat: REF_LATITUD,
    lng: REF_LONGITUD
  });
  
  const [currentPosition, setCurrentPosition] = useState(null);
  
  // Actualizar posición actual cuando cambien los datos del GPS
  useEffect(() => {
    if (gpsData && gpsData.latitude && gpsData.longitude) {
      const newPosition = {
        lat: gpsData.latitude,
        lng: gpsData.longitude
      };
      setCurrentPosition(newPosition);
      
      // Si es la primera posición válida, centrar el mapa ahí
      if (!currentPosition) {
        setMapCenter(newPosition);
      }
    }
  }, [gpsData]);
  
  // Crear marcador personalizado para el satélite
  const satelliteIcon = L.divIcon({
    className: 'custom-satellite-icon',
    html: `<div class="satellite-marker">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
  
  // Generar puntos de trayectoria con tooltips
  const trajectoryPoints = trajectoryData.map((point, index) => ({
    ...point,
    tooltip: `Punto ${index + 1}
Altitud GPS: ${point.gpsAltitude?.toFixed(1)}m
Altitud Barométrica: ${point.barometricAltitude?.toFixed(1)}m
Temperatura: ${point.temperature?.toFixed(1)}°C
Presión: ${point.pressure?.toFixed(1)}hPa
CO2: ${point.co2 || 'N/A'}ppm
Hora: ${point.timestamp || 'N/A'}`
  }));
  
  return (
    <div className="relative w-full h-[600px] bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
      {/* Header del mapa */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-gray-900 bg-opacity-90 backdrop-blur-sm p-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Misión Geoespacial</h3>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-300">
            <div className="flex items-center space-x-1">
              <Activity className="w-4 h-4 text-green-400" />
              <span>En Vuelo</span>
            </div>
            <div className="text-blue-400">
              {currentPosition ? 'GPS Activo' : 'GPS Inactivo'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mapa */}
      <MapContainer
        center={mapCenter}
        zoom={15}
        className="w-full h-full"
        style={{ marginTop: '60px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Controlador del mapa */}
        <MapController center={mapCenter} zoom={15} />
        
        {/* Seguimiento automático */}
        <AutoFollow position={currentPosition} enabled={autoFollow} />
        
        {/* Trayectoria histórica */}
        {trajectoryPoints.length > 1 && (
          <Polyline
            positions={trajectoryPoints.map(p => [p.lat, p.lng])}
            color="#3B82F6"
            weight={3}
            opacity={0.8}
          >
            {trajectoryPoints.map((point, index) => (
              <Popup key={index}>
                <div className="text-sm">
                  <h4 className="font-semibold mb-2">Datos del Punto {index + 1}</h4>
                  <div className="space-y-1 text-gray-700">
                    {point.tooltip.split('\n').map((line, i) => (
                      <div key={i} className="text-xs">{line}</div>
                    ))}
                  </div>
                </div>
              </Popup>
            ))}
          </Polyline>
        )}
        
        {/* Marcador de posición actual */}
        {currentPosition && (
          <Marker position={currentPosition} icon={satelliteIcon}>
            <Popup>
              <div className="text-sm">
                <h4 className="font-semibold mb-2">Posición Actual</h4>
                <div className="space-y-1 text-gray-700">
                  <div><strong>Latitud:</strong> {currentPosition.lat.toFixed(7)}</div>
                  <div><strong>Longitud:</strong> {currentPosition.lng.toFixed(7)}</div>
                  <div><strong>Altitud GPS:</strong> {gpsData?.altitude?.toFixed(1)}m</div>
                  <div><strong>Altitud Barométrica:</strong> {sensorData?.barometricAltitude?.toFixed(1)}m</div>
                  <div><strong>Temperatura:</strong> {sensorData?.temperature?.toFixed(1)}°C</div>
                  <div><strong>Presión:</strong> {sensorData?.pressure?.toFixed(1)}hPa</div>
                  <div><strong>CO2:</strong> {sensorData?.co2 || 'N/A'}ppm</div>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Marcador de punto de referencia */}
        <Marker position={[REF_LATITUD, REF_LONGITUD]}>
          <Popup>
            <div className="text-sm">
              <h4 className="font-semibold mb-2">Punto de Referencia</h4>
              <div className="space-y-1 text-gray-700">
                <div><strong>Latitud:</strong> {REF_LATITUD}</div>
                <div><strong>Longitud:</strong> {REF_LONGITUD}</div>
                <div><strong>Altitud:</strong> {REF_ALTITUD}m</div>
                <div className="text-blue-600">Punto de lanzamiento</div>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      
      {/* Controles del mapa */}
      <div className="absolute bottom-4 right-4 z-[1000] flex flex-col space-y-2">
        <button
          onClick={() => setMapCenter({ lat: REF_LATITUD, lng: REF_LONGITUD })}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg border border-gray-600 transition-colors"
          title="Centrar en punto de referencia"
        >
          <MapPin className="w-4 h-4" />
        </button>
        <button
          onClick={() => currentPosition && setMapCenter(currentPosition)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg border border-blue-500 transition-colors"
          title="Centrar en posición actual"
        >
          <Satellite className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default GeoSpatialMap;
