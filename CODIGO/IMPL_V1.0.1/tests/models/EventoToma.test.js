/**
 * PRUEBAS UNITARIAS: Modelo EventoToma
 * RF06: Informes de historial de medicación
 */
import EventoToma from '../../js/models/EventoToma.js';

describe('EventoToma - RF06.1 Modelo', () => {
  test('RF06.1.1 - Crear evento de toma válido', () => {
    const evento = new EventoToma({
      medicamentoId: 123,
      nombreMedicamento: 'Ibuprofeno',
      tipo: 'tomado',
      dosis: 400,
      unidadDosis: 'mg',
    });

    const validacion = evento.validar();

    expect(validacion.valido).toBe(true);
    expect(validacion.errores).toHaveLength(0);
    expect(evento.tipo).toBe('tomado');
    expect(evento.medicamentoId).toBe(123);
    expect(evento.nombreMedicamento).toBe('Ibuprofeno');
  });

  test('RF06.1.2 - Validar tipo de evento inválido', () => {
    const evento = new EventoToma({
      medicamentoId: 123,
      tipo: 'invalido',
    });

    const validacion = evento.validar();

    expect(validacion.valido).toBe(false);
    expect(validacion.errores).toContain(
      'El tipo de evento debe ser: tomado, omitido o pospuesto',
    );
  });

  test('RF06.1.3 - Validar medicamentoId obligatorio', () => {
    const evento = new EventoToma({
      tipo: 'tomado',
    });

    const validacion = evento.validar();

    expect(validacion.valido).toBe(false);
    expect(validacion.errores).toContain(
      'El ID del medicamento es obligatorio',
    );
  });

  test('RF06.1.4 - Validar fecha obligatoria', () => {
    const evento = new EventoToma({
      medicamentoId: 123,
      tipo: 'tomado',
      fecha: null,
    });

    const validacion = evento.validar();

    expect(validacion.valido).toBe(false);
    expect(validacion.errores).toContain('La fecha del evento es obligatoria');
  });

  test('RF06.1.5 - Generar ID automático', () => {
    const evento = new EventoToma({
      medicamentoId: 123,
      tipo: 'tomado',
    });

    expect(evento.id).toBeDefined();
    expect(typeof evento.id).toBe('string');
    expect(evento.id).toContain('evento-');
  });

  test('RF06.1.6 - Validar tipos de evento permitidos', () => {
    const eventoTomado = new EventoToma({
      medicamentoId: 123,
      tipo: 'tomado',
    });
    const eventoOmitido = new EventoToma({
      medicamentoId: 123,
      tipo: 'omitido',
    });
    const eventoPospuesto = new EventoToma({
      medicamentoId: 123,
      tipo: 'pospuesto',
    });

    expect(eventoTomado.validar().valido).toBe(true);
    expect(eventoOmitido.validar().valido).toBe(true);
    expect(eventoPospuesto.validar().valido).toBe(true);
  });
});

describe('EventoToma - Métodos de Descripción', () => {
  test('RF06.2.1 - Obtener descripción de evento tomado', () => {
    const evento = new EventoToma({
      medicamentoId: 123,
      tipo: 'tomado',
      fecha: '2026-01-21T10:30:00',
    });

    const descripcion = evento.obtenerDescripcion();

    expect(descripcion).toContain('✅');
    expect(descripcion).toContain('Tomado');
  });

  test('RF06.2.2 - Obtener descripción de evento omitido con motivo', () => {
    const evento = new EventoToma({
      medicamentoId: 123,
      tipo: 'omitido',
      motivo: 'Olvido',
      fecha: '2026-01-21T10:30:00',
    });

    const descripcion = evento.obtenerDescripcion();

    expect(descripcion).toContain('❌');
    expect(descripcion).toContain('Omitido');
    expect(descripcion).toContain('Olvido');
  });

  test('RF06.2.3 - Obtener descripción de evento pospuesto', () => {
    const evento = new EventoToma({
      medicamentoId: 123,
      tipo: 'pospuesto',
      motivo: 'Esperando comida',
      fecha: '2026-01-21T10:30:00',
    });

    const descripcion = evento.obtenerDescripcion();

    expect(descripcion).toContain('⏰');
    expect(descripcion).toContain('Pospuesto');
    expect(descripcion).toContain('Esperando comida');
  });

  test('RF06.2.4 - Obtener icono según tipo de evento', () => {
    const eventoTomado = new EventoToma({
      medicamentoId: 123,
      tipo: 'tomado',
    });
    const eventoOmitido = new EventoToma({
      medicamentoId: 123,
      tipo: 'omitido',
    });
    const eventoPospuesto = new EventoToma({
      medicamentoId: 123,
      tipo: 'pospuesto',
    });

    expect(eventoTomado.obtenerIcono()).toBe('✅');
    expect(eventoOmitido.obtenerIcono()).toBe('❌');
    expect(eventoPospuesto.obtenerIcono()).toBe('⏰');
  });
});

describe('EventoToma - Serialización', () => {
  test('toJSON - Serializar evento', () => {
    const evento = new EventoToma({
      medicamentoId: 123,
      nombreMedicamento: 'Ibuprofeno',
      tipo: 'tomado',
      dosis: 400,
    });

    const json = evento.toJSON();

    expect(json).toHaveProperty('id');
    expect(json).toHaveProperty('medicamentoId');
    expect(json).toHaveProperty('tipo');
    expect(json).toHaveProperty('fecha');
    expect(json.medicamentoId).toBe(123);
    expect(json.tipo).toBe('tomado');
  });

  test('fromJSON - Deserializar evento', () => {
    const data = {
      id: 'evento-123',
      medicamentoId: 456,
      tipo: 'omitido',
      motivo: 'Test',
    };

    const evento = EventoToma.fromJSON(data);

    expect(evento).toBeInstanceOf(EventoToma);
    expect(evento.id).toBe('evento-123');
    expect(evento.medicamentoId).toBe(456);
    expect(evento.tipo).toBe('omitido');
  });
});
