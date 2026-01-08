/**
 * VISTA: Lista de Medicamentos
 * Renderiza la lista de medicamentos en la UI
 * RF01-B: Consultar medicamentos
 */
class VistaListaMedicamentos {
  constructor(contenedorId = 'medicine-list') {
    this.contenedor =
      document.querySelector(`.${contenedorId}`) ||
      document.querySelector(`#${contenedorId}`);
    this.callbacks = {
      onEditar: null,
      onEliminar: null,
      onVerDetalle: null,
    };
  }

  /**
   * Renderiza la lista completa de medicamentos
   */
  renderizar(medicamentos) {
    if (!this.contenedor) {
      console.error('Contenedor de lista no encontrado');
      return;
    }

    // Limpiar contenedor
    this.contenedor.innerHTML = '';

    if (medicamentos.length === 0) {
      this.mostrarMensajeVacio();
      return;
    }

    // Renderizar cada medicamento
    medicamentos.forEach((medicamento) => {
      const tarjeta = this.crearTarjetaMedicamento(medicamento);
      this.contenedor.appendChild(tarjeta);
    });
  }

  /**
   * Crea una tarjeta para un medicamento
   */
  crearTarjetaMedicamento(medicamento) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'medicine-card';
    tarjeta.dataset.medicamentoId = medicamento.id;

    // Determinar próxima toma
    const proximaToma = medicamento.obtenerProximaToma();
    let textoProximaToma = 'Sin tomas pendientes';

    if (proximaToma) {
      const fecha = new Date(proximaToma.fechaHora);
      const horas = String(fecha.getHours()).padStart(2, '0');
      const minutos = String(fecha.getMinutes()).padStart(2, '0');
      textoProximaToma = `Próxima toma: <strong>${horas}:${minutos}</strong>`;
    }

    // Determinar icono según presentación
    let iconoSVG =
      '<path d="M48.973,43.316L58.297,34l-0.02-0.02C61.809,30.375,64,25.445,64,20C64,8.953,55.047,0,44,0c-5.449,0-10.375,2.191-13.98,5.723L30,5.703l-9.316,9.324L48.973,43.316z"/><path d="M15.027,20.684L5.879,29.84C2.25,33.461,0,38.465,0,44c0,11.047,8.953,20,20,20c5.535,0,10.539-2.25,14.16-5.879l9.156-9.148L15.027,20.684z"/>'; // Por defecto pastilla

    if (medicamento.presentacion === 'jarabe') {
      iconoSVG =
        '<path d="M354.076,133.07c-10.346,0-18.762-8.417-18.762-18.762V99.459c10.398-0.537,18.67-9.113,18.67-19.643v-60.12C353.984,8.818,345.165,0,334.288,0H177.712c-10.877,0-19.696,8.818-19.696,19.696v60.12c0,10.532,8.272,19.108,18.67,19.643v14.848c0,10.346-8.417,18.762-18.762,18.762c-36.485,0-66.166,29.683-66.166,66.166c0,15.381,0,284.063,0,293.068c0,10.877,8.818,19.696,19.696,19.696h289.09c10.877,0,19.696-8.818,19.696-19.696c0-8.879,0-278.183,0-293.068C420.242,162.752,390.559,133.07,354.076,133.07z M314.592,39.392V60.12H197.408V39.392H314.592z M380.85,472.608H131.151V258.542H380.85V472.608z M380.851,219.152h-249.7v-19.916c0-14.763,12.01-26.775,26.775-26.775c32.066,0,58.154-26.088,58.154-58.154V99.511h79.843v14.797c0,32.066,26.088,58.154,58.154,58.154c14.763,0,26.774,12.011,26.774,26.775V219.152z"/><path d="M206.794,385.27h29.511v29.511c0,10.877,8.818,19.696,19.696,19.696c10.877,0,19.696-8.818,19.696-19.696V385.27h29.511c10.877,0,19.696-8.818,19.696-19.696c0-10.877-8.818-19.696-19.696-19.696h-29.511v-29.51c0-10.877-8.818-19.696-19.696-19.696c-10.877,0-19.696,8.818-19.696,19.696v29.51h-29.511c-10.877,0-19.696,8.818-19.696,19.696C187.098,376.452,195.917,385.27,206.794,385.27z"/>';
    } else if (medicamento.presentacion === 'inyección') {
      iconoSVG =
        '<path d="M22.043,8.549l-0.595,-0.595c-1.172,-1.172 -3.071,-1.172 -4.243,-0l-9.922,9.922l-1.574,-1.573c-0.391,-0.39 -1.024,-0.39 -1.414,0.001c-0.39,0.39 -0.39,1.024 0,1.414l4.289,4.285l-1.769,1.773l-1.49,-1.489c-0.39,-0.39 -1.024,-0.39 -1.414,0.001c-0.39,0.39 -0.39,1.024 0.001,1.414l4.368,4.366c0.391,0.39 1.025,0.39 1.415,-0.001c0.39,-0.39 0.39,-1.024 -0.001,-1.414l-1.464,-1.464l1.768,-1.772l4.295,4.291c0.391,0.39 1.024,0.39 1.414,-0c0.39,-0.391 0.39,-1.024 -0,-1.415l-1.35,-1.349l9.919,-9.919c1.172,-1.172 1.172,-3.071 0,-4.243l-0.819,-0.819l4.251,-4.256c0.39,-0.391 0.389,-1.025 -0.001,-1.415c-0.391,-0.39 -1.025,-0.389 -1.415,0.001l-4.249,4.256Zm-9.101,14.982l9.92,-9.92c0.391,-0.391 0.391,-1.024 0,-1.415c0,0 -2.828,-2.828 -2.828,-2.828c-0.391,-0.391 -1.024,-0.391 -1.414,-0l-0.858,0.857l1.108,1.108c0.39,0.39 0.39,1.024 -0,1.414c-0.39,0.391 -1.024,0.391 -1.414,0l-1.108,-1.107l-1.6,1.6l1.108,1.107c0.39,0.39 0.39,1.024 -0,1.414c-0.391,0.391 -1.024,0.391 -1.414,0l-1.108,-1.107l-1.572,1.571l1.108,1.108c0.39,0.39 0.39,1.024 -0,1.414c-0.39,0.391 -1.024,0.391 -1.414,0l-1.108,-1.107l-1.65,1.65l4.244,4.241Z"/>';
    }

    const iconoClass =
      medicamento.presentacion === 'jarabe'
        ? 'medicine-icon-liquid'
        : medicamento.presentacion === 'inyección'
        ? 'medicine-icon-injection'
        : '';

    let viewBox = '0 0 64 64'; // Por defecto pastilla
    if (medicamento.presentacion === 'jarabe') {
      viewBox = '0 0 512 512';
    } else if (medicamento.presentacion === 'inyección') {
      viewBox = '0 0 32 32';
    }

    tarjeta.innerHTML = `
            <div class="medicine-icon ${iconoClass}">
                <svg class="medicine-svg-icon" width="48" height="48" viewBox="${viewBox}" fill="currentColor">
                    ${iconoSVG}
                </svg>
            </div>
            <div class="medicine-info">
                <h3 class="medicine-name">${this.escaparHTML(
                  medicamento.nombre
                )}</h3>
                <p class="medicine-dose">${medicamento.dosis}${
      medicamento.unidadDosis
    } • ${medicamento.presentacion}</p>
                <p class="medicine-time">${textoProximaToma}</p>
            </div>
            <div class="medicine-actions">
                <!-- Botón Editar -->
                <button class="btn-icon btn-editar" data-action="editar" aria-label="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <!-- Botón Eliminar -->
                <button class="btn-icon btn-delete btn-eliminar" data-action="eliminar" aria-label="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;

    // Agregar event listeners
    const btnEditar = tarjeta.querySelector('[data-action="editar"]');
    const btnEliminar = tarjeta.querySelector('[data-action="eliminar"]');

    if (btnEditar) {
      btnEditar.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.callbacks.onEditar) {
          this.callbacks.onEditar(medicamento);
        }
      });
    }

    if (btnEliminar) {
      btnEliminar.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`¿Estás seguro de eliminar "${medicamento.nombre}"?`)) {
          if (this.callbacks.onEliminar) {
            this.callbacks.onEliminar(medicamento.id);
          }
        }
      });
    }

    // Click en la tarjeta para ver detalle
    tarjeta.addEventListener('click', () => {
      if (this.callbacks.onVerDetalle) {
        this.callbacks.onVerDetalle(medicamento);
      }
    });

    return tarjeta;
  }

  /**
   * Muestra mensaje cuando no hay medicamentos
   */
  mostrarMensajeVacio() {
    this.contenedor.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #94c8e5;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 16px;">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                </svg>
                <p style="font-size: 1.2rem; margin-bottom: 8px;">No hay medicamentos registrados</p>
                <p style="font-size: 0.95rem;">Toca el botón + para agregar tu primer medicamento</p>
            </div>
        `;
  }

  /**
   * Configura callbacks
   */
  onEditar(callback) {
    this.callbacks.onEditar = callback;
  }

  onEliminar(callback) {
    this.callbacks.onEliminar = callback;
  }

  onVerDetalle(callback) {
    this.callbacks.onVerDetalle = callback;
  }

  /**
   * Escapa HTML para prevenir XSS
   */
  escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }

  /**
   * Muestra indicador de carga
   */
  mostrarCargando() {
    if (this.contenedor) {
      this.contenedor.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div style="font-size: 2rem;">⏳</div>
                    <p>Cargando medicamentos...</p>
                </div>
            `;
    }
  }

  /**
   * Muestra mensaje de error
   */
  mostrarError(mensaje) {
    if (this.contenedor) {
      this.contenedor.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #ef4444;">
                    <div style="font-size: 2rem;">⚠️</div>
                    <p>${this.escaparHTML(mensaje)}</p>
                </div>
            `;
    }
  }
}

export default VistaListaMedicamentos;
