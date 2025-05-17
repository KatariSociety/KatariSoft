import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import io from 'socket.io-client';

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
// En la función generateRandomData, actualiza para que tenga un formato más similar a los datos reales:

const generateRandomData = (currentAltitude) => {
    // Generar valores simulados con un patrón de variación realista
    const randomGyroX = ((Math.sin(Date.now() / 1000) * 5) + (Math.random() * 2 - 1)).toFixed(2);
    const randomGyroY = ((Math.cos(Date.now() / 1500) * 3) + (Math.random() * 2 - 1)).toFixed(2);
    const randomGyroZ = ((Math.sin(Date.now() / 2000) * 4) + (Math.random() * 2 - 1)).toFixed(2);
    
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
                        x: { value: ((Math.random() * 0.4 - 0.2) - 0.19).toFixed(2), unit: "g" },
                        y: { value: ((Math.random() * 0.02 - 0.01) - 0.01).toFixed(2), unit: "g" },
                        z: { value: ((Math.random() * 0.1) + 1.0).toFixed(2), unit: "g" }
                    },
                    gyroscope: {
                        x: { value: randomGyroX, unit: "dps" },
                        y: { value: randomGyroY, unit: "dps" },
                        z: { value: randomGyroZ, unit: "dps" }
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
    const [isArduinoConnected, setIsArduinoConnected] = useState(false);
    const [useSimulation, setUseSimulation] = useState(true);
    const [useRealMPU, setUseRealMPU] = useState(false);
    const [activeMode, setActiveMode] = useState(null); // Guardar el modo activo
    const intervalRef = useRef(null);
    const socketRef = useRef(null);

    // Conexión Socket.io principal - Ahora más simple y enfocada
    useEffect(() => {
        // Asegúrate de que solo hay una conexión
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        
        console.log("Conectando a Socket.io backend principal...");
        socketRef.current = io('http://localhost:3000', {
            query: { clientType: 'mainContext' }
        });
        
        // Debug para conexión establecida
        socketRef.current.on('connect', () => {
            console.log('Socket.io principal: Conexión establecida');
            socketRef.current.emit('connect_arduino', { clientType: 'mainContext' });
        });
        
        // Escuchar estado del Arduino con debug
        socketRef.current.on('arduino_status', (status) => {
            console.log('🔌 Estado del Arduino recibido:', status);
            
            // Solo actualizar el estado si realmente hay un cambio
            setIsArduinoConnected(prev => {
                if (prev !== status.connected) {
                    console.log(`Arduino cambió de ${prev ? 'conectado' : 'desconectado'} a ${status.connected ? 'conectado' : 'desconectado'}`);
                    return status.connected;
                }
                return prev;
            });
        });
        
        // Escuchar datos MPU - Modificado para aceptar datos en modo unitTest

        socketRef.current.on('mpu_data', (mpuData) => {
        // console.log("Entro aqui - Recibido:", typeof mpuData); //Recibe un string
        
        // Parsear los datos si vienen como string
        let parsedData = mpuData;
        if (typeof mpuData === 'string') {
            try {
            parsedData = JSON.parse(mpuData);
            // console.log("Datos JSON parseados correctamente en contexto");
            } catch (parseError) {
            console.error("Error parseando datos JSON en contexto:", parseError);
            }
        }
        
        // Procesamos datos MPU si useRealMPU está activo
        if (useRealMPU) {
            // Extraer datos parseados
            const accelX = parseFloat(parsedData?.accelerometer?.x?.value || 0);
            const accelY = parseFloat(parsedData?.accelerometer?.y?.value || 0);
            const accelZ = parseFloat(parsedData?.accelerometer?.z?.value || 0);
            const gyroX = parseFloat(parsedData?.gyroscope?.x?.value || 0);
            const gyroY = parseFloat(parsedData?.gyroscope?.y?.value || 0);
            const gyroZ = parseFloat(parsedData?.gyroscope?.z?.value || 0);
            
            // Log especial cuando estamos en modo unitTest
            if (activeMode === 'unitTest') {
            console.log("%c 🧪 MPU DATOS REALES - CONTEXTO", 
                "background-color: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px;"
            );
            
            // Tabla con los valores procesados
            console.table({
                accelerometer: {
                x: accelX,
                y: accelY,
                z: accelZ,
                },
                gyroscope: {
                x: gyroX,
                y: gyroY,
                z: gyroZ,
                }
            });
            } else {
            console.log("✅ Actualizando datos reales del MPU");
            }
            
            setData(prevData => {
            // Crear copia para no modificar el estado directamente
            const newData = JSON.parse(JSON.stringify(prevData));
            
            // Actualizar SOLO el sensor MPU9250
            newData.sensors.MPU9250 = {
                sensor_id: parsedData.sensor_id || "MPU_9250_K1",
                timestamp: new Date().toISOString(),
                readings: {
                accelerometer: {
                    x: { value: accelX, unit: "g" },
                    y: { value: accelY, unit: "g" },
                    z: { value: accelZ, unit: "g" }
                },
                gyroscope: {
                    x: { value: gyroX, unit: "dps" },
                    y: { value: gyroY, unit: "dps" },
                    z: { value: gyroZ, unit: "dps" }
                }
                }
            };
            
            return newData;
            });
        }
        });
        
        // Manejar desconexiones
        socketRef.current.on('disconnect', () => {
            console.log('Socket.io principal: Desconexión');
        });
        
        // Verificar conexión periódicamente
        const checkInterval = setInterval(() => {
            if (socketRef.current && socketRef.current.connected) {
                socketRef.current.emit('connect_arduino');
            }
        }, 5000);
        
        return () => {
            clearInterval(checkInterval);
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [activeMode, useRealMPU]); // Añadido useRealMPU como dependencia

    // Función para iniciar con datos reales del Arduino (modo normal)
    const startWithRealData = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        
        setUseSimulation(false);
        setUseRealMPU(true);
        setActiveMode('normal');
        
        console.log("🚀 Iniciando modo DATOS REALES del Arduino");
        
        // Iniciar intervalo para actualizar otros sensores simulados
        // mientras usamos datos reales del MPU
        intervalRef.current = setInterval(() => {
            setCurrentAltitude(prevAltitude => {
                const newAltitude = prevAltitude + 17;
                
                setData(prevData => {
                    // Crear una copia profunda del objeto data
                    const newData = JSON.parse(JSON.stringify(prevData));
                    
                    // Actualizar timestamp
                    newData.timestamp = new Date().toISOString();
                    
                    // Actualizar los otros sensores (excepto MPU) con datos simulados
                    // El MPU se actualizará por el manejador de eventos Socket.io
                    newData.sensors.BMP280 = {
                        sensor_id: "BMP_280_K1",
                        timestamp: new Date().toISOString(),
                        readings: {
                            temperature: { value: 29, unit: "C" },
                            pressure: { value: (Math.random() * 50 + 950).toFixed(2), unit: "hPa" },
                            altitude: { value: newAltitude.toFixed(2), unit: "m" }
                        }
                    };
                    
                    newData.sensors.NEO6M = {
                        sensor_id: "NEO_6M_K1",
                        timestamp: new Date().toISOString(),
                        readings: {
                            location: { 
                                latitude: (Math.random() * 180 - 90).toFixed(6), 
                                longitude: (Math.random() * 360 - 180).toFixed(6) 
                            },
                            speed: { value: (Math.random() * 5 + 5).toFixed(2), unit: "km/h" },
                            satellites: Math.floor(Math.random() * 20)
                        }
                    };
                    
                    newData.sensors.CCS811 = {
                        sensor_id: "CCS_811_K1",
                        timestamp: new Date().toISOString(),
                        readings: {
                            CO2: { value: (Math.random() * 1000).toFixed(2), unit: "ppm" },
                            TVOC: { value: (Math.random() * 500).toFixed(2), unit: "ppb" }
                        }
                    };
                    
                    return newData;
                });
                
                return newAltitude;
            });
        }, 1000);
    };

    // Función para iniciar los datos simulados con opción para modo de prueba unitaria
    // Modificada para usar datos reales del MPU en modo unitTest
    const startGeneratingData = (mode = false) => {
        console.log("🔄 Iniciando generación de datos, modo:", mode);
        
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        
        // MODO PRUEBA UNITARIA
        if (mode === 'unitTest') {
            console.log("%c 🧪 INICIANDO MODO PRUEBA UNITARIA CON MPU REAL", "background-color: #10b981; color: white; font-size: 14px; padding: 5px; border-radius: 4px;");
            setActiveMode('unitTest');
            setUseSimulation(false);
            setUseRealMPU(true); // Activar uso de datos reales del MPU
            
            // Solo actualizamos datos de otros sensores (altura, presión, etc.)
            intervalRef.current = setInterval(() => {
                setCurrentAltitude(prevAltitude => {
                    const newAltitude = prevAltitude + 17;
                    
                    setData(prevData => {
                        const newData = JSON.parse(JSON.stringify(prevData));
                        newData.timestamp = new Date().toISOString();
                        
                        // NO preservamos datos del MPU - queremos que se actualicen con datos reales
                        
                        // Actualizar otros sensores simulados
                        const simulatedData = generateRandomData(newAltitude);
                        
                        // Actualizamos solo los sensores que no son MPU
                        newData.sensors.BMP280 = simulatedData.sensors.BMP280;
                        newData.sensors.NEO6M = simulatedData.sensors.NEO6M;
                        newData.sensors.CCS811 = simulatedData.sensors.CCS811;
                        
                        return newData;
                    });
                    
                    return newAltitude;
                });
            }, 1000);
            
            return;
        } 
        // MODO REAL (Arduino conectado)
        else if (mode === true && isArduinoConnected) {
            startWithRealData();
            return;
        }
        
        // MODO SIMULACIÓN ESTÁNDAR
        console.log("🎮 Activando modo SIMULACIÓN");
        setActiveMode('simulation');
        setUseRealMPU(false);
        setUseSimulation(true);
        
        // Generar datos simulados completos
        intervalRef.current = setInterval(() => {
            setCurrentAltitude(prevAltitude => {
                const newAltitude = prevAltitude + 17;
                setData(generateRandomData(newAltitude));
                return newAltitude;
            });
        }, 1000);
    };

    // Función para detener y reiniciar los datos
    const stopGeneratingData = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setActiveMode(null);
        setUseRealMPU(false);
        setUseSimulation(false);
        setData(initialData); // Reiniciar los datos a cero
        setCurrentAltitude(0);
        console.log("⏹️ Detenida generación de datos");
    };

    useEffect(() => {
        return () => stopGeneratingData(); // Cleanup al desmontar
    }, []);

    return (
        <SensorsDataContext.Provider value={{ 
            data, 
            startGeneratingData, 
            stopGeneratingData,
            isArduinoConnected,
            activeMode
        }}>
            {children}
        </SensorsDataContext.Provider>
    );
};

export const useSensorsData = () => {
    return useContext(SensorsDataContext);
};