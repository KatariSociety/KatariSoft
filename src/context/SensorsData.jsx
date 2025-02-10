import React, { createContext, useContext, useEffect, useState, useRef } from "react";

const SensorsDataContext = createContext();

const MAX_GYRO_ANGLE = 10; // Máximo de 10 grados permitido

// Datos iniciales en reposo
const initialData = {
    timestamp: new Date().toISOString(),
    sensors: {
        BMP280: {
            sensor_id: "BMP_280_K1",
            timestamp: new Date().toISOString(),
            readings: {
                temperature: { value: 29, unit: "C" },
                pressure: { value: 1013.25, unit: "hPa" },
                altitude: { value: 0, unit: "m" }
            }
        },
        NEO6M: {
            sensor_id: "NEO_6M_K1",
            timestamp: new Date().toISOString(),
            readings: {
                location: { latitude: 0, longitude: 0 },
                speed: { value: 0, unit: "km/h" },
                satellites: 0
            }
        },
        MPU9250: {
            sensor_id: "MPU_9250_K1",
            timestamp: new Date().toISOString(),
            readings: {
                accelerometer: {
                    x: { value: 0, unit: "g" },
                    y: { value: 0, unit: "g" },
                    z: { value: 0, unit: "g" }
                },
                gyroscope: {
                    x: { value: 0, unit: "dps" },
                    y: { value: 0, unit: "dps" },
                    z: { value: 0, unit: "dps" }
                }
            }
        },
        CCS811: {
            sensor_id: "CCS_811_K1",
            timestamp: new Date().toISOString(),
            readings: {
                CO2: { value: 400, unit: "ppm" },
                TVOC: { value: 0, unit: "ppb" }
            }
        }
    }
};

// Función para generar datos simulados
const generateRandomData = (currentAltitude) => {
    return {
        timestamp: new Date().toISOString(),
        sensors: {
            BMP280: {
                sensor_id: "BMP_280_K1",
                timestamp: new Date().toISOString(),
                readings: {
                    temperature: { value: 29, unit: "C" },
                    pressure: { value: (Math.random() * 50 + 950).toFixed(2), unit: "hPa" },
                    altitude: { value: currentAltitude.toFixed(2), unit: "m" }
                }
            },
            NEO6M: {
                sensor_id: "NEO_6M_K1",
                timestamp: new Date().toISOString(),
                readings: {
                    location: { latitude: (Math.random() * 180 - 90).toFixed(6), longitude: (Math.random() * 360 - 180).toFixed(6) },
                    speed: { value: (Math.random() * 5 + 5).toFixed(2), unit: "km/h" },
                    satellites: Math.floor(Math.random() * 20)
                }
            },
            MPU9250: {
                sensor_id: "MPU_9250_K1",
                timestamp: new Date().toISOString(),
                readings: {
                    accelerometer: {
                        x: { value: (Math.random() * 2 - 1).toFixed(2), unit: "g" },
                        y: { value: (Math.random() * 2 - 1).toFixed(2), unit: "g" },
                        z: { value: (Math.random() * 2 - 1).toFixed(2), unit: "g" }
                    },
                    gyroscope: {
                        x: { value: ((Math.random() * 2 - 1) * MAX_GYRO_ANGLE).toFixed(2), unit: "dps" },
                        y: { value: ((Math.random() * 2 - 1) * MAX_GYRO_ANGLE).toFixed(2), unit: "dps" },
                        z: { value: ((Math.random() * 2 - 1) * MAX_GYRO_ANGLE).toFixed(2), unit: "dps" }
                    }
                }
            },
            CCS811: {
                sensor_id: "CCS_811_K1",
                timestamp: new Date().toISOString(),
                readings: {
                    CO2: { value: (Math.random() * 1000).toFixed(2), unit: "ppm" },
                    TVOC: { value: (Math.random() * 500).toFixed(2), unit: "ppb" }
                }
            }
        }
    };
};

export const SensorsDataProvider = ({ children }) => {
    const [data, setData] = useState(initialData); // Iniciar con datos en reposo
    const [currentAltitude, setCurrentAltitude] = useState(0);
    const intervalRef = useRef(null);

    // Función para iniciar los datos simulados
    const startGeneratingData = () => {
        if (intervalRef.current) return; // Evitar múltiples intervalos
        intervalRef.current = setInterval(() => {
            setCurrentAltitude(prevAltitude => {
                const newAltitude = prevAltitude + 17;
                setData(generateRandomData(newAltitude));
                return newAltitude;
            });
        }, 1000); // Generar datos cada segundo
    };

    // Función para detener y reiniciar los datos
    const stopGeneratingData = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setData(initialData); // Reiniciar los datos a cero
        setCurrentAltitude(0);
    };

    useEffect(() => {
        return () => stopGeneratingData(); // Cleanup al desmontar
    }, []);

    return (
        <SensorsDataContext.Provider value={{ data, startGeneratingData, stopGeneratingData }}>
            {children}
        </SensorsDataContext.Provider>
    );
};

export const useSensorsData = () => {
    return useContext(SensorsDataContext);
};
