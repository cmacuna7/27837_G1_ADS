/**
 * VISTA: Historial de Eventos
 * Muestra el historial completo de eventos de toma
 * RF06: Informes de historial de medicación
 */
class VistaHistorial {
  constructor(containerId) {
    this.container = document.querySelector(`.${containerId}`);
    this.statsContainer = {
      total: document.getElementById('stat-total'),
      tomadas: document.getElementById('stat-tomadas'),
      omitidas: document.getElementById('stat-omitidas'),
    };
  }

  /**
   * Renderiza la lista de eventos
   */
  renderizar(eventos, medicamentos = []) {
    if (!this.container) {
      console.error('Contenedor de historial no encontrado');
      return;
    }

    // Limpiar contenedor
    this.container.innerHTML = '';

    if (eventos.length === 0) {
      this.mostrarMensajeVacio();
      this.actualizarEstadisticas([]);
      return;
    }

    // Actualizar estadísticas
    this.actualizarEstadisticas(eventos);

    // Agrupar eventos por fecha
    const eventosPorFecha = this.agruparPorFecha(eventos);

    // Renderizar grupos
    Object.keys(eventosPorFecha)
      .sort((a, b) => new Date(b) - new Date(a))
      .forEach((fecha) => {
        const grupo = this.crearGrupoFecha(fecha, eventosPorFecha[fecha]);
        this.container.appendChild(grupo);
      });
  }

  /**
   * Agrupa eventos por fecha
   */
  agruparPorFecha(eventos) {
    const grupos = {};

    eventos.forEach((evento) => {
      const fecha = new Date(evento.fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      if (!grupos[fecha]) {
        grupos[fecha] = [];
      }
      grupos[fecha].push(evento);
    });

    return grupos;
  }

  /**
   * Crea un grupo de eventos por fecha
   */
  crearGrupoFecha(fecha, eventos) {
    const grupo = document.createElement('div');
    grupo.className = 'history-date-group';

    const titulo = document.createElement('h3');
    titulo.className = 'history-date-title';
    titulo.textContent = fecha;
    grupo.appendChild(titulo);

    eventos.forEach((evento) => {
      const item = this.crearItemEvento(evento);
      grupo.appendChild(item);
    });

    return grupo;
  }

  /**
   * Crea un item de evento
   */
  crearItemEvento(evento) {
    const item = document.createElement('div');
    item.className = `history-item history-item-${evento.tipo}`;
    item.dataset.eventoId = evento.id;

    const hora = new Date(evento.fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const tipoLabel = {
      tomado: 'Tomado',
      omitido: 'Omitido',
      pospuesto: 'Pospuesto',
    };

    item.innerHTML = `
      <div class="history-item-icon">${evento.obtenerIcono()}</div>
      <div class="history-item-content">
        <div class="history-item-medicine">${evento.nombreMedicamento}</div>
        <div class="history-item-details">
          <span class="history-item-time">${hora}</span>
          <span class="history-item-type">${tipoLabel[evento.tipo]}</span>
          ${
            evento.dosis
              ? `<span class="history-item-dose">${evento.dosis} ${evento.unidadDosis}</span>`
              : ''
          }
        </div>
        ${
          evento.motivo
            ? `<div class="history-item-reason">Motivo: ${evento.motivo}</div>`
            : ''
        }
        ${
          evento.notas
            ? `<div class="history-item-notes">${evento.notas}</div>`
            : ''
        }
      </div>
    `;

    return item;
  }

  /**
   * Actualiza las estadísticas
   */
  actualizarEstadisticas(eventos) {
    const total = eventos.length;
    const tomadas = eventos.filter((e) => e.tipo === 'tomado').length;
    const omitidas = eventos.filter((e) => e.tipo === 'omitido').length;

    if (this.statsContainer.total) {
      this.statsContainer.total.textContent = total;
    }
    if (this.statsContainer.tomadas) {
      this.statsContainer.tomadas.textContent = tomadas;
    }
    if (this.statsContainer.omitidas) {
      this.statsContainer.omitidas.textContent = omitidas;
    }
  }

  /**
   * Muestra mensaje cuando no hay eventos
   */
  mostrarMensajeVacio() {
    this.container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="bi bi-calendar-check" style="font-size: 4rem; color: var(--allports-400);"></i></div>
        <h3>No hay eventos registrados</h3>
        <p>Los eventos de toma se registrarán automáticamente</p>
      </div>
    `;
  }

  /**
   * Filtra eventos por tipo
   */
  filtrarPorTipo(eventos, tipo) {
    if (!tipo || tipo === '') {
      return eventos;
    }
    return eventos.filter((e) => e.tipo === tipo);
  }

  /**
   * Filtra eventos por medicamento
   */
  filtrarPorMedicamento(eventos, medicamentoId) {
    if (!medicamentoId || medicamentoId === '') {
      return eventos;
    }
    return eventos.filter((e) => e.medicamentoId == medicamentoId);
  }

  /**
   * Limpia la vista
   */
  limpiar() {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.actualizarEstadisticas([]);
  }
}

export default VistaHistorial;
