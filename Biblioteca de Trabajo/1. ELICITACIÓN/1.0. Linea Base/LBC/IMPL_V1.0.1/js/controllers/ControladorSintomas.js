/**
 * CONTROLADOR: Síntomas
 * Gestiona el registro y visualización de síntomas
 * RF07: Seguimiento de síntomas
 */
import GestorAlmacenamiento from '../services/GestorAlmacenamiento.js';
import Sintoma from '../models/Sintoma.js';
import VistaSintomas from '../views/VistaSintomas.js';

class ControladorSintomas {
  constructor() {
    this.gestor = new GestorAlmacenamiento();
    this.vista = new VistaSintomas('symptoms-list');
    this.sintomas = [];
    this.medicamentos = [];
    this.sintomaActual = {
      medicamentoId: '',
      categoria: 'general',
      intensidad: 'leve',
    };
  }

  /**
   * Inicializa el controlador de la lista de síntomas
   */
  async inicializarLista() {
    try {
      await this.cargarDatos();
      this.configurarEventosLista();
      this.renderizarLista();
    } catch (error) {
      console.error('Error al inicializar lista de síntomas:', error);
    }
  }

  /**
   * Inicializa el formulario de registro de síntomas
   */
  inicializarFormulario() {
    this.configurarEventosFormulario();
    this.poblarSelectMedicamentos();
  }

  /**
   * Carga los datos
   */
  async cargarDatos() {
    try {
      this.sintomas = await this.gestor.obtenerTodosSintomas();
      this.medicamentos = await this.gestor.obtenerTodosMedicamentos();
      this.poblarFiltrosMedicamentos();
    } catch (error) {
      console.error('Error al cargar datos de síntomas:', error);
      throw error;
    }
  }

  /**
   * Configura eventos de la lista
   */
  configurarEventosLista() {
    // Filtro por medicamento
    const filterMedicamento = document.getElementById(
      'symptom-filter-medicamento'
    );
    if (filterMedicamento) {
      filterMedicamento.addEventListener('change', (e) => {
        this.filtrarYRenderizar();
      });
    }

    // Filtro por intensidad
    const filterIntensidad = document.getElementById(
      'symptom-filter-intensidad'
    );
    if (filterIntensidad) {
      filterIntensidad.addEventListener('change', (e) => {
        this.filtrarYRenderizar();
      });
    }

    // Botón agregar
    const btnAdd = document.querySelector('.btn-add-symptom');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        this.mostrarFormulario();
      });
    }

    // Botón atrás
    const btnBack = document.querySelector('.btn-back-symptoms-list');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        this.cerrarLista();
      });
    }

    // Delegación de eventos para eliminar síntomas
    const container = document.querySelector('.symptoms-list');
    if (container) {
      container.addEventListener('click', (e) => {
        if (e.target.classList.contains('symptom-item-delete')) {
          const sintomaId = e.target.dataset.id;
          this.eliminarSintoma(sintomaId);
        }

        // Botón agregar síntoma cuando está vacío
        if (e.target.classList.contains('btn-add-symptom-empty')) {
          this.mostrarFormulario();
        }
      });
    }
  }

  /**
   * Configura eventos del formulario
   */
  configurarEventosFormulario() {
    // Botones de categoría
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        categoryBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.sintomaActual.categoria = btn.dataset.category;
      });
    });

    // Botones de intensidad
    const intensityBtns = document.querySelectorAll('.intensity-btn');
    intensityBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        intensityBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.sintomaActual.intensidad = btn.dataset.intensity;
      });
    });

    // Formulario
    const form = document.querySelector('.symptoms-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.guardarSintoma();
      });
    }

    // Botón atrás
    const btnBack = document.querySelector('.btn-back-symptoms');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        this.cerrarFormulario();
      });
    }
  }

  /**
   * Pobla el select de medicamentos en el formulario
   */
  poblarSelectMedicamentos() {
    const select = document.getElementById('symptom-medicine-select');
    if (!select) return;

    select.innerHTML = '<option value="">Selecciona un medicamento</option>';

    this.medicamentos
      .filter((m) => m.activo)
      .forEach((med) => {
        const option = document.createElement('option');
        option.value = med.id;
        // Solo mostrar el nombre sin icono en el select
        option.textContent = med.nombre;
        select.appendChild(option);
      });
  }

  /**
   * Pobla los filtros de medicamentos
   */
  poblarFiltrosMedicamentos() {
    const select = document.getElementById('symptom-filter-medicamento');
    if (!select) return;

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
   * Guarda un nuevo síntoma
   */
  async guardarSintoma() {
    try {
      const medicamentoSelect = document.getElementById(
        'symptom-medicine-select'
      );
      const descripcion = document.getElementById('symptom-description').value;
      const notas = document.getElementById('symptom-notes').value;

      if (!medicamentoSelect.value) {
        this.mostrarNotificacion(
          'Por favor selecciona un medicamento',
          'warning'
        );
        return;
      }

      if (!descripcion.trim()) {
        this.mostrarNotificacion('Por favor describe el síntoma', 'warning');
        return;
      }

      const medicamento = this.medicamentos.find(
        (m) => m.id == medicamentoSelect.value
      );

      const sintoma = new Sintoma({
        medicamentoId: medicamentoSelect.value,
        nombreMedicamento: medicamento ? medicamento.nombre : '',
        descripcion: descripcion.trim(),
        categoria: this.sintomaActual.categoria,
        intensidad: this.sintomaActual.intensidad,
        notas: notas.trim(),
        fecha: new Date().toISOString(),
      });

      const validacion = sintoma.validar();
      if (!validacion.valido) {
        this.mostrarNotificacion(validacion.errores[0], 'error');
        return;
      }

      await this.gestor.guardarSintoma(sintoma);
      this.mostrarNotificacion('✅ Síntoma registrado correctamente');

      // Limpiar formulario
      this.limpiarFormulario();

      // Volver a la lista
      setTimeout(() => {
        this.cerrarFormulario();
        this.mostrarLista();
      }, 1000);
    } catch (error) {
      console.error('Error al guardar síntoma:', error);
      this.mostrarNotificacion('❌ Error al guardar síntoma', 'error');
    }
  }

  /**
   * Elimina un síntoma
   */
  async eliminarSintoma(sintomaId) {
    if (!confirm('¿Estás seguro de eliminar este síntoma?')) {
      return;
    }

    try {
      await this.gestor.eliminarSintoma(sintomaId);
      this.mostrarNotificacion('Síntoma eliminado');
      await this.cargarDatos();
      this.renderizarLista();
    } catch (error) {
      console.error('Error al eliminar síntoma:', error);
      this.mostrarNotificacion('❌ Error al eliminar síntoma', 'error');
    }
  }

  /**
   * Filtra y renderiza la lista
   */
  filtrarYRenderizar() {
    const filterMedicamento = document.getElementById(
      'symptom-filter-medicamento'
    );
    const filterIntensidad = document.getElementById(
      'symptom-filter-intensidad'
    );

    let sintomasFiltrados = [...this.sintomas];

    if (filterMedicamento && filterMedicamento.value) {
      sintomasFiltrados = this.vista.filtrarPorMedicamento(
        sintomasFiltrados,
        filterMedicamento.value
      );
    }

    if (filterIntensidad && filterIntensidad.value) {
      sintomasFiltrados = this.vista.filtrarPorIntensidad(
        sintomasFiltrados,
        filterIntensidad.value
      );
    }

    this.vista.renderizar(sintomasFiltrados, this.medicamentos);
  }

  /**
   * Renderiza la lista de síntomas
   */
  renderizarLista() {
    this.vista.renderizar(this.sintomas, this.medicamentos);
  }

  /**
   * Limpia el formulario
   */
  limpiarFormulario() {
    const form = document.querySelector('.symptoms-form');
    if (form) {
      form.reset();
    }

    // Resetear estado
    this.sintomaActual = {
      medicamentoId: '',
      categoria: 'general',
      intensidad: 'leve',
    };

    // Resetear botones activos
    document.querySelectorAll('.category-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === 0);
    });

    document.querySelectorAll('.intensity-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === 0);
    });
  }

  /**
   * Muestra el formulario
   */
  async mostrarFormulario() {
    const screenSymptoms = document.getElementById('screen-symptoms');
    const screenList = document.getElementById('screen-symptoms-list');

    if (screenList) {
      screenList.classList.remove('active');
    }
    if (screenSymptoms) {
      screenSymptoms.classList.add('active');
    }

    // Cargar medicamentos si no están cargados
    if (this.medicamentos.length === 0) {
      await this.cargarDatos();
    }

    // Inicializar eventos del formulario
    this.inicializarFormulario();
  }

  /**
   * Muestra la lista
   */
  async mostrarLista() {
    await this.cargarDatos();
    await this.inicializarLista();

    const screenList = document.getElementById('screen-symptoms-list');
    const screenMain = document.getElementById('screen-list');

    if (screenMain) {
      screenMain.classList.remove('active');
    }
    if (screenList) {
      screenList.classList.add('active');
    }
  }

  /**
   * Cierra el formulario
   */
  cerrarFormulario() {
    const screenSymptoms = document.getElementById('screen-symptoms');
    const screenList = document.getElementById('screen-symptoms-list');

    if (screenSymptoms) {
      screenSymptoms.classList.remove('active');
    }
    if (screenList) {
      screenList.classList.add('active');
    }
  }

  /**
   * Cierra la lista
   */
  cerrarLista() {
    const screenList = document.getElementById('screen-symptoms-list');
    const screenMain = document.getElementById('screen-list');

    if (screenList) {
      screenList.classList.remove('active');
    }
    if (screenMain) {
      screenMain.classList.add('active');
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
   * Recarga los datos
   */
  async recargar() {
    await this.cargarDatos();
    this.renderizarLista();
  }
}

export default ControladorSintomas;
