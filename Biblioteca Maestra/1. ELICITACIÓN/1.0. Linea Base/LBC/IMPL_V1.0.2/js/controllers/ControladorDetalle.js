/**
 * CONTROLADOR: Detalle del Medicamento
 * Gestiona la visualización detallada de un medicamento
 */
import GestorAlmacenamiento from '../services/GestorAlmacenamiento.js';

class ControladorDetalle {
  constructor() {
    this.gestor = new GestorAlmacenamiento();
    this.medicamentoActual = null;
  }

  /**
   * Muestra el detalle de un medicamento
   */
  async mostrarDetalle(medicamento) {
    try {
      this.medicamentoActual = medicamento;

      // Cargar información completa
      await this.cargarDatosCompletos();

      // Actualizar interfaz
      this.renderizarInformacionGeneral();
      await this.renderizarProximasTomas();
      await this.renderizarHistorial();
      await this.renderizarSintomas();

      // Configurar eventos
      this.configurarEventos();

      // Mostrar pantalla
      this.mostrarPantalla();
    } catch (error) {
      console.error('Error al mostrar detalle:', error);
      alert('Error al cargar el detalle del medicamento');
    }
  }

  /**
   * Carga datos completos del medicamento
   */
  async cargarDatosCompletos() {
    // Recargar medicamento actualizado
    this.medicamentoActual = await this.gestor.obtenerMedicamentoPorId(
      this.medicamentoActual.id,
    );
  }

  /**
   * Renderiza la información general
   */
  renderizarInformacionGeneral() {
    const med = this.medicamentoActual;

    // Icono SVG según presentación
    const iconoContainer = document.getElementById('detail-icon');
    let iconoSVG =
      '<path d="M48.973,43.316L58.297,34l-0.02-0.02C61.809,30.375,64,25.445,64,20C64,8.953,55.047,0,44,0c-5.449,0-10.375,2.191-13.98,5.723L30,5.703l-9.316,9.324L48.973,43.316z"/><path d="M15.027,20.684L5.879,29.84C2.25,33.461,0,38.465,0,44c0,11.047,8.953,20,20,20c5.535,0,10.539-2.25,14.16-5.879l9.156-9.148L15.027,20.684z"/>';
    let viewBox = '0 0 64 64';
    let iconClass = '';

    if (med.presentacion === 'jarabe') {
      iconoSVG =
        '<path d="M354.076,133.07c-10.346,0-18.762-8.417-18.762-18.762V99.459c10.398-0.537,18.67-9.113,18.67-19.643v-60.12C353.984,8.818,345.165,0,334.288,0H177.712c-10.877,0-19.696,8.818-19.696,19.696v60.12c0,10.532,8.272,19.108,18.67,19.643v14.848c0,10.346-8.417,18.762-18.762,18.762c-36.485,0-66.166,29.683-66.166,66.166c0,15.381,0,284.063,0,293.068c0,10.877,8.818,19.696,19.696,19.696h289.09c10.877,0,19.696-8.818,19.696-19.696c0-8.879,0-278.183,0-293.068C420.242,162.752,390.559,133.07,354.076,133.07z M314.592,39.392V60.12H197.408V39.392H314.592z M380.85,472.608H131.151V258.542H380.85V472.608z M380.851,219.152h-249.7v-19.916c0-14.763,12.01-26.775,26.775-26.775c32.066,0,58.154-26.088,58.154-58.154V99.511h79.843v14.797c0,32.066,26.088,58.154,58.154,58.154c14.763,0,26.774,12.011,26.774,26.775V219.152z"/><path d="M206.794,385.27h29.511v29.511c0,10.877,8.818,19.696,19.696,19.696c10.877,0,19.696-8.818,19.696-19.696V385.27h29.511c10.877,0,19.696-8.818,19.696-19.696c0-10.877-8.818-19.696-19.696-19.696h-29.511v-29.51c0-10.877-8.818-19.696-19.696-19.696c-10.877,0-19.696,8.818-19.696,19.696v29.51h-29.511c-10.877,0-19.696,8.818-19.696,19.696C187.098,376.452,195.917,385.27,206.794,385.27z"/>';
      viewBox = '0 0 512 512';
      iconClass = 'medicine-icon-liquid';
    } else if (med.presentacion === 'inyección') {
      iconoSVG =
        '<path d="M22.043,8.549l-0.595,-0.595c-1.172,-1.172 -3.071,-1.172 -4.243,-0l-9.922,9.922l-1.574,-1.573c-0.391,-0.39 -1.024,-0.39 -1.414,0.001c-0.39,0.39 -0.39,1.024 0,1.414l4.289,4.285l-1.769,1.773l-1.49,-1.489c-0.39,-0.39 -1.024,-0.39 -1.414,0.001c-0.39,0.39 -0.39,1.024 0.001,1.414l4.368,4.366c0.391,0.39 1.025,0.39 1.415,-0.001c0.39,-0.39 0.39,-1.024 -0.001,-1.414l-1.464,-1.464l1.768,-1.772l4.295,4.291c0.391,0.39 1.024,0.39 1.414,-0c0.39,-0.391 0.39,-1.024 -0,-1.415l-1.35,-1.349l9.919,-9.919c1.172,-1.172 1.172,-3.071 0,-4.243l-0.819,-0.819l4.251,-4.256c0.39,-0.391 0.389,-1.025 -0.001,-1.415c-0.391,-0.39 -1.025,-0.389 -1.415,0.001l-4.249,4.256Zm-9.101,14.982l9.92,-9.92c0.391,-0.391 0.391,-1.024 0,-1.415c0,0 -2.828,-2.828 -2.828,-2.828c-0.391,-0.391 -1.024,-0.391 -1.414,-0l-0.858,0.857l1.108,1.108c0.39,0.39 0.39,1.024 -0,1.414c-0.39,0.391 -1.024,0.391 -1.414,0l-1.108,-1.107l-1.6,1.6l1.108,1.107c0.39,0.39 0.39,1.024 -0,1.414c-0.391,0.391 -1.024,0.391 -1.414,0l-1.108,-1.107l-1.572,1.571l1.108,1.108c0.39,0.39 0.39,1.024 -0,1.414c-0.39,0.391 -1.024,0.391 -1.414,0l-1.108,-1.107l-1.65,1.65l4.244,4.241Z"/>';
      viewBox = '0 0 32 32';
      iconClass = 'medicine-icon-injection';
    }

    iconoContainer.innerHTML = `
      <svg class="medicine-svg-icon ${iconClass}" width="64" height="64" viewBox="${viewBox}" fill="currentColor">
        ${iconoSVG}
      </svg>
    `;

    // Nombre
    document.getElementById('detail-name').textContent = med.nombre;

    // Nombre del paciente
    const pacienteElement = document.getElementById('detail-paciente');
    if (pacienteElement) {
      if (med.nombrePaciente && med.nombrePaciente.trim()) {
        pacienteElement.textContent = med.nombrePaciente;
        pacienteElement.parentElement.style.display = 'flex';
      } else {
        pacienteElement.parentElement.style.display = 'none';
      }
    }

    // Información
    const presentacionLabels = {
      pastilla: 'Pastilla',
      jarabe: 'Jarabe',
      inyección: 'Inyección',
    };
    document.getElementById('detail-presentacion').textContent =
      presentacionLabels[med.presentacion] || med.presentacion;

    document.getElementById('detail-dosis').textContent =
      `${med.dosis} ${med.unidadDosis}`;

    document.getElementById('detail-frecuencia').textContent =
      `Cada ${med.frecuencia} horas`;

    document.getElementById('detail-hora').textContent = med.horarioPrimeraToma;

    document.getElementById('detail-duracion').textContent =
      `${med.duracion} días`;

    const fecha = new Date(med.fechaInicio);
    document.getElementById('detail-fecha-inicio').textContent =
      fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

    // Notas
    const notasSection = document.getElementById('detail-notas-section');
    const notasText = document.getElementById('detail-notas');
    if (med.notas && med.notas.trim()) {
      notasSection.style.display = 'block';
      notasText.textContent = med.notas;
    } else {
      notasSection.style.display = 'none';
    }
  }

  /**
   * Renderiza las próximas tomas
   */
  async renderizarProximasTomas() {
    const container = document.getElementById('detail-schedule');
    const ahora = new Date();

    const horarios = this.medicamentoActual.horariosGenerados || [];
    const proximasTomas = horarios
      .filter((h) => {
        const fecha = new Date(h.fechaHora);
        return fecha > ahora && !h.tomada && !h.omitida;
      })
      .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora))
      .slice(0, 5);

    if (proximasTomas.length === 0) {
      container.innerHTML =
        '<p class="empty-message">No hay próximas tomas programadas</p>';
      return;
    }

    container.innerHTML = proximasTomas
      .map((toma) => {
        const fecha = new Date(toma.fechaHora);
        const fechaStr = fecha.toLocaleDateString('es-ES', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
        });
        const horaStr = fecha.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        });

        return `
        <div class="schedule-item">
          <div class="schedule-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="schedule-info">
            <div class="schedule-date">${fechaStr}</div>
            <div class="schedule-time">${horaStr}</div>
          </div>
        </div>
      `;
      })
      .join('');
  }

  /**
   * Renderiza el historial de eventos
   */
  async renderizarHistorial() {
    const container = document.getElementById('detail-history');

    try {
      const eventos = await this.gestor.obtenerEventosPorMedicamento(
        this.medicamentoActual.id,
      );

      if (eventos.length === 0) {
        container.innerHTML =
          '<p class="empty-message">No hay eventos registrados</p>';
        return;
      }

      const eventosRecientes = eventos
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 10);

      container.innerHTML = eventosRecientes
        .map((evento) => {
          const fecha = new Date(evento.fecha);
          const fechaStr = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
          });
          const horaStr = fecha.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          });

          const iconos = {
            tomado: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>`,
            omitido: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>`,
            pospuesto: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>`,
          };

          const labels = {
            tomado: 'Tomado',
            omitido: 'Omitido',
            pospuesto: 'Pospuesto',
          };

          return `
          <div class="history-mini-item history-mini-${evento.tipo}">
            <div class="history-mini-icon">${iconos[evento.tipo]}</div>
            <div class="history-mini-content">
              <div class="history-mini-type">${labels[evento.tipo]}</div>
              <div class="history-mini-time">${fechaStr} ${horaStr}</div>
              ${
                evento.motivo
                  ? `<div class="history-mini-reason">${evento.motivo}</div>`
                  : ''
              }
            </div>
          </div>
        `;
        })
        .join('');
    } catch (error) {
      console.error('Error al cargar historial:', error);
      container.innerHTML =
        '<p class="empty-message">Error al cargar historial</p>';
    }
  }

  /**
   * Renderiza los síntomas
   */
  async renderizarSintomas() {
    const container = document.getElementById('detail-symptoms');

    try {
      const sintomas = await this.gestor.obtenerSintomasPorMedicamento(
        this.medicamentoActual.id,
      );

      if (sintomas.length === 0) {
        container.innerHTML =
          '<p class="empty-message">No hay síntomas registrados</p>';
        return;
      }

      const sintomasRecientes = sintomas
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5);

      container.innerHTML = sintomasRecientes
        .map((sintoma) => {
          const fecha = new Date(sintoma.fecha);
          const fechaStr = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
          });

          const colores = {
            leve: '#10b981',
            moderada: '#f59e0b',
            severa: '#ef4444',
          };

          return `
          <div class="symptom-mini-item">
            <div class="symptom-mini-icon" style="color: ${
              colores[sintoma.intensidad]
            }">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div class="symptom-mini-content">
              <div class="symptom-mini-desc">${sintoma.descripcion}</div>
              <div class="symptom-mini-meta">
                <span>${fechaStr}</span>
                <span class="symptom-mini-intensity" style="color: ${
                  colores[sintoma.intensidad]
                }">${sintoma.intensidad}</span>
              </div>
            </div>
          </div>
        `;
        })
        .join('');
    } catch (error) {
      console.error('Error al cargar síntomas:', error);
      container.innerHTML =
        '<p class="empty-message">Error al cargar síntomas</p>';
    }
  }

  /**
   * Configura eventos de la pantalla
   */
  configurarEventos() {
    // Botón atrás
    const btnBack = document.querySelector('.btn-back-detail');
    if (btnBack) {
      // Remover listeners previos
      const newBtn = btnBack.cloneNode(true);
      btnBack.parentNode.replaceChild(newBtn, btnBack);

      newBtn.addEventListener('click', () => {
        this.cerrar();
      });
    }

    // Botón editar
    const btnEdit = document.querySelector('.btn-edit-detail');
    if (btnEdit) {
      const newBtn = btnEdit.cloneNode(true);
      btnEdit.parentNode.replaceChild(newBtn, btnEdit);

      newBtn.addEventListener('click', () => {
        this.editar();
      });
    }

    // Botón eliminar
    const btnDelete = document.getElementById('btn-delete-detail');
    if (btnDelete) {
      const newBtn = btnDelete.cloneNode(true);
      btnDelete.parentNode.replaceChild(newBtn, btnDelete);

      newBtn.addEventListener('click', () => {
        this.eliminar();
      });
    }

    // Botón agregar síntoma
    const btnAddSymptom = document.getElementById('btn-add-symptom-detail');
    if (btnAddSymptom) {
      const newBtn = btnAddSymptom.cloneNode(true);
      btnAddSymptom.parentNode.replaceChild(newBtn, btnAddSymptom);

      newBtn.addEventListener('click', () => {
        this.agregarSintoma();
      });
    }
  }

  /**
   * Cierra la vista de detalle
   */
  cerrar() {
    const screenDetail = document.getElementById('screen-detail');
    const screenList = document.getElementById('screen-list');

    if (screenDetail) {
      screenDetail.classList.remove('active');
    }
    if (screenList) {
      screenList.classList.add('active');
    }
  }

  /**
   * Edita el medicamento actual
   */
  editar() {
    // Cerrar la pantalla de detalle primero
    const screenDetail = document.getElementById('screen-detail');
    if (screenDetail) {
      screenDetail.classList.remove('active');
    }

    // Llamar al método de edición
    if (window.app) {
      window.app.editarMedicamento(this.medicamentoActual);
    }
  }

  /**
   * Elimina el medicamento actual
   */
  async eliminar() {
    if (
      !confirm(`¿Estás seguro de eliminar "${this.medicamentoActual.nombre}"?`)
    ) {
      return;
    }

    try {
      if (window.app) {
        await window.app.eliminarMedicamento(this.medicamentoActual.id);
        this.cerrar();
      }
    } catch (error) {
      console.error('Error al eliminar medicamento:', error);
      alert('Error al eliminar el medicamento');
    }
  }

  /**
   * Agrega un síntoma al medicamento actual
   */
  async agregarSintoma() {
    if (window.app && window.app.controladorSintomas) {
      // Primero cerrar la pantalla de detalle
      const screenDetail = document.getElementById('screen-detail');
      if (screenDetail) {
        screenDetail.classList.remove('active');
      }

      // Mostrar formulario de síntomas (ahora es async)
      await window.app.controladorSintomas.mostrarFormulario();

      // Pre-seleccionar el medicamento
      setTimeout(() => {
        const select = document.getElementById('symptom-medicine-select');
        if (select && this.medicamentoActual) {
          select.value = this.medicamentoActual.id;

          // Trigger change event para asegurar que se actualice
          const event = new Event('change', { bubbles: true });
          select.dispatchEvent(event);
        }
      }, 200);
    }
  }

  /**
   * Muestra la pantalla de detalle
   */
  mostrarPantalla() {
    const screenDetail = document.getElementById('screen-detail');
    const screenList = document.getElementById('screen-list');

    if (screenList) {
      screenList.classList.remove('active');
    }
    if (screenDetail) {
      screenDetail.classList.add('active');
    }
  }
}

export default ControladorDetalle;
