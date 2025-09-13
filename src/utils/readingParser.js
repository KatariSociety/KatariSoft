import sensoresService from '../services/sensoresService';

// Cache para no pedir el nombre del mismo sensor múltiples veces
const sensorNamesCache = new Map();

export const getSensorName = async (sensorId) => {
    if (sensorNamesCache.has(sensorId)) {
        return sensorNamesCache.get(sensorId);
    }
    try {
        const result = await sensoresService.obtenerSensorPorId(sensorId);
        if (result.body && result.body.success && result.body.data) {
            const name = result.body.data.nombre_sensor;
            sensorNamesCache.set(sensorId, name);
            return name;
        }
    } catch (error) {
        console.error(`Error fetching name for sensor ${sensorId}:`, error);
    }
    // Fallback name
    const fallbackName = `Sensor ${sensorId}`;
    sensorNamesCache.set(sensorId, fallbackName);
    return fallbackName;
};


// Normaliza el formato de fecha, que puede ser string ISO o timestamp numérico
const normalizeDate = (dateValue) => {
    if (typeof dateValue === 'number') {
        return new Date(dateValue);
    }
    return new Date(dateValue);
};

/**
 * Procesa una lista de lecturas crudas de la API y las prepara para las tablas y gráficas.
 * @param {Array} rawReadings - El array de lecturas de la API.
 * @returns {Promise<Object>} Un objeto con datos procesados para cada tipo de gráfica.
 */
export const processReadingsData = async (rawReadings) => {
    const processed = {
        tableData: [],
        altitudeData: [],
        pressureAltitudeData: [],
        imuData: [],
        environmentalData: [],
    };

    // Usar Promise.all para obtener todos los nombres de sensores eficientemente
    const sensorNamePromises = rawReadings.map(r => getSensorName(r.id_sensor));
    const sensorNames = await Promise.all(sensorNamePromises);

    rawReadings.forEach((reading, index) => {
        const date = normalizeDate(reading.fecha_lectura);
        let parsedValue = {};

        try {
            if (reading.valor_lectura && reading.valor_lectura.startsWith('{')) {
                parsedValue = JSON.parse(reading.valor_lectura);
            } else {
                // Si no es JSON, lo tratamos como un valor simple
                parsedValue = { value: reading.valor_lectura };
            }
        } catch (e) {
            console.warn("Could not parse valor_lectura:", reading.valor_lectura);
            parsedValue = { error: "Formato inválido", raw: reading.valor_lectura };
        }

        // 1. Datos para la tabla principal de lecturas
        processed.tableData.push({
            id: reading.id_lectura,
            date: date,
            sensorName: sensorNames[index],
            value: parsedValue,
        });

        // 2. Extraer datos para la gráfica de Altitud
        if (parsedValue.altitude && typeof parsedValue.altitude.value === 'number') {
            processed.altitudeData.push({
                time: date.getTime(),
                altitude: parsedValue.altitude.value
            });
        }

        // 3. Extraer datos para Presión vs Altitud
        if (parsedValue.pressure && typeof parsedValue.pressure.value === 'number' && parsedValue.altitude && typeof parsedValue.altitude.value === 'number') {
            processed.pressureAltitudeData.push({
                altitude: parsedValue.altitude.value,
                pressure: parsedValue.pressure.value,
                temperature: parsedValue.temperature?.value // Opcional
            });
        }

        // 4. Extraer datos para IMU (Acelerómetro y Giroscopio)
        if (parsedValue.accelerometer && parsedValue.gyroscope) {
            const accel = {
                x: parsedValue.accelerometer.x?.value || 0,
                y: parsedValue.accelerometer.y?.value || 0,
                z: parsedValue.accelerometer.z?.value || 0
            };
            const gyro = {
                x: parsedValue.gyroscope.x?.value || 0,
                y: parsedValue.gyroscope.y?.value || 0,
                z: parsedValue.gyroscope.z?.value || 0
            };

            // Cálculo de la magnitud del vector
            const accelMagnitude = Math.sqrt(accel.x ** 2 + accel.y ** 2 + accel.z ** 2);
            const gyroMagnitude = Math.sqrt(gyro.x ** 2 + gyro.y ** 2 + gyro.z ** 2);

            processed.imuData.push({
                time: date.getTime(),
                timeFormatted: date.toLocaleTimeString(),
                accel,
                gyro,
                accelMagnitude,
                gyroMagnitude,
            });
        }

        // 5. Extraer datos Ambientales (CO2, Temperatura, Humedad)
        if (parsedValue.co2 && parsedValue.temperature && parsedValue.humidity) {
            processed.environmentalData.push({
                time: date.getTime(),
                timeFormatted: date.toLocaleTimeString(),
                co2: parsedValue.co2.value,
                temperature: parsedValue.temperature.value,
                humidity: parsedValue.humidity.value
            });
        }
    });

    // Ordenar datos cronológicamente donde sea necesario
    const sortByTime = (a, b) => a.time - b.time;
    processed.altitudeData.sort(sortByTime);
    processed.imuData.sort(sortByTime);
    processed.environmentalData.sort(sortByTime);

    return processed;
};