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
            // para evitar actualizaciones innecesarias
            setIsArduinoConnected(prev => {
                if (prev !== status.connected) {
                    console.log(`Arduino cambió de ${prev ? 'conectado' : 'desconectado'} a ${status.connected ? 'conectado' : 'desconectado'}`);
                    return status.connected;
                }
                return prev;
            });
        });
        
        // Escuchar cuando el modo unitTest toma control exclusivo
        socketRef.current.on('unit_test_active', () => {
            console.log('⚠️ Modo prueba unitaria activado en otro componente');
            // Podemos suspender temporalmente nuestra conexión cuando la prueba unitaria está activa
        });
        
        socketRef.current.on('unit_test_released', () => {
            console.log('✅ Modo prueba unitaria finalizado, restaurando conexión normal');
            // Reiniciar nuestra conexión después de que la prueba unitaria termina
            socketRef.current.emit('connect_arduino');
        });
        
        // Configurar handler MPU para modo normal (no unitTest)
        // Este manejador solo se usa cuando NO estamos en modo prueba unitaria
        socketRef.current.on('mpu_data', (mpuData) => {
            // Si estamos en modo prueba unitaria, no procesamos los datos aquí
            // ya que SimulationCanSat.jsx los maneja directamente
            if (activeMode === 'unitTest') {
                return;
            }
            
            if (useRealMPU) {
                console.log("✅ Actualizando datos reales del MPU (modo normal)");
                
                setData(prevData => {
                    // Crear copia para no modificar el estado directamente
                    const newData = JSON.parse(JSON.stringify(prevData));
                    
                    // Actualizar SOLO el sensor MPU9250
                    newData.sensors.MPU9250 = {
                        sensor_id: mpuData.sensor_id,
                        timestamp: new Date().toISOString(),
                        readings: {
                            accelerometer: {
                                x: { value: parseFloat(mpuData.readings.accelerometer.x.value), unit: "g" },
                                y: { value: parseFloat(mpuData.readings.accelerometer.y.value), unit: "g" },
                                z: { value: parseFloat(mpuData.readings.accelerometer.z.value), unit: "g" }
                            },
                            gyroscope: {
                                x: { value: parseFloat(mpuData.readings.gyroscope.x.value), unit: "dps" },
                                y: { value: parseFloat(mpuData.readings.gyroscope.y.value), unit: "dps" },
                                z: { value: parseFloat(mpuData.readings.gyroscope.z.value), unit: "dps" }
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
    }, []); // Sin dependencias para evitar reconexiones innecesarias

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
    const startGeneratingData = (mode = false) => {
        console.log("🔄 Iniciando generación de datos, modo:", mode);
        
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        
        // MODO PRUEBA UNITARIA - Ahora simplificado
        if (mode === 'unitTest') {
            console.log("🧪 Activando modo PRUEBA UNITARIA MPU");
            setActiveMode('unitTest');
            
            // Ya no necesitamos activar useRealMPU aquí porque SimulationCanSat.jsx 
            // maneja su propia conexión Socket.io
            setUseSimulation(false);
            
            // Sólo actualizamos datos de otros sensores excepto MPU
            intervalRef.current = setInterval(() => {
                setCurrentAltitude(prevAltitude => {
                    const newAltitude = prevAltitude + 17;
                    
                    setData(prevData => {
                        const newData = JSON.parse(JSON.stringify(prevData));
                        newData.timestamp = new Date().toISOString();
                        
                        // NO MODIFICAR MPU9250 aquí, lo maneja directamente el componente
                        // Sólo actualizar otros sensores simulados
                        const savedMPU = newData.sensors.MPU9250;
                        
                        // Actualizar otros sensores con datos simulados
                        newData.sensors = generateRandomData(newAltitude).sensors;
                        
                        // Restaurar el MPU que teníamos
                        newData.sensors.MPU9250 = savedMPU;
                        
                        return newData;
                    });
                    
                    return newAltitude;
                });
            }, 1000);
            
            return;
        } else if (mode === true && isArduinoConnected) {
            startWithRealData();
            return;
        }
        
        // Modo simulación estándar
        console.log("🎮 Activando modo SIMULACIÓN");
        setActiveMode('simulation');
        setUseRealMPU(false);
        setUseSimulation(true);
        
        // Intervalo para datos simulados
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