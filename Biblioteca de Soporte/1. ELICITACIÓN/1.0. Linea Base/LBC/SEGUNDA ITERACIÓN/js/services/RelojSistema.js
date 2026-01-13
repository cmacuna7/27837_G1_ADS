/**
 * PATRÓN OBSERVER: Reloj del Sistema
 * Monitorea el tiempo y notifica cuando es hora de tomar medicamentos
 * RF02: Recordatorios de medicación
 */
import Sujeto from './Sujeto.js';
import GestorAlmacenamiento from './GestorAlmacenamiento.js';

class RelojSistema extends Sujeto {
  constructor() {
    super();
    this.horaActual = new Date();
    this.intervaloTick = null;
    this.intervaloVerificacion = 60000; // Verificar cada minuto
    this.gestorAlmacenamiento = new GestorAlmacenamiento();
    this.tomasNotificadas = new Set(); // Evitar duplicados
  }

  /**
   * Inicia el reloj del sistema
   */
  iniciar() {
    console.log('\n========== RELOJ DEL SISTEMA INICIADO ==========');
    console.log('[RELOJ] Tick cada 1 segundo');
    console.log('[RELOJ] Verificación de medicamentos cada 60 segundos');

    // Tick cada segundo para actualizar hora
    this.intervaloTick = setInterval(() => {
      this.tick();
    }, 1000);

    // Verificar medicamentos cada minuto
    this.verificarMedicamentos();
    setInterval(() => {
      this.verificarMedicamentos();
    }, this.intervaloVerificacion);

    console.log('[RELOJ] Sistema de monitoreo activo\n');
  }

  /**
   * Actualiza la hora actual
   */
  tick() {
    this.horaActual = new Date();
  }

  /**
   * Verifica si hay medicamentos por tomar
   * RF02: Genera alertas automáticas
   */
  async verificarMedicamentos() {
    try {
      console.log(
        '\n🔍 [RELOJ] ========== VERIFICANDO MEDICAMENTOS =========='
      );
      const horariosPendientes =
        await this.gestorAlmacenamiento.obtenerHorariosPendientes();
      const ahora = new Date();

      console.log(
        `📋 [RELOJ] Horarios pendientes encontrados: ${horariosPendientes.length}`
      );

      if (horariosPendientes.length === 0) {
        console.log('[RELOJ] No hay medicamentos pendientes');
        console.log('====================================================\n');
        return;
      }

      for (const horario of horariosPendientes) {
        const fechaHorario = new Date(horario.fechaHora);
        const diferenciaMs = fechaHorario - ahora;
        const diferenciaMinutos = Math.floor(diferenciaMs / 60000);

        console.log(`\n  [HORARIO ${horario.id}]`);
        console.log(
          `     Hora programada: ${fechaHorario.toLocaleTimeString()}`
        );
        console.log(`     Diferencia: ${diferenciaMinutos} minutos`);
        console.log(
          `     Ya notificado: ${this.tomasNotificadas.has(horario.id)}`
        );

        // Notificar si la toma es ahora o está vencida
        if (diferenciaMinutos <= 0 && !this.tomasNotificadas.has(horario.id)) {
          console.log(`\n  [RELOJ] ¡ALERTA! Es hora de tomar medicamento`);

          // Obtener información del medicamento
          const medicamento =
            await this.gestorAlmacenamiento.obtenerMedicamentoPorId(
              horario.medicamentoId
            );

          if (medicamento) {
            console.log(`  [RELOJ] Medicamento: ${medicamento.nombre}`);
            console.log(
              `  📢 [RELOJ] Preparando notificación a observadores...`
            );

            this.notificar({
              tipo: 'ALERTA_MEDICAMENTO',
              horario: horario,
              medicamento: medicamento,
              timestamp: new Date(),
            });

            this.tomasNotificadas.add(horario.id);
            console.log(`  [RELOJ] Toma registrada como notificada`);
          } else {
            console.log(
              `  ⚠️ [RELOJ] No se encontró información del medicamento`
            );
          }
        } else if (diferenciaMinutos > 0) {
          console.log(`     Falta ${diferenciaMinutos} min`);
        }
      }

      console.log('\n====================================================\n');
    } catch (error) {
      console.error('❌ [RELOJ] Error al verificar medicamentos:', error);
    }
  }

  /**
   * Detiene el reloj
   */
  detener() {
    if (this.intervaloTick) {
      clearInterval(this.intervaloTick);
      this.intervaloTick = null;
      console.log('Reloj del sistema detenido');
    }
  }

  /**
   * Obtiene la hora actual
   */
  obtenerHoraActual() {
    return this.horaActual;
  }
}

export default RelojSistema;
