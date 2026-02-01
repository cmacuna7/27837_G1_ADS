/**
 * MODELO: Entidad Síntoma
 * Representa un síntoma asociado a un medicamento
 * RF07: Seguimiento de síntomas
 */
class Sintoma {
  /**
   * @param {Object} data - Datos del síntoma
   */
  constructor(data = {}) {
    this.id = data.id || `sintoma-${Date.now()}-${Math.random()}`;
    this.medicamentoId = data.medicamentoId || null;
    this.nombreMedicamento = data.nombreMedicamento || '';
    this.descripcion = data.descripcion || '';
    this.categoria = data.categoria || 'general'; // general, digestivo, neurologico, cutaneo, respiratorio, cardiovascular
    this.intensidad = data.intensidad || 'leve'; // leve, moderada, severa
    this.fecha = data.fecha || new Date().toISOString();
    this.notas = data.notas || '';
    this.icono = data.icono || this.obtenerIconoPorCategoria(data.categoria);
  }

  /**
   * Valida que los datos del síntoma sean correctos
   */
  validar() {
    const errores = [];

    if (!this.medicamentoId) {
      errores.push('El ID del medicamento es obligatorio');
    }

    if (!this.descripcion || this.descripcion.trim() === '') {
      errores.push('La descripción del síntoma es obligatoria');
    }

    const categoriasValidas = [
      'general',
      'digestivo',
      'neurologico',
      'cutaneo',
      'respiratorio',
      'cardiovascular',
    ];
    if (!categoriasValidas.includes(this.categoria)) {
      errores.push('Categoría de síntoma no válida');
    }

    const intensidadesValidas = ['leve', 'moderada', 'severa'];
    if (!intensidadesValidas.includes(this.intensidad)) {
      errores.push('Intensidad no válida');
    }

    return {
      valido: errores.length === 0,
      errores: errores,
    };
  }

  /**
   * Obtiene el icono según la categoría del síntoma
   */
  obtenerIconoPorCategoria(categoria) {
    const iconos = {
      general: '📋',
      digestivo: '🤢',
      neurologico: '🧠',
      cutaneo: '🩹',
      respiratorio: '🫁',
      cardiovascular: '❤️',
    };
    return iconos[categoria] || '📋';
  }

  /**
   * Obtiene el color según la intensidad
   */
  obtenerColorIntensidad() {
    const colores = {
      leve: '#4CAF50', // Verde
      moderada: '#FF9800', // Naranja
      severa: '#F44336', // Rojo
    };
    return colores[this.intensidad] || '#757575';
  }

  /**
   * Obtiene una descripción legible del síntoma
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

    return `${this.icono} ${this.descripcion} - ${fechaStr} ${horaStr} (${this.intensidad})`;
  }

  /**
   * Obtiene las categorías disponibles
   */
  static obtenerCategorias() {
    return [
      { valor: 'general', nombre: 'General', icono: '📋' },
      { valor: 'digestivo', nombre: 'Digestivo', icono: '🤢' },
      { valor: 'neurologico', nombre: 'Neurológico', icono: '🧠' },
      { valor: 'cutaneo', nombre: 'Cutáneo', icono: '🩹' },
      { valor: 'respiratorio', nombre: 'Respiratorio', icono: '🫁' },
      { valor: 'cardiovascular', nombre: 'Cardiovascular', icono: '❤️' },
    ];
  }

  /**
   * Obtiene las intensidades disponibles
   */
  static obtenerIntensidades() {
    return [
      { valor: 'leve', nombre: 'Leve', color: '#4CAF50' },
      { valor: 'moderada', nombre: 'Moderada', color: '#FF9800' },
      { valor: 'severa', nombre: 'Severa', color: '#F44336' },
    ];
  }

  /**
   * Convierte el objeto a formato JSON para almacenamiento
   */
  toJSON() {
    return {
      id: this.id,
      medicamentoId: this.medicamentoId,
      nombreMedicamento: this.nombreMedicamento,
      descripcion: this.descripcion,
      categoria: this.categoria,
      intensidad: this.intensidad,
      fecha: this.fecha,
      notas: this.notas,
      icono: this.icono,
    };
  }

  /**
   * Crea una instancia desde datos JSON
   */
  static fromJSON(json) {
    return new Sintoma(json);
  }
}

export default Sintoma;
