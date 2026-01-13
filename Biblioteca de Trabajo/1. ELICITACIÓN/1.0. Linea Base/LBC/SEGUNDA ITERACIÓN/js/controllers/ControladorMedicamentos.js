/**
 * CONTROLADOR: Medicamentos
 * Gestiona la lógica de negocio para los medicamentos
 * RF01: Gestión de Medicamentos
 */
import Medicamento from '../models/Medicamento.js';
import GestorAlmacenamiento from '../services/GestorAlmacenamiento.js';

class ControladorMedicamentos {
  constructor() {
    this.gestorAlmacenamiento = new GestorAlmacenamiento();
    this.observadores = [];
  }

  /**
   * RF01-A: Crear nuevo medicamento
   */
  async crearMedicamento(datos) {
    try {
      // Crear instancia del medicamento
      const medicamento = new Medicamento(datos);

      // Validar datos
      const validacion = medicamento.validar();
      if (!validacion.valido) {
        return {
          exito: false,
          errores: validacion.errores,
        };
      }

      // Generar horarios de tomas
      medicamento.generarHorarios();

      // Guardar en base de datos
      await this.gestorAlmacenamiento.guardarMedicamento(medicamento);

      // Notificar a observadores
      this.notificarCambio('MEDICAMENTO_CREADO', medicamento);

      return {
        exito: true,
        medicamento: medicamento,
        mensaje: 'Medicamento registrado exitosamente',
      };
    } catch (error) {
      console.error('Error al crear medicamento:', error);
      return {
        exito: false,
        errores: ['Error al guardar el medicamento'],
      };
    }
  }

  /**
   * RF01-B: Obtener todos los medicamentos
   */
  async obtenerTodos() {
    try {
      const medicamentos =
        await this.gestorAlmacenamiento.obtenerTodosMedicamentos();
      return {
        exito: true,
        medicamentos: medicamentos,
      };
    } catch (error) {
      console.error('Error al obtener medicamentos:', error);
      return {
        exito: false,
        errores: ['Error al cargar los medicamentos'],
      };
    }
  }

  /**
   * RF01-B: Obtener medicamento por ID
   */
  async obtenerPorId(id) {
    try {
      const medicamento =
        await this.gestorAlmacenamiento.obtenerMedicamentoPorId(id);
      return {
        exito: true,
        medicamento: medicamento,
      };
    } catch (error) {
      console.error('Error al obtener medicamento:', error);
      return {
        exito: false,
        errores: ['Error al cargar el medicamento'],
      };
    }
  }

  /**
   * RF01-C: Actualizar medicamento existente
   */
  async actualizarMedicamento(id, datos) {
    try {
      // Obtener medicamento existente
      const resultado = await this.obtenerPorId(id);
      if (!resultado.exito || !resultado.medicamento) {
        return {
          exito: false,
          errores: ['Medicamento no encontrado'],
        };
      }

      // Actualizar datos
      const medicamento = resultado.medicamento;
      Object.assign(medicamento, datos);

      // Validar
      const validacion = medicamento.validar();
      if (!validacion.valido) {
        return {
          exito: false,
          errores: validacion.errores,
        };
      }

      // Regenerar horarios si cambió la frecuencia o duración
      medicamento.generarHorarios();

      // Guardar
      await this.gestorAlmacenamiento.actualizarMedicamento(medicamento);

      // Notificar cambio
      this.notificarCambio('MEDICAMENTO_ACTUALIZADO', medicamento);

      return {
        exito: true,
        medicamento: medicamento,
        mensaje: 'Medicamento actualizado exitosamente',
      };
    } catch (error) {
      console.error('Error al actualizar medicamento:', error);
      return {
        exito: false,
        errores: ['Error al actualizar el medicamento'],
      };
    }
  }

  /**
   * RF01-D: Eliminar medicamento
   */
  async eliminarMedicamento(id) {
    try {
      await this.gestorAlmacenamiento.eliminarMedicamento(id);

      // Notificar cambio
      this.notificarCambio('MEDICAMENTO_ELIMINADO', { id });

      return {
        exito: true,
        mensaje: 'Medicamento eliminado exitosamente',
      };
    } catch (error) {
      console.error('Error al eliminar medicamento:', error);
      return {
        exito: false,
        errores: ['Error al eliminar el medicamento'],
      };
    }
  }

  /**
   * Suscribe un observador para cambios en medicamentos
   */
  suscribir(callback) {
    this.observadores.push(callback);
  }

  /**
   * Notifica cambios a los observadores
   */
  notificarCambio(tipo, data) {
    this.observadores.forEach((callback) => {
      callback({ tipo, data });
    });
  }
}

export default ControladorMedicamentos;
