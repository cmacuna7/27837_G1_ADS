/**
 * SERVICIO: Gestor de Almacenamiento
 * Maneja todas las operaciones CRUD con IndexedDB
 * RF01: Gestión de Medicamentos
 */
import ConexionBD from '../config/Database.js';
import Medicamento from '../models/Medicamento.js';

class GestorAlmacenamiento {
  constructor() {
    this.db = ConexionBD.getInstancia();
  }

  /**
   * RF01-A: Guardar medicamento
   */
  async guardarMedicamento(medicamento) {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(['medicamentos'], 'readwrite');
        const store = transaction.objectStore('medicamentos');
        const request = store.put(medicamento.toJSON());

        request.onsuccess = async () => {
          // Guardar horarios generados
          await this.guardarHorarios(medicamento.horariosGenerados);
          console.log('Medicamento guardado:', medicamento.nombre);
          resolve(medicamento);
        };

        request.onerror = () => {
          console.error('❌ Error al guardar medicamento');
          reject(new Error('Error al guardar medicamento'));
        };
      });
    } catch (error) {
      console.error('Error en guardarMedicamento:', error);
      throw error;
    }
  }

  /**
   * RF01-B: Obtener todos los medicamentos
   */
  async obtenerTodosMedicamentos() {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(['medicamentos'], 'readonly');
        const store = transaction.objectStore('medicamentos');
        const request = store.getAll();

        request.onsuccess = () => {
          const medicamentos = request.result.map((data) =>
            Medicamento.fromJSON(data)
          );
          console.log(`${medicamentos.length} medicamentos obtenidos`);
          resolve(medicamentos);
        };

        request.onerror = () => {
          console.error('❌ Error al obtener medicamentos');
          reject(new Error('Error al obtener medicamentos'));
        };
      });
    } catch (error) {
      console.error('Error en obtenerTodosMedicamentos:', error);
      throw error;
    }
  }

  /**
   * RF01-B: Obtener medicamento por ID
   */
  async obtenerMedicamentoPorId(id) {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(['medicamentos'], 'readonly');
        const store = transaction.objectStore('medicamentos');
        const request = store.get(id);

        request.onsuccess = () => {
          if (request.result) {
            const medicamento = Medicamento.fromJSON(request.result);
            resolve(medicamento);
          } else {
            resolve(null);
          }
        };

        request.onerror = () => {
          reject(new Error('Error al obtener medicamento'));
        };
      });
    } catch (error) {
      console.error('Error en obtenerMedicamentoPorId:', error);
      throw error;
    }
  }

  /**
   * RF01-C: Actualizar medicamento
   */
  async actualizarMedicamento(medicamento) {
    return this.guardarMedicamento(medicamento);
  }

  /**
   * RF01-D: Eliminar medicamento
   */
  async eliminarMedicamento(id) {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(
          ['medicamentos', 'horarios'],
          'readwrite'
        );

        // Eliminar medicamento
        const medicamentosStore = transaction.objectStore('medicamentos');
        const requestMed = medicamentosStore.delete(id);

        // Eliminar horarios asociados
        const horariosStore = transaction.objectStore('horarios');
        const index = horariosStore.index('medicamentoId');
        const requestHorarios = index.openCursor(IDBKeyRange.only(id));

        requestHorarios.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          }
        };

        transaction.oncomplete = () => {
          console.log('Medicamento eliminado:', id);
          resolve(true);
        };

        transaction.onerror = () => {
          console.error('❌ Error al eliminar medicamento');
          reject(new Error('Error al eliminar medicamento'));
        };
      });
    } catch (error) {
      console.error('Error en eliminarMedicamento:', error);
      throw error;
    }
  }

  /**
   * Guardar horarios de tomas
   */
  async guardarHorarios(horarios) {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(['horarios'], 'readwrite');
        const store = transaction.objectStore('horarios');

        horarios.forEach((horario) => {
          store.put(horario);
        });

        transaction.oncomplete = () => {
          console.log(`${horarios.length} horarios guardados`);
          resolve(true);
        };

        transaction.onerror = () => {
          reject(new Error('Error al guardar horarios'));
        };
      });
    } catch (error) {
      console.error('Error en guardarHorarios:', error);
      throw error;
    }
  }

  /**
   * RF02: Obtener horarios pendientes para notificaciones
   */
  async obtenerHorariosPendientes() {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(['horarios'], 'readonly');
        const store = transaction.objectStore('horarios');
        const request = store.getAll();

        request.onsuccess = () => {
          const ahora = new Date();
          const pendientes = request.result.filter(
            (h) => new Date(h.fechaHora) > ahora && !h.tomada && !h.omitida
          );
          resolve(pendientes);
        };

        request.onerror = () => {
          reject(new Error('Error al obtener horarios pendientes'));
        };
      });
    } catch (error) {
      console.error('Error en obtenerHorariosPendientes:', error);
      throw error;
    }
  }

  /**
   * RF02: Marcar toma como realizada
   */
  async marcarTomaRealizada(tomaId) {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(['horarios'], 'readwrite');
        const store = transaction.objectStore('horarios');
        const request = store.get(tomaId);

        request.onsuccess = () => {
          const toma = request.result;
          if (toma) {
            toma.tomada = true;
            toma.fechaReal = new Date().toISOString();
            store.put(toma);

            transaction.oncomplete = () => {
              console.log('Toma marcada como realizada');
              resolve(toma);
            };
          } else {
            reject(new Error('Toma no encontrada'));
          }
        };

        request.onerror = () => {
          reject(new Error('Error al marcar toma'));
        };
      });
    } catch (error) {
      console.error('Error en marcarTomaRealizada:', error);
      throw error;
    }
  }

  /**
   * RF02: Posponer toma
   */
  async posponerToma(tomaId, minutos = 10) {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(['horarios'], 'readwrite');
        const store = transaction.objectStore('horarios');
        const request = store.get(tomaId);

        request.onsuccess = () => {
          const toma = request.result;
          if (toma) {
            const nuevaFecha = new Date(toma.fechaHora);
            nuevaFecha.setMinutes(nuevaFecha.getMinutes() + minutos);
            toma.fechaHora = nuevaFecha.toISOString();
            toma.pospuesta = true;
            store.put(toma);

            transaction.oncomplete = () => {
              console.log(`Toma pospuesta ${minutos} minutos`);
              resolve(toma);
            };
          } else {
            reject(new Error('Toma no encontrada'));
          }
        };

        request.onerror = () => {
          reject(new Error('Error al posponer toma'));
        };
      });
    } catch (error) {
      console.error('Error en posponerToma:', error);
      throw error;
    }
  }

  /**
   * RF02: Marcar toma como omitida
   */
  async marcarTomaOmitida(tomaId, motivo = '') {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(['horarios'], 'readwrite');
        const store = transaction.objectStore('horarios');
        const request = store.get(tomaId);

        request.onsuccess = () => {
          const toma = request.result;
          if (toma) {
            toma.omitida = true;
            toma.motivoOmision = motivo;
            store.put(toma);

            transaction.oncomplete = () => {
              console.log('Toma marcada como omitida');
              resolve(toma);
            };
          } else {
            reject(new Error('Toma no encontrada'));
          }
        };

        request.onerror = () => {
          reject(new Error('Error al marcar toma como omitida'));
        };
      });
    } catch (error) {
      console.error('Error en marcarTomaOmitida:', error);
      throw error;
    }
  }

  /**
   * RF02: Alias para omitir toma
   */
  async omitirToma(tomaId, motivo = '') {
    return this.marcarTomaOmitida(tomaId, motivo);
  }
}

export default GestorAlmacenamiento;
