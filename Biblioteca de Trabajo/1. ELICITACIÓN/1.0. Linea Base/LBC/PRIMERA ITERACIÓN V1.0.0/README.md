# PRIMERA ITERACIÓN - Healthy+

## Descripción General

Healthy+ es una aplicación web progresiva diseñada para ayudar a los usuarios a gestionar sus medicamentos y recibir recordatorios oportunos sobre las tomas programadas. Esta primera iteración implementa las funcionalidades básicas del sistema de gestión de medicamentos.

## Funcionalidades Implementadas

### RF01: Gestión de Medicamentos

- Registro de medicamentos con información detallada (nombre, presentación, dosis, frecuencia)
- Edición de medicamentos existentes
- Eliminación de medicamentos del sistema
- Listado visual de todos los medicamentos activos
- Validación de campos obligatorios

### RF02: Sistema de Recordatorios

- Generación automática de horarios de tomas basado en frecuencia
- Notificaciones visuales mediante alertas en pantalla
- Notificaciones sonoras configurables
- Gestión de tomas (marcar como tomada, posponer, omitir)
- Sistema de observadores para actualización en tiempo real

## Arquitectura del Proyecto

El proyecto sigue el patrón arquitectónico MVC (Model-View-Controller) con una clara separación de responsabilidades:

### Estructura de Directorios

```
PRIMERA ITERACIÓN/
├── index.html              # Interfaz de usuario principal
├── css/
│   └── styles.css         # Estilos visuales de la aplicación
├── js/
│   ├── app.js            # Punto de entrada y orquestación
│   ├── config/
│   │   └── Database.js   # Gestión de IndexedDB
│   ├── models/
│   │   └── Medicamento.js # Entidad Medicamento
│   ├── controllers/
│   │   ├── ControladorMedicamentos.js  # Lógica de medicamentos
│   │   ├── ControladorAlertas.js       # Lógica de alertas
│   │   └── ControladorFormulario.js    # Lógica del formulario
│   ├── services/
│   │   ├── GestorAlmacenamiento.js     # Persistencia de datos
│   │   ├── NotificadorVisual.js        # Notificaciones visuales
│   │   ├── NotificadorSonoro.js        # Notificaciones sonoras
│   │   ├── RelojSistema.js             # Gestión de tiempo
│   │   ├── Sujeto.js                   # Patrón Observer
│   │   └── Observador.js               # Patrón Observer
│   └── views/
│       └── VistaListaMedicamentos.js   # Renderizado de lista
└── Diagrama_Arquitectura_Componentes.puml  # Diseño arquitectónico

```

## Componentes Principales

### Modelos (Models)

**Medicamento.js**

- Representa la entidad Medicamento con sus atributos
- Incluye validación de datos
- Genera horarios de toma automáticamente
- Calcula próximas tomas y tomas pendientes

### Vistas (Views)

**VistaListaMedicamentos.js**

- Renderiza la lista de medicamentos
- Maneja eventos de interacción del usuario
- Actualiza la interfaz dinámicamente
- Implementa callbacks para edición y eliminación

### Controladores (Controllers)

**ControladorMedicamentos.js**

- Gestiona las operaciones CRUD de medicamentos
- Coordina entre modelo, vista y almacenamiento
- Maneja la lógica de negocio de medicamentos

**ControladorAlertas.js**

- Monitorea horarios de tomas programadas
- Activa notificaciones visuales y sonoras
- Gestiona el estado de las alertas activas
- Verifica tomas cada minuto

**ControladorFormulario.js**

- Valida datos ingresados por el usuario
- Procesa envío de formularios
- Maneja estados de edición y creación

### Servicios (Services)

**GestorAlmacenamiento.js**

- Abstrae el acceso a IndexedDB
- Proporciona operaciones CRUD genéricas
- Maneja transacciones de base de datos

**NotificadorVisual.js**

- Muestra alertas modales en pantalla
- Implementa el patrón Observer
- Permite confirmación de tomas desde la alerta

**NotificadorSonoro.js**

- Reproduce sonidos de alerta
- Configurable para activar/desactivar
- Utiliza la API Web Audio

**RelojSistema.js**

- Gestiona el tiempo del sistema
- Verifica tomas programadas periódicamente
- Notifica a observadores cuando hay alertas

**Sujeto.js y Observador.js**

- Implementan el patrón de diseño Observer
- Permiten comunicación desacoplada entre componentes
- Notificación de eventos en tiempo real

### Configuración

**Database.js**

- Implementa el patrón Singleton para IndexedDB
- Gestiona la conexión y creación de almacenes
- Define estructura de datos persistentes

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica de la aplicación
- **CSS3**: Estilos y diseño responsivo
- **JavaScript ES6+**: Módulos, clases y programación orientada a objetos
- **IndexedDB**: Almacenamiento local persistente
- **Bootstrap Icons**: Iconografía de la interfaz
- **Web Audio API**: Reproducción de sonidos de alerta

## Patrones de Diseño Implementados

1. **MVC (Model-View-Controller)**: Separación de responsabilidades
2. **Singleton**: Para la conexión de base de datos
3. **Observer**: Para notificaciones y actualizaciones en tiempo real
4. **Repository**: Para abstracción del acceso a datos

## Flujo de Funcionamiento

1. **Inicio de la aplicación**: Se inicializa la conexión a IndexedDB y se cargan los medicamentos
2. **Visualización**: Los medicamentos se muestran en una lista con información relevante
3. **Registro de medicamento**: El usuario completa el formulario con datos del medicamento
4. **Generación de horarios**: El sistema calcula automáticamente todos los horarios de toma
5. **Monitoreo**: El reloj del sistema verifica cada minuto si hay tomas programadas
6. **Notificación**: Cuando llega la hora de una toma, se activan notificaciones visuales y sonoras
7. **Confirmación**: El usuario marca la toma como realizada, pospuesta u omitida
8. **Actualización**: Los cambios se persisten en IndexedDB y la interfaz se actualiza

## Características Técnicas

- **Aplicación de página única (SPA)**: Navegación sin recargas
- **Almacenamiento offline**: Funciona sin conexión a internet
- **Diseño responsivo**: Adaptable a diferentes tamaños de pantalla
- **Programación reactiva**: Actualizaciones automáticas de la interfaz
- **Modularización**: Código organizado en módulos ES6
- **Validación de datos**: En cliente y modelo

## Requisitos del Sistema

- Navegador web moderno con soporte para:
  - ES6 Modules
  - IndexedDB
  - Web Audio API
  - CSS Grid y Flexbox

## Cómo Ejecutar

1. Abrir el archivo `index.html` en un servidor web local (requerido para módulos ES6)
2. Alternativamente, usar extensiones de VS Code como "Live Server"
3. No ejecutar directamente desde el sistema de archivos debido a restricciones CORS

## Próximas Iteraciones

La primera iteración establece la base del sistema. Las siguientes iteraciones agregarán:

- Historial de medicación
- Seguimiento de síntomas
- Generación de informes
- Vista detallada de medicamentos
- Exportación de datos
