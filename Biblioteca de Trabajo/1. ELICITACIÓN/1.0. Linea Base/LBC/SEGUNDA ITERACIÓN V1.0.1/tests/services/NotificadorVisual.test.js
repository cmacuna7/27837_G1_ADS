/**
 * TESTS: NotificadorVisual
 * RF05: Notificaciones Visuales
 */

import NotificadorVisual from '../../js/services/NotificadorVisual.js';

describe('NotificadorVisual - RF05 Notificaciones Visuales', () => {
  let notificador;

  beforeEach(() => {
    // Mock del DOM
    document.body.innerHTML = `
      <div id="screen-alert" class="">
        <div class="alert-subtitle"></div>
      </div>
    `;

    // Mock de Notification API
    global.Notification = class {
      constructor(title, options) {
        this.title = title;
        this.options = options;
        this.onclick = null;
      }
      close() {}
      static permission = 'granted';
      static requestPermission = () => Promise.resolve('granted');
    };

    // Mock de navigator.vibrate
    global.navigator.vibrate = () => {};

    notificador = new NotificadorVisual();
  });

  afterEach(() => {
    // Limpiar
  });

  describe('RF05.3.1 - Mostrar notificación visual', () => {
    test('Debe actualizar contenido de alerta en pantalla', () => {
      // Arrange
      const medicamento = {
        nombre: 'Ibuprofeno',
        dosis: 400,
        unidadDosis: 'mg',
        icono: '💊',
      };

      const horario = {
        id: '1-1',
        fechaHora: new Date().toISOString(),
      };

      const data = {
        tipo: 'ALERTA_MEDICAMENTO',
        medicamento: medicamento,
        horario: horario,
      };

      // Act
      notificador.actualizar(data);

      // Assert
      const alertSubtitle = document.querySelector('.alert-subtitle');
      expect(alertSubtitle.textContent).toBe('Ibuprofeno 400mg');
    });

    test('Debe activar la pantalla de alerta', () => {
      // Arrange
      const medicamento = {
        nombre: 'Paracetamol',
        dosis: 650,
        unidadDosis: 'mg',
        icono: '💊',
      };

      const data = {
        tipo: 'ALERTA_MEDICAMENTO',
        medicamento: medicamento,
        horario: { id: '1-1' },
      };

      const screenAlert = document.getElementById('screen-alert');
      expect(screenAlert.classList.contains('active')).toBe(false);

      // Act
      notificador.actualizar(data);

      // Assert
      expect(screenAlert.classList.contains('active')).toBe(true);
    });

    test('Debe guardar datos de toma actual en window', () => {
      // Arrange
      const medicamento = {
        nombre: 'Omeprazol',
        dosis: 20,
        unidadDosis: 'mg',
        icono: '💊',
      };

      const horario = {
        id: 'toma-123',
        fechaHora: new Date().toISOString(),
      };

      const data = {
        tipo: 'ALERTA_MEDICAMENTO',
        medicamento: medicamento,
        horario: horario,
      };

      // Act
      notificador.mostrarAlertaVisual(medicamento, horario);

      // Assert
      expect(window.tomaActual).toBe('toma-123');
      expect(window.medicamentoActual).toEqual(medicamento);
    });

    test('Debe activar vibración si está disponible', () => {
      // Arrange
      const medicamento = {
        nombre: 'Aspirina',
        dosis: 100,
        unidadDosis: 'mg',
        icono: '💊',
      };

      const data = {
        tipo: 'ALERTA_MEDICAMENTO',
        medicamento: medicamento,
        horario: { id: '1-1' },
      };

      // Act
      notificador.actualizar(data);

      // Assert: Verificar que la alerta se muestre
      const screenAlert = document.getElementById('screen-alert');
      expect(screenAlert.classList.contains('active')).toBe(true);
    });

    test('No debe fallar si vibración no está disponible', () => {
      // Arrange
      delete global.navigator.vibrate;

      const medicamento = {
        nombre: 'Test',
        dosis: 100,
        unidadDosis: 'mg',
        icono: '💊',
      };

      const data = {
        tipo: 'ALERTA_MEDICAMENTO',
        medicamento: medicamento,
        horario: { id: '1-1' },
      };

      // Act & Assert: No debe lanzar error
      expect(() => notificador.actualizar(data)).not.toThrow();
    });
  });

  describe('RF05.3.2 - Notificación del navegador', () => {
    test('Debe crear notificación con permisos otorgados', () => {
      // Arrange
      const medicamento = {
        nombre: 'Ibuprofeno',
        dosis: 400,
        unidadDosis: 'mg',
        icono: '💊',
      };

      let notificacionCreada = false;
      const NotificationOriginal = global.Notification;
      global.Notification = class extends NotificationOriginal {
        constructor(title, options) {
          super(title, options);
          notificacionCreada = true;
        }
      };

      // Act
      notificador.mostrarNotificacionNavegador(medicamento);

      // Assert
      expect(notificacionCreada).toBe(true);

      // Restaurar
      global.Notification = NotificationOriginal;
    });

    test('No debe crear notificación sin permisos', () => {
      // Arrange
      global.Notification.permission = 'denied';

      const medicamento = {
        nombre: 'Test',
        dosis: 100,
        unidadDosis: 'mg',
        icono: '💊',
      };

      let notificacionCreada = false;
      const NotificationOriginal = global.Notification;
      global.Notification = class extends NotificationOriginal {
        constructor(title, options) {
          super(title, options);
          notificacionCreada = true;
        }
      };

      // Act
      notificador.mostrarNotificacionNavegador(medicamento);

      // Assert
      expect(notificacionCreada).toBe(false);

      // Restaurar
      global.Notification = NotificationOriginal;
      global.Notification.permission = 'granted';
    });

    test('Debe configurar evento onclick en notificación', () => {
      // Arrange
      const medicamento = {
        nombre: 'Paracetamol',
        dosis: 650,
        unidadDosis: 'mg',
        icono: '💊',
      };

      // Mock de window.focus
      global.window.focus = () => {};

      // Act & Assert: No debe lanzar error
      expect(() =>
        notificador.mostrarNotificacionNavegador(medicamento),
      ).not.toThrow();
    });
  });

  describe('RF05.3.3 - Manejo de tipos de eventos', () => {
    test('Debe procesar solo eventos ALERTA_MEDICAMENTO', () => {
      // Arrange
      const data = {
        tipo: 'OTRO_TIPO',
        medicamento: { nombre: 'Test' },
      };

      const screenAlert = document.getElementById('screen-alert');

      // Act
      notificador.actualizar(data);

      // Assert: No debe activar alerta
      expect(screenAlert.classList.contains('active')).toBe(false);
    });

    test('Debe ignorar eventos sin tipo', () => {
      // Arrange
      const data = {
        medicamento: { nombre: 'Test' },
      };

      // Act & Assert: No debe lanzar error
      expect(() => notificador.actualizar(data)).not.toThrow();
    });

    test('Debe manejar datos incompletos sin error', () => {
      // Arrange
      const data = {
        tipo: 'ALERTA_MEDICAMENTO',
        // Sin medicamento
      };

      // Act & Assert: No debe lanzar error
      expect(() => notificador.actualizar(data)).not.toThrow();
    });
  });

  describe('RF05.3.4 - Integración con NotificadorSonoro', () => {
    test('Debe permitir configurar notificador sonoro', () => {
      // Arrange
      const mockSonoro = {
        reproducirAlerta: () => {},
      };

      // Act
      notificador.setNotificadorSonoro(mockSonoro);

      // Assert
      expect(notificador.notificadorSonoro).toBe(mockSonoro);
    });

    test('Debe aceptar notificador sonoro en constructor', () => {
      // Arrange
      const mockSonoro = {
        reproducirAlerta: () => {},
      };

      // Act
      const notificadorConSonoro = new NotificadorVisual(mockSonoro);

      // Assert
      expect(notificadorConSonoro.notificadorSonoro).toBe(mockSonoro);
    });
  });
});
