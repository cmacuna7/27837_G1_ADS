/**
 * CONTROLADOR: Formulario
 * Gestiona la validación y lógica del formulario de medicamentos
 * RF01-A: Registro de Medicamento con validación
 */
class ControladorFormulario {
  constructor() {
    this.formulario = null;
    this.callbacks = {
      onSubmit: null,
      onCancel: null,
    };
  }

  /**
   * Inicializa el controlador del formulario
   */
  inicializar(formularioElement) {
    this.formulario = formularioElement;
    this.configurarEventos();
  }

  /**
   * Configura los eventos del formulario
   */
  configurarEventos() {
    if (!this.formulario) return;

    // Validación en tiempo real del nombre
    const inputNombre = this.formulario.querySelector('#medicine-name-input');
    if (inputNombre) {
      inputNombre.addEventListener('input', () => this.validarFormulario());
    }

    // Submit del formulario
    this.formulario.addEventListener('submit', (e) => {
      e.preventDefault();
      this.manejarSubmit();
    });
  }

  /**
   * RF01-A: Implementar validación de campos obligatorios
   */
  validarFormulario() {
    const nombre =
      this.formulario.querySelector('#medicine-name-input')?.value || '';
    const saveBtn = document.getElementById('save-btn');

    if (nombre.trim().length > 0) {
      if (saveBtn) saveBtn.disabled = false;
      return true;
    } else {
      if (saveBtn) saveBtn.disabled = true;
      return false;
    }
  }

  /**
   * Obtiene los datos del formulario
   */
  obtenerDatos() {
    const nombre =
      this.formulario.querySelector('#medicine-name-input')?.value || '';
    const dosis = parseInt(
      document.getElementById('dose-value')?.textContent || '500'
    );
    const horario =
      this.formulario.querySelector('#time-input')?.value || '08:00';
    const duracion = parseInt(
      this.formulario.querySelector('#duration-input')?.value || '7'
    );
    const notas = this.formulario.querySelector('#notes-input')?.value || '';

    // Obtener frecuencia seleccionada
    const frecuenciaBtn = this.formulario.querySelector(
      '.frequency-btn.active'
    );
    let frecuencia = 8;
    if (frecuenciaBtn) {
      const texto = frecuenciaBtn.textContent.trim();
      const match = texto.match(/\d+/);
      if (match) {
        frecuencia = parseInt(match[0]);
      }
    }

    // Obtener presentación seleccionada
    const presentacionBtn = this.formulario.querySelector(
      '.presentation-btn.active'
    );
    let presentacion = 'pastilla';
    let icono = '💊';
    if (presentacionBtn) {
      presentacion =
        presentacionBtn.getAttribute('data-presentation') || 'pastilla';
      // Asignar ícono según presentación
      if (presentacion === 'jarabe') icono = '🥤';
      else if (presentacion === 'inyección') icono = '💉';
    }

    return {
      nombre: nombre.trim(),
      dosis: dosis,
      unidadDosis: document.getElementById('dose-unit')?.textContent || 'mg',
      frecuencia: frecuencia,
      horarioPrimeraToma: horario,
      duracion: duracion,
      presentacion: presentacion,
      icono: icono,
      notas: notas.trim(),
    };
  }

  /**
   * Maneja el envío del formulario
   */
  async manejarSubmit() {
    if (!this.validarFormulario()) {
      this.mostrarError('Por favor completa todos los campos obligatorios');
      return;
    }

    const datos = this.obtenerDatos();

    if (this.callbacks.onSubmit) {
      await this.callbacks.onSubmit(datos);
    }
  }

  /**
   * Limpia el formulario
   */
  limpiar() {
    if (this.formulario) {
      this.formulario.reset();

      // Resetear dosis
      const doseValue = document.getElementById('dose-value');
      if (doseValue) doseValue.textContent = '500';

      // Resetear frecuencia (primera opción activa)
      const frequencyBtns = this.formulario.querySelectorAll('.frequency-btn');
      frequencyBtns.forEach((btn, index) => {
        if (index === 0) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Resetear presentación (pastilla por defecto)
      const presentationBtns =
        this.formulario.querySelectorAll('.presentation-btn');
      presentationBtns.forEach((btn, index) => {
        if (index === 0) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Deshabilitar botón de guardar
      const saveBtn = document.getElementById('save-btn');
      if (saveBtn) saveBtn.disabled = true;
    }
  }

  /**
   * Carga datos en el formulario para edición
   */
  cargarDatos(medicamento) {
    if (!this.formulario) return;

    // Cargar nombre
    const inputNombre = this.formulario.querySelector('#medicine-name-input');
    if (inputNombre) inputNombre.value = medicamento.nombre;

    // Cargar dosis
    const doseValue = document.getElementById('dose-value');
    if (doseValue) doseValue.textContent = medicamento.dosis;

    // Cargar horario
    const timeInput = this.formulario.querySelector('#time-input');
    if (timeInput) timeInput.value = medicamento.horarioPrimeraToma;

    // Cargar duración
    const durationInput = this.formulario.querySelector('#duration-input');
    if (durationInput) durationInput.value = medicamento.duracion || 7;

    // Cargar notas
    const notesInput = this.formulario.querySelector('#notes-input');
    if (notesInput) notesInput.value = medicamento.notas || '';

    // Cargar frecuencia
    const frequencyBtns = this.formulario.querySelectorAll('.frequency-btn');
    frequencyBtns.forEach((btn) => {
      const texto = btn.textContent.trim();
      const match = texto.match(/\d+/);
      if (match && parseInt(match[0]) === medicamento.frecuencia) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Cargar presentación
    const presentationBtns =
      this.formulario.querySelectorAll('.presentation-btn');
    presentationBtns.forEach((btn) => {
      const presentacion = btn.getAttribute('data-presentation');
      if (presentacion === medicamento.presentacion) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Cargar unidad de dosis
    const doseUnitSpan = document.getElementById('dose-unit');
    if (doseUnitSpan) {
      doseUnitSpan.textContent = medicamento.unidadDosis || 'mg';
    }

    this.validarFormulario();
  }

  /**
   * Configura callback para submit
   */
  onSubmit(callback) {
    this.callbacks.onSubmit = callback;
  }

  /**
   * Configura callback para cancelar
   */
  onCancel(callback) {
    this.callbacks.onCancel = callback;
  }

  /**
   * Muestra mensaje de error
   */
  mostrarError(mensaje) {
    alert(mensaje); // Temporal, puede mejorarse con un modal
  }

  /**
   * Muestra mensaje de confirmación
   */
  mostrarConfirmacion(mensaje) {
    // Temporal, puede mejorarse
    console.log(mensaje);
  }
}

export default ControladorFormulario;
