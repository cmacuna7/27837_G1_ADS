/**
 * APLICACIÓN PRINCIPAL - Healthy+
 * Inicializa el sistema MVC y conecta todos los componentes
 * Implementa RF01 (Gestión de Medicamentos) y RF02 (Recordatorios)
 * RF06: Informes de historial de medicación
 * RF07: Seguimiento de síntomas
 */

// Importar componentes
import ConexionBD from './config/Database.js';
import ControladorMedicamentos from './controllers/ControladorMedicamentos.js';
import ControladorAlertas from './controllers/ControladorAlertas.js';
import ControladorFormulario from './controllers/ControladorFormulario.js';
import ControladorHistorial from './controllers/ControladorHistorial.js';
import ControladorSintomas from './controllers/ControladorSintomas.js';
import ControladorDetalle from './controllers/ControladorDetalle.js';
import VistaListaMedicamentos from './views/VistaListaMedicamentos.js';

class AplicacionHealthy {
  constructor() {
    // Controladores
    this.controladorMedicamentos = new ControladorMedicamentos();
    this.controladorAlertas = new ControladorAlertas();
    this.controladorFormulario = new ControladorFormulario();
    this.controladorHistorial = new ControladorHistorial(); // RF06
    this.controladorSintomas = new ControladorSintomas(); // RF07
    this.controladorDetalle = new ControladorDetalle(); // Vista detalle

    // Vistas
    this.vistaLista = new VistaListaMedicamentos('medicine-list');

    // Estado
    this.medicamentoEnEdicion = null;
  }

  /**
   * Inicializa la aplicación
   */
  async inicializar() {
    try {
      console.log('Inicializando Healthy+...');

      // Conectar a la base de datos
      const db = ConexionBD.getInstancia();
      await db.conectar();
      console.log('Base de datos conectada');

      // Inicializar componentes
      this.configurarVistas();
      this.configurarFormulario();
      this.configurarNavegacion();
      this.configurarAlertas();

      // Cargar datos iniciales
      await this.cargarMedicamentos();

      // Iniciar sistema de alertas
      this.controladorAlertas.iniciar();

      console.log('Healthy+ iniciado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar aplicación:', error);
      alert('Error al iniciar la aplicación. Por favor, recarga la página.');
    }
  }

  /**
   * Configura las vistas
   */
  configurarVistas() {
    // Callbacks de la vista de lista
    this.vistaLista.onEditar((medicamento) => {
      this.editarMedicamento(medicamento);
    });

    this.vistaLista.onEliminar(async (id) => {
      await this.eliminarMedicamento(id);
    });

    this.vistaLista.onVerDetalle(async (medicamento) => {
      await this.mostrarDetalleMedicamento(medicamento);
    });
  }

  /**
   * Configura el formulario
   */
  configurarFormulario() {
    const formulario = document.querySelector('.medicine-form');
    if (formulario) {
      this.controladorFormulario.inicializar(formulario);

      // Callback de submit
      this.controladorFormulario.onSubmit(async (datos) => {
        await this.guardarMedicamento(datos);
      });
    }

    // Configurar selectores de dosis
    this.configurarSelectorDosis();

    // Configurar selectores de frecuencia
    this.configurarSelectorFrecuencia();
  }

  /**
   * Configura la navegación entre pantallas
   */
  configurarNavegacion() {
    // Botón flotante para agregar
    const fab = document.querySelector('.fab');
    if (fab) {
      fab.addEventListener('click', () => {
        this.medicamentoEnEdicion = null;
        this.controladorFormulario.limpiar();
        this.mostrarPantalla('screen-form');

        // Reconfigurar botones después de mostrar el formulario
        setTimeout(() => {
          this.configurarBotonesPresentacion();
        }, 100);
      });
    }

    // Botón cancelar en formulario
    const btnCancelar = document.querySelector('.btn-text');
    if (btnCancelar) {
      btnCancelar.addEventListener('click', () => {
        this.medicamentoEnEdicion = null;
        this.controladorFormulario.limpiar();
        this.mostrarPantalla('screen-list');
      });
    }

    // RF06: Botón para ver historial
    const btnViewHistory = document.getElementById('btn-view-history');
    if (btnViewHistory) {
      btnViewHistory.addEventListener('click', async () => {
        await this.mostrarHistorial();
      });
    }

    // RF07: Botón para ver síntomas
    const btnViewSymptoms = document.getElementById('btn-view-symptoms');
    if (btnViewSymptoms) {
      btnViewSymptoms.addEventListener('click', async () => {
        await this.mostrarSintomas();
      });
    }

    // Botones de la alerta
    const btnTomada = document.querySelector('.alert-btn-taken');
    if (btnTomada) {
      btnTomada.addEventListener('click', async () => {
        if (window.tomaActual) {
          await this.marcarTomaRealizada(window.tomaActual);
        }
      });
    }

    const btnPosponer = document.querySelector('.alert-btn-postpone');
    if (btnPosponer) {
      btnPosponer.addEventListener('click', async () => {
        if (window.tomaActual) {
          await this.posponerToma(window.tomaActual);
        }
      });
    }

    const btnOmitir = document.querySelector('.alert-btn-skip');
    if (btnOmitir) {
      btnOmitir.addEventListener('click', () => {
        this.mostrarModalOmision();
      });
    }

    // Botones del modal de omisión
    const reasonButtons = document.querySelectorAll('.reason-btn');
    reasonButtons.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const motivo = btn.getAttribute('data-reason');
        if (window.tomaActual) {
          await this.omitirToma(window.tomaActual, motivo);
        }
      });
    });

    const btnCancelSkip = document.querySelector('.btn-cancel-skip');
    if (btnCancelSkip) {
      btnCancelSkip.addEventListener('click', () => {
        this.ocultarModalOmision();
      });
    }
  }

  /**
   * Configura el sistema de alertas
   */
  configurarAlertas() {
    // Suscribirse a cambios en medicamentos para actualizar alertas
    this.controladorMedicamentos.suscribir((evento) => {
      console.log('Evento de medicamento:', evento.tipo);
      if (
        evento.tipo === 'MEDICAMENTO_CREADO' ||
        evento.tipo === 'MEDICAMENTO_ACTUALIZADO'
      ) {
        // Las alertas se gestionan automáticamente por el RelojSistema
      }
    });
  }

  /**
   * RF01-B: Cargar todos los medicamentos
   */
  async cargarMedicamentos() {
    try {
      this.vistaLista.mostrarCargando();

      const resultado = await this.controladorMedicamentos.obtenerTodos();

      if (resultado.exito) {
        this.vistaLista.renderizar(resultado.medicamentos);
      } else {
        this.vistaLista.mostrarError('Error al cargar medicamentos');
      }
    } catch (error) {
      console.error('Error al cargar medicamentos:', error);
      this.vistaLista.mostrarError('Error al cargar medicamentos');
    }
  }

  /**
   * RF01-A: Guardar nuevo medicamento o actualizar existente
   */
  async guardarMedicamento(datos) {
    try {
      let resultado;

      if (this.medicamentoEnEdicion) {
        // Actualizar existente
        resultado = await this.controladorMedicamentos.actualizarMedicamento(
          this.medicamentoEnEdicion.id,
          datos
        );
      } else {
        // Crear nuevo
        resultado = await this.controladorMedicamentos.crearMedicamento(datos);
      }

      if (resultado.exito) {
        // Mostrar mensaje de éxito
        this.mostrarConfetti();

        // Recargar lista
        await this.cargarMedicamentos();

        // Volver a la lista
        this.medicamentoEnEdicion = null;
        this.controladorFormulario.limpiar();
        this.mostrarPantalla('screen-list');
      } else {
        alert('Error: ' + resultado.errores.join(', '));
      }
    } catch (error) {
      console.error('Error al guardar medicamento:', error);
      alert('Error al guardar el medicamento');
    }
  }

  /**
   * RF01-C: Editar medicamento
   */
  editarMedicamento(medicamento) {
    this.medicamentoEnEdicion = medicamento;
    this.controladorFormulario.cargarDatos(medicamento);
    this.mostrarPantalla('screen-form');
  }

  /**
   * RF01-D: Eliminar medicamento
   */
  async eliminarMedicamento(id) {
    try {
      const resultado = await this.controladorMedicamentos.eliminarMedicamento(
        id
      );

      if (resultado.exito) {
        await this.cargarMedicamentos();
      } else {
        alert('Error al eliminar el medicamento');
      }
    } catch (error) {
      console.error('Error al eliminar medicamento:', error);
      alert('Error al eliminar el medicamento');
    }
  }

  /**
   * RF02: Marcar toma como realizada
   */
  async marcarTomaRealizada(tomaId) {
    try {
      // Detener alarma sonora
      if (this.controladorAlertas.notificadorSonoro) {
        this.controladorAlertas.notificadorSonoro.detenerAlarma();
      }

      const resultado = await this.controladorAlertas.marcarComoTomada(tomaId);

      if (resultado.exito) {
        this.mostrarConfetti();
        await this.cargarMedicamentos(); // Actualizar próximas tomas
        this.mostrarPantalla('screen-list'); // Volver a lista
      }
    } catch (error) {
      console.error('Error al marcar toma:', error);
    }
  }

  /**
   * RF02: Posponer toma
   */
  async posponerToma(tomaId, minutos = 10) {
    try {
      // Detener alarma sonora
      if (this.controladorAlertas.notificadorSonoro) {
        this.controladorAlertas.notificadorSonoro.detenerAlarma();
      }

      const resultado = await this.controladorAlertas.posponerRecordatorio(
        tomaId,
        minutos
      );

      if (resultado.exito) {
        this.mostrarPantalla('screen-list');
      }
    } catch (error) {
      console.error('Error al posponer toma:', error);
    }
  }

  /**
   * RF02: Omitir toma con motivo
   */
  async omitirToma(tomaId, motivo) {
    try {
      // Detener alarma sonora
      if (this.controladorAlertas.notificadorSonoro) {
        this.controladorAlertas.notificadorSonoro.detenerAlarma();
      }

      const resultado = await this.controladorAlertas.omitirDosis(
        tomaId,
        motivo
      );

      if (resultado.exito) {
        this.ocultarModalOmision();
        this.mostrarPantalla('screen-list');
        await this.cargarMedicamentos();
      }
    } catch (error) {
      console.error('Error al omitir toma:', error);
    }
  }

  /**
   * Muestra el modal de motivo de omisión
   */
  mostrarModalOmision() {
    const modal = document.getElementById('skip-reason-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  /**
   * Oculta el modal de motivo de omisión
   */
  ocultarModalOmision() {
    const modal = document.getElementById('skip-reason-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  /**
   * Muestra una pantalla específica
   */
  mostrarPantalla(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach((screen) => screen.classList.remove('active'));

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
      targetScreen.classList.add('active');
    }
  }

  /**
   * Configura el selector de dosis
   */
  configurarSelectorDosis() {
    const btnMenos = document.querySelector('.dose-btn:first-child');
    const btnMas = document.querySelector('.dose-btn:last-child');
    const doseValue = document.getElementById('dose-value');

    if (btnMenos && btnMas && doseValue) {
      btnMenos.addEventListener('click', (e) => {
        e.preventDefault();
        let valor = parseInt(doseValue.textContent);
        if (valor > 100) {
          valor -= 100;
          doseValue.textContent = valor;
        }
      });

      btnMas.addEventListener('click', (e) => {
        e.preventDefault();
        let valor = parseInt(doseValue.textContent);
        if (valor < 2000) {
          valor += 100;
          doseValue.textContent = valor;
        }
      });
    }
  }

  /**
   * Configura el selector de frecuencia
   */
  configurarSelectorFrecuencia() {
    const buttons = document.querySelectorAll('.frequency-btn');
    buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        buttons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });

    this.configurarBotonesPresentacion();
  }

  /**
   * Configura los botones de presentación
   */
  configurarBotonesPresentacion() {
    const presentationButtons = document.querySelectorAll('.presentation-btn');
    const doseUnitSpan = document.getElementById('dose-unit');
    console.log(
      'Configurando botones de presentación:',
      presentationButtons.length
    );

    presentationButtons.forEach((button) => {
      // Remover listeners anteriores clonando el botón
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      newButton.addEventListener('click', (e) => {
        e.preventDefault();
        const presentacion = newButton.getAttribute('data-presentation');
        console.log('Click en presentación:', presentacion);

        // Remover active de todos
        document.querySelectorAll('.presentation-btn').forEach((btn) => {
          btn.classList.remove('active');
        });

        // Activar el clickeado
        newButton.classList.add('active');

        // Cambiar unidad de dosis según presentación
        if (doseUnitSpan) {
          if (presentacion === 'jarabe' || presentacion === 'inyección') {
            doseUnitSpan.textContent = 'ml';
          } else {
            doseUnitSpan.textContent = 'mg';
          }
        }
      });
    });
  }

  /**
   * Muestra efecto confetti
   */
  mostrarConfetti() {
    const confettiContainer = document.getElementById('confetti');
    if (!confettiContainer) return;

    confettiContainer.classList.add('active');

    const colors = ['#5baad5', '#3691c1', '#94c8e5', '#c6e0f1', '#10b981'];

    for (let i = 0; i < 50; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = Math.random() * 2 + 2 + 's';
      piece.style.animationDelay = Math.random() * 0.5 + 's';
      confettiContainer.appendChild(piece);
    }

    setTimeout(() => {
      confettiContainer.innerHTML = '';
      confettiContainer.classList.remove('active');
    }, 3000);
  }

  /**
   * RF06: Muestra la pantalla de historial
   */
  async mostrarHistorial() {
    try {
      this.mostrarPantalla('screen-history');
      await this.controladorHistorial.inicializar();
    } catch (error) {
      console.error('Error al mostrar historial:', error);
      alert('Error al cargar el historial');
    }
  }

  /**
   * RF07: Muestra la pantalla de síntomas
   */
  async mostrarSintomas() {
    try {
      await this.controladorSintomas.mostrarLista();
    } catch (error) {
      console.error('Error al mostrar síntomas:', error);
      alert('Error al cargar los síntomas');
    }
  }

  /**
   * Muestra el detalle completo de un medicamento
   */
  async mostrarDetalleMedicamento(medicamento) {
    try {
      await this.controladorDetalle.mostrarDetalle(medicamento);
    } catch (error) {
      console.error('Error al mostrar detalle del medicamento:', error);
      alert('Error al cargar el detalle');
    }
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AplicacionHealthy();
  window.app.inicializar();
});

// Exportar para uso externo si es necesario
export default AplicacionHealthy;
