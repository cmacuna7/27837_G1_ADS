# Sistema de Gestión de Medicamentos - Healthy+

Este repositorio contiene el desarrollo del sistema Healthy+. Se incluyen artefactos de análisis, diseño, desarrollo y pruebas.

## Estructura y Ubicación de Componentes Clave

A continuación se detalla la ubicación de los elementos principales del proyecto en este repositorio:

### 🚀 Código del Proyecto
*   **Código Activo / Última Implementación (React + CSS + Vanilla JS):**
    *   [`CODIGO/IMPL_V1.0.2`](./CODIGO/IMPL_V1.0.2) - Contiene el código fuente actual del sistema (frontend, backend, configuración de la base de datos local/config y lógica del controlador).
*   **Historial de Versiones de Código:**
    *   [`CODIGO/IMPL_V1.0.0`](./CODIGO/IMPL_V1.0.0) y [`CODIGO/IMPL_V1.0.1`](./CODIGO/IMPL_V1.0.1) - Versiones anteriores de la implementación.
*   **Líneas Base de Código (LBC):**
    *   [`Biblioteca de Trabajo/1. ELICITACIÓN/1.0. Linea Base/LBC/IMPL_V1.0.2`](./Biblioteca%20de%20Trabajo/1.%20ELICITACIÓN/1.0.%20Linea%20Base/LBC/IMPL_V1.0.2)
    *   [`Biblioteca de Soporte/1. ELICITACIÓN/1.0. Linea Base/LBC/IMPL_V1.0.2`](./Biblioteca%20de%20Soporte/1.%20ELICITACIÓN/1.0.%20Linea%20Base/LBC/IMPL_V1.0.2)

### 📄 Documentación de Requisitos (SRS / ERS)
La Especificación de Requisitos del Sistema (ERS / SRS) se encuentra en las siguientes carpetas:
*   **Versión Activa (V1.0.1):**
    *   [`Biblioteca de Trabajo/1. ELICITACIÓN/1.1 Especificación RS/ERS_V1.0.1.pdf`](./Biblioteca%20de%20Trabajo/1.%20ELICITACIÓN/1.1%20Especificación%20RS/ERS_V1.0.1.pdf) - Especificación activa.
    *   [`Biblioteca Maestra/1. ELICITACIÓN/1.1 Especificación RS/ERS_V1.0.1.pdf`](./Biblioteca%20Maestra/1.%20ELICITACIÓN/1.1%20Especificación%20RS/ERS_V1.0.1.pdf) - Especificación liberada.
*   **Historial y Líneas Base (LBR):**
    *   [`Biblioteca de Trabajo/1. ELICITACIÓN/1.0. Linea Base/LBR/`](./Biblioteca%20de%20Trabajo/1.%20ELICITACIÓN/1.0.%20Linea%20Base/LBR/) - ERS y anexos en la Línea Base de Requisitos.
    *   [`DOCUMENTOS/RS/`](./DOCUMENTOS/RS/) - Contiene plantillas de referencia como `formato_ieee8300 RS.pdf` y anexos de análisis de importancia.

### 🎨 Diseños y Modelos del Sistema
Los diagramas y diseños del software se organizan de la siguiente manera:
*   **Diagrama de Clases (Class Diagram):**
    *   [`Biblioteca de Trabajo/3. DISEÑOS/1.4 Diagrama de clases/DC_V1.0.1.pdf`](./Biblioteca%20de%20Trabajo/3.%20DISEÑOS/1.4%20Diagrama%20de%20clases/DC_V1.0.1.pdf) - Diagrama de clases activo en PDF.
    *   [`Biblioteca de Trabajo/3. DISEÑOS/1.4 Diagrama de clases/DC_Anexo_V1.0.1.png`](./Biblioteca%20de%20Trabajo/3.%20DISEÑOS/1.4%20Diagrama%20de%20clases/DC_Anexo_V1.0.1.png) - Imagen del diagrama de clases activo.
    *   [`MODELOS/1.4 Diagrama de clases/`](./MODELOS/1.4%20Diagrama%20de%20clases/) - Copia del diagrama de clases de diseño.
*   **Diseño de Arquitectura:**
    *   [`Biblioteca de Trabajo/3. DISEÑOS/1.2 Diseño de Arquitectura/ARQ_V1.0.1.pdf`](./Biblioteca%20de%20Trabajo/3.%20DISEÑOS/1.2%20Diseño%20de%20Arquitectura/ARQ_V1.0.1.pdf) y su anexo en imagen [`ARQ_Anexo_V1.0.1.png`](./Biblioteca%20de%20Trabajo/3.%20DISEÑOS/1.2%20Diseño%20de%20Arquitectura/ARQ_Anexo_V1.0.1.png).
    *   [`MODELOS/1.2 Diseño de Arquitectura/`](./MODELOS/1.2%20Diseño%20de%20Arquitectura/) - Copia de arquitectura.
*   **Patrones de Diseño:**
    *   [`Biblioteca de Trabajo/3. DISEÑOS/1.1 Patron de diseño/`](./Biblioteca%20de%20Trabajo/3.%20DISEÑOS/1.1%20Patron%20de%20diseño/) y [`MODELOS/1.1 Patron de diseño/`](./MODELOS/1.1%20Patron%20de%20diseño/).

## Cómo Ejecutar el Proyecto

Para levantar y probar la aplicación web localmente, sigue estos pasos:

### 1. Requisitos Previos
*   Tener instalado [Node.js](https://nodejs.org/) (recomendado para la ejecución de pruebas).
*   Un editor de código como [VS Code](https://code.visualstudio.com/).
*   Un servidor web local (por ejemplo, la extensión **Live Server** para VS Code, o herramientas de consola como `http-server`).
    > [!IMPORTANT]
    > Dado que el proyecto utiliza módulos de JavaScript (`type="module"`) y almacenamiento local `IndexedDB`, **no se debe** abrir el archivo `index.html` directamente haciendo doble clic (con protocolo `file://`), ya que los navegadores modernos bloquean estas características por políticas de seguridad (CORS).

### 2. Pasos para Levantar la Aplicación
1.  Abre la terminal y navega al directorio del código activo:
    ```bash
    cd "CODIGO/IMPL_V1.0.2"
    ```
2.  Inicia un servidor local. Puedes usar cualquiera de las siguientes opciones:
    *   **Opción A (VS Code - Recomendada):** Abre la carpeta del proyecto en VS Code, haz clic derecho en el archivo [`index.html`](./CODIGO/IMPL_V1.0.2/index.html) y selecciona **Open with Live Server**.
    *   **Opción B (NodeJS/npx):** Ejecuta en tu consola:
        ```bash
        npx http-server
        ```
    *   **Opción C (Python):** Ejecuta en tu consola:
        ```bash
        python -m http.server
        ```
3.  Abre tu navegador y accede a la dirección local que te provea el servidor (por ejemplo, `http://localhost:5500` o `http://localhost:8080`).

---

## Ejecución de Pruebas Unitarias

El proyecto cuenta con un conjunto de pruebas unitarias configuradas con **Jest** y **Testing Library**. Para ejecutarlas, sigue las siguientes instrucciones:

1.  Navega a la carpeta del código del proyecto en tu terminal:
    ```bash
    cd "CODIGO/IMPL_V1.0.2"
    ```
2.  Instala las dependencias necesarias ejecutando:
    ```bash
    npm install
    ```
3.  Ejecuta las pruebas con el siguiente comando:
    ```bash
    npm test
    ```

### Comandos de Pruebas Adicionales
*   **Ver cobertura de código:**
    ```bash
    npm run test:coverage
    ```
*   **Ejecutar pruebas en modo observador (watch):**
    ```bash
    npm run test:watch
    ```
*   **Ejecutar pruebas con salida detallada:**
    ```bash
    npm run test:verbose
    ```


## Autores
- Marcelo Acuña
- Abner Arboleda
- Christian Bonifaz