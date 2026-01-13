/**
 * CONTROLADOR: Historial de Eventos
 * Gestiona la visualización y exportación del historial
 * RF06: Informes de historial de medicación
 */
import GestorAlmacenamiento from '../services/GestorAlmacenamiento.js';
import GestorInformes from '../services/GestorInformes.js';
import VistaHistorial from '../views/VistaHistorial.js';

class ControladorHistorial {
  constructor() {
    this.gestor = new GestorAlmacenamiento();
    this.gestorInformes = new GestorInformes();
    this.vista = new VistaHistorial('history-list');
    this.eventos = [];
    this.medicamentos = [];
    this.filtros = {
      medicamentoId: '',
      tipo: '',
    };
  }

  /**
   * Inicializa el controlador
   */
  async inicializar() {
    try {
      await this.cargarDatos();
      this.configurarEventos();
      this.renderizar();
    } catch (error) {
      console.error('Error al inicializar controlador de historial:', error);
    }
  }

  /**
   * Carga los datos del historial
   */
  async cargarDatos() {
    try {
      this.eventos = await this.gestor.obtenerTodosEventosToma();
      this.medicamentos = await this.gestor.obtenerTodosMedicamentos();

      // Poblar select de medicamentos
      this.poblarSelectMedicamentos();
    } catch (error) {
      console.error('Error al cargar datos del historial:', error);
      throw error;
    }
  }

  /**
   * Configura los eventos de la interfaz
   */
  configurarEventos() {
    // Filtro por medicamento
    const filterMedicamento = document.getElementById('filter-medicamento');
    if (filterMedicamento) {
      filterMedicamento.addEventListener('change', (e) => {
        this.filtros.medicamentoId = e.target.value;
        this.renderizar();
      });
    }

    // Filtro por tipo
    const filterTipo = document.getElementById('filter-tipo');
    if (filterTipo) {
      filterTipo.addEventListener('change', (e) => {
        this.filtros.tipo = e.target.value;
        this.renderizar();
      });
    }

    // Botón exportar
    const btnExport = document.querySelector('.btn-export');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        this.mostrarMenuExportacion();
      });
    }

    // Botón atrás
    const btnBack = document.querySelector('.btn-back-history');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        this.cerrar();
      });
    }
  }

  /**
   * Pobla el select de medicamentos
   */
  poblarSelectMedicamentos() {
    const select = document.getElementById('filter-medicamento');
    if (!select) return;

    // Limpiar opciones excepto la primera
    select.innerHTML = '<option value="">Todos los medicamentos</option>';

    this.medicamentos.forEach((med) => {
      const option = document.createElement('option');
      option.value = med.id;
      // Solo mostrar el nombre sin icono en el select
      option.textContent = med.nombre;
      select.appendChild(option);
    });
  }

  /**
   * Renderiza la vista con filtros aplicados
   */
  renderizar() {
    let eventosFiltrados = [...this.eventos];

    // Aplicar filtros
    if (this.filtros.medicamentoId) {
      eventosFiltrados = this.vista.filtrarPorMedicamento(
        eventosFiltrados,
        this.filtros.medicamentoId
      );
    }

    if (this.filtros.tipo) {
      eventosFiltrados = this.vista.filtrarPorTipo(
        eventosFiltrados,
        this.filtros.tipo
      );
    }

    this.vista.renderizar(eventosFiltrados, this.medicamentos);
  }

  /**
   * Muestra el menú de opciones de exportación
   */
  mostrarMenuExportacion() {
    const opciones = [
      {
        texto: '<i class="bi bi-file-earmark-pdf"></i> Exportar a PDF',
        accion: () => this.exportarPDF(),
      },
      {
        texto: '<i class="bi bi-file-earmark-excel"></i> Exportar a Excel',
        accion: () => this.exportarExcel(),
      },
      {
        texto: '<i class="bi bi-clipboard-check"></i> Copiar resumen',
        accion: () => this.copiarResumen(),
      },
    ];

    // Crear menú contextual
    const menu = document.createElement('div');
    menu.className = 'export-menu';
    menu.innerHTML = `
      <div class="export-menu-overlay"></div>
      <div class="export-menu-content">
        <h3>Exportar historial</h3>
        ${opciones
          .map(
            (op, i) => `
          <button class="export-option" data-index="${i}">
            ${op.texto}
          </button>
        `
          )
          .join('')}
        <button class="export-cancel">Cancelar</button>
      </div>
    `;

    document.body.appendChild(menu);

    // Event listeners
    menu.querySelectorAll('.export-option').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        opciones[index].accion();
        menu.remove();
      });
    });

    menu.querySelector('.export-cancel').addEventListener('click', () => {
      menu.remove();
    });

    menu.querySelector('.export-menu-overlay').addEventListener('click', () => {
      menu.remove();
    });
  }

  /**
   * Exporta a PDF
   */
  async exportarPDF() {
    try {
      const opciones = {
        medicamentoId: this.filtros.medicamentoId,
        incluirSintomas: false,
      };

      await this.gestorInformes.generarReportePDF(opciones);
      this.mostrarNotificacion('✅ Reporte PDF generado correctamente');
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      this.mostrarNotificacion(
        '❌ Error al generar PDF. Verifica que la biblioteca jsPDF esté cargada.',
        'error'
      );
    }
  }

  /**
   * Exporta a Excel
   */
  async exportarExcel() {
    try {
      const opciones = {
        medicamentoId: this.filtros.medicamentoId,
        incluirSintomas: false,
      };

      await this.gestorInformes.exportarExcel(opciones);
      this.mostrarNotificacion('✅ Archivo Excel generado correctamente');
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      this.mostrarNotificacion(
        '❌ Error al generar Excel. Verifica que la biblioteca XLSX esté cargada.',
        'error'
      );
    }
  }

  /**
   * Copia el resumen al portapapeles
   */
  async copiarResumen() {
    try {
      const resumen = await this.gestorInformes.generarResumenTexto({
        medicamentoId: this.filtros.medicamentoId,
      });

      await navigator.clipboard.writeText(resumen);
      this.mostrarNotificacion('✅ Resumen copiado al portapapeles');
    } catch (error) {
      console.error('Error al copiar resumen:', error);
      this.mostrarNotificacion('❌ Error al copiar resumen', 'error');
    }
  }

  /**
   * Muestra una notificación
   */
  mostrarNotificacion(mensaje, tipo = 'success') {
    const notif = document.createElement('div');
    notif.className = `notification notification-${tipo}`;
    notif.textContent = mensaje;
    document.body.appendChild(notif);

    setTimeout(() => {
      notif.classList.add('show');
    }, 100);

    setTimeout(() => {
      notif.classList.remove('show');
      setTimeout(() => notif.remove(), 300);
    }, 3000);
  }

  /**
   * Cierra la vista de historial
   */
  cerrar() {
    const screenHistory = document.getElementById('screen-history');
    const screenList = document.getElementById('screen-list');

    if (screenHistory) {
      screenHistory.classList.remove('active');
    }
    if (screenList) {
      screenList.classList.add('active');
    }
  }

  /**
   * Recarga los datos
   */
  async recargar() {
    await this.cargarDatos();
    this.renderizar();
  }
}

export default ControladorHistorial;
