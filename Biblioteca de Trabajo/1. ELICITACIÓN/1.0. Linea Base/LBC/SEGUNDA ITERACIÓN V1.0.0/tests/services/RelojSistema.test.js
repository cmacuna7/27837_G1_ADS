/**
 * TESTS: RelojSistema
 * RF05: Recordatorios Automáticos con Alertas
 */

import RelojSistema from '../../js/services/RelojSistema.js';
import Medicamento from '../../js/models/Medicamento.js';

// Mock de GestorAlmacenamiento
class MockGestorAlmacenamiento {
  constructor() {
    this.horarios = [];
    this.medicamentos = new Map();
  }

  async obtenerHorariosPendientes() {
    return this.horarios.filter((h) => !h.tomada);
  }

  async obtenerMedicamentoPorId(id) {
    return this.medicamentos.get(id) || null;
  }

  agregarHorario(horario) {
    this.horarios.push(horario);
  }

  agregarMedicamento(medicamento) {
    this.medicamentos.set(medicamento.id, medicamento);
  }
}

describe('RelojSistema - RF05 Recordatorios Automáticos', () => {
  let reloj;
  let mockGestor;

  beforeEach(() => {
    reloj = new RelojSistema();
    mockGestor = new MockGestorAlmacenamiento();
    reloj.gestorAlmacenamiento = mockGestor;
  });

  afterEach(() => {
    if (reloj) {
      reloj.detener();
    }
  });

  describe('RF05.1 - Generación de Horarios', () => {
    test('Debe generar horarios cada 8 horas para 2 días', () => {
      // Arrange
      const medicamento = new Medicamento({
        nombre: 'Ibuprofeno',
        dosis: 400,
        frecuencia: 8,
        horarioPrimeraToma: '08:00',
        duracion: 2,
      });

      // Act
      medicamento.generarHorarios();

      // Assert: 3 tomas/día × 2 días = 6 horarios
      expect(medicamento.horarios).toBeDefined();
      expect(medicamento.horarios.length).toBe(6);
    });

    test('Debe generar horarios cada 12 horas para 1 día', () => {
      // Arrange
      const medicamento = new Medicamento({
        nombre: 'Omeprazol',
        dosis: 20,
        frecuencia: 12,
        horarioPrimeraToma: '08:00',
        duracion: 1,
      });

      // Act
      medicamento.generarHorarios();

      // Assert: 2 tomas/día × 1 día = 2 horarios
      expect(medicamento.horarios.length).toBe(2);
    });

    test('Debe validar formato de horarios generados', () => {
      // Arrange
      const medicamento = new Medicamento({
        nombre: 'Paracetamol',
        dosis: 650,
        frecuencia: 6,
        horarioPrimeraToma: '08:00',
        duracion: 1,
      });

      // Act
      medicamento.generarHorarios();

      // Assert: Cada horario debe tener estructura correcta
      medicamento.horarios.forEach((horario) => {
        expect(horario).toHaveProperty('id');
        expect(horario).toHaveProperty('fechaHora');
        expect(horario).toHaveProperty('tomada');
        expect(horario.tomada).toBe(false);
        expect(typeof horario.id).toBe('string');
        expect(typeof horario.fechaHora).toBe('string');
      });
    });

    test('Debe generar IDs únicos para cada horario', () => {
      // Arrange
      const medicamento = new Medicamento({
        nombre: 'Aspirina',
        dosis: 100,
        frecuencia: 8,
        horarioPrimeraToma: '08:00',
        duracion: 3,
      });

      // Act
      medicamento.generarHorarios();

      // Assert: Todos los IDs deben ser únicos
      const ids = medicamento.horarios.map((h) => h.id);
      const idsUnicos = new Set(ids);
      expect(idsUnicos.size).toBe(ids.length);
    });
  });

  describe('RF05.2 - Verificación de Alertas Próximas', () => {
    test('Debe detectar alerta dentro de ventana de tiempo', async () => {
      // Arrange: Horario que debe alertar (hora actual)
      const ahora = new Date();
      const medicamento = new Medicamento({
        id: 1,
        nombre: 'Ibuprofeno',
        dosis: 400,
        frecuencia: 8,
        horarioPrimeraToma: '08:00',
        duracion: 1,
      });

      const horario = {
        id: '1-1',
        medicamentoId: 1,
        fechaHora: ahora.toISOString(),
        tomada: false,
      };

      mockGestor.agregarHorario(horario);
      mockGestor.agregarMedicamento(medicamento);

      // Suscribir observador
      let alertaRecibida = null;
      const observador = {
        actualizar: (data) => {
          alertaRecibida = data;
        },
      };
      reloj.suscribir(observador);

      // Act
      await reloj.verificarMedicamentos();

      // Assert
      expect(alertaRecibida).not.toBeNull();
      expect(alertaRecibida.tipo).toBe('ALERTA_MEDICAMENTO');
      expect(alertaRecibida.medicamento.nombre).toBe('Ibuprofeno');
    });

    test('Debe ignorar alertas fuera de ventana', async () => {
      // Arrange: Horario en el futuro (1 hora adelante)
      const futuro = new Date();
      futuro.setHours(futuro.getHours() + 1);

      const horario = {
        id: '1-1',
        medicamentoId: 1,
        fechaHora: futuro.toISOString(),
        tomada: false,
      };

      mockGestor.agregarHorario(horario);

      // Suscribir observador
      let alertaRecibida = null;
      const observador = {
        actualizar: (data) => {
          alertaRecibida = data;
        },
      };
      reloj.suscribir(observador);

      // Act
      await reloj.verificarMedicamentos();

      // Assert: No debe alertar
      expect(alertaRecibida).toBeNull();
    });

    test('Debe evitar duplicar alertas ya notificadas', async () => {
      // Arrange
      const ahora = new Date();
      const medicamento = new Medicamento({
        id: 1,
        nombre: 'Test',
        dosis: 100,
        frecuencia: 8,
        horarioPrimeraToma: '08:00',
        duracion: 1,
      });

      const horario = {
        id: '1-1',
        medicamentoId: 1,
        fechaHora: ahora.toISOString(),
        tomada: false,
      };

      mockGestor.agregarHorario(horario);
      mockGestor.agregarMedicamento(medicamento);

      let conteoAlertas = 0;
      const observador = {
        actualizar: () => {
          conteoAlertas++;
        },
      };
      reloj.suscribir(observador);

      // Act: Verificar dos veces
      await reloj.verificarMedicamentos();
      await reloj.verificarMedicamentos();

      // Assert: Solo debe alertar una vez
      expect(conteoAlertas).toBe(1);
    });

    test('Debe ignorar horarios ya tomados', async () => {
      // Arrange
      const ahora = new Date();
      const horario = {
        id: '1-1',
        medicamentoId: 1,
        fechaHora: ahora.toISOString(),
        tomada: true, // Ya tomada
      };

      mockGestor.agregarHorario(horario);

      let alertaRecibida = null;
      const observador = {
        actualizar: (data) => {
          alertaRecibida = data;
        },
      };
      reloj.suscribir(observador);

      // Act
      await reloj.verificarMedicamentos();

      // Assert
      expect(alertaRecibida).toBeNull();
    });
  });

  describe('RF05.3 - Control del Reloj', () => {
    test('Debe actualizar hora con tick()', () => {
      // Arrange
      const horaInicial = reloj.horaActual;

      // Act: Esperar un momento y hacer tick
      setTimeout(() => {
        reloj.tick();
      }, 100);

      // Assert
      setTimeout(() => {
        const horaNueva = reloj.horaActual;
        expect(horaNueva.getTime()).toBeGreaterThanOrEqual(
          horaInicial.getTime(),
        );
      }, 200);
    });

    test('Debe obtener hora actual', () => {
      // Act
      const hora = reloj.obtenerHoraActual();

      // Assert
      expect(hora).toBeInstanceOf(Date);
    });

    test('Debe detener el reloj correctamente', () => {
      // Arrange
      reloj.iniciar();
      expect(reloj.intervaloTick).not.toBeNull();

      // Act
      reloj.detener();

      // Assert
      expect(reloj.intervaloTick).toBeNull();
    });
  });

  describe('RF05.4 - Patrón Observer', () => {
    test('Debe permitir suscribir observadores', () => {
      // Arrange
      const observador1 = () => {};
      const observador2 = () => {};

      // Act
      reloj.suscribir(observador1);
      reloj.suscribir(observador2);

      // Assert
      expect(reloj.observadores.length).toBe(2);
    });

    test('Debe notificar a observadores cuando hay alerta', async () => {
      // Arrange
      const ahora = new Date();
      const medicamento = new Medicamento({
        id: 1,
        nombre: 'Medicamento',
        dosis: 100,
        frecuencia: 8,
        horarioPrimeraToma: '08:00',
        duracion: 1,
      });

      const horario = {
        id: '1-1',
        medicamentoId: 1,
        fechaHora: ahora.toISOString(),
        tomada: false,
      };

      mockGestor.agregarHorario(horario);
      mockGestor.agregarMedicamento(medicamento);

      let llamado = false;
      const observador = {
        actualizar: (data) => {
          llamado = true;
          expect(data.tipo).toBe('ALERTA_MEDICAMENTO');
        },
      };
      reloj.suscribir(observador);

      // Act
      await reloj.verificarMedicamentos();

      // Assert
      expect(llamado).toBe(true);
    });
  });
});
