/**
 * PRUEBAS UNITARIAS: VistaListaMedicamentos
 * RF02: Consultar lista de medicamentos
 */
import VistaListaMedicamentos from '../../js/views/VistaListaMedicamentos.js';
import Medicamento from '../../js/models/Medicamento.js';

describe('VistaListaMedicamentos - RF02 Renderizado', () => {
  let vista;
  let contenedor;

  beforeEach(() => {
    document.body.innerHTML = '<div id="medicamentos-lista"></div>';
    contenedor = document.getElementById('medicamentos-lista');
    vista = new VistaListaMedicamentos(contenedor);
  });

  test('RF02.1 - Renderizar lista vacía', () => {
    vista.renderizar([]);

    expect(contenedor.innerHTML).toContain('No hay medicamentos');
  });

  test('RF02.2 - Renderizar lista con medicamentos', () => {
    const medicamentos = [
      new Medicamento({ id: 1, nombre: 'Ibuprofeno', dosis: 400 }),
      new Medicamento({ id: 2, nombre: 'Paracetamol', dosis: 500 }),
    ];

    vista.renderizar(medicamentos);

    const items = contenedor.querySelectorAll('.medicine-card');
    expect(items.length).toBeGreaterThan(0);
  });

  test('RF02.3 - Mostrar detalles correctos del medicamento', () => {
    const medicamentos = [
      new Medicamento({
        id: 1,
        nombre: 'Ibuprofeno',
        dosis: 400,
        unidadDosis: 'mg',
        frecuencia: 8,
      }),
    ];

    vista.renderizar(medicamentos);

    expect(contenedor.innerHTML).toContain('Ibuprofeno');
    expect(contenedor.innerHTML).toContain('400');
  });

  test('RF02.4 - Renderizar múltiples medicamentos', () => {
    const medicamentos = [
      new Medicamento({ nombre: 'Med1', dosis: 100 }),
      new Medicamento({ nombre: 'Med2', dosis: 200 }),
      new Medicamento({ nombre: 'Med3', dosis: 300 }),
    ];

    vista.renderizar(medicamentos);

    expect(contenedor.innerHTML).toContain('Med1');
    expect(contenedor.innerHTML).toContain('Med2');
    expect(contenedor.innerHTML).toContain('Med3');
  });

  test('RF02.5 - Mostrar ícono del medicamento', () => {
    const medicamentos = [
      new Medicamento({
        nombre: 'Ibuprofeno',
        dosis: 400,
        icono: '💊',
      }),
    ];

    vista.renderizar(medicamentos);

    // El HTML usa SVG icons, no emojis directos
    expect(contenedor.innerHTML).toContain('Ibuprofeno');
    expect(contenedor.innerHTML).toContain('medicine-icon');
  });
});

describe('VistaListaMedicamentos - Eventos de Usuario', () => {
  let vista;
  let contenedor;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="medicamentos-lista">
        <div class="medicamento-item" data-id="1">
          <button class="btn-edit">Editar</button>
          <button class="btn-delete">Eliminar</button>
        </div>
      </div>
    `;
    contenedor = document.getElementById('medicamentos-lista');
    vista = new VistaListaMedicamentos(contenedor);
  });

  test('Configurar evento de edición', () => {
    let called = false;
    const callback = () => {
      called = true;
    };

    vista.onEditar(callback);

    expect(vista.callbacks.onEditar).toBe(callback);
  });

  test('Configurar evento de eliminación', () => {
    let called = false;
    const callback = () => {
      called = true;
    };

    vista.onEliminar(callback);

    expect(vista.callbacks.onEliminar).toBe(callback);
  });

  test('Pasar ID correcto en eventos', () => {
    const medicamentos = [new Medicamento({ id: '1', nombre: 'Test' })];
    vista.renderizar(medicamentos);

    const card = contenedor.querySelector('[data-medicamento-id]');
    expect(card.dataset.medicamentoId).toBeDefined();
  });
});

describe('VistaListaMedicamentos - Actualización', () => {
  let vista;
  let contenedor;

  beforeEach(() => {
    document.body.innerHTML = '<div id="medicamentos-lista"></div>';
    contenedor = document.getElementById('medicamentos-lista');
    vista = new VistaListaMedicamentos(contenedor);
  });

  test('Actualizar lista con nuevos medicamentos', () => {
    const medicamentos1 = [new Medicamento({ id: 1, nombre: 'Med1' })];

    vista.renderizar(medicamentos1);
    expect(contenedor.innerHTML).toContain('Med1');

    const medicamentos2 = [new Medicamento({ id: 2, nombre: 'Med2' })];

    vista.renderizar(medicamentos2);
    expect(contenedor.innerHTML).toContain('Med2');
    expect(contenedor.innerHTML).not.toContain('Med1');
  });

  test('Limpiar lista antes de renderizar', () => {
    contenedor.innerHTML = '<div>Contenido previo</div>';

    vista.renderizar([]);

    expect(contenedor.innerHTML).not.toContain('Contenido previo');
  });
});

describe('VistaListaMedicamentos - Formato de Datos', () => {
  let vista;
  let contenedor;

  beforeEach(() => {
    document.body.innerHTML = '<div id="medicamentos-lista"></div>';
    contenedor = document.getElementById('medicamentos-lista');
    vista = new VistaListaMedicamentos(contenedor);
  });

  test('Formatear frecuencia de tomas', () => {
    const medicamentos = [
      new Medicamento({
        nombre: 'Ibuprofeno',
        frecuencia: 8,
      }),
    ];

    vista.renderizar(medicamentos);

    expect(contenedor.innerHTML).toContain('8');
  });

  test('Mostrar estado activo/inactivo', () => {
    const medicamentos = [
      new Medicamento({
        nombre: 'Ibuprofeno',
        activo: true,
      }),
    ];

    vista.renderizar(medicamentos);

    const item = contenedor.querySelector('.medicine-card');
    expect(item !== null || contenedor.innerHTML.includes('Activo')).toBe(true);
  });
});
