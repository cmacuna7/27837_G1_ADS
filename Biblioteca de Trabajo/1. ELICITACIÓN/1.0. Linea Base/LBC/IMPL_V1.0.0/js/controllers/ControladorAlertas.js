/**
 * CONTROLADOR: Alertas
 * Gestiona la lógica de las alertas y notificaciones
 * RF02: Recordatorios de medicación
 */
import GestorAlmacenamiento from '../services/GestorAlmacenamiento.js';
import RelojSistema from '../services/RelojSistema.js';
import NotificadorVisual from '../services/NotificadorVisual.js';
import NotificadorSonoro from '../services/NotificadorSonoro.js';

class ControladorAlertas {
  constructor() {
    console.log('\n========== INICIALIZANDO PATRÓN OBSERVER ==========');

    this.gestorAlmacenamiento = new GestorAlmacenamiento();
    console.log('[SETUP] GestorAlmacenamiento creado');

    this.relojSistema = new RelojSistema();
    console.log('[SETUP] RelojSistema creado (SUJETO)');

    this.notificadorVisual = new NotificadorVisual();
    console.log('[SETUP] NotificadorVisual creado (OBSERVADOR 1)');

    this.notificadorSonoro = new NotificadorSonoro();
    console.log('[SETUP] NotificadorSonoro creado (OBSERVADOR 2)');

    // Conectar notificador sonoro al visual para que pueda detener la alarma
    this.notificadorVisual.setNotificadorSonoro(this.notificadorSonoro);
    console.log('[SETUP] Notificadores conectados');

    // Suscribir observadores al reloj
    console.log('\n[SETUP] Suscribiendo observadores al sujeto...');
    this.relojSistema.suscribir(this.notificadorVisual);
    this.relojSistema.suscribir(this.notificadorSonoro);
    console.log('\n========== PATRÓN OBSERVER CONFIGURADO ==========\n');
  }

  /**
   * Inicia el sistema de alertas
   */
  iniciar() {
    console.log('Sistema de alertas iniciado');
    this.relojSistema.iniciar();
    this.solicitarPermisoNotificaciones();
  }

  /**
   * Detiene el sistema de alertas
   */
  detener() {
    this.relojSistema.detener();
    console.log('Sistema de alertas detenido');
  }

  /**
   * RF02: Marcar dosis como tomada
   */
  async marcarComoTomada(tomaId) {
    try {
      await this.gestorAlmacenamiento.marcarTomaRealizada(tomaId);

      // Ocultar alerta visual
      this.notificadorVisual.ocultarAlerta();

      return {
        exito: true,
        mensaje: 'Dosis registrada exitosamente',
      };
    } catch (error) {
      console.error('Error al marcar toma:', error);
      return {
        exito: false,
        errores: ['Error al registrar la toma'],
      };
    }
  }

  /**
   * RF02: Posponer recordatorio
   */
  async posponerRecordatorio(tomaId, minutos = 10) {
    try {
      await this.gestorAlmacenamiento.posponerToma(tomaId, minutos);

      // Ocultar alerta visual
      this.notificadorVisual.ocultarAlerta();

      return {
        exito: true,
        mensaje: `Recordatorio pospuesto ${minutos} minutos`,
      };
    } catch (error) {
      console.error('Error al posponer toma:', error);
      return {
        exito: false,
        errores: ['Error al posponer el recordatorio'],
      };
    }
  }

  /**
   * RF02: Omitir dosis con motivo
   */
  async omitirDosis(tomaId, motivo) {
    try {
      await this.gestorAlmacenamiento.omitirToma(tomaId, motivo);

      // Ocultar alerta visual
      this.notificadorVisual.ocultarAlerta();

      return {
        exito: true,
        mensaje: 'Dosis omitida',
      };
    } catch (error) {
      console.error('Error al omitir dosis:', error);
      return {
        exito: false,
        errores: ['Error al omitir la dosis'],
      };
    }
  }

  /**
   * RF02: Marcar dosis como omitida
   */
  async marcarComoOmitida(tomaId, motivo = '') {
    try {
      await this.gestorAlmacenamiento.marcarTomaOmitida(tomaId, motivo);

      // Ocultar alerta visual
      this.notificadorVisual.ocultarAlerta();

      return {
        exito: true,
        mensaje: 'Dosis omitida registrada',
      };
    } catch (error) {
      console.error('Error al marcar como omitida:', error);
      return {
        exito: false,
        errores: ['Error al registrar la omisión'],
      };
    }
  }

  /**
   * Solicita permiso para notificaciones del navegador
   */
  async solicitarPermisoNotificaciones() {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permiso = await Notification.requestPermission();
        if (permiso === 'granted') {
          console.log('Permisos de notificación concedidos');
        }
      } catch (error) {
        console.log('No se pudo solicitar permisos de notificación');
      }
    }
  }

  /**
   * Muestra notificación del navegador
   */
  mostrarNotificacionNavegador(medicamento) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notificacion = new Notification('¡Hora de tu medicina!', {
        body: `${medicamento.nombre} ${medicamento.dosis}${medicamento.unidadDosis}`,
        icon: '💊',
        requireInteraction: true,
        tag: `medicamento-${medicamento.id}`,
      });

      notificacion.onclick = () => {
        window.focus();
        notificacion.close();
      };
    }
  }

  /**
   * Configura audio
   */
  configurarAudio(habilitado) {
    this.notificadorSonoro.configurarAudio(habilitado);
  }
}

export default ControladorAlertas;
