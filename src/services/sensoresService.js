import api from './api/api';

/**
 * Servicio para gestionar los sensores
 */
const sensoresService = {
  /**
   * Obtiene todos los sensores disponibles
   * @returns {Promise} Promesa con el resultado de la petición
   */
  obtenerSensores: async () => {
    try {
      const response = await api.get('/sensores');
      return response.data;
    } catch (error) {
      console.error('Error al obtener sensores:', error);
      throw error;
    }
  },

  /**
   * Obtiene un sensor específico por su ID
   * @param {string|number} sensorId - ID del sensor
   * @returns {Promise} Promesa con el resultado de la petición
   */
  obtenerSensorPorId: async (sensorId) => {
    try {
      const response = await api.get(`/sensores/${sensorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener sensor con ID ${sensorId}:`, error);
      throw error;
    }
  },

  /**
   * Inserta un nuevo sensor
   * @param {Object} sensorData - Datos del sensor a insertar
   * @returns {Promise} Promesa con el resultado de la petición
   */
  insertarSensor: async (sensorData) => {
    try {
      const response = await api.post('/sensores', sensorData);
      return response.data;
    } catch (error) {
      console.error('Error al insertar sensor:', error);
      throw error;
    }
  },

  /**
   * Actualiza un sensor existente
   * @param {string|number} sensorId - ID del sensor a actualizar
   * @param {Object} sensorData - Nuevos datos del sensor
   * @returns {Promise} Promesa con el resultado de la petición
   */
  actualizarSensor: async (sensorId, sensorData) => {
    try {
      const response = await api.put(`/sensores/${sensorId}`, sensorData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar sensor con ID ${sensorId}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un sensor existente
   * @param {string|number} sensorId - ID del sensor a eliminar
   * @returns {Promise} Promesa con el resultado de la petición
   */
  eliminarSensor: async (sensorId) => {
    try {
      const response = await api.delete(`/sensores/${sensorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar sensor con ID ${sensorId}:`, error);
      throw error;
    }
  }
};

export default sensoresService;