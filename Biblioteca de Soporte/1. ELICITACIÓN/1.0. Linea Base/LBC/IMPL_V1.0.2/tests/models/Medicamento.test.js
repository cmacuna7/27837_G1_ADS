/**
 * PRUEBAS UNITARIAS: Modelo Medicamento
 * RF01: Gestión de Medicamentos
 * RF05: Generación de Horarios
 */
import Medicamento from '../../js/models/Medicamento.js';

describe('Medicamento - RF01.1 Crear Medicamento', () => {
  test('RF01.1.1 - Crear medicamento con datos válidos', () => {
    const datos = {
      nombre: 'Ibuprofeno',
      dosis: 400,
      unidadDosis: 'mg',
      frecuencia: 8,
      horarioPrimeraToma: '08:00',
      duracion: 7,
    };

    const medicamento = new Medicamento(datos);
    const validacion = medicamento.validar();

    expect(validacion.valido).toBe(true);
    expect(validacion.errores).toHaveLength(0);
    expect(medicamento.nombre).toBe('Ibuprofeno');
    expect(medicamento.dosis).toBe(400);
    expect(medicamento.unidadDosis).toBe('mg');
    expect(medicamento.frecuencia).toBe(8);
  });

  test('RF01.1.2 - Crear medicamento sin nombre', () => {
    const datos = {
      nombre: '',
      dosis: 400,
      frecuencia: 8,
      horarioPrimeraToma: '08:00',
      duracion: 7,
    };

    const medicamento = new Medicamento(datos);
    const validacion = medicamento.validar();

    expect(validacion.valido).toBe(false);
    expect(validacion.errores).toContain(
      'El nombre del medicamento es obligatorio',
    );
  });

  test('RF01.1.3 - Crear medicamento con dosis inválida', () => {
    const datos = {
      nombre: 'Ibuprofeno',
      dosis: 0,
      frecuencia: 8,
      horarioPrimeraToma: '08:00',
      duracion: 7,
    };

    const medicamento = new Medicamento(datos);
    const validacion = medicamento.validar();

    expect(validacion.valido).toBe(false);
    expect(validacion.errores).toContain('La dosis debe ser mayor a 0');
  });

  test('RF01.1.4 - Crear medicamento con horario inválido', () => {
    const datos = {
      nombre: 'Ibuprofeno',
      dosis: 400,
      frecuencia: 8,
      horarioPrimeraToma: '25:00',
      duracion: 7,
    };

    const medicamento = new Medicamento(datos);
    const validacion = medicamento.validar();

    expect(validacion.valido).toBe(false);
    expect(validacion.errores).toContain(
      'El horario de primera toma debe ser válido (formato HH:MM)',
    );
  });

  test('RF01.1.5 - Validar generación automática de ID', () => {
    const datos = {
      nombre: 'Ibuprofeno',
      dosis: 400,
      frecuencia: 8,
      horarioPrimeraToma: '08:00',
      duracion: 7,
    };

    const medicamento = new Medicamento(datos);

    expect(medicamento.id).toBeDefined();
    expect(typeof medicamento.id).toBe('number');
  });

  test('RF01.1.6 - Validar frecuencia inválida', () => {
    const datos = {
      nombre: 'Ibuprofeno',
      dosis: 400,
      frecuencia: 0,
      horarioPrimeraToma: '08:00',
      duracion: 7,
    };

    const medicamento = new Medicamento(datos);
    const validacion = medicamento.validar();

    expect(validacion.valido).toBe(false);
    expect(validacion.errores).toContain('La frecuencia debe ser mayor a 0');
  });

  test('RF01.1.7 - Validar duración inválida', () => {
    const datos = {
      nombre: 'Ibuprofeno',
      dosis: 400,
      frecuencia: 8,
      horarioPrimeraToma: '08:00',
      duracion: 0,
    };

    const medicamento = new Medicamento(datos);
    const validacion = medicamento.validar();

    expect(validacion.valido).toBe(false);
    expect(validacion.errores).toContain('La duración debe ser mayor a 0');
  });
});

describe('Medicamento - RF05.1 Generación de Horarios', () => {
  test('RF05.1.1 - Generar horarios cada 8 horas para 2 días', () => {
    const medicamento = new Medicamento({
      nombre: 'Test',
      dosis: 100,
      frecuencia: 8,
      horarioPrimeraToma: '08:00',
      duracion: 2,
      fechaInicio: '2026-01-21T00:00:00',
    });

    medicamento.generarHorarios();

    const tomasPorDia = Math.floor(24 / 8); // 3
    const totalEsperado = tomasPorDia * 2; // 6

    expect(medicamento.horariosGenerados).toHaveLength(totalEsperado);
    expect(medicamento.horariosGenerados[0].tomada).toBe(false);
    expect(medicamento.horariosGenerados[0].medicamentoId).toBe(medicamento.id);
  });

  test('RF05.1.2 - Generar horarios cada 12 horas para 1 día', () => {
    const medicamento = new Medicamento({
      nombre: 'Test',
      dosis: 100,
      frecuencia: 12,
      horarioPrimeraToma: '09:00',
      duracion: 1,
      fechaInicio: '2026-01-21T00:00:00',
    });

    medicamento.generarHorarios();

    const tomasPorDia = Math.floor(24 / 12); // 2
    const totalEsperado = tomasPorDia * 1; // 2

    expect(medicamento.horariosGenerados).toHaveLength(totalEsperado);
  });

  test('RF05.1.3 - Validar formato de horarios generados', () => {
    const medicamento = new Medicamento({
      nombre: 'Test',
      dosis: 100,
      frecuencia: 12,
      horarioPrimeraToma: '09:00',
      duracion: 1,
    });

    medicamento.generarHorarios();

    medicamento.horariosGenerados.forEach((horario) => {
      expect(horario).toHaveProperty('id');
      expect(horario).toHaveProperty('fechaHora');
      expect(horario).toHaveProperty('tomada');
      expect(horario).toHaveProperty('medicamentoId');
      expect(horario.tomada).toBe(false);
      expect(horario.pospuesta).toBe(false);
      expect(horario.omitida).toBe(false);
    });
  });

  test('RF05.1.4 - Validar intervalo correcto entre tomas', () => {
    const medicamento = new Medicamento({
      nombre: 'Test',
      dosis: 100,
      frecuencia: 8,
      horarioPrimeraToma: '08:00',
      duracion: 1,
    });

    medicamento.generarHorarios();

    // Verificar que hay diferencia de 8 horas entre tomas
    for (let i = 1; i < medicamento.horariosGenerados.length; i++) {
      const fecha1 = new Date(medicamento.horariosGenerados[i - 1].fechaHora);
      const fecha2 = new Date(medicamento.horariosGenerados[i].fechaHora);
      const diferenciaHoras = (fecha2 - fecha1) / (1000 * 60 * 60);

      expect(diferenciaHoras).toBe(8);
    }
  });
});

describe('Medicamento - Métodos Adicionales', () => {
  test('Validar formato de horario correcto', () => {
    const medicamento = new Medicamento();

    expect(medicamento.validarHorario('08:00')).toBe(true);
    expect(medicamento.validarHorario('23:59')).toBe(true);
    expect(medicamento.validarHorario('00:00')).toBe(true);
  });

  test('Validar formato de horario incorrecto', () => {
    const medicamento = new Medicamento();

    expect(medicamento.validarHorario('25:00')).toBe(false);
    expect(medicamento.validarHorario('12:60')).toBe(false);
    expect(medicamento.validarHorario('abc')).toBe(false);
    expect(medicamento.validarHorario('12-30')).toBe(false);
  });

  test('toJSON - Serializar medicamento', () => {
    const medicamento = new Medicamento({
      nombre: 'Test',
      dosis: 100,
    });

    const json = medicamento.toJSON();

    expect(json).toHaveProperty('nombre');
    expect(json).toHaveProperty('dosis');
    expect(json).toHaveProperty('id');
    expect(json.nombre).toBe('Test');
  });

  test('fromJSON - Deserializar medicamento', () => {
    const data = {
      id: 123,
      nombre: 'Test',
      dosis: 100,
      frecuencia: 8,
    };

    const medicamento = Medicamento.fromJSON(data);

    expect(medicamento).toBeInstanceOf(Medicamento);
    expect(medicamento.id).toBe(123);
    expect(medicamento.nombre).toBe('Test');
  });
});
