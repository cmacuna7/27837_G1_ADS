/**
 * PATRÓN OBSERVER: Interface Sujeto
 * Define el contrato para los sujetos observables
 */
class Sujeto {
  constructor() {
    this.observadores = [];
  }

  /**
   * Suscribe un observador
   * @param {Observador} observador
   */
  suscribir(observador) {
    if (!this.observadores.includes(observador)) {
      this.observadores.push(observador);
      console.log(
        '✅ [OBSERVER] Observador suscrito:',
        observador.constructor.name
      );
      console.log(
        `📊 [OBSERVER] Total observadores: ${this.observadores.length}`
      );
    }
  }

  /**
   * Desuscribe un observador
   * @param {Observador} observador
   */
  desuscribir(observador) {
    const index = this.observadores.indexOf(observador);
    if (index > -1) {
      this.observadores.splice(index, 1);
      console.log(
        '❌ [OBSERVER] Observador desuscrito:',
        observador.constructor.name
      );
      console.log(
        `📊 [OBSERVER] Total observadores: ${this.observadores.length}`
      );
    }
  }

  /**
   * Notifica a todos los observadores
   * @param {Object} data - Datos a enviar a los observadores
   */
  notificar(data) {
    console.log('\n========== PATRÓN OBSERVER: NOTIFICACIÓN ==========');
    console.log(
      `📢 [SUBJECT] ${this.constructor.name} notificando a ${this.observadores.length} observadores`
    );
    console.log('[DATA] Tipo de evento:', data.tipo);
    if (data.medicamento) {
      console.log('[DATA] Medicamento:', data.medicamento.nombre);
    }

    this.observadores.forEach((observador, index) => {
      console.log(
        `\n  → [${index + 1}/${this.observadores.length}] Notificando a: ${
          observador.constructor.name
        }`
      );
      observador.actualizar(data);
    });

    console.log('[SUBJECT] Notificación completada');
    console.log('====================================================\n');
  }
}

export default Sujeto;
