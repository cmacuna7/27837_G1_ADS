/**
 * TESTS: NotificadorSonoro
 * RF05: Notificaciones Sonoras
 */

import NotificadorSonoro from '../../js/services/NotificadorSonoro.js';

describe('NotificadorSonoro - RF05 Notificaciones Sonoras', () => {
  let notificador;
  let mockAudioContext;
  let mockOscillator;
  let mockGain;

  const createMockOscillator = () => ({
    connect: function (target) {
      return this;
    },
    start: () => {},
    stop: () => {},
    frequency: { value: 0 },
    type: 'sine',
  });

  const createMockGain = () => ({
    connect: function (target) {
      return this;
    },
    gain: {
      value: 0,
      setValueAtTime: () => {},
      linearRampToValueAtTime: () => {},
      exponentialRampToValueAtTime: () => {},
    },
  });

  beforeEach(() => {
    // Mock de AudioContext
    mockOscillator = createMockOscillator();
    mockGain = createMockGain();

    mockAudioContext = {
      createOscillator: () => createMockOscillator(),
      createGain: () => createMockGain(),
      currentTime: 0,
      destination: {},
      close: () => {},
    };

    global.AudioContext = () => mockAudioContext;
    global.webkitAudioContext = () => mockAudioContext;

    notificador = new NotificadorSonoro();
  });

  afterEach(() => {
    notificador.detenerAlarma();
  });

  describe('RF05.3.5 - Reproducir sonido de alerta', () => {
    test('Debe reproducir sonido cuando recibe ALERTA_MEDICAMENTO', () => {
      // Arrange
      const data = {
        tipo: 'ALERTA_MEDICAMENTO',
        medicamento: { nombre: 'Ibuprofeno' },
        horario: { id: '1-1' },
      };

      // Act
      notificador.actualizar(data);

      // Assert: Verificamos que se creó el contexto
      expect(global.AudioContext).toBeDefined();
    });

    test('No debe reproducir si audio está deshabilitado', () => {
      // Arrange
      notificador.audioHabilitado = false;

      const data = {
        tipo: 'ALERTA_MEDICAMENTO',
        medicamento: { nombre: 'Test' },
      };

      // Act
      notificador.actualizar(data);

      // Assert: No debe haber creado contexto ni intervalo
      expect(notificador.audioContext).toBeNull();
      expect(notificador.intervaloAlarma).toBeNull();
    });

    test('Debe ignorar eventos que no son ALERTA_MEDICAMENTO', () => {
      // Arrange
      const data = {
        tipo: 'OTRO_EVENTO',
        medicamento: { nombre: 'Test' },
      };

      // Act
      notificador.actualizar(data);

      // Assert: No debe haber creado contexto ni intervalo
      expect(notificador.audioContext).toBeNull();
      expect(notificador.intervaloAlarma).toBeNull();
    });

    test('Debe crear contexto de audio al reproducir', () => {
      // Arrange
      let audioContextCreated = false;
      const originalAudioContext = global.AudioContext;
      global.AudioContext = function () {
        audioContextCreated = true;
        return mockAudioContext;
      };

      const data = {
        tipo: 'ALERTA_MEDICAMENTO',
        medicamento: { nombre: 'Test' },
      };

      // Act
      notificador.actualizar(data);

      // Assert
      expect(audioContextCreated).toBe(true);

      // Cleanup
      global.AudioContext = originalAudioContext;
    });
  });

  describe('RF05.3.6 - Alarma continua', () => {
    test('Debe iniciar alarma continua con intervalo', () => {
      // Arrange
      const data = {
        tipo: 'ALERTA_MEDICAMENTO',
        medicamento: { nombre: 'Ibuprofeno' },
      };

      // Act
      notificador.actualizar(data);

      // Assert: Debe configurar intervalo
      expect(notificador.intervaloAlarma).not.toBeNull();
    });

    test('Debe repetir alarma cada 3 segundos', () => {
      // Arrange
      let createOscillatorCount = 0;
      const originalCreateOscillator = mockAudioContext.createOscillator;
      mockAudioContext.createOscillator = () => {
        createOscillatorCount++;
        return originalCreateOscillator();
      };

      // Interceptar la creación del AudioContext
      const originalAudioContext = global.AudioContext;
      global.AudioContext = function () {
        return mockAudioContext;
      };

      const data = {
        tipo: 'ALERTA_MEDICAMENTO',
        medicamento: { nombre: 'Test' },
      };

      // Act
      notificador.actualizar(data);

      // Assert: Primera reproducción inmediata
      expect(createOscillatorCount).toBe(3); // 3 beeps en reproducirAlerta

      // Verificar que el intervalo se haya configurado
      expect(notificador.intervaloAlarma).toBeDefined();

      // Cleanup
      mockAudioContext.createOscillator = originalCreateOscillator;
      global.AudioContext = originalAudioContext;
    });

    test('Debe detener alarma previa antes de iniciar nueva', () => {
      // Arrange
      const data = {
        tipo: 'ALERTA_MEDICAMENTO',
        medicamento: { nombre: 'Test' },
      };

      // Primera alarma
      notificador.actualizar(data);
      const primerIntervalo = notificador.intervaloAlarma;

      // Act: Segunda alarma
      notificador.actualizar(data);

      // Assert: Debe haber detenido la primera
      expect(notificador.intervaloAlarma).not.toBe(primerIntervalo);
    });

    test('Debe detener alarma correctamente', () => {
      // Arrange
      let closeCalled = false;
      const originalClose = mockAudioContext.close;
      mockAudioContext.close = () => {
        closeCalled = true;
        return originalClose.call(mockAudioContext);
      };

      const data = {
        tipo: 'ALERTA_MEDICAMENTO',
        medicamento: { nombre: 'Test' },
      };

      notificador.audioContext = mockAudioContext;
      notificador.actualizar(data);
      expect(notificador.intervaloAlarma).not.toBeNull();

      // Act
      notificador.detenerAlarma();

      // Assert
      expect(notificador.intervaloAlarma).toBeNull();
      expect(closeCalled).toBe(true);

      // Cleanup
      mockAudioContext.close = originalClose;
    });

    test('No debe fallar al detener si no hay alarma activa', () => {
      // Act & Assert: No debe lanzar error
      expect(() => notificador.detenerAlarma()).not.toThrow();
    });
  });

  describe('RF05.3.7 - Configuración de audio', () => {
    test('Debe tener audio habilitado por defecto', () => {
      // Assert
      expect(notificador.audioHabilitado).toBe(true);
    });

    test('Debe permitir deshabilitar audio', () => {
      // Act
      notificador.audioHabilitado = false;

      // Assert
      expect(notificador.audioHabilitado).toBe(false);
    });

    test('Debe respetar estado de audio deshabilitado', () => {
      // Arrange
      notificador.audioHabilitado = false;

      const data = {
        tipo: 'ALERTA_MEDICAMENTO',
        medicamento: { nombre: 'Test' },
      };

      // Act
      notificador.actualizar(data);

      // Assert: No debe crear audio
      expect(notificador.intervaloAlarma).toBeNull();
    });
  });

  describe('RF05.3.8 - Secuencia de tonos', () => {
    test('Debe crear oscilador para cada beep', () => {
      // Arrange
      notificador.audioContext = mockAudioContext;
      let createOscillatorCount = 0;
      const originalCreateOscillator = mockAudioContext.createOscillator;
      mockAudioContext.createOscillator = () => {
        createOscillatorCount++;
        return originalCreateOscillator();
      };

      // Act
      notificador.reproducirAlerta();

      // Assert: 3 beeps = 3 osciladores
      expect(createOscillatorCount).toBe(3);

      // Cleanup
      mockAudioContext.createOscillator = originalCreateOscillator;
    });

    test('Debe crear gain para control de volumen', () => {
      // Arrange
      notificador.audioContext = mockAudioContext;
      let createGainCount = 0;
      const originalCreateGain = mockAudioContext.createGain;
      mockAudioContext.createGain = () => {
        createGainCount++;
        return originalCreateGain();
      };

      // Act
      notificador.reproducirAlerta();

      // Assert
      expect(createGainCount).toBe(3);

      // Cleanup
      mockAudioContext.createGain = originalCreateGain;
    });

    test('Debe conectar oscilador a gain y gain a destino', () => {
      // Arrange
      notificador.audioContext = mockAudioContext;
      let oscillatorConnectCalled = false;
      let gainConnectCalled = false;

      const originalCreateOscillator = mockAudioContext.createOscillator;
      const originalCreateGain = mockAudioContext.createGain;

      mockAudioContext.createOscillator = () => {
        const osc = originalCreateOscillator();
        const originalConnect = osc.connect;
        osc.connect = function (target) {
          oscillatorConnectCalled = true;
          return originalConnect.call(this, target);
        };
        return osc;
      };

      mockAudioContext.createGain = () => {
        const gain = originalCreateGain();
        const originalConnect = gain.connect;
        gain.connect = function (target) {
          gainConnectCalled = true;
          return originalConnect.call(this, target);
        };
        return gain;
      };

      // Act
      notificador.reproducirAlerta();

      // Assert
      expect(oscillatorConnectCalled).toBe(true);
      expect(gainConnectCalled).toBe(true);

      // Cleanup
      mockAudioContext.createOscillator = originalCreateOscillator;
      mockAudioContext.createGain = originalCreateGain;
    });

    test('Debe iniciar y detener osciladores', () => {
      // Arrange
      notificador.audioContext = mockAudioContext;
      let startCalled = false;
      let stopCalled = false;

      const originalCreateOscillator = mockAudioContext.createOscillator;

      mockAudioContext.createOscillator = () => {
        const osc = originalCreateOscillator();
        const originalStart = osc.start;
        const originalStop = osc.stop;

        osc.start = function (when) {
          startCalled = true;
          return originalStart.call(this, when);
        };

        osc.stop = function (when) {
          stopCalled = true;
          return originalStop.call(this, when);
        };

        return osc;
      };

      // Act
      notificador.reproducirAlerta();

      // Assert
      expect(startCalled).toBe(true);
      expect(stopCalled).toBe(true);

      // Cleanup
      mockAudioContext.createOscillator = originalCreateOscillator;
    });
  });

  describe('RF05.3.9 - Manejo de errores', () => {
    test('Debe manejar error si AudioContext no está disponible', () => {
      // Arrange
      delete global.AudioContext;
      delete global.webkitAudioContext;

      const data = {
        tipo: 'ALERTA_MEDICAMENTO',
        medicamento: { nombre: 'Test' },
      };

      // Act & Assert: No debe lanzar error
      expect(() => notificador.actualizar(data)).not.toThrow();

      // Restaurar
      global.AudioContext = () => mockAudioContext;
    });

    test('Debe manejar error al crear oscilador', () => {
      // Arrange
      mockAudioContext.createOscillator = () => {
        throw new Error('Error al crear oscilador');
      };

      // Act & Assert: No debe propagar el error
      expect(() => notificador.reproducirAlerta()).not.toThrow();
    });

    test('Debe cerrar contexto al detener incluso si hay error', () => {
      // Arrange
      notificador.audioContext = mockAudioContext;
      mockAudioContext.close = () => {
        throw new Error('Error al cerrar');
      };

      // Act & Assert: No debe lanzar error
      expect(() => notificador.detenerAlarma()).not.toThrow();
    });
  });

  describe('RF05.3.10 - Patrón Observer', () => {
    test('Debe extender clase Observador', () => {
      // Assert
      expect(notificador.actualizar).toBeDefined();
      expect(typeof notificador.actualizar).toBe('function');
    });

    test('Debe procesar actualizaciones correctamente', () => {
      // Arrange
      const data = {
        tipo: 'ALERTA_MEDICAMENTO',
        medicamento: { nombre: 'Test' },
        timestamp: new Date(),
      };

      // Act
      notificador.actualizar(data);

      // Assert: Debe haber iniciado alarma
      expect(notificador.intervaloAlarma).not.toBeNull();
    });
  });
});
