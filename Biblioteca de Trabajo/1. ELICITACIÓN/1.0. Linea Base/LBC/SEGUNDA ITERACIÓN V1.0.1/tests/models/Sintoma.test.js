/**
 * PRUEBAS UNITARIAS: Modelo Sintoma
 * RF07: Seguimiento de síntomas
 */
import Sintoma from '../../js/models/Sintoma.js';

describe('Sintoma - RF07.1 Modelo', () => {
  test('RF07.1.1 - Crear síntoma válido', () => {
    const sintoma = new Sintoma({
      medicamentoId: 123,
      nombreMedicamento: 'Ibuprofeno',
      descripcion: 'Dolor de estómago',
      categoria: 'digestivo',
      intensidad: 'moderada',
    });

    const validacion = sintoma.validar();

    expect(validacion.valido).toBe(true);
    expect(validacion.errores).toHaveLength(0);
    expect(sintoma.categoria).toBe('digestivo');
    expect(sintoma.intensidad).toBe('moderada');
    expect(sintoma.descripcion).toBe('Dolor de estómago');
  });

  test('RF07.1.2 - Validar descripción obligatoria', () => {
    const sintoma = new Sintoma({
      medicamentoId: 123,
      descripcion: '',
    });

    const validacion = sintoma.validar();

    expect(validacion.valido).toBe(false);
    expect(validacion.errores).toContain(
      'La descripción del síntoma es obligatoria',
    );
  });

  test('RF07.1.3 - Validar categoría válida', () => {
    const sintoma = new Sintoma({
      medicamentoId: 123,
      descripcion: 'Test',
      categoria: 'invalida',
    });

    const validacion = sintoma.validar();

    expect(validacion.valido).toBe(false);
    expect(validacion.errores).toContain('Categoría de síntoma no válida');
  });

  test('RF07.1.4 - Validar intensidad válida', () => {
    const sintoma = new Sintoma({
      medicamentoId: 123,
      descripcion: 'Test',
      intensidad: 'extrema',
    });

    const validacion = sintoma.validar();

    expect(validacion.valido).toBe(false);
    expect(validacion.errores).toContain('Intensidad no válida');
  });

  test('RF07.1.5 - Validar medicamentoId obligatorio', () => {
    const sintoma = new Sintoma({
      descripcion: 'Test',
    });

    const validacion = sintoma.validar();

    expect(validacion.valido).toBe(false);
    expect(validacion.errores).toContain(
      'El ID del medicamento es obligatorio',
    );
  });

  test('RF07.1.6 - Validar categorías permitidas', () => {
    const categoriasValidas = [
      'general',
      'digestivo',
      'neurologico',
      'cutaneo',
      'respiratorio',
      'cardiovascular',
    ];

    categoriasValidas.forEach((categoria) => {
      const sintoma = new Sintoma({
        medicamentoId: 123,
        descripcion: 'Test',
        categoria: categoria,
      });

      expect(sintoma.validar().valido).toBe(true);
    });
  });

  test('RF07.1.7 - Validar intensidades permitidas', () => {
    const intensidadesValidas = ['leve', 'moderada', 'severa'];

    intensidadesValidas.forEach((intensidad) => {
      const sintoma = new Sintoma({
        medicamentoId: 123,
        descripcion: 'Test',
        intensidad: intensidad,
      });

      expect(sintoma.validar().valido).toBe(true);
    });
  });
});

describe('Sintoma - Métodos de Visualización', () => {
  test('RF07.2.1 - Obtener icono por categoría digestivo', () => {
    const sintoma = new Sintoma({
      medicamentoId: 123,
      descripcion: 'Test',
      categoria: 'digestivo',
    });

    const icono = sintoma.obtenerIconoPorCategoria('digestivo');
    expect(icono).toBe('🤢');
  });

  test('RF07.2.2 - Obtener icono por categoría neurológico', () => {
    const sintoma = new Sintoma({
      medicamentoId: 123,
      descripcion: 'Test',
      categoria: 'neurologico',
    });

    expect(sintoma.icono).toBe('🧠');
  });

  test('RF07.2.3 - Obtener icono por categoría cutáneo', () => {
    const sintoma = new Sintoma({
      medicamentoId: 123,
      descripcion: 'Test',
      categoria: 'cutaneo',
    });

    expect(sintoma.icono).toBe('🩹');
  });

  test('RF07.2.4 - Obtener color según intensidad leve', () => {
    const sintoma = new Sintoma({
      medicamentoId: 123,
      descripcion: 'Test',
      intensidad: 'leve',
    });

    const color = sintoma.obtenerColorIntensidad();
    expect(color).toBe('#4CAF50'); // Verde
  });

  test('RF07.2.5 - Obtener color según intensidad moderada', () => {
    const sintoma = new Sintoma({
      medicamentoId: 123,
      descripcion: 'Test',
      intensidad: 'moderada',
    });

    const color = sintoma.obtenerColorIntensidad();
    expect(color).toBe('#FF9800'); // Naranja
  });

  test('RF07.2.6 - Obtener color según intensidad severa', () => {
    const sintoma = new Sintoma({
      medicamentoId: 123,
      descripcion: 'Test',
      intensidad: 'severa',
    });

    const color = sintoma.obtenerColorIntensidad();
    expect(color).toBe('#F44336'); // Rojo
  });
});

describe('Sintoma - Serialización', () => {
  test('toJSON - Serializar síntoma', () => {
    const sintoma = new Sintoma({
      medicamentoId: 123,
      descripcion: 'Test',
      categoria: 'general',
      intensidad: 'leve',
    });

    const json = sintoma.toJSON();

    expect(json).toHaveProperty('id');
    expect(json).toHaveProperty('medicamentoId');
    expect(json).toHaveProperty('descripcion');
    expect(json).toHaveProperty('categoria');
    expect(json).toHaveProperty('intensidad');
  });

  test('fromJSON - Deserializar síntoma', () => {
    const data = {
      id: 'sintoma-123',
      medicamentoId: 456,
      descripcion: 'Test',
      categoria: 'digestivo',
      intensidad: 'moderada',
    };

    const sintoma = Sintoma.fromJSON(data);

    expect(sintoma).toBeInstanceOf(Sintoma);
    expect(sintoma.id).toBe('sintoma-123');
    expect(sintoma.medicamentoId).toBe(456);
    expect(sintoma.categoria).toBe('digestivo');
  });

  test('Generar ID automático', () => {
    const sintoma = new Sintoma({
      medicamentoId: 123,
      descripcion: 'Test',
    });

    expect(sintoma.id).toBeDefined();
    expect(typeof sintoma.id).toBe('string');
    expect(sintoma.id).toContain('sintoma-');
  });
});
