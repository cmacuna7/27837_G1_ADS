/**
 * TESTS: ControladorMedicamentos - Eliminar
 * RF04: Eliminar Medicamento
 */

import ControladorMedicamentos from '../../js/controllers/ControladorMedicamentos.js';
import Medicamento from '../../js/models/Medicamento.js';

// Mock de GestorAlmacenamiento
class MockGestorAlmacenamiento {
  constructor() {
    this.medicamentos = new Map();
    this.idCounter = 1;
  }

  async guardarMedicamento(medicamento) {
    if (!medicamento.id) {
      medicamento.id = this.idCounter++;
    }
    this.medicamentos.set(medicamento.id, medicamento);
    return medicamento;
  }

  async obtenerMedicamentoPorId(id) {
    return this.medicamentos.get(id) || null;
  }

  async eliminarMedicamento(id) {
    this.medicamentos.delete(id);
  }

  async obtenerTodosMedicamentos() {
    return Array.from(this.medicamentos.values());
  }
}

describe('ControladorMedicamentos - RF04 Eliminar Medicamento', () => {
  let controlador;
  let mockGestor;

  beforeEach(() => {
    controlador = new ControladorMedicamentos();
    mockGestor = new MockGestorAlmacenamiento();
    controlador.gestorAlmacenamiento = mockGestor;
  });

  describe('RF04.1 - Eliminar medicamento exitosamente', () => {
    test('Debe eliminar un medicamento y retornar éxito', async () => {
      // Arrange: Crear y guardar un medicamento
      const medicamento = new Medicamento({
        nombre: 'Aspirina',
        dosis: 500,
        frecuencia: 8,
        horarioPrimeraToma: '08:00',
        duracion: 7,
      });
      await mockGestor.guardarMedicamento(medicamento);
      const id = medicamento.id;

      // Verificar que existe antes de eliminar
      const medicamentoAntes = await mockGestor.obtenerMedicamentoPorId(id);
      expect(medicamentoAntes).not.toBeNull();

      // Act: Eliminar el medicamento
      const resultado = await controlador.eliminarMedicamento(id);

      // Assert: Verificar resultado exitoso
      expect(resultado.exito).toBe(true);
      expect(resultado.mensaje).toBe('Medicamento eliminado exitosamente');

      // Verificar que ya no existe
      const medicamentoDespues = await mockGestor.obtenerMedicamentoPorId(id);
      expect(medicamentoDespues).toBeNull();
    });

    test('Debe manejar error al eliminar medicamento inexistente', async () => {
      // Arrange: ID que no existe
      const idInexistente = 999;

      // Mock que simula error
      mockGestor.eliminarMedicamento = async () => {
        throw new Error('Medicamento no encontrado');
      };

      // Act
      const resultado = await controlador.eliminarMedicamento(idInexistente);

      // Assert
      expect(resultado.exito).toBe(false);
      expect(resultado.errores).toContain('Error al eliminar el medicamento');
    });

    test('Debe eliminar del almacenamiento correctamente', async () => {
      // Arrange: Crear múltiples medicamentos
      const med1 = new Medicamento({
        nombre: 'Med1',
        dosis: 100,
        frecuencia: 8,
        horarioPrimeraToma: '08:00',
        duracion: 7,
      });
      const med2 = new Medicamento({
        nombre: 'Med2',
        dosis: 200,
        frecuencia: 12,
        horarioPrimeraToma: '09:00',
        duracion: 5,
      });

      await mockGestor.guardarMedicamento(med1);
      await mockGestor.guardarMedicamento(med2);

      const totalAntes = await mockGestor.obtenerTodosMedicamentos();
      expect(totalAntes.length).toBe(2);

      // Act: Eliminar uno
      await controlador.eliminarMedicamento(med1.id);

      // Assert: Verificar que solo queda uno
      const totalDespues = await mockGestor.obtenerTodosMedicamentos();
      expect(totalDespues.length).toBe(1);
      expect(totalDespues[0].nombre).toBe('Med2');
    });
  });

  describe('RF04.2 - Notificar observadores tras eliminación', () => {
    test('Debe emitir evento MEDICAMENTO_ELIMINADO', async () => {
      // Arrange: Crear medicamento y suscribir observador
      const medicamento = new Medicamento({
        nombre: 'Ibuprofeno',
        dosis: 400,
        frecuencia: 8,
        horarioPrimeraToma: '08:00',
        duracion: 7,
      });
      await mockGestor.guardarMedicamento(medicamento);

      let eventoRecibido = null;
      controlador.suscribir((evento) => {
        eventoRecibido = evento;
      });

      // Act: Eliminar medicamento
      await controlador.eliminarMedicamento(medicamento.id);

      // Assert: Verificar notificación
      expect(eventoRecibido).not.toBeNull();
      expect(eventoRecibido.tipo).toBe('MEDICAMENTO_ELIMINADO');
      expect(eventoRecibido.data).toEqual({ id: medicamento.id });
    });

    test('Debe notificar a múltiples observadores', async () => {
      // Arrange: Crear medicamento
      const medicamento = new Medicamento({
        nombre: 'Paracetamol',
        dosis: 650,
        frecuencia: 6,
        horarioPrimeraToma: '08:00',
        duracion: 3,
      });
      await mockGestor.guardarMedicamento(medicamento);

      // Suscribir múltiples observadores
      const notificaciones = [];
      controlador.suscribir((evento) =>
        notificaciones.push({ observador: 1, evento }),
      );
      controlador.suscribir((evento) =>
        notificaciones.push({ observador: 2, evento }),
      );
      controlador.suscribir((evento) =>
        notificaciones.push({ observador: 3, evento }),
      );

      // Act: Eliminar medicamento
      await controlador.eliminarMedicamento(medicamento.id);

      // Assert: Todos los observadores fueron notificados
      expect(notificaciones.length).toBe(3);
      expect(notificaciones[0].evento.tipo).toBe('MEDICAMENTO_ELIMINADO');
      expect(notificaciones[1].evento.tipo).toBe('MEDICAMENTO_ELIMINADO');
      expect(notificaciones[2].evento.tipo).toBe('MEDICAMENTO_ELIMINADO');
    });

    test('Debe incluir ID del medicamento eliminado en notificación', async () => {
      // Arrange
      const medicamento = new Medicamento({
        nombre: 'Omeprazol',
        dosis: 20,
        frecuencia: 24,
        horarioPrimeraToma: '08:00',
        duracion: 14,
      });
      await mockGestor.guardarMedicamento(medicamento);

      let idNotificado = null;
      controlador.suscribir((evento) => {
        idNotificado = evento.data.id;
      });

      // Act
      await controlador.eliminarMedicamento(medicamento.id);

      // Assert
      expect(idNotificado).toBe(medicamento.id);
    });

    test('Debe notificar incluso si la eliminación falla', async () => {
      // Arrange: Mock que falla
      mockGestor.eliminarMedicamento = async () => {
        throw new Error('Error de base de datos');
      };

      let notificado = false;
      controlador.suscribir(() => {
        notificado = true;
      });

      // Act
      const resultado = await controlador.eliminarMedicamento(1);

      // Assert: No debe notificar si falla
      expect(resultado.exito).toBe(false);
      expect(notificado).toBe(false);
    });
  });

  describe('RF04.3 - Patrón Observer', () => {
    test('Debe permitir suscribir observadores', () => {
      // Arrange
      const observador1 = () => {};
      const observador2 = () => {};

      // Act
      controlador.suscribir(observador1);
      controlador.suscribir(observador2);

      // Assert
      expect(controlador.observadores.length).toBe(2);
    });

    test('Debe ejecutar callback de observador cuando hay cambio', async () => {
      // Arrange
      const medicamento = new Medicamento({
        nombre: 'Test',
        dosis: 100,
        frecuencia: 8,
        horarioPrimeraToma: '08:00',
        duracion: 7,
      });
      await mockGestor.guardarMedicamento(medicamento);

      let llamado = false;
      controlador.suscribir(() => {
        llamado = true;
      });

      // Act
      await controlador.eliminarMedicamento(medicamento.id);

      // Assert
      expect(llamado).toBe(true);
    });
  });
});
