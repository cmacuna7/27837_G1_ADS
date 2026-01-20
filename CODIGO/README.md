# Código Fuente (IMPL)

Este directorio contiene el código fuente implementado del proyecto **Healthy+**, incluyendo la evolución del desarrollo a través de sus iteraciones.

## Información del ECS

- **Código del ECS:** IMPL
- **Nombre del ECS:** Implementación - Código Fuente
- **Autor:** Marcelo Acuña, Abner Arboleda, Christian Bonifaz
- **Proyecto:** Healthy+
- **Línea base:** LBC - Línea Base Implementación
- **Tipo de ECS:** Código Fuente (HTML, CSS, JavaScript)
- **Fecha de creación:** 08/01/2026
- **ID del proyecto:** 27837_G1_ADS

## Líneas Base Relacionadas

- **LBA - Análisis:** Contiene diagramas de actividades y documentación de análisis funcional y de procesos
- **LBC - Implementación:** Contiene código fuente frontend y backend del proyecto
- **LBD - Diseño:** Contiene diagramas de flujo y diagramas de casos de uso
- **LBR - Requisitos:** Contiene la especificación completa de requisitos y diagramas de flujo

## Estructura de Iteraciones

### 1. PRIMERA ITERACIÓN
Implementación base del sistema Healthy+ con funcionalidades principales:
- Gestión de medicamentos
- Formulario de registro de medicamentos
- Alertas de medicamentos
- Almacenamiento local (LocalStorage)
- Interfaz visual básica

**Componentes principales:**
- `index.html` - Página principal de la aplicación
- `css/styles.css` - Estilos visuales
- `js/app.js` - Punto de entrada de la aplicación
- `js/config/Database.js` - Configuración de base de datos local
- `js/models/Medicamento.js` - Modelo de datos de medicamento
- `js/controllers/` - Controladores MVC (Alertas, Formulario, Medicamentos)
- `js/services/` - Servicios de notificación, almacenamiento y reloj
- `js/views/VistaListaMedicamentos.js` - Vista de lista de medicamentos
- `Diagrama_Arquitectura_Componentes.puml` - Diagrama de arquitectura

### 2. SEGUNDA ITERACIÓN
Mejoras y expansión de funcionalidades:
- Nuevos controladores (Detalle, Historial, Síntomas)
- Nuevos modelos (EventoToma, Sintoma)
- Nuevas vistas (Historial, Síntomas)
- Gestor de Informes
- Mejora de la arquitectura y separación de concerns

**Componentes principales:**
- `index.html` - Página principal mejorada
- `css/styles.css` - Estilos mejorados
- `js/app.js` - Punto de entrada mejorado
- `js/config/Database.js` - Configuración de BD mejorada
- `js/models/` - Modelos extendidos (Medicamento, EventoToma, Sintoma)
- `js/controllers/` - Controladores extendidos
- `js/services/` - Servicios adicionales (GestorInformes)
- `js/views/` - Vistas mejoradas

### 3. TERCERA ITERACIÓN
Pendiente de implementación - Será la fase final del desarrollo.

## Contenido Principal

* Código fuente frontend desarrollado en JavaScript vanilla
* Estructura MVC (Modelo-Vista-Controlador)
* Componentes reutilizables
* Sistema de notificaciones (visual y sonoro)
* Gestión de almacenamiento local
* Interfaz responsiva con CSS

## Fecha de inicio:

08 de enero de 2026

## Responsables:

Marcelo Acuña, Abner Arboleda, Christian Bonifaz

## Historial de Versiones del Código

| Iteración             | Fecha       | Responsable       | Aprobado por                         | Descripción                                    |
|-----------------------|-------------|-------------------|--------------------------------------|------------------------------------------------|
| Primera Iteración     | 28/07/2025  | Marcelo Acuña     | Abner Arboleda y Christian Bonifaz   | Implementación base del sistema Healthy+       |
| Segunda Iteración     | 15/12/2025  | Abner Arboleda    | Christian Bonifaz                    | Expansión de funcionalidades y mejoras         |
| Tercera Iteración     | Pendiente   | Christian Bonifaz | Marcelo Acuña y Abner Arboleda      | Finalización y optimizaciones finales          |

## Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Arquitectura:** Patrón MVC
- **Almacenamiento:** LocalStorage
- **Diagrama:** PlantUML

## Notas de Desarrollo

- Cada iteración constituye un hito funcional completado y validado
- El código sigue el patrón MVC para mantener una arquitectura limpia
- Se utilizan patrones de diseño como Observer para la reactividad
- El almacenamiento local permite el funcionamiento sin servidor
