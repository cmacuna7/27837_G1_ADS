package ec.edu.espe.logica_negocio.validation;

import ec.edu.espe.datos.model.Estudiante;

/**
 * NombresValidationStrategy - Validación de los nombres del estudiante
 * Implementación del patrón Strategy para validar nombres
 */
public class NombresValidationStrategy implements ValidationStrategy {
    
    @Override
    public String validate(Estudiante estudiante) {
        if (estudiante == null) {
            return "Error: El estudiante no puede ser nulo";
        }
        
        if (estudiante.getNombres() == null || estudiante.getNombres().trim().isEmpty()) {
            return "Error: Los nombres no pueden estar vacíos";
        }
        
        // Validar que tenga al menos dos caracteres
        if (estudiante.getNombres().trim().length() < 2) {
            return "Error: Los nombres deben tener al menos 2 caracteres";
        }
        
        // Validar que solo contenga letras y espacios
        if (!estudiante.getNombres().matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$")) {
            return "Error: Los nombres solo pueden contener letras y espacios";
        }
        
        return null; // Validación exitosa
    }
}
