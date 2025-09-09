import api from './api/api';

/**
 * Servicio para gestionar los eventos
 */
const eventosService = {
  /**
   * Obtiene todos los eventos disponibles
   * @returns {Promise} Promesa con el resultado de la petición
   */
  obtenerEventos: async () => {
    try {
      const response = await api.get('/eventos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      throw error;
    }
  },

  /**
   * Obtiene un evento específico por su ID
   * @param {string|number} eventoId - ID del evento
   * @returns {Promise} Promesa con el resultado de la petición
   */
  obtenerEventoPorId: async (eventoId) => {
    try {
      const response = await api.get(`/eventos/${eventoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener evento con ID ${eventoId}:`, error);
      throw error;
    }
  },

  /**
   * Inserta un nuevo evento
   * @param {Object} eventoData - Datos del evento a insertar
   * @returns {Promise} Promesa con el resultado de la petición
   */
  insertarEvento: async (eventoData) => {
    try {
      const response = await api.post('/eventos', eventoData);
      return response.data;
    } catch (error) {
      console.error('Error al insertar evento:', error);
      throw error;
    }
  },

  /**
   * Actualiza un evento existente
   * @param {string|number} eventoId - ID del evento a actualizar
   * @param {Object} eventoData - Nuevos datos del evento
   * @returns {Promise} Promesa con el resultado de la petición
   */
  actualizarEvento: async (eventoId, eventoData) => {
    try {
      const response = await api.put(`/eventos/${eventoId}`, eventoData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar evento con ID ${eventoId}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un evento existente
   * @param {string|number} eventoId - ID del evento a eliminar
   * @returns {Promise} Promesa con el resultado de la petición
   */
  eliminarEvento: async (eventoId) => {
    try {
      const response = await api.delete(`/eventos/${eventoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar evento con ID ${eventoId}:`, error);
      throw error;
    }
  }
};

export default eventosService;