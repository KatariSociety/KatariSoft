import React, { createContext, useContext, useEffect, useState } from 'react';

const SensorsDataContext = createContext();

export const SensorsDataProvider = ({ children }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('/path/to/data.json')
            .then(response => response.json())
            .then(data => setData(data));
    }, []);

    return (
        <SensorsDataContext.Provider value={data}>
            {children}
        </SensorsDataContext.Provider>
    );
};

export const useSensorsData = () => {
    return useContext(SensorsDataContext);
};