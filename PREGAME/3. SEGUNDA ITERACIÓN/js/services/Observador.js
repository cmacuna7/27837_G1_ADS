/**
 * PATRÓN OBSERVER: Interface Observador
 * Define el contrato para los observadores del sistema
 */
class Observador {
  /**
   * Método que será llamado cuando el sujeto notifique cambios
   * @param {Object} data - Datos del evento
   */
  actualizar(data) {
    throw new Error('El método actualizar() debe ser implementado');
  }
}

export default Observador;
