/**
 * VISTA: Lista de Síntomas
 * Muestra los síntomas registrados con categorías visuales
 * RF07: Seguimiento de síntomas
 * RF07-4: Mostrar síntomas en vista histórica
 */
class VistaSintomas {
  constructor(containerId) {
    // Aceptar tanto un ID string como un elemento DOM
    if (typeof containerId === 'string') {
      this.container =
        document.querySelector(`#${containerId}`) ||
        document.querySelector(`.${containerId}`);
    } else {
      this.container = containerId;
    }
  }

  /**
   * Renderiza la lista de síntomas
   */
  renderizar(sintomas, medicamentos = []) {
    if (!this.container) {
      console.error('Contenedor de síntomas no encontrado');
      return;
    }

    // Limpiar contenedor
    this.container.innerHTML = '';

    if (sintomas.length === 0) {
      this.mostrarMensajeVacio();
      return;
    }

    // Agrupar síntomas por medicamento
    const sintomasPorMedicamento = this.agruparPorMedicamento(sintomas);

    // Renderizar grupos
    Object.keys(sintomasPorMedicamento).forEach((medicamentoId) => {
      const grupo = this.crearGrupoMedicamento(
        medicamentoId,
        sintomasPorMedicamento[medicamentoId],
        medicamentos,
      );
      this.container.appendChild(grupo);
    });
  }

  /**
   * Agrupa síntomas por medicamento
   */
  agruparPorMedicamento(sintomas) {
    const grupos = {};

    sintomas.forEach((sintoma) => {
      const id = sintoma.medicamentoId || 'sin-medicamento';

      if (!grupos[id]) {
        grupos[id] = [];
      }
      grupos[id].push(sintoma);
    });

    return grupos;
  }

  /**
   * Crea un grupo de síntomas por medicamento
   */
  crearGrupoMedicamento(medicamentoId, sintomas, medicamentos) {
    const grupo = document.createElement('div');
    grupo.className = 'symptoms-group';

    const medicamento = medicamentos.find((m) => m.id == medicamentoId);
    let nombreMed = '';

    if (medicamento) {
      // Determinar icono SVG según presentación
      let iconoHTML = '';
      if (medicamento.presentacion === 'jarabe') {
        iconoHTML =
          '<i class="bi bi-droplet-fill" style="color: var(--orange-color);"></i>';
      } else if (medicamento.presentacion === 'inyección') {
        iconoHTML =
          '<i class="bi bi-hospital" style="color: var(--allports-700);"></i>';
      } else {
        iconoHTML =
          '<i class="bi bi-capsule" style="color: var(--allports-600);"></i>';
      }
      nombreMed = `${iconoHTML} ${medicamento.nombre}`;
    } else {
      nombreMed =
        sintomas[0].nombreMedicamento || 'Medicamento no especificado';
    }

    const titulo = document.createElement('h3');
    titulo.className = 'symptoms-group-title';
    titulo.innerHTML = nombreMed;
    grupo.appendChild(titulo);

    sintomas
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .forEach((sintoma) => {
        const item = this.crearItemSintoma(sintoma);
        grupo.appendChild(item);
      });

    return grupo;
  }

  /**
   * Crea un item de síntoma
   */
  crearItemSintoma(sintoma) {
    const item = document.createElement('div');
    item.className = `symptom-item symptom-intensity-${sintoma.intensidad}`;
    item.dataset.sintomaId = sintoma.id;

    const fecha = new Date(sintoma.fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const hora = new Date(sintoma.fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const intensidadColors = {
      leve: '#4CAF50',
      moderada: '#FF9800',
      severa: '#F44336',
    };

    const intensidadLabels = {
      leve: 'Leve',
      moderada: 'Moderada',
      severa: 'Severa',
    };

    // Iconos de Bootstrap según categoría
    const categoriaIconos = {
      general: 'clipboard-check',
      digestivo: 'emoji-dizzy',
      neurologico: 'brain',
      cutaneo: 'bandaid',
      respiratorio: 'lungs',
      cardiovascular: 'heart-pulse',
    };

    const iconoCategoria =
      categoriaIconos[sintoma.categoria] || 'clipboard-check';

    item.innerHTML = `
      <div class="symptom-item-icon"><i class="bi bi-${iconoCategoria}"></i></div>
      <div class="symptom-item-content">
        <div class="symptom-item-description">${sintoma.descripcion}</div>
        <div class="symptom-item-meta">
          <span class="symptom-item-date">${fecha} ${hora}</span>
          <span class="symptom-item-category">${this.obtenerNombreCategoria(
            sintoma.categoria,
          )}</span>
          <span class="symptom-item-intensity" style="background-color: ${
            intensidadColors[sintoma.intensidad]
          }">
            ${intensidadLabels[sintoma.intensidad]}
          </span>
        </div>
        ${
          sintoma.notas
            ? `<div class="symptom-item-notes">${sintoma.notas}</div>`
            : ''
        }
      </div>
      <button class="symptom-item-delete" data-id="${
        sintoma.id
      }" title="Eliminar">
        ×
      </button>
    `;

    return item;
  }

  /**
   * Obtiene el nombre de la categoría
   */
  obtenerNombreCategoria(categoria) {
    const nombres = {
      general: 'General',
      digestivo: 'Digestivo',
      neurologico: 'Neurológico',
      cutaneo: 'Cutáneo',
      respiratorio: 'Respiratorio',
      cardiovascular: 'Cardiovascular',
    };
    return nombres[categoria] || categoria;
  }

  /**
   * Muestra mensaje cuando no hay síntomas
   */
  mostrarMensajeVacio() {
    this.container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="bi bi-clipboard2-pulse" style="font-size: 4rem; color: var(--allports-400);"></i></div>
        <h3>No hay síntomas registrados</h3>
        <p>Registra síntomas asociados a tus medicamentos para hacer seguimiento</p>
        <button class="btn-primary btn-add-symptom-empty">Registrar síntoma</button>
      </div>
    `;
  }

  /**
   * Filtra síntomas por medicamento
   */
  filtrarPorMedicamento(sintomas, medicamentoId) {
    if (!medicamentoId || medicamentoId === '') {
      return sintomas;
    }
    return sintomas.filter((s) => s.medicamentoId == medicamentoId);
  }

  /**
   * Filtra síntomas por intensidad
   */
  filtrarPorIntensidad(sintomas, intensidad) {
    if (!intensidad || intensidad === '') {
      return sintomas;
    }
    return sintomas.filter((s) => s.intensidad === intensidad);
  }

  /**
   * Filtra síntomas por categoría
   */
  filtrarPorCategoria(sintomas, categoria) {
    if (!categoria || categoria === '') {
      return sintomas;
    }
    return sintomas.filter((s) => s.categoria === categoria);
  }

  /**
   * Limpia la vista
   */
  limpiar() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

export default VistaSintomas;
