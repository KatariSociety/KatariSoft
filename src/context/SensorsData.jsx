import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import io from 'socket.io-client';

const SensorsDataContext = createContext();

const MAX_GYRO_ANGLE = 100; //Máximo de 10 grados permitido

// GPS base (2°27′15″N, 76°36′33″O) => 2.4541666666667, -76.609166666667
const GPS_BASE_LAT = 2.4541666666667;
const GPS_BASE_LON = -76.609166666667;
// Estado interno para simular un random-walk estable alrededor de la base
let lastLat = null;
let lastLon = null;

// Datos iniciales en reposo
const initialData = {
    timestamp: new Date().toISOString(),
    sensors: {
        BMP280: {
            sensor_id: "BMP_280_K1",
            timestamp: new Date().toISOString(),
            readings: {
                temperature: { value: 26.5, unit: "C" },
                pressure: { value: 829.0, unit: "hPa" },
                altitude: { value: 1658.0, unit: "m" }
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
                    x: { value: -0.015, unit: "g" },
                    y: { value: -0.057, unit: "g" },
                    z: { value: -0.978, unit: "g" }
                },
                gyroscope: {
                    x: { value: 0.0, unit: "dps" },
                    y: { value: -1.77, unit: "dps" },
                    z: { value: -0.18, unit: "dps" }
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
        ,
        SCD40: {
            sensor_id: "SCD_40_K1",
            timestamp: new Date().toISOString(),
            readings: {
                temperature: { value: 24.0, unit: "C" },
                CO2: { value: 2663, unit: "ppm" },
                humidity: { value: 75.6, unit: "%" }
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

    // --- GPS simulación estable dentro de 20 metros del punto base ---
    // maxRadiusMeters: radio máximo desde la base (20 m)
    const maxRadiusMeters = 20;
    // maxStepMeters: cuánto puede moverse el punto entre ticks (más pequeño = más estable)
    const maxStepMeters = 4; // ~4 metros por actualización

    // Convertir lat/lon a radiales para cálculo de longitud
    const latRad = GPS_BASE_LAT * (Math.PI / 180);
    // metros por grado aproximado
    const metersPerDegLat = 111320; // promedio
    const metersPerDegLon = 111320 * Math.cos(latRad);

    // Convertir lastLat/lastLon a metros offset respecto base
    const lastOffsetXM = (lastLat - GPS_BASE_LAT) * metersPerDegLat;
    const lastOffsetYM = (lastLon - GPS_BASE_LON) * metersPerDegLon;

    // Random walk: generar un paso aleatorio pequeño en metros
    const stepAngle = Math.random() * Math.PI * 2;
    const stepRadius = Math.random() * maxStepMeters;
    let newOffsetXM = lastOffsetXM + Math.cos(stepAngle) * stepRadius;
    let newOffsetYM = lastOffsetYM + Math.sin(stepAngle) * stepRadius;

    // Si la nueva posición excede el radio máximo, clampear a la circunferencia
    const distFromBase = Math.sqrt(newOffsetXM * newOffsetXM + newOffsetYM * newOffsetYM);
    if (distFromBase > maxRadiusMeters) {
        const scale = maxRadiusMeters / distFromBase;
        newOffsetXM *= scale;
        newOffsetYM *= scale;
    }

    // Si lastLat/lastLon no están inicializados, devolvemos coordenadas cero para NEO6M
    if (lastLat === null || lastLon === null) {
        // No inicializado: regresar datos pero con GPS a 0,0
        return {
            timestamp: new Date().toISOString(),
            sensors: {
                BMP280: {
                    sensor_id: "BMP_280_K1",
                    timestamp: new Date().toISOString(),
                    readings: {
                        temperature: { value: (26.5 + Math.random() * 1).toFixed(2), unit: "C" },
                        pressure: { value: (829 + Math.random() * 2).toFixed(2), unit: "hPa" },
                        altitude: { value: (1658 + Math.random() * 5).toFixed(1), unit: "m" }
                    }
                },
                NEO6M: {
                    sensor_id: "NEO_6M_K1",
                    timestamp: new Date().toISOString(),
                    readings: {
                        location: { latitude: 0, longitude: 0 },
                        speed: { value: 0, unit: "km/h" },
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
                },
                SCD40: {
                    sensor_id: "SCD_40_K1",
                    timestamp: new Date().toISOString(),
                    readings: {
                        temperature: { value: (23.5 + Math.random() * 2).toFixed(2), unit: "C" },
                        CO2: { value: (2600 + Math.random() * 100).toFixed(0), unit: "ppm" },
                        humidity: { value: (75 + Math.random() * 5).toFixed(1), unit: "%" }
                    }
                }
            }
        };
    }

    // Convertir offsets de metros de vuelta a grados
    const newLat = GPS_BASE_LAT + (newOffsetXM / metersPerDegLat);
    const newLon = GPS_BASE_LON + (newOffsetYM / metersPerDegLon);

    // Guardar para el siguiente tick
    const prevOffsetXM = lastOffsetXM;
    const prevOffsetYM = lastOffsetYM;
    lastLat = newLat;
    lastLon = newLon;
    
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
                    location: { latitude: newLat.toFixed(6), longitude: newLon.toFixed(6), altitude: { value: currentAltitude.toFixed(2), unit: 'm' } },
                    speed: { value: (Math.sqrt(Math.pow(newOffsetXM - lastOffsetXM, 2) + Math.pow(newOffsetYM - lastOffsetYM, 2)) * 3.6).toFixed(2), unit: "km/h" },
                    satellites: Math.floor(Math.random() * 20)
                }
            },
            MPU9250: {
                sensor_id: "MPU_9250_K1",
                timestamp: new Date().toISOString(),
                readings: {
                    accelerometer: {
                        x: { value: (-0.015 + Math.random() * 0.01).toFixed(3), unit: "g" },
                        y: { value: (-0.057 + Math.random() * 0.01).toFixed(3), unit: "g" },
                        z: { value: (-0.978 + Math.random() * 0.02).toFixed(3), unit: "g" }
                    },
                    gyroscope: {
                        x: { value: (Math.random() * 0.5 - 0.25).toFixed(2), unit: "dps" },
                        y: { value: (-1.77 + Math.random() * 0.5).toFixed(2), unit: "dps" },
                        z: { value: (-0.18 + Math.random() * 0.2).toFixed(2), unit: "dps" }
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
            ,
            SCD40: {
                sensor_id: "SCD_40_K1",
                timestamp: new Date().toISOString(),
                readings: {
                    temperature: { value: (22 + Math.random() * 8).toFixed(2), unit: "C" },
                    CO2: { value: (350 + Math.random() * 800).toFixed(2), unit: "ppm" },
                    humidity: { value: (40 + Math.random() * 40).toFixed(1), unit: "%" }
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
            //console.log('🔌 Estado del Arduino recibido:', status);
            
            // Solo actualizar el estado si realmente hay un cambio
            setIsArduinoConnected(prev => {
                if (prev !== status.connected) {
                    console.log(`Arduino cambió de ${prev ? 'conectado' : 'desconectado'} a ${status.connected ? 'conectado' : 'desconectado'}`);
                    return status.connected;
                }
                return prev;
            });
        });
        
        // Escuchar confirmación de prueba unitaria lista
        socketRef.current.on('unit_test_ready', (response) => {
            console.log('🧪 Respuesta de prueba unitaria:', response);
            
            if (response.ready) {
                console.log('✅ Servidor confirmó: listo para prueba unitaria');
            } else {
                console.error('❌ Error en prueba unitaria:', response.error);
            }
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
        
        // Escuchar datos completos del Arduino (JSON format como en tu ejemplo)
        socketRef.current.on('arduino_data', (arduinoData) => {
            console.log('📡 Datos completos del Arduino recibidos:', typeof arduinoData, arduinoData);
            console.log("🔍 Estado actual: activeMode =", activeMode, "| useRealMPU =", useRealMPU);
            
            // Parsear los datos si vienen como string
            let parsedData = arduinoData;
            if (typeof arduinoData === 'string') {
                try {
                    parsedData = JSON.parse(arduinoData);
                    console.log("✅ Datos JSON del Arduino parseados correctamente");
                } catch (parseError) {
                    console.error("❌ Error parseando datos JSON del Arduino:", parseError);
                    return;
                }
            }
            
            // Solo procesar si estamos en modo unitTest
            if (activeMode === 'unitTest') {
                console.log("%c 🧪 MODO PRUEBA UNITARIA - PROCESANDO DATOS REALES DEL ARDUINO", 
                    "background-color: #10b981; color: white; padding: 8px; border-radius: 4px; font-weight: bold;"
                );
                
                console.log("📊 Datos recibidos del Arduino:");
                console.log(parsedData);
                
                // Mostrar datos GPS específicamente si están presentes
                if (parsedData.gps_lat !== undefined) {
                    console.log("🌍 Datos GPS detectados:", {
                        lat: parsedData.gps_lat,
                        lng: parsedData.gps_lng,
                        alt: parsedData.gps_alt,
                        sats: parsedData.gps_sats
                    });
                }
                
                setData(prevData => {
                    const newData = JSON.parse(JSON.stringify(prevData));
                    newData.timestamp = new Date().toISOString();
                    
                    // Actualizar TODOS los sensores con datos reales del Arduino
                    if (parsedData.co2 !== undefined) {
                        newData.sensors.SCD40 = {
                            sensor_id: "SCD_40_K1",
                            timestamp: new Date().toISOString(),
                            readings: {
                                CO2: { value: parseFloat(parsedData.co2) || 0, unit: "ppm" },
                                temperature: { value: parseFloat(parsedData.temp_scd) || 0, unit: "C" },
                                humidity: { value: parseFloat(parsedData.humidity) || 0, unit: "%" }
                            }
                        };
                        console.log("✅ Sensor SCD40 actualizado con datos reales");
                    }
                    
                    if (parsedData.pressure !== undefined) {
                        newData.sensors.BMP280 = {
                            sensor_id: "BMP_280_K1",
                            timestamp: new Date().toISOString(),
                            readings: {
                                temperature: { value: parseFloat(parsedData.temp_bmp) || 0, unit: "C" },
                                pressure: { value: parseFloat(parsedData.pressure) || 0, unit: "hPa" },
                                altitude: { value: parseFloat(parsedData.altitude_bmp) || 0, unit: "m" }
                            }
                        };
                        console.log("✅ Sensor BMP280 actualizado con datos reales");
                    }
                    
                    if (parsedData.accel_x !== undefined) {
                        newData.sensors.MPU9250 = {
                            sensor_id: "MPU_9250_K1",
                            timestamp: new Date().toISOString(),
                            readings: {
                                accelerometer: {
                                    x: { value: parseFloat(parsedData.accel_x) || 0, unit: "g" },
                                    y: { value: parseFloat(parsedData.accel_y) || 0, unit: "g" },
                                    z: { value: parseFloat(parsedData.accel_z) || 0, unit: "g" }
                                },
                                gyroscope: {
                                    x: { value: parseFloat(parsedData.gyro_x) || 0, unit: "dps" },
                                    y: { value: parseFloat(parsedData.gyro_y) || 0, unit: "dps" },
                                    z: { value: parseFloat(parsedData.gyro_z) || 0, unit: "dps" }
                                }
                            }
                        };
                        console.log("✅ Sensor MPU9250 actualizado con datos reales");
                    }
                    
                    if (parsedData.gps_lat !== undefined) {
                        newData.sensors.NEO6M = {
                            sensor_id: "NEO_6M_K1",
                            timestamp: new Date().toISOString(),
                            readings: {
                                location: { 
                                    latitude: parseFloat(parsedData.gps_lat) || 0, 
                                    longitude: parseFloat(parsedData.gps_lng) || 0,
                                    altitude: { value: parseFloat(parsedData.gps_alt) || 0, unit: 'm' }
                                },
                                speed: { value: 0, unit: "km/h" },
                                satellites: parseInt(parsedData.gps_sats) || 0
                            }
                        };
                        console.log("✅ Sensor GPS actualizado con datos reales");
                    }
                    
                    return newData;
                });
            } else {
                console.log("🔄 Datos del Arduino recibidos pero no en modo unitTest, ignorando");
            }
        });
        
        // Escuchar datos del sensor (evento legacy para compatibilidad)
        socketRef.current.on('sensor_data', (sensorData) => {
            console.log('📊 Datos del sensor recibidos (sensor_data):', typeof sensorData);
            
            // Reenviar al manejador de arduino_data para procesamiento consistente
            if (activeMode === 'unitTest') {
                console.log('🔄 Reenviando sensor_data a arduino_data handler');
                // Trigger the arduino_data handler with the same data
                socketRef.current.emit('arduino_data', sensorData);
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

        // Inicializar posición simulada del GPS si no está inicializada
        if (lastLat === null || lastLon === null) {
            lastLat = GPS_BASE_LAT;
            lastLon = GPS_BASE_LON;
        }
        
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
                                latitude: lastLat.toFixed(6), 
                                longitude: lastLon.toFixed(6),
                                altitude: { value: newAltitude.toFixed(2), unit: 'm' }
                            },
                            speed: { value: (Math.random() * 1 + 0.2).toFixed(2), unit: "km/h" },
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
                    // Añadir SCD40 (satélite): temperatura y CO2
                    newData.sensors.SCD40 = {
                        sensor_id: "SCD_40_K1",
                        timestamp: new Date().toISOString(),
                        readings: {
                            temperature: { value: (22 + Math.random() * 8).toFixed(2), unit: "C" },
                            CO2: { value: (350 + Math.random() * 800).toFixed(2), unit: "ppm" }
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
            console.log("%c 🧪 INICIANDO MODO PRUEBA UNITARIA - DATOS REALES DEL ARDUINO", 
                "background-color: #10b981; color: white; font-size: 16px; padding: 8px 16px; border-radius: 4px; font-weight: bold;"
            );
            
            setActiveMode('unitTest');
            setUseSimulation(false);
            setUseRealMPU(false); // No usar el manejador específico del MPU, usar el manejador completo
            
            // Solicitar explícitamente al servidor que inicie la prueba unitaria
            if (socketRef.current && socketRef.current.connected) {
                console.log("📡 Solicitando al servidor iniciar prueba unitaria...");
                socketRef.current.emit('start_unit_test');
                socketRef.current.emit('connect_arduino', { forceConnection: true, unitTest: true });
            }
            
            console.log("⏳ Modo prueba unitaria activado - esperando datos reales del Arduino...");
            console.log("🔍 Los datos aparecerán automáticamente cuando el Arduino envíe información");
            
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

        // Inicializar posición simulada del GPS cuando se inicia la simulación
        if (lastLat === null || lastLon === null) {
            lastLat = GPS_BASE_LAT;
            lastLon = GPS_BASE_LON;
        }
        
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
    // Resetear posición simulada del GPS a la base
    lastLat = GPS_BASE_LAT;
    lastLon = GPS_BASE_LON;
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