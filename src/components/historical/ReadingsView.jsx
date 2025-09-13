import { useEffect, useState } from "react";
import lecturasService from "../../services/lecturasService";
import { processReadingsData } from "../../utils/readingParser";
import AltitudeChart from "./AltitudeChart";
import EnvironmentalTimeSeriesChart from "./EnvironmentalTimeSeriesChart";
import ImuMagnitudeChart from "./ImuMagnitudeChart";
import ImuTimeSeriesChart from "./ImuTimeSeriesChart";
import PressureAltitudeChart from "./PressureAltitudeChart";
import ReadingsTable from "./ReadingsTable";

const ReadingsView = ({ event }) => {
    const [processedData, setProcessedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAndProcessReadings = async () => {
            if (!event?.id_evento) return;

            try {
                setLoading(true);
                const result = await lecturasService.obtenerLecturasPorEvento(event.id_evento, 1, 200);
                //console.log("Respuesta del servicio de lecturas:", result);
                if (result.body && result.body.success && result.body.data.length > 0) {
                    const data = await processReadingsData(result.body.data);
                    setProcessedData(data);
                } else {
                    setProcessedData(null);
                    if (result.body && !result.body.success) {
                        setError(result.body.message);
                    } else {
                        setError(null);
                    }
                }
            } catch (err) {
                setError("Error de conexión al obtener las lecturas.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAndProcessReadings();
    }, [event]);

    if (loading) {
        return <div className="text-center text-gray-400 py-8">Cargando lecturas para el evento "{event.nombre_evento}"...</div>;
    }

    if (error) {
        return <div className="text-center text-red-400 py-8">{error}</div>;
    }

    if (!processedData || processedData.tableData.length === 0) {
        return <div className="text-center text-gray-500 py-8">No hay lecturas disponibles para este evento.</div>;
    }

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">
                Detalle del Evento: <span className="text-blue-400">{event.nombre_evento}</span>
            </h2>

            {/* Tabla de Lecturas */}
            <ReadingsTable data={processedData.tableData} />

            {/* Contenedor de Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {processedData.altitudeData.length > 0 && <AltitudeChart data={processedData.altitudeData} />}
                {processedData.pressureAltitudeData.length > 0 && <PressureAltitudeChart data={processedData.pressureAltitudeData} />}
                
                {/* Gráficas IMU */}
                {processedData.imuData.length > 0 && <ImuTimeSeriesChart data={processedData.imuData} />}
                {processedData.imuData.length > 0 && <ImuMagnitudeChart data={processedData.imuData} />}

                {/* Gráficas Ambientales */}
                {processedData.environmentalData.length > 0 && <EnvironmentalTimeSeriesChart data={processedData.environmentalData} />}
            </div>
        </div>
    );
};

export default ReadingsView;