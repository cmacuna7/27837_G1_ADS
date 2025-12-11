/**
 * PATRÓN SINGLETON: Conexión a IndexedDB
 * Garantiza una única instancia de la conexión a la base de datos
 */
class ConexionBD {
  static instancia = null;
  static DB_NAME = 'HealthyPlusDB';
  static DB_VERSION = 1;

  constructor() {
    if (ConexionBD.instancia) {
      return ConexionBD.instancia;
    }

    this.conexionActiva = null;
    this.inicializando = false;
    ConexionBD.instancia = this;
  }

  /**
   * Obtiene la instancia única (Singleton)
   */
  static getInstancia() {
    if (!ConexionBD.instancia) {
      ConexionBD.instancia = new ConexionBD();
    }
    return ConexionBD.instancia;
  }

  /**
   * Conecta e inicializa la base de datos
   */
  async conectar() {
    if (this.conexionActiva) {
      return this.conexionActiva;
    }

    if (this.inicializando) {
      // Esperar a que termine la inicialización en curso
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.conexionActiva) {
            clearInterval(checkInterval);
            resolve(this.conexionActiva);
          }
        }, 100);
      });
    }

    this.inicializando = true;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(ConexionBD.DB_NAME, ConexionBD.DB_VERSION);

      request.onerror = () => {
        this.inicializando = false;
        reject(new Error('Error al abrir la base de datos'));
      };

      request.onsuccess = (event) => {
        this.conexionActiva = event.target.result;
        this.inicializando = false;
        console.log('Base de datos conectada exitosamente');
        resolve(this.conexionActiva);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Object Store para Medicamentos
        if (!db.objectStoreNames.contains('medicamentos')) {
          const medicamentosStore = db.createObjectStore('medicamentos', {
            keyPath: 'id',
          });
          medicamentosStore.createIndex('nombre', 'nombre', { unique: false });
          medicamentosStore.createIndex('activo', 'activo', { unique: false });
          medicamentosStore.createIndex('fechaInicio', 'fechaInicio', {
            unique: false,
          });
          console.log('Object Store "medicamentos" creado');
        }

        // Object Store para Horarios/Tomas
        if (!db.objectStoreNames.contains('horarios')) {
          const horariosStore = db.createObjectStore('horarios', {
            keyPath: 'id',
          });
          horariosStore.createIndex('medicamentoId', 'medicamentoId', {
            unique: false,
          });
          horariosStore.createIndex('fechaHora', 'fechaHora', {
            unique: false,
          });
          horariosStore.createIndex('tomada', 'tomada', { unique: false });
          console.log('Object Store "horarios" creado');
        }

        // Object Store para Configuración
        if (!db.objectStoreNames.contains('configuracion')) {
          db.createObjectStore('configuracion', { keyPath: 'clave' });
          console.log('Object Store "configuracion" creado');
        }
      };
    });
  }

  /**
   * Obtiene la conexión activa
   */
  async obtenerConexion() {
    if (!this.conexionActiva) {
      await this.conectar();
    }
    return this.conexionActiva;
  }

  /**
   * Cierra la conexión
   */
  cerrar() {
    if (this.conexionActiva) {
      this.conexionActiva.close();
      this.conexionActiva = null;
      console.log('Base de datos cerrada');
    }
  }

  /**
   * Elimina completamente la base de datos
   */
  static async eliminarBaseDatos() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(ConexionBD.DB_NAME);

      request.onsuccess = () => {
        console.log('Base de datos eliminada');
        ConexionBD.instancia = null;
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Error al eliminar la base de datos'));
      };
    });
  }
}

export default ConexionBD;
