package ec.edu.espe;

import ec.edu.espe.presentacion.EstudianteUI;
import javax.swing.SwingUtilities;

/**
 * Main - Clase principal para ejecutar la aplicación
 * Punto de entrada del sistema de gestión de estudiantes
 */
public class Main {
    
    /**
     * Método principal que inicia la aplicación
     * @param args Argumentos de línea de comandos
     */
    public static void main(String[] args) {
        // Ejecutar la interfaz gráfica en el hilo de eventos de Swing
        SwingUtilities.invokeLater(() -> {
            EstudianteUI ventana = new EstudianteUI();
            ventana.setVisible(true);
        });
    }
}
