package ec.edu.espe.logica_negocio.validation;

import ec.edu.espe.datos.model.Estudiante;

/**
 * EdadValidationStrategy - Validación de la edad del estudiante
 * Implementación del patrón Strategy para validar edad
 */
public class EdadValidationStrategy implements ValidationStrategy {
    
    private static final int EDAD_MINIMA = 1;
    private static final int EDAD_MAXIMA = 120;
    
    @Override
    public String validate(Estudiante estudiante) {
        if (estudiante == null) {
            return "Error: El estudiante no puede ser nulo";
        }
        
        if (estudiante.getEdad() <= 0) {
            return "Error: La edad debe ser mayor a 0";
        }
        
        if (estudiante.getEdad() < EDAD_MINIMA) {
            return "Error: La edad mínima permitida es " + EDAD_MINIMA;
        }
        
        if (estudiante.getEdad() > EDAD_MAXIMA) {
            return "Error: La edad no puede ser mayor a " + EDAD_MAXIMA + " años";
        }
        
        return null; // Validación exitosa
    }
}
