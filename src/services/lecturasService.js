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
   * Obtiene todas las lecturas disponibles con paginación
   * @param {number} page - Número de página (opcional, por defecto 1)
   * @param {number} limit - Límite de registros por página (opcional, por defecto 50)
   * @param {string} sortOrder - Orden de clasificación ('asc' o 'desc', opcional) - NO IMPLEMENTADO EN BACKEND
   * @returns {Promise} Promesa con el resultado de la petición
   */
  obtenerLecturas: async (page = 1, limit = 50, sortOrder = 'desc') => {
    try {
      const response = await api.get(`/lecturas?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener lecturas:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las lecturas de un sensor específico con paginación
   * @param {string|number} sensorId - ID del sensor
   * @param {number} page - Número de página (opcional, por defecto 1)
   * @param {number} limit - Límite de registros por página (opcional, por defecto 50)
   * @param {string} sortOrder - Orden de clasificación ('asc' o 'desc', opcional) - NO IMPLEMENTADO EN BACKEND
   * @returns {Promise} Promesa con el resultado de la petición
   */
  obtenerLecturasPorSensor: async (sensorId, page = 1, limit = 50, sortOrder = 'desc') => {
    try {
      const response = await api.get(`/lecturas/sensor/${sensorId}?page=${page}&limit=${limit}`);
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
   * Obtiene todas las lecturas de un evento específico con paginación
   * @param {string|number} eventoId - ID del evento
   * @param {number} page - Número de página (opcional, por defecto 1)
   * @param {number} limit - Límite de registros por página (opcional, por defecto 50)
   * @param {string} sortOrder - Orden de clasificación ('asc' o 'desc', opcional) - NO IMPLEMENTADO EN BACKEND
   * @returns {Promise} Promesa con el resultado de la petición
   */
  obtenerLecturasPorEvento: async (eventoId, page = 1, limit = 50, sortOrder = 'desc') => {
    try {
      const response = await api.get(`/lecturas/evento/${eventoId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener lecturas del evento ${eventoId}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene lecturas por sensor y evento específicos
   * @param {string|number} sensorId - ID del sensor
   * @param {string|number} eventoId - ID del evento
   * @returns {Promise} Promesa con el resultado de la petición
   */
  obtenerLecturasPorSensorYEvento: async (sensorId, eventoId) => {
    try {
      const response = await api.get(`/lecturas/sensor/${sensorId}/evento/${eventoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener lecturas del sensor ${sensorId} y evento ${eventoId}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene todas las lecturas para gráficas (sin paginación)
   * @param {string} sortOrder - Orden de clasificación ('asc' o 'desc', opcional)
   * @returns {Promise} Promesa con el resultado de la petición
   */
  obtenerLecturasParaGraficas: async (sortOrder = 'desc') => {
    try {
      // El backend ahora tiene límite máximo de 500, así que obtenemos la primera página con 500 registros
      const response = await api.get(`/lecturas?page=1&limit=500`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener lecturas para gráficas:', error);
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