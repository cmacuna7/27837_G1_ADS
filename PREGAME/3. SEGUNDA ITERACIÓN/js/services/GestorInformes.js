/**
 * SERVICIO: Gestor de Informes
 * Genera reportes en PDF y Excel del historial de medicación y síntomas
 * RF06: Informes de historial de medicación
 * RF06-3: Generar reporte en formato PDF
 * RF06-4: Implementar exportación opcional a Excel
 */
import GestorAlmacenamiento from './GestorAlmacenamiento.js';

class GestorInformes {
  constructor() {
    this.gestor = new GestorAlmacenamiento();
  }

  // ========================================
  // RF06-3: GENERACIÓN DE REPORTES PDF
  // ========================================

  /**
   * Genera un reporte PDF del historial completo de medicación
   * Nota: Requiere la biblioteca jsPDF (se debe incluir en index.html)
   */
  async generarReportePDF(opciones = {}) {
    try {
      // Verificar que jsPDF esté disponible
      if (typeof window.jspdf === 'undefined') {
        throw new Error(
          'jsPDF no está cargado. Incluye la biblioteca en tu HTML.'
        );
      }

      const { jsPDF } = window.jspdf;

      // Obtener datos
      const eventos = await this.obtenerEventosFiltrados(opciones);
      const medicamentos = await this.gestor.obtenerTodosMedicamentos();
      const sintomas = opciones.incluirSintomas
        ? await this.gestor.obtenerTodosSintomas()
        : [];

      // Crear documento PDF
      const doc = new jsPDF();

      // Configuración
      const margen = 20;
      let yPos = margen;
      const lineHeight = 7;
      const pageHeight = doc.internal.pageSize.height;

      // Título del documento
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('Healthy+ - Reporte de Medicación', margen, yPos);
      yPos += lineHeight + 5;

      // Fecha del reporte
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const fechaReporte = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      doc.text(`Fecha del reporte: ${fechaReporte}`, margen, yPos);
      yPos += lineHeight + 5;

      // Línea separadora
      doc.setDrawColor(200);
      doc.line(margen, yPos, 190, yPos);
      yPos += 10;

      // Resumen estadístico
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Resumen Estadístico', margen, yPos);
      yPos += lineHeight;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');

      const estadisticas = this.calcularEstadisticas(eventos);
      doc.text(`Total de registros: ${eventos.length}`, margen + 5, yPos);
      yPos += lineHeight;
      doc.text(
        `Tomas realizadas: ${estadisticas.tomadas} (${estadisticas.porcentajeTomadas}%)`,
        margen + 5,
        yPos
      );
      yPos += lineHeight;
      doc.text(
        `Tomas omitidas: ${estadisticas.omitidas} (${estadisticas.porcentajeOmitidas}%)`,
        margen + 5,
        yPos
      );
      yPos += lineHeight;
      doc.text(
        `Tomas pospuestas: ${estadisticas.pospuestas} (${estadisticas.porcentajePospuestas}%)`,
        margen + 5,
        yPos
      );
      yPos += lineHeight + 10;

      // Detalle de eventos por medicamento
      const eventosPorMedicamento = this.agruparEventosPorMedicamento(eventos);

      for (const [medicamentoId, eventosDelMed] of Object.entries(
        eventosPorMedicamento
      )) {
        // Verificar si necesitamos nueva página
        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = margen;
        }

        const medicamento = medicamentos.find((m) => m.id == medicamentoId);
        const nombreMed = medicamento
          ? medicamento.nombre
          : eventosDelMed[0].nombreMedicamento;

        // Nombre del medicamento
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(nombreMed, margen, yPos);
        yPos += lineHeight;

        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');

        // Listar eventos
        for (const evento of eventosDelMed.slice(0, 10)) {
          // Limitar a 10 eventos por medicamento
          if (yPos > pageHeight - 20) {
            doc.addPage();
            yPos = margen;
          }

          const fecha = new Date(evento.fecha).toLocaleDateString('es-ES');
          const hora = new Date(evento.fecha).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          });

          let texto = `  ${evento.obtenerIcono()} ${fecha} ${hora} - ${
            evento.tipo
          }`;
          if (evento.motivo) {
            texto += ` (${evento.motivo})`;
          }

          doc.text(texto, margen + 5, yPos);
          yPos += lineHeight;
        }

        if (eventosDelMed.length > 10) {
          doc.setFont(undefined, 'italic');
          doc.text(
            `  ... y ${eventosDelMed.length - 10} eventos más`,
            margen + 5,
            yPos
          );
          doc.setFont(undefined, 'normal');
          yPos += lineHeight;
        }

        yPos += 5;
      }

      // Síntomas (si se solicitó)
      if (opciones.incluirSintomas && sintomas.length > 0) {
        if (yPos > pageHeight - 60) {
          doc.addPage();
          yPos = margen;
        }

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Síntomas Reportados', margen, yPos);
        yPos += lineHeight + 5;

        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');

        for (const sintoma of sintomas.slice(0, 20)) {
          if (yPos > pageHeight - 20) {
            doc.addPage();
            yPos = margen;
          }

          const fecha = new Date(sintoma.fecha).toLocaleDateString('es-ES');
          const texto = `  ${sintoma.icono} ${sintoma.descripcion} - ${fecha} (${sintoma.intensidad})`;

          doc.text(texto, margen + 5, yPos);
          yPos += lineHeight;
        }
      }

      // Pie de página
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont(undefined, 'italic');
        doc.text(`Página ${i} de ${totalPages}`, margen, pageHeight - 10);
        doc.text('Generado por Healthy+', 140, pageHeight - 10);
      }

      // Guardar PDF
      const nombreArchivo = `Healthy_Reporte_${new Date().getTime()}.pdf`;
      doc.save(nombreArchivo);

      console.log('✅ Reporte PDF generado:', nombreArchivo);
      return nombreArchivo;
    } catch (error) {
      console.error('Error al generar reporte PDF:', error);
      throw error;
    }
  }

  // ========================================
  // RF06-4: EXPORTACIÓN A EXCEL
  // ========================================

  /**
   * Exporta el historial a formato Excel
   * Nota: Requiere la biblioteca SheetJS/xlsx (se debe incluir en index.html)
   */
  async exportarExcel(opciones = {}) {
    try {
      // Verificar que XLSX esté disponible
      if (typeof XLSX === 'undefined') {
        throw new Error(
          'SheetJS/XLSX no está cargado. Incluye la biblioteca en tu HTML.'
        );
      }

      // Obtener datos
      const eventos = await this.obtenerEventosFiltrados(opciones);
      const sintomas = opciones.incluirSintomas
        ? await this.gestor.obtenerTodosSintomas()
        : [];

      // Crear libro de trabajo
      const wb = XLSX.utils.book_new();

      // Hoja 1: Eventos de Toma
      const datosEventos = eventos.map((evento) => ({
        Fecha: new Date(evento.fecha).toLocaleDateString('es-ES'),
        Hora: new Date(evento.fecha).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        Medicamento: evento.nombreMedicamento,
        Tipo: evento.tipo,
        Dosis: `${evento.dosis} ${evento.unidadDosis}`,
        Motivo: evento.motivo || '-',
        Notas: evento.notas || '-',
      }));

      const wsEventos = XLSX.utils.json_to_sheet(datosEventos);
      XLSX.utils.book_append_sheet(wb, wsEventos, 'Eventos de Toma');

      // Hoja 2: Estadísticas
      const estadisticas = this.calcularEstadisticas(eventos);
      const datosEstadisticas = [
        { Concepto: 'Total de registros', Valor: eventos.length },
        { Concepto: 'Tomas realizadas', Valor: estadisticas.tomadas },
        {
          Concepto: '% Tomas realizadas',
          Valor: `${estadisticas.porcentajeTomadas}%`,
        },
        { Concepto: 'Tomas omitidas', Valor: estadisticas.omitidas },
        {
          Concepto: '% Tomas omitidas',
          Valor: `${estadisticas.porcentajeOmitidas}%`,
        },
        { Concepto: 'Tomas pospuestas', Valor: estadisticas.pospuestas },
        {
          Concepto: '% Tomas pospuestas',
          Valor: `${estadisticas.porcentajePospuestas}%`,
        },
      ];

      const wsEstadisticas = XLSX.utils.json_to_sheet(datosEstadisticas);
      XLSX.utils.book_append_sheet(wb, wsEstadisticas, 'Estadísticas');

      // Hoja 3: Síntomas (si se solicitó)
      if (opciones.incluirSintomas && sintomas.length > 0) {
        const datosSintomas = sintomas.map((sintoma) => ({
          Fecha: new Date(sintoma.fecha).toLocaleDateString('es-ES'),
          Hora: new Date(sintoma.fecha).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          Medicamento: sintoma.nombreMedicamento,
          Descripción: sintoma.descripcion,
          Categoría: sintoma.categoria,
          Intensidad: sintoma.intensidad,
          Notas: sintoma.notas || '-',
        }));

        const wsSintomas = XLSX.utils.json_to_sheet(datosSintomas);
        XLSX.utils.book_append_sheet(wb, wsSintomas, 'Síntomas');
      }

      // Guardar archivo
      const nombreArchivo = `Healthy_Historial_${new Date().getTime()}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);

      console.log('✅ Archivo Excel generado:', nombreArchivo);
      return nombreArchivo;
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      throw error;
    }
  }

  // ========================================
  // MÉTODOS AUXILIARES
  // ========================================

  /**
   * Obtiene eventos filtrados según opciones
   */
  async obtenerEventosFiltrados(opciones = {}) {
    let eventos = [];

    if (opciones.medicamentoId) {
      eventos = await this.gestor.obtenerEventosPorMedicamento(
        opciones.medicamentoId
      );
    } else if (opciones.fechaInicio && opciones.fechaFin) {
      eventos = await this.gestor.obtenerEventosPorFechas(
        opciones.fechaInicio,
        opciones.fechaFin
      );
    } else {
      eventos = await this.gestor.obtenerTodosEventosToma();
    }

    // Ordenar por fecha descendente
    eventos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    return eventos;
  }

  /**
   * Calcula estadísticas de eventos
   */
  calcularEstadisticas(eventos) {
    const total = eventos.length;
    const tomadas = eventos.filter((e) => e.tipo === 'tomado').length;
    const omitidas = eventos.filter((e) => e.tipo === 'omitido').length;
    const pospuestas = eventos.filter((e) => e.tipo === 'pospuesto').length;

    return {
      total,
      tomadas,
      omitidas,
      pospuestas,
      porcentajeTomadas: total > 0 ? Math.round((tomadas / total) * 100) : 0,
      porcentajeOmitidas: total > 0 ? Math.round((omitidas / total) * 100) : 0,
      porcentajePospuestas:
        total > 0 ? Math.round((pospuestas / total) * 100) : 0,
    };
  }

  /**
   * Agrupa eventos por medicamento
   */
  agruparEventosPorMedicamento(eventos) {
    const grupos = {};

    eventos.forEach((evento) => {
      if (!grupos[evento.medicamentoId]) {
        grupos[evento.medicamentoId] = [];
      }
      grupos[evento.medicamentoId].push(evento);
    });

    return grupos;
  }

  /**
   * Genera un resumen de texto del historial
   */
  async generarResumenTexto(opciones = {}) {
    const eventos = await this.obtenerEventosFiltrados(opciones);
    const estadisticas = this.calcularEstadisticas(eventos);

    let resumen = '=== HEALTHY+ - RESUMEN DE MEDICACIÓN ===\n\n';
    resumen += `Fecha: ${new Date().toLocaleDateString('es-ES')}\n`;
    resumen += `Total de registros: ${eventos.length}\n\n`;
    resumen += '--- Estadísticas ---\n';
    resumen += `Tomas realizadas: ${estadisticas.tomadas} (${estadisticas.porcentajeTomadas}%)\n`;
    resumen += `Tomas omitidas: ${estadisticas.omitidas} (${estadisticas.porcentajeOmitidas}%)\n`;
    resumen += `Tomas pospuestas: ${estadisticas.pospuestas} (${estadisticas.porcentajePospuestas}%)\n\n`;

    resumen += '--- Eventos Recientes ---\n';
    eventos.slice(0, 10).forEach((evento) => {
      resumen += `${evento.obtenerDescripcion()}\n`;
    });

    return resumen;
  }
}

export default GestorInformes;
