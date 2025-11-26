package ec.edu.espe.logica_negocio.validation;

import ec.edu.espe.datos.model.Estudiante;

/**
 * ValidationStrategy - Patrón Strategy para validaciones
 * Define el contrato para las diferentes estrategias de validación
 */
public interface ValidationStrategy {
    /**
     * Valida un estudiante según la estrategia específica
     * @param estudiante Estudiante a validar
     * @return null si la validación es exitosa, mensaje de error en caso contrario
     */
    String validate(Estudiante estudiante);
}
