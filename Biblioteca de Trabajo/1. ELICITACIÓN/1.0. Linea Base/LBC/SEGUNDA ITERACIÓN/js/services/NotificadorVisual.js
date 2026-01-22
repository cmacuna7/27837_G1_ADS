/**
 * PATRÓN OBSERVER: Notificador Visual
 * Muestra alertas visuales en pantalla
 * RF02: Las alertas incluirán mensaje en pantalla
 */
import Observador from './Observador.js';

class NotificadorVisual extends Observador {
  constructor(notificadorSonoro = null) {
    super();
    this.notificadorSonoro = notificadorSonoro; // Referencia al notificador sonoro
  }

  /**
   * Establece la referencia al notificador sonoro
   */
  setNotificadorSonoro(notificadorSonoro) {
    this.notificadorSonoro = notificadorSonoro;
  }

  /**
   * Actualiza la UI cuando hay una alerta
   */
  actualizar(data) {
    console.log('    [OBSERVER - NotificadorVisual] Actualización recibida');
    if (data.tipo === 'ALERTA_MEDICAMENTO') {
      console.log(
        '    👁️ [OBSERVER - NotificadorVisual] Tipo correcto: ALERTA_MEDICAMENTO',
      );
      console.log(
        '    🎬 [OBSERVER - NotificadorVisual] ACCIÓN: Mostrando alerta visual',
      );
      this.mostrarAlertaVisual(data.medicamento, data.horario);
    } else {
      console.log(
        '    ⚠️ [OBSERVER - NotificadorVisual] Tipo no reconocido:',
        data.tipo,
      );
    }
  }

  /**
   * Muestra la pantalla de alerta
   */
  mostrarAlertaVisual(medicamento, horario) {
    // Validar que medicamento existe
    if (!medicamento) {
      console.warn('No se puede mostrar alerta: medicamento no definido');
      return;
    }

    // Actualizar contenido de la alerta
    const alertaSubtitle = document.querySelector('.alert-subtitle');
    if (alertaSubtitle) {
      alertaSubtitle.textContent = `${medicamento.nombre} ${medicamento.dosis}${medicamento.unidadDosis}`;
    }

    // Guardar ID de la toma actual para acciones posteriores
    window.tomaActual = horario?.id;
    window.medicamentoActual = medicamento;

    // Mostrar pantalla de alerta
    const screenAlert = document.getElementById('screen-alert');
    if (screenAlert) {
      screenAlert.classList.add('active');
    }

    // Vibración si está disponible
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    // Notificación del navegador (pantalla de bloqueo)
    this.mostrarNotificacionNavegador(medicamento);

    // Reproducir sonido (opcional)
    this.reproducirSonido();
  }

  /**
   * RF02: Mostrar notificación del navegador (pantalla de bloqueo)
   */
  mostrarNotificacionNavegador(medicamento) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('¡Hora de tu medicina!', {
        body: `${medicamento.nombre} - ${medicamento.dosis}${medicamento.unidadDosis}`,
        icon: medicamento.icono,
        badge: '💊',
        tag: 'medicamento-alerta',
        requireInteraction: true, // No desaparece automáticamente
        silent: false,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }

  /**
   * Reproduce un sonido de alerta
   */
  reproducirSonido() {
    try {
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('No se pudo reproducir sonido:', error);
    }
  }

  /**
   * Oculta la alerta visual y detiene la alarma sonora
   */
  ocultarAlerta() {
    const screenAlert = document.getElementById('screen-alert');
    if (screenAlert) {
      screenAlert.classList.remove('active');
    }

    // Detener alarma sonora si existe referencia
    if (this.notificadorSonoro) {
      this.notificadorSonoro.detenerAlarma();
    }
  }
}

export default NotificadorVisual;
