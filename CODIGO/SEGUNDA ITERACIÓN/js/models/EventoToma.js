/**
 * MODELO: Entidad EventoToma
 * Representa un evento del historial de tomas de medicamentos
 * RF06: Informes de historial de medicación
 */
class EventoToma {
  /**
   * @param {Object} data - Datos del evento
   */
  constructor(data = {}) {
    this.id = data.id || `evento-${Date.now()}-${Math.random()}`;
    this.medicamentoId = data.medicamentoId || null;
    this.horarioId = data.horarioId || null;
    this.nombreMedicamento = data.nombreMedicamento || '';
    this.tipo = data.tipo || 'tomado'; // 'tomado', 'omitido', 'pospuesto'
    this.fecha = data.fecha || new Date().toISOString();
    this.horaProgamada = data.horaProgamada || null;
    this.horaReal = data.horaReal || new Date().toISOString();
    this.motivo = data.motivo || ''; // Motivo de omisión o postergación
    this.notas = data.notas || '';
    this.dosis = data.dosis || 0;
    this.unidadDosis = data.unidadDosis || 'mg';
  }

  /**
   * Valida que los datos del evento sean correctos
   */
  validar() {
    const errores = [];

    if (!this.medicamentoId) {
      errores.push('El ID del medicamento es obligatorio');
    }

    if (!['tomado', 'omitido', 'pospuesto'].includes(this.tipo)) {
      errores.push('El tipo de evento debe ser: tomado, omitido o pospuesto');
    }

    if (!this.fecha) {
      errores.push('La fecha del evento es obligatoria');
    }

    return {
      valido: errores.length === 0,
      errores: errores,
    };
  }

  /**
   * Obtiene una descripción legible del evento
   */
  obtenerDescripcion() {
    const fecha = new Date(this.fecha);
    const fechaStr = fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const horaStr = fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    let descripcion = '';
    switch (this.tipo) {
      case 'tomado':
        descripcion = `✅ Tomado - ${fechaStr} a las ${horaStr}`;
        break;
      case 'omitido':
        descripcion = `❌ Omitido - ${fechaStr} a las ${horaStr}`;
        if (this.motivo) {
          descripcion += ` (${this.motivo})`;
        }
        break;
      case 'pospuesto':
        descripcion = `⏰ Pospuesto - ${fechaStr} a las ${horaStr}`;
        if (this.motivo) {
          descripcion += ` (${this.motivo})`;
        }
        break;
    }

    return descripcion;
  }

  /**
   * Obtiene el icono según el tipo de evento
   */
  obtenerIcono() {
    const iconos = {
      tomado: '✅',
      omitido: '❌',
      pospuesto: '⏰',
    };
    return iconos[this.tipo] || '📋';
  }

  /**
   * Convierte el objeto a formato JSON para almacenamiento
   */
  toJSON() {
    return {
      id: this.id,
      medicamentoId: this.medicamentoId,
      horarioId: this.horarioId,
      nombreMedicamento: this.nombreMedicamento,
      tipo: this.tipo,
      fecha: this.fecha,
      horaProgamada: this.horaProgamada,
      horaReal: this.horaReal,
      motivo: this.motivo,
      notas: this.notas,
      dosis: this.dosis,
      unidadDosis: this.unidadDosis,
    };
  }

  /**
   * Crea una instancia desde datos JSON
   */
  static fromJSON(json) {
    return new EventoToma(json);
  }
}

export default EventoToma;
