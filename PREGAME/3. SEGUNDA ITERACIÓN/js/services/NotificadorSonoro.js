/**
 * PATRÓN OBSERVER: Notificador Sonoro
 * Reproduce alertas sonoras
 * RF02: Las alertas incluirán sonido
 */
import Observador from './Observador.js';

class NotificadorSonoro extends Observador {
  constructor() {
    super();
    this.audioHabilitado = true;
    this.intervaloAlarma = null; // Temporizador para repetir la alarma
    this.audioContext = null;
  }

  /**
   * Actualiza cuando hay una alerta
   */
  actualizar(data) {
    console.log('    [OBSERVER - NotificadorSonoro] Actualización recibida');
    console.log(
      '    🔊 [OBSERVER - NotificadorSonoro] Audio habilitado:',
      this.audioHabilitado
    );
    if (data.tipo === 'ALERTA_MEDICAMENTO' && this.audioHabilitado) {
      console.log(
        '    🔔 [OBSERVER - NotificadorSonoro] Tipo correcto: ALERTA_MEDICAMENTO'
      );
      console.log(
        '    🎬 [OBSERVER - NotificadorSonoro] ACCIÓN: Iniciando alarma continua'
      );
      this.iniciarAlarma();
    } else if (data.tipo !== 'ALERTA_MEDICAMENTO') {
      console.log(
        '    ⚠️ [OBSERVER - NotificadorSonoro] Tipo no reconocido:',
        data.tipo
      );
    } else {
      console.log(
        '    🔇 [OBSERVER - NotificadorSonoro] Audio deshabilitado, no se reproduce'
      );
    }
  }

  /**
   * Inicia la alarma continua que suena cada 3 segundos
   */
  iniciarAlarma() {
    console.log('    [ALARMA] Iniciando alarma continua...');

    // Detener alarma previa si existe
    this.detenerAlarma();

    // Reproducir inmediatamente
    console.log('    [ALARMA] Primera reproducción inmediata');
    this.reproducirAlerta();

    // Repetir cada 3 segundos
    this.intervaloAlarma = setInterval(() => {
      console.log('    [ALARMA] Repitiendo alarma (cada 3s)');
      this.reproducirAlerta();
    }, 3000); // Repetir cada 3 segundos

    console.log(
      '    ⏰ [ALARMA] Alarma continua configurada (intervalo: 3000ms)'
    );
  }

  /**
   * Detiene la alarma continua
   */
  detenerAlarma() {
    if (this.intervaloAlarma) {
      console.log('    [ALARMA] Deteniendo alarma continua...');
      clearInterval(this.intervaloAlarma);
      this.intervaloAlarma = null;
      console.log('    [ALARMA] Intervalo limpiado');
    } else {
      console.log('    [ALARMA] No hay alarma activa para detener');
    }

    // Cerrar contexto de audio si existe
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      console.log('    [ALARMA] Contexto de audio cerrado');
    }
  }

  /**
   * Reproduce una secuencia de tonos de alerta
   */
  reproducirAlerta() {
    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      // Secuencia de 3 beeps
      const frecuencias = [880, 880, 880]; // Frecuencia en Hz
      const duracion = 0.2; // Duración de cada beep
      const pausa = 0.1; // Pausa entre beeps

      let tiempoInicio = this.audioContext.currentTime;

      frecuencias.forEach((frecuencia, index) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frecuencia;
        oscillator.type = 'sine';

        const inicio = tiempoInicio + index * (duracion + pausa);
        const fin = inicio + duracion;

        gainNode.gain.setValueAtTime(0, inicio);
        gainNode.gain.linearRampToValueAtTime(0.3, inicio + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, fin);

        oscillator.start(inicio);
        oscillator.stop(fin);
      });

      console.log('Alerta sonora reproducida');
    } catch (error) {
      console.log('No se pudo reproducir alerta sonora:', error);
    }
  }

  /**
   * Habilita/deshabilita el audio
   */
  configurarAudio(habilitado) {
    this.audioHabilitado = habilitado;
    if (!habilitado) {
      this.detenerAlarma();
    }
    console.log(`Audio ${habilitado ? 'habilitado' : 'deshabilitado'}`);
  }
}

export default NotificadorSonoro;
