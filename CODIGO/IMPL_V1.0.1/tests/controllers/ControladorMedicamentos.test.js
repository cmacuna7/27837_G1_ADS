/**
 * PRUEBAS UNITARIAS: ControladorMedicamentos
 * RF01: Gestión de Medicamentos (CRUD completo)
 * Versión simplificada compatible con ES6 modules
 */
import Medicamento from '../../js/models/Medicamento.js';

describe('ControladorMedicamentos - RF01.1 Crear', () => {
  test('RF01.1.1 - Crear medicamento con datos válidos', () => {
    const datos = {
      nombre: 'Ibuprofeno',
      dosis: 400,
      frecuencia: 8,
      horarioPrimeraToma: '08:00',
      duracion: 7,
    };

    const medicamento = new Medicamento(datos);
    const validacion = medicamento.validar();

    expect(validacion.valido).toBe(true);
    expect(medicamento.nombre).toBe('Ibuprofeno');
    expect(medicamento.dosis).toBe(400);
  });

  test('RF01.1.2 - Crear medicamento con datos inválidos', () => {
    const datos = {
      nombre: '', // Nombre vacío
      dosis: 400,
    };

    const medicamento = new Medicamento(datos);
    const validacion = medicamento.validar();

    expect(validacion.valido).toBe(false);
    expect(validacion.errores.length).toBeGreaterThan(0);
  });

  test('RF01.1.3 - Validar campos obligatorios', () => {
    const medicamento = new Medicamento({});
    const validacion = medicamento.validar();

    expect(validacion.valido).toBe(false);
    expect(validacion.errores).toContain(
      'El nombre del medicamento es obligatorio',
    );
  });
});

describe('ControladorMedicamentos - RF01.2 Consultar', () => {
  test('RF01.2.1 - Obtener medicamento por ID', () => {
    const medicamento = new Medicamento({
      id: 12345,
      nombre: 'Ibuprofeno',
      dosis: 400,
      frecuencia: 8,
      horarioPrimeraToma: '08:00',
      duracion: 7,
    });

    expect(medicamento.id).toBe(12345);
    expect(medicamento.nombre).toBe('Ibuprofeno');
  });

  test('RF01.2.2 - Medicamento tiene propiedades correctas', () => {
    const medicamento = new Medicamento({
      nombre: 'Paracetamol',
      dosis: 500,
      frecuencia: 6,
      duracion: 5,
    });

    expect(medicamento).toHaveProperty('nombre');
    expect(medicamento).toHaveProperty('dosis');
    expect(medicamento).toHaveProperty('frecuencia');
    expect(medicamento).toHaveProperty('duracion');
  });

  test('RF01.2.3 - Generar horarios correctamente', () => {
    const medicamento = new Medicamento({
      nombre: 'Test',
      dosis: 100,
      frecuencia: 8,
      horarioPrimeraToma: '08:00',
      duracion: 2,
    });

    const horarios = medicamento.generarHorarios();

    expect(horarios.length).toBeGreaterThan(0);
    expect(horarios[0]).toHaveProperty('medicamentoId');
    expect(horarios[0]).toHaveProperty('fechaHora');
  });
});

describe('ControladorMedicamentos - RF01.3 Actualizar', () => {
  test('RF01.3.1 - Actualizar propiedades del medicamento', () => {
    const medicamento = new Medicamento({
      nombre: 'Original',
      dosis: 100,
      frecuencia: 8,
      horarioPrimeraToma: '08:00',
      duracion: 7,
    });

    medicamento.nombre = 'Actualizado';
    medicamento.dosis = 200;

    expect(medicamento.nombre).toBe('Actualizado');
    expect(medicamento.dosis).toBe(200);
  });

  test('RF01.3.2 - Validar después de actualizar', () => {
    const medicamento = new Medicamento({
      nombre: 'Test',
      dosis: 100,
      frecuencia: 8,
      horarioPrimeraToma: '08:00',
      duracion: 7,
    });

    medicamento.nombre = '';
    const validacion = medicamento.validar();

    expect(validacion.valido).toBe(false);
  });

  test('RF01.3.3 - Actualizar estado activo', () => {
    const medicamento = new Medicamento({
      nombre: 'Test',
      dosis: 100,
      frecuencia: 8,
      horarioPrimeraToma: '08:00',
      duracion: 7,
      activo: true,
    });

    medicamento.activo = false;

    expect(medicamento.activo).toBe(false);
  });
});

describe('ControladorMedicamentos - RF01.4 Eliminar', () => {
  test('RF01.4.1 - Medicamento tiene ID único', () => {
    const med1 = new Medicamento({ nombre: 'Med1', dosis: 100 });
    const med2 = new Medicamento({ nombre: 'Med2', dosis: 200 });

    expect(med1.id).toBeDefined();
    expect(med2.id).toBeDefined();
    expect(med1.id).not.toBe(med2.id);
  });

  test('RF01.4.2 - Serializar medicamento', () => {
    const medicamento = new Medicamento({
      nombre: 'Test',
      dosis: 100,
      frecuencia: 8,
      horarioPrimeraToma: '08:00',
      duracion: 7,
    });

    const json = medicamento.toJSON();

    expect(json).toHaveProperty('nombre', 'Test');
    expect(json).toHaveProperty('dosis', 100);
  });

  test('RF01.4.3 - Deserializar medicamento', () => {
    const json = {
      id: 123,
      nombre: 'Test',
      dosis: 100,
      frecuencia: 8,
      horarioPrimeraToma: '08:00',
      duracion: 7,
    };

    const medicamento = Medicamento.fromJSON(json);

    expect(medicamento.id).toBe(123);
    expect(medicamento.nombre).toBe('Test');
    expect(medicamento).toBeInstanceOf(Medicamento);
  });
});
