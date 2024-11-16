// SensorsData.jsx
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const SensorsDataContext = createContext();

const generateRandomData = (currentAltitude) => {
    return {
        timestamp: new Date().toISOString(),
        sensors: {
            BMP280: {
                sensor_id: "BMP_280_K1",
                timestamp: new Date().toISOString(),
                readings: {
                    temperature: {
                        value: 29,
                        unit: "C"
                    },
                    pressure: {
                        value: (Math.random() * 50 + 950).toFixed(2),
                        unit: "hPa"
                    },
                    altitude: {
                        value: currentAltitude.toFixed(2),
                        unit: "m"
                    }
                }
            },
            NEO6M: {
                sensor_id: "NEO_6M_K1",
                timestamp: new Date().toISOString(),
                readings: {
                    location: {
                        latitude: (Math.random() * 180 - 90).toFixed(6),
                        longitude: (Math.random() * 360 - 180).toFixed(6),
                        altitude: {
                            value: (Math.random() * 100).toFixed(2),
                            unit: "m"
                        }
                    },
                    speed: {
                        value: 5+(Math.random() * 2).toFixed(2),
                        unit: "km/h"
                    },
                    satellites: Math.floor(Math.random() * 20)
                }
            },
            MPU9250: {
                sensor_id: "MPU_9250_K1",
                timestamp: new Date().toISOString(),
                readings: {
                    accelerometer: {
                        x: {
                            value: (Math.random() * 2 - 1).toFixed(2),
                            unit: "g"
                        },
                        y: {
                            value: (Math.random() * 2 - 1).toFixed(2),
                            unit: "g"
                        },
                        z: {
                            value: (Math.random() * 2 - 1).toFixed(2),
                            unit: "g"
                        }
                    },
                    gyroscope: {
                        x: {
                            value: (Math.random() * 360 - 180).toFixed(2),
                            unit: "dps"
                        },
                        y: {
                            value: (Math.random() * 360 - 180).toFixed(2),
                            unit: "dps"
                        },
                        z: {
                            value: (Math.random() * 360 - 180).toFixed(2),
                            unit: "dps"
                        }
                    },
                    magnetometer: {
                        x: {
                            value: (Math.random() * 100).toFixed(2),
                            unit: "uT"
                        },
                        y: {
                            value: (Math.random() * 100).toFixed(2),
                            unit: "uT"
                        },
                        z: {
                            value: (Math.random() * 100).toFixed(2),
                            unit: "uT"
                        }
                    }
                }
            },
            CCS811: {
                sensor_id: "CCS_811_K1",
                timestamp: new Date().toISOString(),
                readings: {
                    CO2: {
                        value: (Math.random() * 1000).toFixed(2),
                        unit: "ppm"
                    },
                    TVOC: {
                        value: (Math.random() * 500).toFixed(2),
                        unit: "ppb"
                    }
                }
            }
        }
    };
};

export const SensorsDataProvider = ({ children }) => {
    const [data, setData] = useState(generateRandomData(0));
    const [currentAltitude, setCurrentAltitude] = useState(0);
    const intervalRef = useRef(null);

    const startGeneratingData = () => {
        if (intervalRef.current) return; // Prevent multiple intervals
        intervalRef.current = setInterval(() => {
            setCurrentAltitude(prevAltitude => {
                const newAltitude = prevAltitude + 17;
                setData(generateRandomData(newAltitude));
                return newAltitude;
            });
        }, 1000); // Generate new data every second
    };

    const stopGeneratingData = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        return () => stopGeneratingData(); // Cleanup on unmount
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