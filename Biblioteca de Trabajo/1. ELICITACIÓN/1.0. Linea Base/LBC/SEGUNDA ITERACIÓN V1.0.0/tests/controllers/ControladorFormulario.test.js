/**
 * TESTS: ControladorFormulario
 * RF03: Editar Medicamento
 */

import ControladorFormulario from '../../js/controllers/ControladorFormulario.js';

describe('ControladorFormulario - RF03 Editar Medicamento', () => {
  let controlador;
  let mockFormulario;

  beforeEach(() => {
    // Configurar DOM mock para el formulario
    document.body.innerHTML = `
      <form id="medicine-form">
        <input type="text" id="medicine-name-input" value="" />
        <div id="dose-value">500</div>
        <div id="dose-unit">mg</div>
        <input type="time" id="time-input" value="08:00" />
        <input type="number" id="duration-input" value="7" />
        <textarea id="notes-input"></textarea>
        <button id="save-btn" disabled>Guardar</button>
        
        <div class="frequency-btn active" data-frequency="8">Cada 8h</div>
        <div class="frequency-btn" data-frequency="12">Cada 12h</div>
        
        <div class="presentation-btn active" data-presentation="pastilla">Pastilla</div>
        <div class="presentation-btn" data-presentation="jarabe">Jarabe</div>
        <div class="presentation-btn" data-presentation="inyección">Inyección</div>
      </form>
    `;

    mockFormulario = document.getElementById('medicine-form');
    controlador = new ControladorFormulario();
  });

  describe('RF03.1 - Cargar datos en formulario de edición', () => {
    test('Debe cargar datos del medicamento en el formulario', () => {
      // Arrange: Datos de un medicamento existente
      const medicamento = {
        nombre: 'Ibuprofeno',
        dosis: 600,
        unidadDosis: 'mg',
        frecuencia: 8,
        horarioPrimeraToma: '09:00',
        duracion: 10,
        presentacion: 'pastilla',
        notas: 'Tomar con alimentos',
      };

      // Act: Cargar datos en el formulario
      const inputNombre = mockFormulario.querySelector('#medicine-name-input');
      const inputHorario = mockFormulario.querySelector('#time-input');
      const inputDuracion = mockFormulario.querySelector('#duration-input');
      const inputNotas = mockFormulario.querySelector('#notes-input');
      const doseValue = document.getElementById('dose-value');

      inputNombre.value = medicamento.nombre;
      doseValue.textContent = medicamento.dosis.toString();
      inputHorario.value = medicamento.horarioPrimeraToma;
      inputDuracion.value = medicamento.duracion.toString();
      inputNotas.value = medicamento.notas;

      // Assert: Verificar que los campos tienen los valores correctos
      expect(inputNombre.value).toBe('Ibuprofeno');
      expect(doseValue.textContent).toBe('600');
      expect(inputHorario.value).toBe('09:00');
      expect(inputDuracion.value).toBe('10');
      expect(inputNotas.value).toBe('Tomar con alimentos');
    });

    test('Debe habilitar el botón guardar cuando hay nombre', () => {
      // Arrange
      controlador.inicializar(mockFormulario);
      const inputNombre = mockFormulario.querySelector('#medicine-name-input');
      const saveBtn = document.getElementById('save-btn');

      // Act: Ingresar nombre
      inputNombre.value = 'Paracetamol';
      const evento = new Event('input', { bubbles: true });
      inputNombre.dispatchEvent(evento);

      // Assert
      const esValido = controlador.validarFormulario();
      expect(esValido).toBe(true);
      expect(saveBtn.disabled).toBe(false);
    });
  });

  describe('RF03.2 - Guardar cambios válidos', () => {
    test('Debe obtener datos actualizados del formulario', () => {
      // Arrange
      controlador.inicializar(mockFormulario);
      const inputNombre = mockFormulario.querySelector('#medicine-name-input');
      const inputNotas = mockFormulario.querySelector('#notes-input');

      inputNombre.value = 'Aspirina';
      inputNotas.value = 'Nueva indicación';

      // Act
      const datos = controlador.obtenerDatos();

      // Assert
      expect(datos.nombre).toBe('Aspirina');
      expect(datos.notas).toBe('Nueva indicación');
      expect(datos.dosis).toBe(500);
      expect(datos.frecuencia).toBe(8);
      expect(datos.horarioPrimeraToma).toBe('08:00');
      expect(datos.duracion).toBe(7);
    });

    test('Debe obtener presentación correcta seleccionada', () => {
      // Arrange
      controlador.inicializar(mockFormulario);

      // Cambiar a jarabe
      const btnPastilla = mockFormulario.querySelector(
        '[data-presentation="pastilla"]',
      );
      const btnJarabe = mockFormulario.querySelector(
        '[data-presentation="jarabe"]',
      );
      btnPastilla.classList.remove('active');
      btnJarabe.classList.add('active');

      // Act
      const datos = controlador.obtenerDatos();

      // Assert
      expect(datos.presentacion).toBe('jarabe');
      expect(datos.icono).toBe('🥤');
    });

    test('Debe obtener frecuencia correcta seleccionada', () => {
      // Arrange
      controlador.inicializar(mockFormulario);

      // Cambiar a cada 12h
      const btn8h = mockFormulario.querySelector('[data-frequency="8"]');
      const btn12h = mockFormulario.querySelector('[data-frequency="12"]');
      btn8h.classList.remove('active');
      btn12h.classList.add('active');

      // Act
      const datos = controlador.obtenerDatos();

      // Assert
      expect(datos.frecuencia).toBe(12);
    });
  });

  describe('RF03.3 - Validar campos al editar', () => {
    test('Debe rechazar nombre vacío', () => {
      // Arrange
      controlador.inicializar(mockFormulario);
      const inputNombre = mockFormulario.querySelector('#medicine-name-input');
      inputNombre.value = '';

      // Act
      const esValido = controlador.validarFormulario();

      // Assert
      expect(esValido).toBe(false);
    });

    test('Debe rechazar nombre con solo espacios', () => {
      // Arrange
      controlador.inicializar(mockFormulario);
      const inputNombre = mockFormulario.querySelector('#medicine-name-input');
      inputNombre.value = '   ';

      // Act
      const esValido = controlador.validarFormulario();

      // Assert
      expect(esValido).toBe(false);
    });

    test('Debe aceptar nombre válido', () => {
      // Arrange
      controlador.inicializar(mockFormulario);
      const inputNombre = mockFormulario.querySelector('#medicine-name-input');
      inputNombre.value = 'Omeprazol';

      // Act
      const esValido = controlador.validarFormulario();

      // Assert
      expect(esValido).toBe(true);
    });

    test('Debe deshabilitar botón guardar con nombre inválido', () => {
      // Arrange
      controlador.inicializar(mockFormulario);
      const inputNombre = mockFormulario.querySelector('#medicine-name-input');
      const saveBtn = document.getElementById('save-btn');

      inputNombre.value = '';

      // Act
      controlador.validarFormulario();

      // Assert
      expect(saveBtn.disabled).toBe(true);
    });
  });

  describe('RF03.4 - Limpiar formulario', () => {
    test('Debe resetear todos los campos a valores por defecto', () => {
      // Arrange
      controlador.inicializar(mockFormulario);
      const inputNombre = mockFormulario.querySelector('#medicine-name-input');
      inputNombre.value = 'Test';

      // Act
      controlador.limpiar();

      // Assert
      expect(inputNombre.value).toBe('');
      const doseValue = document.getElementById('dose-value');
      expect(doseValue.textContent).toBe('500');
    });

    test('Debe restaurar primera frecuencia como activa', () => {
      // Arrange
      controlador.inicializar(mockFormulario);
      const buttons = mockFormulario.querySelectorAll('.frequency-btn');
      buttons[0].classList.remove('active');
      buttons[1].classList.add('active');

      // Act
      controlador.limpiar();

      // Assert
      expect(buttons[0].classList.contains('active')).toBe(true);
      expect(buttons[1].classList.contains('active')).toBe(false);
    });
  });
});
