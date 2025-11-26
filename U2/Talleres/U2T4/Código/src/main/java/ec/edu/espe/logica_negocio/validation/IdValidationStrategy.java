package ec.edu.espe.logica_negocio.validation;

import ec.edu.espe.datos.model.Estudiante;

/**
 * IdValidationStrategy - Validación del ID del estudiante
 * Implementación del patrón Strategy para validar el identificador
 */
public class IdValidationStrategy implements ValidationStrategy {
    
    @Override
    public String validate(Estudiante estudiante) {
        if (estudiante == null) {
            return "Error: El estudiante no puede ser nulo";
        }
        
        if (estudiante.getId() == null || estudiante.getId().trim().isEmpty()) {
            return "Error: El ID no puede estar vacío";
        }
        
        // Validar formato de ID (opcional)
        if (estudiante.getId().length() < 3) {
            return "Error: El ID debe tener al menos 3 caracteres";
        }
        
        return null; // Validación exitosa
    }
}
