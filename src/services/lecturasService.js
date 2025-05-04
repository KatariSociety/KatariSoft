import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Servicio para gestionar las lecturas de sensores
 */
const lecturasService = {
  /**
   * Obtiene todas las lecturas disponibles
   * @returns {Promise} Promesa con el resultado de la petición
   */
  obtenerLecturas: async () => {
    try {
      const response = await api.get('/lecturas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener lecturas:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las lecturas de un sensor específico
   * @param {string|number} sensorId - ID del sensor
   * @returns {Promise} Promesa con el resultado de la petición
   */
  obtenerLecturasPorSensor: async (sensorId) => {
    try {
      const response = await api.get(`/lecturas/sensor/${sensorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener lecturas del sensor ${sensorId}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene una lectura específica por su ID
   * @param {string|number} lecturaId - ID de la lectura
   * @returns {Promise} Promesa con el resultado de la petición
   */
  obtenerLecturasPorId: async (lecturaId) => {
    try {
      const response = await api.get(`/lecturas/${lecturaId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener lectura con ID ${lecturaId}:`, error);
      throw error;
    }
  },

  /**
   * Inserta una nueva lectura
   * @param {Object} lecturaData - Datos de la lectura a insertar
   * @returns {Promise} Promesa con el resultado de la petición
   */
  insertarLectura: async (lecturaData) => {
    try {
      const response = await api.post('/lecturas', lecturaData);
      return response.data;
    } catch (error) {
      console.error('Error al insertar lectura:', error);
      throw error;
    }
  },

  /**
   * [NO IMPLEMENTADO] Obtiene lecturas por fecha
   * @param {string} fecha - Fecha para filtrar lecturas (formato: YYYY-MM-DD)
   * @returns {Promise} Promesa con el resultado de la petición
   */
  obtenerLecturasPorFecha: async (fecha) => {
    try {
      const response = await api.get(`/lecturas/fecha/${fecha}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener lecturas por fecha ${fecha}:`, error);
      throw error;
    }
  },

  /**
   * [NO IMPLEMENTADO] Obtiene lecturas por sensor y fecha
   * @param {string|number} sensorId - ID del sensor
   * @param {string} fecha - Fecha para filtrar lecturas (formato: YYYY-MM-DD)
   * @returns {Promise} Promesa con el resultado de la petición
   */
  obtenerLecturasPorSensorYFecha: async (sensorId, fecha) => {
    try {
      const response = await api.get(`/lecturas/sensor/${sensorId}/fecha/${fecha}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener lecturas del sensor ${sensorId} por fecha ${fecha}:`, error);
      throw error;
    }
  }
};

export default lecturasService;