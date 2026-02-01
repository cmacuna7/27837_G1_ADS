/**
 * MODELO: Entidad Medicamento
 * Representa un medicamento en el sistema
 * RF01-A: Gestión de Medicamentos
 */
class Medicamento {
  /**
   * @param {Object} data - Datos del medicamento
   */
  constructor(data = {}) {
    this.id = data.id || Date.now() + Math.random();
    this.nombre = data.nombre || '';
    this.nombrePaciente = data.nombrePaciente || '';
    this.presentacion = data.presentacion || 'pastilla'; // pastilla, jarabe, inyección
    this.dosis = data.dosis !== undefined ? data.dosis : 0;
    this.unidadDosis = data.unidadDosis || 'mg';
    this.frecuencia = data.frecuencia !== undefined ? data.frecuencia : 8; // horas entre tomas
    this.horarioPrimeraToma = data.horarioPrimeraToma || '08:00';
    this.duracion = data.duracion !== undefined ? data.duracion : 7; // días
    this.notas = data.notas || '';
    this.icono = data.icono || '💊';
    this.activo = data.activo !== undefined ? data.activo : true;
    this.fechaInicio = data.fechaInicio || new Date().toISOString();
    this.horariosGenerados = data.horariosGenerados || [];
  }

  /**
   * Getter para compatibilidad con tests
   */
  get horarios() {
    return this.horariosGenerados;
  }

  /**
   * Setter para compatibilidad con tests
   */
  set horarios(value) {
    this.horariosGenerados = value;
  }

  /**
   * Valida que los datos del medicamento sean correctos
   * RF01-A: Implementar validación de campos obligatorios
   */
  validar() {
    const errores = [];

    if (!this.nombre || this.nombre.trim() === '') {
      errores.push('El nombre del medicamento es obligatorio');
    }

    if (!this.dosis || this.dosis <= 0) {
      errores.push('La dosis debe ser mayor a 0');
    }

    if (
      this.frecuencia === undefined ||
      this.frecuencia === null ||
      this.frecuencia <= 0
    ) {
      errores.push('La frecuencia debe ser mayor a 0');
    }

    if (
      !this.horarioPrimeraToma ||
      !this.validarHorario(this.horarioPrimeraToma)
    ) {
      errores.push(
        'El horario de primera toma debe ser válido (formato HH:MM)',
      );
    }

    if (
      this.duracion === undefined ||
      this.duracion === null ||
      this.duracion <= 0
    ) {
      errores.push('La duración debe ser mayor a 0');
    }

    return {
      valido: errores.length === 0,
      errores: errores,
    };
  }

  /**
   * Valida formato de horario HH:MM
   */
  validarHorario(horario) {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(horario);
  }

  /**
   * Genera los horarios de todas las tomas basado en frecuencia
   * RF02: Recordatorios de medicación
   */
  generarHorarios() {
    const horarios = [];
    const [horas, minutos] = this.horarioPrimeraToma.split(':').map(Number);
    const tomasPorDia = Math.floor(24 / this.frecuencia);
    const totalTomas = tomasPorDia * this.duracion;

    let fechaActual = new Date(this.fechaInicio);
    fechaActual.setHours(horas, minutos, 0, 0);

    for (let i = 0; i < totalTomas; i++) {
      horarios.push({
        id: `${this.id}-toma-${i}`,
        medicamentoId: this.id,
        fechaHora: fechaActual.toISOString(),
        tomada: false,
        pospuesta: false,
        omitida: false,
        motivoOmision: '',
      });

      fechaActual = new Date(
        fechaActual.getTime() + this.frecuencia * 60 * 60 * 1000,
      );
    }

    this.horariosGenerados = horarios;
    return horarios;
  }

  /**
   * Obtiene la próxima toma programada
   */
  obtenerProximaToma() {
    const ahora = new Date();
    const proximasTomas = this.horariosGenerados.filter(
      (h) => new Date(h.fechaHora) > ahora && !h.tomada && !h.omitida,
    );

    if (proximasTomas.length > 0) {
      proximasTomas.sort(
        (a, b) => new Date(a.fechaHora) - new Date(b.fechaHora),
      );
      return proximasTomas[0];
    }

    return null;
  }

  /**
   * Convierte el objeto a formato JSON para almacenamiento
   */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      nombrePaciente: this.nombrePaciente,
      presentacion: this.presentacion,
      dosis: this.dosis,
      unidadDosis: this.unidadDosis,
      frecuencia: this.frecuencia,
      horarioPrimeraToma: this.horarioPrimeraToma,
      duracion: this.duracion,
      notas: this.notas,
      icono: this.icono,
      activo: this.activo,
      fechaInicio: this.fechaInicio,
      horariosGenerados: this.horariosGenerados,
    };
  }

  /**
   * Crea una instancia desde datos JSON
   */
  static fromJSON(json) {
    return new Medicamento(json);
  }
}

export default Medicamento;
