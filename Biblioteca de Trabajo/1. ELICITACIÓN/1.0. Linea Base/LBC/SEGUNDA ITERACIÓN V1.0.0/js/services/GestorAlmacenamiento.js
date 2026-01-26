/**
 * SERVICIO: Gestor de Almacenamiento
 * Maneja todas las operaciones CRUD con IndexedDB
 * RF01: Gestión de Medicamentos
 * RF06: Informes de historial de medicación
 * RF07: Seguimiento de síntomas
 */
import ConexionBD from '../config/Database.js';
import Medicamento from '../models/Medicamento.js';
import EventoToma from '../models/EventoToma.js';
import Sintoma from '../models/Sintoma.js';

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
   * Obtener un horario por ID
   */
  async obtenerHorarioPorId(id) {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(['horarios'], 'readonly');
        const store = transaction.objectStore('horarios');
        const request = store.get(id);

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(new Error('Error al obtener horario'));
        };
      });
    } catch (error) {
      console.error('Error en obtenerHorarioPorId:', error);
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

  // ========================================
  // RF06: MÉTODOS PARA EVENTOS DE TOMA
  // ========================================

  /**
   * RF06-2: Registrar evento de toma
   */
  async registrarEventoToma(evento) {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(['eventos_toma'], 'readwrite');
        const store = transaction.objectStore('eventos_toma');
        const request = store.put(evento.toJSON());

        request.onsuccess = () => {
          console.log('✅ Evento de toma registrado:', evento.tipo);
          resolve(evento);
        };

        request.onerror = () => {
          console.error('❌ Error al registrar evento de toma');
          reject(new Error('Error al registrar evento de toma'));
        };
      });
    } catch (error) {
      console.error('Error en registrarEventoToma:', error);
      throw error;
    }
  }

  /**
   * RF06: Obtener todos los eventos de toma
   */
  async obtenerTodosEventosToma() {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(['eventos_toma'], 'readonly');
        const store = transaction.objectStore('eventos_toma');
        const request = store.getAll();

        request.onsuccess = () => {
          const eventos = request.result.map((data) =>
            EventoToma.fromJSON(data)
          );
          console.log(`${eventos.length} eventos de toma obtenidos`);
          resolve(eventos);
        };

        request.onerror = () => {
          console.error('❌ Error al obtener eventos de toma');
          reject(new Error('Error al obtener eventos de toma'));
        };
      });
    } catch (error) {
      console.error('Error en obtenerTodosEventosToma:', error);
      throw error;
    }
  }

  /**
   * RF06: Obtener eventos de toma por medicamento
   */
  async obtenerEventosPorMedicamento(medicamentoId) {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(['eventos_toma'], 'readonly');
        const store = transaction.objectStore('eventos_toma');
        const index = store.index('medicamentoId');
        const request = index.getAll(medicamentoId);

        request.onsuccess = () => {
          const eventos = request.result.map((data) =>
            EventoToma.fromJSON(data)
          );
          resolve(eventos);
        };

        request.onerror = () => {
          reject(new Error('Error al obtener eventos por medicamento'));
        };
      });
    } catch (error) {
      console.error('Error en obtenerEventosPorMedicamento:', error);
      throw error;
    }
  }

  /**
   * RF06: Obtener eventos de toma por rango de fechas
   */
  async obtenerEventosPorFechas(fechaInicio, fechaFin) {
    try {
      const eventos = await this.obtenerTodosEventosToma();
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      return eventos.filter((evento) => {
        const fechaEvento = new Date(evento.fecha);
        return fechaEvento >= inicio && fechaEvento <= fin;
      });
    } catch (error) {
      console.error('Error en obtenerEventosPorFechas:', error);
      throw error;
    }
  }

  /**
   * RF06: Eliminar evento de toma
   */
  async eliminarEventoToma(eventoId) {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(['eventos_toma'], 'readwrite');
        const store = transaction.objectStore('eventos_toma');
        const request = store.delete(eventoId);

        request.onsuccess = () => {
          console.log('Evento de toma eliminado');
          resolve();
        };

        request.onerror = () => {
          reject(new Error('Error al eliminar evento de toma'));
        };
      });
    } catch (error) {
      console.error('Error en eliminarEventoToma:', error);
      throw error;
    }
  }

  // ========================================
  // RF07: MÉTODOS PARA SÍNTOMAS
  // ========================================

  /**
   * RF07-2: Guardar síntoma
   */
  async guardarSintoma(sintoma) {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(['sintomas'], 'readwrite');
        const store = transaction.objectStore('sintomas');
        const request = store.put(sintoma.toJSON());

        request.onsuccess = () => {
          console.log('✅ Síntoma guardado:', sintoma.descripcion);
          resolve(sintoma);
        };

        request.onerror = () => {
          console.error('❌ Error al guardar síntoma');
          reject(new Error('Error al guardar síntoma'));
        };
      });
    } catch (error) {
      console.error('Error en guardarSintoma:', error);
      throw error;
    }
  }

  /**
   * RF07: Obtener todos los síntomas
   */
  async obtenerTodosSintomas() {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(['sintomas'], 'readonly');
        const store = transaction.objectStore('sintomas');
        const request = store.getAll();

        request.onsuccess = () => {
          const sintomas = request.result.map((data) => Sintoma.fromJSON(data));
          console.log(`${sintomas.length} síntomas obtenidos`);
          resolve(sintomas);
        };

        request.onerror = () => {
          console.error('❌ Error al obtener síntomas');
          reject(new Error('Error al obtener síntomas'));
        };
      });
    } catch (error) {
      console.error('Error en obtenerTodosSintomas:', error);
      throw error;
    }
  }

  /**
   * RF07-3: Obtener síntomas por medicamento
   */
  async obtenerSintomasPorMedicamento(medicamentoId) {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(['sintomas'], 'readonly');
        const store = transaction.objectStore('sintomas');
        const index = store.index('medicamentoId');
        const request = index.getAll(medicamentoId);

        request.onsuccess = () => {
          const sintomas = request.result.map((data) => Sintoma.fromJSON(data));
          resolve(sintomas);
        };

        request.onerror = () => {
          reject(new Error('Error al obtener síntomas por medicamento'));
        };
      });
    } catch (error) {
      console.error('Error en obtenerSintomasPorMedicamento:', error);
      throw error;
    }
  }

  /**
   * RF07: Obtener síntoma por ID
   */
  async obtenerSintomaPorId(id) {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(['sintomas'], 'readonly');
        const store = transaction.objectStore('sintomas');
        const request = store.get(id);

        request.onsuccess = () => {
          if (request.result) {
            const sintoma = Sintoma.fromJSON(request.result);
            resolve(sintoma);
          } else {
            resolve(null);
          }
        };

        request.onerror = () => {
          reject(new Error('Error al obtener síntoma'));
        };
      });
    } catch (error) {
      console.error('Error en obtenerSintomaPorId:', error);
      throw error;
    }
  }

  /**
   * RF07: Eliminar síntoma
   */
  async eliminarSintoma(sintomaId) {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(['sintomas'], 'readwrite');
        const store = transaction.objectStore('sintomas');
        const request = store.delete(sintomaId);

        request.onsuccess = () => {
          console.log('Síntoma eliminado');
          resolve();
        };

        request.onerror = () => {
          reject(new Error('Error al eliminar síntoma'));
        };
      });
    } catch (error) {
      console.error('Error en eliminarSintoma:', error);
      throw error;
    }
  }

  /**
   * RF07: Obtener síntomas por categoría
   */
  async obtenerSintomasPorCategoria(categoria) {
    try {
      const conexion = await this.db.obtenerConexion();

      return new Promise((resolve, reject) => {
        const transaction = conexion.transaction(['sintomas'], 'readonly');
        const store = transaction.objectStore('sintomas');
        const index = store.index('categoria');
        const request = index.getAll(categoria);

        request.onsuccess = () => {
          const sintomas = request.result.map((data) => Sintoma.fromJSON(data));
          resolve(sintomas);
        };

        request.onerror = () => {
          reject(new Error('Error al obtener síntomas por categoría'));
        };
      });
    } catch (error) {
      console.error('Error en obtenerSintomasPorCategoria:', error);
      throw error;
    }
  }
}

export default GestorAlmacenamiento;
